/** Pages légales obligatoires (Mentions légales, Accessibilité…) : le texte réglementaire est un
 * gabarit fixe non éditable, seules les variables (coordonnées, taux de conformité…) sont des
 * champs. Voir `src/lib/legal/legalTemplates.ts` pour les gabarits et `LegalPageEditor` pour le rendu. */

export type LegalFieldType =
  | { input: 'url' }
  | { input: 'text' }
  | { input: 'number'; min?: number; max?: number; suffix?: string }
  | { input: 'email' }
  | { input: 'choice'; options: string[] }
  /** Réservé aux rares blocs de vraie rédaction libre (ex. liste des dérogations d'accessibilité). */
  | { input: 'richtext' };

export interface LegalField {
  key: string;
  label: string;
  help?: string;
  required: boolean;
  /** Clé de `StructureData` (src/lib/legal/structureData.ts) utilisée pour pré-remplir la valeur initiale. */
  prefillFrom?: string;
  type: LegalFieldType;
}

export type LegalBlock =
  /**
   * Texte réglementaire fixe, en lecture seule — jamais éditable ni supprimable par l'utilisateur.
   * `text` est du texte brut (pas de HTML injecté). `as` donne un indice de mise en forme ;
   * `newParagraph` démarre un nouveau paragraphe dans le flux continu du document (voir §2 du cahier
   * des charges — les blocs 'fixed'/'field' consécutifs se lisent en continu, comme le document publié).
   */
  | { kind: 'fixed'; text: string; as?: 'heading' | 'subheading' | 'body'; newParagraph?: boolean }
  | { kind: 'field'; field: LegalField };

export type LegalTemplateId = 'accessibility' | 'legal';

export interface LegalTemplate {
  id: LegalTemplateId;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalPageState {
  templateId: LegalTemplateId;
  values: Record<string, string>;
}

export interface LegalCompletion {
  complete: boolean;
  missingCount: number;
  missingFieldKeys: string[];
}
