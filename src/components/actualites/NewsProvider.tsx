'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { NEWS_SEED, USER_TEMPLATES_SEED } from '@/lib/actualites/seed';
import { cloneContent, newNewsId } from '@/lib/actualites/news';
import { todayIso } from '@/lib/actualites/dates';
import { MAX_FAVORITE_NEWS, type ContentTemplate, type NewsArticle, type NewsFormData, type StructureRow } from '@/types/actualites';

const STORAGE_KEY = 'neopse:actualites';

type ToastSeverity = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  severity: ToastSeverity;
}

interface NewsStore {
  /** Faux tant que l'état de session n'est pas relu : les écrans affichent un squelette. */
  hydrated: boolean;
  today: string;
  articles: NewsArticle[];
  userTemplates: ContentTemplate[];
  /** Crée l'article si `id` est null ; renvoie son identifiant. */
  saveArticle: (id: string | null, data: NewsFormData) => string;
  /** Faux si la limite de favoris est atteinte (rien n'est modifié). */
  setFavorite: (id: string, favorite: boolean) => boolean;
  canAddFavorite: (exceptId?: string) => boolean;
  publishNow: (ids: string[]) => void;
  deactivate: (ids: string[]) => void;
  schedule: (ids: string[], date: string) => void;
  /** Copies inactives, insérées juste après leur original ; renvoie les nouveaux identifiants. */
  duplicate: (ids: string[]) => string[];
  remove: (ids: string[]) => void;
  addUserTemplate: (label: string, content: StructureRow[]) => void;
  removeUserTemplate: (id: string) => void;
  notify: (message: string, severity?: ToastSeverity) => void;
}

interface PersistedState {
  articles: NewsArticle[];
  userTemplates: ContentTemplate[];
}

const NewsContext = createContext<NewsStore | null>(null);

function stripBlobUrls(state: PersistedState): PersistedState {
  // Après un rechargement, les object URL des images importées n'existent plus : on les retire plutôt que d'afficher des images cassées.
  const keep = (url: string) => !url.startsWith('blob:');
  return {
    ...state,
    articles: state.articles.map((article) => ({
      ...article,
      thumbnail: article.thumbnail && keep(article.thumbnail.url) ? article.thumbnail : undefined,
      content: article.content.map((row) => ({
        ...row,
        columns: row.columns.map((blocks) =>
          blocks.map((block) => (block.kind === 'images' || block.kind === 'diaporama' ? { ...block, imageUrls: block.imageUrls.filter(keep) } : block)),
        ),
      })),
    })),
  };
}

function readPersisted(): PersistedState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    // Un aperçu ouvert depuis l'éditeur partage les object URL de son onglet d'origine, encore vivant.
    return window.opener ? parsed : stripBlobUrls(parsed);
  } catch {
    return null;
  }
}

