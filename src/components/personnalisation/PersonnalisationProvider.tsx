'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { computeManualOverrideIssues, createDefaultTokens, SECTION_PROPERTIES } from '@/lib/personnalisation/colorModel';
import { createId, createPreviewSlug, SEED_CUSTOM_PALETTES, SEED_HISTORY, SEED_VARIANTS } from '@/lib/personnalisation/seed';
import { getPreset, NEOPSE_DEFAULT_PALETTE_ID, PRESET_PALETTES } from '@/lib/personnalisation/palettes';
import { TEMPLATES } from '@/lib/personnalisation/templates';
import { resolveRevealTarget } from '@/lib/personnalisation/previewRoles';
import type {
  BackgroundGraphicKind,
  BackgroundMode,
  BackgroundSlot,
  ColorKey,
  ContrastIssue,
  EditorStatus,
  HistoryEntry,
  ModuleKey,
  Palette,
  PageGabaritId,
  RoleValue,
  SectionKey,
  ThemeTokens,
  Variant,
} from '@/types/personnalisation';
import { MODULE_KEYS, PAGE_GABARITS } from '@/types/personnalisation';

const CURRENT_USER = 'Vous';

export type EditorTab = 'templates' | 'general' | 'modules';

export interface HighlightTarget {
  owner: SectionKey | ModuleKey;
  propertyKey: string;
}

export interface RevealCommand {
  owner: SectionKey | ModuleKey;
  propertyKey: string;
  targetPageId: PageGabaritId;
  nonce: number;
}

export function resolvePalette(id: string, customPalettes: Palette[]): Palette {
  return customPalettes.find((p) => p.id === id) ?? getPreset(id) ?? PRESET_PALETTES[0];
}

function forkIdFor(tokens: ThemeTokens, customPalettes: Palette[]): string | null {
  const palette = resolvePalette(tokens.paletteId, customPalettes);
  return palette.origin === 'custom' ? palette.id : null;
}

/** Route du hub d'apparence — sert de destination de retour et de valeur sentinelle pour
 * `pendingVariantSwitchId` lorsque la navigation en attente n'est pas un changement de variante
 * mais un retour au hub (voir `requestReturnToHub`). */
const HUB_PATH = '/dashboard/personnalisation';
const RETURN_TO_HUB = '__return_to_hub__';

interface PersonnalisationStore {
  variants: Variant[];
  activeVariant: Variant;
  customPalettes: Palette[];
  status: EditorStatus;
  isDirty: boolean;
  draftTokens: ThemeTokens;
  draftTemplateId: string;
  activePalette: Palette;
  history: HistoryEntry[];
  contrastIssues: ContrastIssue[];
  pendingVariantSwitchId: string | null;
  publishTargetId: string | null;
  moduleCoexistenceMessage: string | null;
  activeEditorTab: EditorTab;
  highlightTarget: HighlightTarget | null;
  previewPageId: PageGabaritId;
  revealCommand: RevealCommand | null;

  updatePaletteColor: (key: ColorKey, hex: string) => void;
  selectPreset: (presetId: string) => void;
  resetPalette: () => void;

  setSectionRole: (section: SectionKey, key: string, value: RoleValue | null) => void;
  setModuleRole: (moduleKey: ModuleKey, key: string, value: RoleValue | null) => void;
  resetToAuto: (owner: SectionKey | ModuleKey, key: string) => void;

  setTemplate: (templateId: string) => void;
  setTypographyPairing: (pairingId: string) => void;
  setLogo: (slot: keyof ThemeTokens['logos'], url: string | null) => void;

  setSearchEnabled: (enabled: boolean) => void;
  setBackgroundMode: (slot: BackgroundSlot, mode: BackgroundMode) => void;
  setBackgroundGraphicKind: (slot: BackgroundSlot, kind: BackgroundGraphicKind) => void;
  setBackgroundImage: (slot: BackgroundSlot, url: string | null) => void;
  setBackgroundTexture: (slot: BackgroundSlot, textureId: string | null) => void;

  dismissModuleCoexistenceMessage: () => void;
  setActiveEditorTab: (tab: EditorTab) => void;
  focusContrastIssue: (issue: ContrastIssue) => void;
  openSection: (section: SectionKey) => void;
  clearHighlight: () => void;

