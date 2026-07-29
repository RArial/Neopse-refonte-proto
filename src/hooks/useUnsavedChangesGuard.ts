'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface UseUnsavedChangesGuardOptions {
  /** Préfixes de chemin (ex. sous-pages d'un même écran) qui ne déclenchent pas l'avertissement. */
  excludePrefixes?: string[];
}

const EMPTY_PREFIXES: string[] = [];

/**
 * Avertit l'utilisateur avant de quitter la page tant que `isDirty` est vrai :
 * - navigateur (fermeture d'onglet, rechargement, saisie d'une nouvelle URL) via `beforeunload` ;
 * - navigation interne (clic sur un lien `next/link`) interceptée en amont, avant que le routeur ne l'exécute.
 */
export function useUnsavedChangesGuard(isDirty: boolean, options: UseUnsavedChangesGuardOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const isDirtyRef = useRef(isDirty);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const excludePrefixes = options.excludePrefixes ?? EMPTY_PREFIXES;

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!isDirtyRef.current) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || anchor.getAttribute('target') === '_blank') return;

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname === pathname) return;
      if (excludePrefixes.some((prefix) => url.pathname.startsWith(prefix))) return;

      event.preventDefault();
      setPendingHref(`${url.pathname}${url.search}${url.hash}`);
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, excludePrefixes]);

  const confirmLeave = useCallback(() => {
    if (pendingHref) router.push(pendingHref);
    setPendingHref(null);
  }, [pendingHref, router]);

  const cancelLeave = useCallback(() => setPendingHref(null), []);

  return { isDialogOpen: pendingHref !== null, confirmLeave, cancelLeave };
}