/** Proto sans backend : les actualités vivent dans la session de l'onglet (et des aperçus qu'il ouvre). */
export function NewsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>({ articles: NEWS_SEED, userTemplates: USER_TEMPLATES_SEED });
  const [hydrated, setHydrated] = useState(false);
  const [today, setToday] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    // Lecture d'un système externe (sessionStorage) indisponible côté serveur : elle ne peut pas
    // se faire au rendu sans désynchroniser le HTML serveur et le premier rendu client.
    const persisted = readPersisted();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (persisted) setState(persisted);
    setToday(todayIso());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Stockage indisponible (navigation privée stricte) : la session reste en mémoire.
    }
  }, [state, hydrated]);

  const updateArticles = useCallback((ids: string[], patch: (article: NewsArticle) => NewsArticle) => {
    setState((prev) => ({ ...prev, articles: prev.articles.map((article) => (ids.includes(article.id) ? patch(article) : article)) }));
  }, []);

  const saveArticle = useCallback((id: string | null, data: NewsFormData) => {
    const targetId = id ?? newNewsId();
    setState((prev) => {
      const exists = prev.articles.some((article) => article.id === targetId);
      const articles = exists
        ? prev.articles.map((article) => (article.id === targetId ? { ...data, id: targetId } : article))
        : [{ ...data, id: targetId }, ...prev.articles];
      return { ...prev, articles };
    });
    return targetId;
  }, []);

  const canAddFavorite = useCallback(
    (exceptId?: string) => state.articles.filter((article) => article.favorite && article.id !== exceptId).length < MAX_FAVORITE_NEWS,
    [state.articles],
  );

  const setFavorite = useCallback(
    (id: string, favorite: boolean) => {
      if (favorite && !canAddFavorite(id)) return false;
      updateArticles([id], (article) => ({ ...article, favorite }));
      return true;
    },
    [canAddFavorite, updateArticles],
  );

  const publishNow = useCallback((ids: string[]) => updateArticles(ids, (article) => ({ ...article, active: true, publishedAt: todayIso() })), [updateArticles]);

  // Ne touche pas à la date de publication : repasser en active retrouve la date d'origine.
  const deactivate = useCallback((ids: string[]) => updateArticles(ids, (article) => ({ ...article, active: false })), [updateArticles]);

  const schedule = useCallback(
    (ids: string[], date: string) => updateArticles(ids, (article) => ({ ...article, active: true, publishedAt: date })),
    [updateArticles],
  );

  const duplicate = useCallback((ids: string[]) => {
    // Identifiants générés avant la mise à jour : React peut exécuter celle-ci plus tard.
    const copyIds = new Map(ids.map((id) => [id, newNewsId()]));
    setState((prev) => {
      const articles: NewsArticle[] = [];
      prev.articles.forEach((article) => {
        articles.push(article);
        const id = copyIds.get(article.id);
        if (!id) return;
        articles.push({
          ...article,
          id,
          title: `${article.title} (copie)`.slice(0, 100),
          favorite: false,
          active: false,
          // Référence propre à la copie : supprimer l'une ne touche jamais la vignette de l'autre.
          thumbnail: article.thumbnail ? structuredClone(article.thumbnail) : undefined,
          content: cloneContent(article.content),
        });
      });
      return { ...prev, articles };
    });
    return [...copyIds.values()];
  }, []);

  const remove = useCallback((ids: string[]) => {
    setState((prev) => ({ ...prev, articles: prev.articles.filter((article) => !ids.includes(article.id)) }));
  }, []);

  const addUserTemplate = useCallback((label: string, content: StructureRow[]) => {
    const template: ContentTemplate = { id: `user-template-${Date.now()}`, label, content: cloneContent(content) };
    setState((prev) => ({ ...prev, userTemplates: [...prev.userTemplates, template] }));
  }, []);

  const removeUserTemplate = useCallback((id: string) => {
    setState((prev) => ({ ...prev, userTemplates: prev.userTemplates.filter((template) => template.id !== id) }));
  }, []);

  const notify = useCallback((message: string, severity: ToastSeverity = 'success') => {
    setToast({ id: Date.now(), message, severity });
  }, []);

  const store = useMemo<NewsStore>(
    () => ({
      hydrated,
      today,
      articles: state.articles,
      userTemplates: state.userTemplates,
      saveArticle,
      setFavorite,
      canAddFavorite,
      publishNow,
      deactivate,
      schedule,
      duplicate,
      remove,
      addUserTemplate,
      removeUserTemplate,
      notify,
    }),
    [hydrated, today, state, saveArticle, setFavorite, canAddFavorite, publishNow, deactivate, schedule, duplicate, remove, addUserTemplate, removeUserTemplate, notify],
  );

  return (
    <NewsContext.Provider value={store}>
      {children}
      <Snackbar
        key={toast?.id}
        open={toast !== null}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // Au-dessus de la barre d'actions groupées, qui occupe le bas de l'écran.
        sx={{ bottom: { xs: 96, sm: 96 } }}
      >
        <Alert severity={toast?.severity ?? 'success'} variant="filled" role={toast?.severity === 'error' ? 'alert' : 'status'} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </NewsContext.Provider>
  );
}

export function useNews(): NewsStore {
  const store = useContext(NewsContext);
  if (!store) throw new Error('useNews doit être utilisé dans un NewsProvider');
  return store;
}
