import type { AddedModule } from '@/types/content';

/** Nombre maximal de niveaux de modules imbriqués (page parente de page parente…) sous un onglet ou à la racine. */
export const MAX_MODULE_DEPTH = 4;

/** Identifiant du conteneur direct d'un module : sa page parente si elle existe, sinon son onglet (ou la racine). */
export function containerOf(mod: AddedModule): string {
  return mod.parentPageId || mod.thematiqueId;
}

/** Profondeur d'un module : 1 s'il n'a pas de page parente, sinon 1 + la profondeur de sa page parente. */
export function getModuleDepth(modules: AddedModule[], id: string): number {
  const byId = new Map(modules.map((mod) => [mod.id, mod]));
  const visited = new Set<string>();
  let depth = 1;
  let current = byId.get(id);
  while (current?.parentPageId && byId.has(current.parentPageId) && !visited.has(current.id)) {
    visited.add(current.id);
    depth += 1;
    current = byId.get(current.parentPageId);
  }
  return depth;
}

/** Hauteur du sous-arbre enraciné en `id` (1 s'il n'a pas d'enfants, davantage sinon). */
export function getSubtreeHeight(modules: AddedModule[], id: string): number {
  const childIds = modules.filter((mod) => mod.parentPageId === id).map((mod) => mod.id);
  if (childIds.length === 0) return 1;
  return 1 + Math.max(...childIds.map((childId) => getSubtreeHeight(modules, childId)));
}

/** `candidateId` est-il `ancestorId` lui-même, ou l'un de ses descendants via la chaîne `parentPageId` ? */
export function isSelfOrDescendant(modules: AddedModule[], candidateId: string, ancestorId: string): boolean {
  if (candidateId === ancestorId) return true;
  const byId = new Map(modules.map((mod) => [mod.id, mod]));
  const visited = new Set<string>();
  let current = byId.get(candidateId);
  while (current?.parentPageId && !visited.has(current.id)) {
    if (current.parentPageId === ancestorId) return true;
    visited.add(current.id);
    current = byId.get(current.parentPageId);
  }
  return false;
}

/** Un module glissé peut-il être déposé « à l'intérieur » de `targetId` (celui-ci devenant sa nouvelle page parente) ?
 * Seul un module (rubrique comprise) peut servir de page parente ; une séparation n'a pas de page parente (elle
 * reste toujours au premier niveau d'un onglet) et ne peut donc jamais être imbriquée ni servir de conteneur. */
export function canNestModuleInto(modules: AddedModule[], draggedId: string, targetId: string): boolean {
  const dragged = modules.find((mod) => mod.id === draggedId);
  const target = modules.find((mod) => mod.id === targetId);
  if (dragged?.kind === 'separator' || target?.kind !== 'module') return false;
  if (isSelfOrDescendant(modules, targetId, draggedId)) return false;
  return getModuleDepth(modules, targetId) + getSubtreeHeight(modules, draggedId) <= MAX_MODULE_DEPTH;
}
