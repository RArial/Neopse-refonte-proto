import type { LegalCompletion, LegalField, LegalPageState, LegalTemplate } from '@/types/legal';
import { getStructureValue } from '@/lib/legal/structureData';

export function getTemplateFields(template: LegalTemplate): LegalField[] {
  const fields: LegalField[] = [];
  const seenKeys = new Set<string>();
  for (const block of template.blocks) {
    if (block.kind !== 'field') continue;
    if (seenKeys.has(block.field.key)) continue;
    seenKeys.add(block.field.key);
    fields.push(block.field);
  }
  return fields;
}

/** Un champ requis compte comme rempli s'il est non vide après suppression des espaces — on ne
 * juge jamais la qualité du contenu, seulement rempli / non rempli (y compris pour le richtext,
 * dont la valeur HTML peut contenir des balises vides). */
function isFieldFilled(field: LegalField, rawValue: string | undefined): boolean {
  const value = (rawValue ?? '').trim();
  if (value === '') return false;
  if (field.type.input === 'richtext') return value.replace(/<[^>]*>/g, '').trim() !== '';
  return true;
}

export function getDefaultLegalPageState(template: LegalTemplate): LegalPageState {
  const values: Record<string, string> = {};
  for (const field of getTemplateFields(template)) {
    values[field.key] = field.prefillFrom ? getStructureValue(field.prefillFrom) : '';
  }
  return { templateId: template.id, values };
}

export function computeLegalCompletion(template: LegalTemplate, values: Record<string, string>): LegalCompletion {
  const missingFieldKeys = getTemplateFields(template)
    .filter((field) => field.required && !isFieldFilled(field, values[field.key]))
    .map((field) => field.key);

  return {
    complete: missingFieldKeys.length === 0,
    missingCount: missingFieldKeys.length,
    missingFieldKeys,
  };
}

