'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  createFooterId,
  DEFAULT_FOOTER_CONTENT,
  SOCIAL_NETWORKS,
  type FooterContent,
  type FooterLink,
  type FooterLinkCategory,
  type SocialLink,
  type SocialNetwork,
} from '@/types/footer';

interface FooterContentStore {
  saved: FooterContent;
  content: FooterContent;
  isDirty: boolean;
  save: () => void;
  cancel: () => void;
  setTitle: (title: string) => void;
  setText: (text: string) => void;
  saveLink: (link: FooterLink) => void;
  removeLink: (id: string) => void;
  /** Crée une catégorie vide et retourne son id. */
  addLinkCategory: () => string;
  updateLinkCategory: (id: string, patch: Partial<FooterLinkCategory>) => void;
  /** Retourne `false` (sans rien supprimer) si la catégorie est encore utilisée par un lien. */
  removeLinkCategory: (id: string) => boolean;
  updateSocialLink: (id: string, patch: Partial<SocialLink>) => void;
  addSocialLink: () => void;
  removeSocialLink: (id: string) => void;
}

const FooterContentContext = createContext<FooterContentStore | null>(null);

function nextUnusedNetwork(existing: SocialLink[]): SocialNetwork {
  const used = new Set(existing.map((s) => s.network));
  return SOCIAL_NETWORKS.find((network) => !used.has(network)) ?? SOCIAL_NETWORKS[0];
}

/** Registre partagé du contenu du pied de page — monté au-dessus de l'écran « Pied de page » et de
 * ses sous-pages (ajout/modification d'un lien) pour que le brouillon en cours d'édition survive à
 * la navigation entre ces écrans, jusqu'à l'« Enregistrer » explicite du formulaire principal. */
export function FooterContentProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<FooterContent>(DEFAULT_FOOTER_CONTENT);
  const [content, setContent] = useState<FooterContent>(DEFAULT_FOOTER_CONTENT);

  const isDirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);

  const save = useCallback(() => setSaved(content), [content]);
  const cancel = useCallback(() => setContent(saved), [saved]);

  const setTitle = useCallback((title: string) => setContent((prev) => ({ ...prev, title })), []);
  const setText = useCallback((text: string) => setContent((prev) => ({ ...prev, text })), []);

  const saveLink = useCallback((link: FooterLink) => {
    setContent((prev) => {
      const exists = prev.links.some((l) => l.id === link.id);
      return { ...prev, links: exists ? prev.links.map((l) => (l.id === link.id ? link : l)) : [...prev.links, link] };
    });
  }, []);

  const removeLink = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, links: prev.links.filter((link) => link.id !== id) }));
  }, []);

  const addLinkCategory = useCallback(() => {
    const id = createFooterId('footer-cat');
    setContent((prev) => ({ ...prev, linkCategories: [...prev.linkCategories, { id, name: '' }] }));
    return id;
  }, []);

  const updateLinkCategory = useCallback((id: string, patch: Partial<FooterLinkCategory>) => {
    setContent((prev) => ({
      ...prev,
      linkCategories: prev.linkCategories.map((category) => (category.id === id ? { ...category, ...patch } : category)),
    }));
  }, []);

  const removeLinkCategory = useCallback(
    (id: string) => {
      if (content.links.some((link) => link.categoryId === id)) return false;
      setContent((prev) => ({ ...prev, linkCategories: prev.linkCategories.filter((category) => category.id !== id) }));
      return true;
    },
    [content.links],
  );

  const updateSocialLink = useCallback((id: string, patch: Partial<SocialLink>) => {
    setContent((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((social) => (social.id === id ? { ...social, ...patch } : social)),
    }));
  }, []);

  const addSocialLink = useCallback(() => {
    setContent((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { id: createFooterId('footer-social'), network: nextUnusedNetwork(prev.socialLinks), url: '' }],
    }));
  }, []);

  const removeSocialLink = useCallback((id: string) => {
    setContent((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((social) => social.id !== id) }));
  }, []);

  const value = useMemo<FooterContentStore>(
    () => ({
      saved,
      content,
      isDirty,
      save,
      cancel,
      setTitle,
      setText,
      saveLink,
      removeLink,
      addLinkCategory,
      updateLinkCategory,
      removeLinkCategory,
      updateSocialLink,
      addSocialLink,
      removeSocialLink,
    }),
    [
      saved,
      content,
      isDirty,
      save,
      cancel,
      setTitle,
      setText,
      saveLink,
      removeLink,
      addLinkCategory,
      updateLinkCategory,
      removeLinkCategory,
      updateSocialLink,
      addSocialLink,
      removeSocialLink,
    ],
  );

  return <FooterContentContext.Provider value={value}>{children}</FooterContentContext.Provider>;
}

export function useFooterContent(): FooterContentStore {
  const store = useContext(FooterContentContext);
  if (!store) throw new Error('useFooterContent doit être utilisé à l’intérieur de <FooterContentProvider>.');
  return store;
}