  setPreviewPageId: (pageId: PageGabaritId) => void;
  requestReveal: (owner: SectionKey | ModuleKey, propertyKey: string) => void;

  save: () => void;
  cancelDraft: () => void;

  requestSelectVariant: (id: string) => void;
  requestReturnToHub: () => void;
  confirmSwitchVariant: (mode: 'save' | 'discard') => void;
  cancelSwitchVariant: () => void;

  openPublishConfirm: (id?: string) => void;
  closePublishConfirm: () => void;
  publishVariant: (id: string) => void;

  duplicateVariant: (id: string, nameOverride?: string) => string | null;
  createVariant: () => string;
  renameVariant: (id: string, name: string) => void;
  deleteVariant: (id: string) => void;
  restoreFromHistory: (entryId: string) => void;
}

const PersonnalisationContext = createContext<PersonnalisationStore | null>(null);

export function PersonnalisationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>(SEED_VARIANTS);
  const [history, setHistory] = useState<HistoryEntry[]>(SEED_HISTORY);
  const [customPalettes, setCustomPalettes] = useState<Palette[]>(SEED_CUSTOM_PALETTES);
  const [activeVariantId, setActiveVariantId] = useState<string>(
    () => SEED_VARIANTS.find((v) => v.status === 'published')?.id ?? SEED_VARIANTS[0].id,
  );

  const activeVariant = variants.find((v) => v.id === activeVariantId) ?? variants[0];

  const [draftTokens, setDraftTokens] = useState<ThemeTokens>(activeVariant.tokens);
  const [draftTemplateId, setDraftTemplateId] = useState<string>(activeVariant.templateId);
  const [draftForkId, setDraftForkId] = useState<string | null>(() => forkIdFor(activeVariant.tokens, SEED_CUSTOM_PALETTES));
  const [status, setStatus] = useState<EditorStatus>('idle');
  const [pendingVariantSwitchId, setPendingVariantSwitchId] = useState<string | null>(null);
  const [publishTargetId, setPublishTargetId] = useState<string | null>(null);
  const [moduleCoexistenceMessage, setModuleCoexistenceMessage] = useState<string | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<EditorTab>('templates');
  const [highlightTarget, setHighlightTarget] = useState<HighlightTarget | null>(null);
  const [previewPageId, setPreviewPageId] = useState<PageGabaritId>(PAGE_GABARITS[0].id as PageGabaritId);
  const [revealCommand, setRevealCommand] = useState<RevealCommand | null>(null);

  const activePalette = useMemo(() => resolvePalette(draftTokens.paletteId, customPalettes), [draftTokens.paletteId, customPalettes]);

  const isDirty = useMemo(
    () =>
      JSON.stringify(draftTokens) !== JSON.stringify(activeVariant.tokens) ||
      draftTemplateId !== activeVariant.templateId,
    [draftTokens, draftTemplateId, activeVariant],
  );

  const contrastIssues = useMemo(() => computeManualOverrideIssues(draftTokens, activePalette), [draftTokens, activePalette]);

  const markDirty = useCallback(() => setStatus((s) => (s === 'publishing' ? s : 'dirty')), []);

  // ─── Charte graphique ─────────────────────────────────────────────────────

  const updatePaletteColor = useCallback(
    (key: ColorKey, hex: string) => {
      const current = resolvePalette(draftTokens.paletteId, customPalettes);
      if (draftForkId && draftTokens.paletteId === draftForkId) {
        setCustomPalettes((prev) => prev.map((p) => (p.id === draftForkId ? { ...p, colors: { ...p.colors, [key]: hex } } : p)));
      } else {
        const basedOnId = current.origin === 'custom' ? current.basedOn ?? current.id : current.id;
        const basedOnPalette = getPreset(basedOnId) ?? current;
        const newId = createId('palette');
        // Le point de départ « Personnalisée » a déjà ce nom : éviter le doublon « Personnalisée
        // (basée sur Personnalisée) » lorsqu'on part directement de lui.
        const name =
          basedOnId === NEOPSE_DEFAULT_PALETTE_ID ? 'Personnalisée' : `Personnalisée (basée sur ${basedOnPalette.name})`;
        const newPalette: Palette = {
          id: newId,
          name,
          origin: 'custom',
          basedOn: basedOnId,
          colors: { ...current.colors, [key]: hex },
        };
        setCustomPalettes((prev) => [...prev, newPalette]);
        setDraftForkId(newId);
        setDraftTokens((t) => ({ ...t, paletteId: newId }));
      }
      markDirty();
    },
    [draftTokens.paletteId, customPalettes, draftForkId, markDirty],
  );

  const selectPreset = useCallback(
    (presetId: string) => {
      setDraftTokens((t) => ({ ...t, paletteId: presetId }));
      setDraftForkId(null);
      markDirty();
    },
    [markDirty],
  );

  const resetPalette = useCallback(() => {
    const current = resolvePalette(draftTokens.paletteId, customPalettes);
    if (current.origin !== 'custom' || !current.basedOn) return;
    setDraftTokens((t) => ({ ...t, paletteId: current.basedOn! }));
    setDraftForkId(null);
    markDirty();
  }, [draftTokens.paletteId, customPalettes, markDirty]);

  // ─── Rôles de section / module ──────────────────────────────────────────

  const setSectionRole = useCallback(
    (section: SectionKey, key: string, value: RoleValue | null) => {
      setDraftTokens((prev) => {
        const sectionMap = { ...prev.sections[section] };
        if (value === null) delete sectionMap[key];
        else sectionMap[key] = value;
        return { ...prev, sections: { ...prev.sections, [section]: sectionMap } };
      });
      markDirty();

      if (section === 'general') {
        const affected = MODULE_KEYS.filter((m) => Boolean(draftTokens.modules[m]?.[key]));
        if (affected.length > 0) {
          const plural = affected.length > 1;
          setModuleCoexistenceMessage(
            `${affected.length} module${plural ? 's' : ''} garde${plural ? 'nt' : ''} ${plural ? 'leurs couleurs' : 'sa couleur'} personnalisée${plural ? 's' : ''}.`,
          );
        }
      }
    },
    [markDirty, draftTokens.modules],
  );

  const setModuleRole = useCallback(
    (moduleKey: ModuleKey, key: string, value: RoleValue | null) => {
      setDraftTokens((prev) => {
        const moduleMap = { ...prev.modules[moduleKey] };
        if (value === null) delete moduleMap[key];
        else moduleMap[key] = value;
        return { ...prev, modules: { ...prev.modules, [moduleKey]: moduleMap } };
      });
      markDirty();
    },
    [markDirty],
  );

  const resetToAuto = useCallback(
    (owner: SectionKey | ModuleKey, key: string) => {
      if (MODULE_KEYS.includes(owner as ModuleKey)) setModuleRole(owner as ModuleKey, key, null);
      else setSectionRole(owner as SectionKey, key, null);
    },
    [setModuleRole, setSectionRole],
  );

  // ─── Maquette & typographie ──────────────────────────────────────────────

  const setTemplate = useCallback(
    (templateId: string) => {
      setDraftTemplateId(templateId);
      markDirty();
    },
    [markDirty],
  );

  const setTypographyPairing = useCallback(
    (pairingId: string) => {
      setDraftTokens((prev) => ({ ...prev, typography: { ...prev.typography, pairingId } }));
      markDirty();
    },
    [markDirty],
  );

  const setLogo = useCallback(
    (slot: keyof ThemeTokens['logos'], url: string | null) => {
      setDraftTokens((prev) => ({ ...prev, logos: { ...prev.logos, [slot]: url } }));
      markDirty();
    },
    [markDirty],
  );

  // ─── Recherche & fonds graphiques ───────────────────────────────────────

  const setSearchEnabled = useCallback(
    (enabled: boolean) => {
      setDraftTokens((prev) => ({ ...prev, searchEnabled: enabled }));
      markDirty();
    },
    [markDirty],
  );

  const setBackgroundMode = useCallback(
    (slot: BackgroundSlot, mode: BackgroundMode) => {
      setDraftTokens((prev) => ({ ...prev, backgroundModes: { ...prev.backgroundModes, [slot]: mode } }));
      markDirty();
    },
    [markDirty],
  );

  const setBackgroundGraphicKind = useCallback(
    (slot: BackgroundSlot, kind: BackgroundGraphicKind) => {
      setDraftTokens((prev) => ({
        ...prev,
        backgroundGraphics: { ...prev.backgroundGraphics, [slot]: { ...prev.backgroundGraphics[slot], kind } },
      }));
      markDirty();
    },
    [markDirty],
  );

  const setBackgroundImage = useCallback(
    (slot: BackgroundSlot, url: string | null) => {
      setDraftTokens((prev) => ({
        ...prev,
        backgroundGraphics: { ...prev.backgroundGraphics, [slot]: { ...prev.backgroundGraphics[slot], imageUrl: url } },
      }));
      markDirty();
    },
    [markDirty],
  );

  const setBackgroundTexture = useCallback(
    (slot: BackgroundSlot, textureId: string | null) => {
      setDraftTokens((prev) => ({
        ...prev,
        backgroundGraphics: { ...prev.backgroundGraphics, [slot]: { ...prev.backgroundGraphics[slot], textureId } },
      }));
      markDirty();
    },
    [markDirty],
  );

  const dismissModuleCoexistenceMessage = useCallback(() => setModuleCoexistenceMessage(null), []);

  // ─── Avertissements de contraste : cliquer un lien saute jusqu'à l'élément concerné ────────

  const clearHighlight = useCallback(() => setHighlightTarget(null), []);

  const focusContrastIssue = useCallback((issue: ContrastIssue) => {
    setActiveEditorTab(MODULE_KEYS.includes(issue.section as ModuleKey) ? 'modules' : 'general');
    setHighlightTarget({ owner: issue.section, propertyKey: issue.propertyKey });
  }, []);

  // Ouvre l'onglet Général et déplie l'accordéon d'une section (ex. lien « Personnalisation »
  // depuis l'écran Pied de page) — réutilise le mécanisme de surbrillance/scroll de
  // `focusContrastIssue`, ciblé sur la première propriété de la section faute de propriété précise.
  const openSection = useCallback((section: SectionKey) => {
    const firstProperty = SECTION_PROPERTIES[section]?.[0];
    if (!firstProperty) return;
    setActiveEditorTab('general');
    setHighlightTarget({ owner: section, propertyKey: firstProperty.key });
  }, []);

  // ─── Liaison contrôle ↔ aperçu ────────────────────────────────────────────
  // Le bouton œil (reveal) passe par `revealCommand` car il peut nécessiter un changement de
  // gabarit — donc un rendu React (nouvelle URL d'iframe) — avant de pouvoir viser le bon élément.
  // C'est le seul déclencheur de surbrillance dans l'aperçu : le survol seul n'en produit jamais.

  const requestReveal = useCallback(
    (owner: SectionKey | ModuleKey, propertyKey: string) => {
      const target = resolveRevealTarget(owner, propertyKey, previewPageId);
      if (target.pageId !== previewPageId) setPreviewPageId(target.pageId);
      setRevealCommand({ owner, propertyKey, targetPageId: target.pageId, nonce: Date.now() });
    },
    [previewPageId],
  );

  // ─── Enregistrement / navigation entre variantes ────────────────────────

  const commitDraftIntoVariant = useCallback((id: string, tokens: ThemeTokens, templateId: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, tokens, templateId, updatedAt: new Date().toISOString(), updatedBy: CURRENT_USER } : v)),
    );
  }, []);

  const save = useCallback(() => {
    commitDraftIntoVariant(activeVariantId, draftTokens, draftTemplateId);
    setStatus('idle');
  }, [activeVariantId, draftTokens, draftTemplateId, commitDraftIntoVariant]);

  const cancelDraft = useCallback(() => {
    setDraftTokens(activeVariant.tokens);
    setDraftTemplateId(activeVariant.templateId);
    setDraftForkId(forkIdFor(activeVariant.tokens, customPalettes));
    setStatus('idle');
  }, [activeVariant, customPalettes]);

  const switchTo = useCallback(
    (id: string) => {
      const target = variants.find((v) => v.id === id);
      if (!target) return;
      setActiveVariantId(id);
      setDraftTokens(target.tokens);
      setDraftTemplateId(target.templateId);
      setDraftForkId(forkIdFor(target.tokens, customPalettes));
      setStatus('idle');
    },
    [variants, customPalettes],
  );

  const requestSelectVariant = useCallback(
    (id: string) => {
      if (id === activeVariantId) return;
      if (!isDirty) {
        switchTo(id);
        return;
      }
      setPendingVariantSwitchId(id);
    },
    [activeVariantId, isDirty, switchTo],
  );

  const requestReturnToHub = useCallback(() => {
    if (!isDirty) {
      router.push(HUB_PATH);
      return;
    }
    setPendingVariantSwitchId(RETURN_TO_HUB);
  }, [isDirty, router]);

  const confirmSwitchVariant = useCallback(
    (mode: 'save' | 'discard') => {
      if (!pendingVariantSwitchId) return;

      if (pendingVariantSwitchId === RETURN_TO_HUB) {
        if (mode === 'save') save();
        else cancelDraft();
        setPendingVariantSwitchId(null);
        router.push(HUB_PATH);
        return;
      }

      if (mode === 'save') commitDraftIntoVariant(activeVariantId, draftTokens, draftTemplateId);
      switchTo(pendingVariantSwitchId);
      setPendingVariantSwitchId(null);
    },
    [pendingVariantSwitchId, activeVariantId, draftTokens, draftTemplateId, commitDraftIntoVariant, switchTo, save, cancelDraft, router],
  );

  const cancelSwitchVariant = useCallback(() => setPendingVariantSwitchId(null), []);

  const openPublishConfirm = useCallback((id?: string) => setPublishTargetId(id ?? activeVariantId), [activeVariantId]);
  const closePublishConfirm = useCallback(() => setPublishTargetId(null), []);

  const publishVariant = useCallback(
    (id: string) => {
      const target = variants.find((v) => v.id === id);
      if (!target) return;
      const isActiveTarget = id === activeVariantId;
      const tokensToPublish = isActiveTarget ? draftTokens : target.tokens;
      const templateIdToPublish = isActiveTarget ? draftTemplateId : target.templateId;

      setPublishTargetId(null);
      if (isActiveTarget) setStatus('publishing');
      const now = new Date().toISOString();

      window.setTimeout(() => {
        setVariants((prev) =>
          prev.map((v) => {
            if (v.id === id) {
              return { ...v, tokens: tokensToPublish, templateId: templateIdToPublish, status: 'published', updatedAt: now, updatedBy: CURRENT_USER };
            }
            if (v.status === 'published') return { ...v, status: 'saved' };
            return v;
          }),
        );
        setHistory((prev) =>
          [
            {
              id: createId('history'),
              publishedAt: now,
              publishedBy: CURRENT_USER,
              variantName: target.name,
              templateId: templateIdToPublish,
              tokens: tokensToPublish,
            },
            ...prev,
          ].slice(0, 10),
        );
        if (isActiveTarget) setStatus('idle');
      }, 500);
    },
    [variants, activeVariantId, draftTokens, draftTemplateId],
  );

  const duplicateVariant = useCallback(
    (id: string, nameOverride?: string): string | null => {
      const source = variants.find((v) => v.id === id);
      if (!source) return null;
      const name = nameOverride ?? `${source.name} (copie)`;
      const newVariant: Variant = {
        id: createId('variant'),
        name,
        templateId: source.id === activeVariantId ? draftTemplateId : source.templateId,
        tokens: source.id === activeVariantId ? draftTokens : source.tokens,
        status: 'saved',
        previewSlug: createPreviewSlug(name),
        updatedAt: new Date().toISOString(),
        updatedBy: CURRENT_USER,
      };
      setVariants((prev) => [...prev, newVariant]);
      return newVariant.id;
    },
    [variants, activeVariantId, draftTokens, draftTemplateId],
  );

  const createVariant = useCallback((): string => {
    const name = 'Nouvelle variante';
    const newVariant: Variant = {
      id: createId('variant'),
      name,
      templateId: TEMPLATES[0].id,
      tokens: createDefaultTokens(NEOPSE_DEFAULT_PALETTE_ID),
      status: 'saved',
      previewSlug: createPreviewSlug(name),
      updatedAt: new Date().toISOString(),
      updatedBy: CURRENT_USER,
    };
    setVariants((prev) => [...prev, newVariant]);
    return newVariant.id;
  }, []);

  const renameVariant = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, name: trimmed, updatedAt: new Date().toISOString(), updatedBy: CURRENT_USER } : v)),
    );
  }, []);

  const deleteVariant = useCallback(
    (id: string) => {
      const target = variants.find((v) => v.id === id);
      if (!target || target.status === 'published') return;

      setVariants((prev) => prev.filter((v) => v.id !== id));

      if (id === activeVariantId) {
        const fallback = variants.find((v) => v.id !== id && v.status === 'published') ?? variants.find((v) => v.id !== id);
        if (fallback) {
          setActiveVariantId(fallback.id);
          setDraftTokens(fallback.tokens);
          setDraftTemplateId(fallback.templateId);
          setDraftForkId(forkIdFor(fallback.tokens, customPalettes));
          setStatus('idle');
        }
      }
    },
    [variants, activeVariantId, customPalettes],
  );

  const restoreFromHistory = useCallback(
    (entryId: string) => {
      const entry = history.find((h) => h.id === entryId);
      if (!entry) return;
      const name = `${entry.variantName} (restaurée)`;
      const newVariant: Variant = {
        id: createId('variant'),
        name,
        templateId: entry.templateId,
        tokens: entry.tokens,
        status: 'saved',
        previewSlug: createPreviewSlug(name),
        updatedAt: new Date().toISOString(),
        updatedBy: CURRENT_USER,
      };
      setVariants((prev) => [...prev, newVariant]);

      // Ne passe pas par requestSelectVariant : la nouvelle variante n'existe pas encore dans le
      // `variants` capturé par sa closure au même tick. On reproduit ici sa logique directement,
      // à partir de l'objet qu'on vient de créer.
      if (!isDirty) {
        setActiveVariantId(newVariant.id);
        setDraftTokens(newVariant.tokens);
        setDraftTemplateId(newVariant.templateId);
        setDraftForkId(forkIdFor(newVariant.tokens, customPalettes));
        setStatus('idle');
      } else {
        setPendingVariantSwitchId(newVariant.id);
      }
    },
    [history, isDirty, customPalettes],
  );

  const value: PersonnalisationStore = {
    variants,
    activeVariant,
    customPalettes,
    status,
    isDirty,
    draftTokens,
    draftTemplateId,
    activePalette,
    history,
    contrastIssues,
    pendingVariantSwitchId,
    publishTargetId,
    moduleCoexistenceMessage,
    activeEditorTab,
    highlightTarget,
    previewPageId,
    revealCommand,
    updatePaletteColor,
    selectPreset,
    resetPalette,
    setSectionRole,
    setModuleRole,
    resetToAuto,
    setTemplate,
    setTypographyPairing,
    setLogo,
    setSearchEnabled,
    setBackgroundMode,
    setBackgroundGraphicKind,
    setBackgroundImage,
    setBackgroundTexture,
    dismissModuleCoexistenceMessage,
    setActiveEditorTab,
    focusContrastIssue,
    openSection,
    clearHighlight,
    setPreviewPageId,
    requestReveal,
    save,
    cancelDraft,
    requestSelectVariant,
    requestReturnToHub,
    confirmSwitchVariant,
    cancelSwitchVariant,
    openPublishConfirm,
    closePublishConfirm,
    publishVariant,
    duplicateVariant,
    createVariant,
    renameVariant,
    deleteVariant,
    restoreFromHistory,
  };

  return <PersonnalisationContext.Provider value={value}>{children}</PersonnalisationContext.Provider>;
}

export function usePersonnalisation(): PersonnalisationStore {
  const ctx = useContext(PersonnalisationContext);
  if (!ctx) throw new Error('usePersonnalisation doit être utilisé dans un PersonnalisationProvider');
  return ctx;
}
