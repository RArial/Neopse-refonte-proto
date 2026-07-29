'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { computeLegalCompletion, getDefaultLegalPageState } from '@/lib/legal/legalCompletion';
import { getLegalTemplate, LEGAL_TEMPLATES } from '@/lib/legal/legalTemplates';
import type { LegalCompletion, LegalPageState, LegalTemplate, LegalTemplateId } from '@/types/legal';

interface LegalPagesStore {
  templates: LegalTemplate[];
  pageStates: Record<LegalTemplateId, LegalPageState>;
  /** Enregistre les valeurs d'une page légale (équivalent d'un « Enregistrer » de formulaire). */
  saveLegalPageValues: (templateId: LegalTemplateId, values: Record<string, string>) => void;
  getCompletion: (templateId: LegalTemplateId) => LegalCompletion;
}

const LegalPagesContext = createContext<LegalPagesStore | null>(null);

function buildInitialPageStates(): Record<LegalTemplateId, LegalPageState> {
  const initial = {} as Record<LegalTemplateId, LegalPageState>;
  for (const template of LEGAL_TEMPLATES) initial[template.id] = getDefaultLegalPageState(template);
  return initial;
}

/** Registre partagé des pages légales obligatoires — monté dans le layout du tableau de bord
 * (au-dessus de Contenu et de Personnalisation) car son état de complétion doit être lisible à la
 * fois depuis le registre « Pages obligatoires » et depuis l'avertissement de publication. */
export function LegalPagesProvider({ children }: { children: ReactNode }) {
  const [pageStates, setPageStates] = useState<Record<LegalTemplateId, LegalPageState>>(buildInitialPageStates);

  const saveLegalPageValues = useCallback((templateId: LegalTemplateId, values: Record<string, string>) => {
    setPageStates((prev) => ({ ...prev, [templateId]: { templateId, values } }));
  }, []);

  const getCompletion = useCallback(
    (templateId: LegalTemplateId): LegalCompletion => computeLegalCompletion(getLegalTemplate(templateId), pageStates[templateId].values),
    [pageStates],
  );

  const value = useMemo<LegalPagesStore>(
    () => ({ templates: LEGAL_TEMPLATES, pageStates, saveLegalPageValues, getCompletion }),
    [pageStates, saveLegalPageValues, getCompletion],
  );

  return <LegalPagesContext.Provider value={value}>{children}</LegalPagesContext.Provider>;
}

export function useLegalPages(): LegalPagesStore {
  const store = useContext(LegalPagesContext);
  if (!store) throw new Error('useLegalPages doit être utilisé à l’intérieur de <LegalPagesProvider>.');
  return store;
}
