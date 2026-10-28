import { createBlock, type ContentBlockData, type ContentBlockKind, type ContentBlockPatch, type StructureRow } from '@/types/actualites';
import { cloneContent } from '@/lib/actualites/news';

/** Colonne visée : la palette « Informations » insère ici. */
export interface ColumnRef {
  rowId: string;
  columnIndex: number;
}

export interface BlockLocation extends ColumnRef {
  index: number;
}

/** Insère une ligne de structure déjà créée (à la fin si `beforeRowId` est absent ou introuvable). */
export function insertRow(content: StructureRow[], row: StructureRow, beforeRowId?: string): StructureRow[] {
  const index = beforeRowId ? content.findIndex((candidate) => candidate.id === beforeRowId) : -1;
  if (index === -1) return [...content, row];
  const next = [...content];
  next.splice(index, 0, row);
  return next;
}

export function moveRowTo(content: StructureRow[], rowId: string, targetRowId: string): StructureRow[] {
  const from = content.findIndex((row) => row.id === rowId);
  const to = content.findIndex((row) => row.id === targetRowId);
  if (from === -1 || to === -1 || from === to) return content;
  const next = [...content];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function moveRowBy(content: StructureRow[], rowId: string, delta: -1 | 1): StructureRow[] {
  const from = content.findIndex((row) => row.id === rowId);
  const target = content[from + delta];
  return target ? moveRowTo(content, rowId, target.id) : content;
}

export function duplicateRow(content: StructureRow[], rowId: string): StructureRow[] {
  const index = content.findIndex((row) => row.id === rowId);
  if (index === -1) return content;
  const next = [...content];
  next.splice(index + 1, 0, cloneContent([content[index]])[0]);
  return next;
}

export function removeRow(content: StructureRow[], rowId: string): StructureRow[] {
  return content.filter((row) => row.id !== rowId);
}

function mapColumn(content: StructureRow[], target: ColumnRef, update: (blocks: ContentBlockData[]) => ContentBlockData[]): StructureRow[] {
  return content.map((row) =>
    row.id === target.rowId ? { ...row, columns: row.columns.map((blocks, index) => (index === target.columnIndex ? update(blocks) : blocks)) } : row,
  );
}

/** Insère un nouveau contenu (à la fin de la colonne si `index` est absent). */
export function insertBlock(content: StructureRow[], target: ColumnRef, kind: ContentBlockKind, index?: number): StructureRow[] {
  return mapColumn(content, target, (blocks) => {
    const next = [...blocks];
    next.splice(index ?? next.length, 0, createBlock(kind));
    return next;
  });
}

export function locateBlock(content: StructureRow[], blockId: string): BlockLocation | null {
  for (const row of content) {
    for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex += 1) {
      const index = row.columns[columnIndex].findIndex((block) => block.id === blockId);
      if (index !== -1) return { rowId: row.id, columnIndex, index };
    }
  }
  return null;
}

/** Déplace un contenu, y compris vers une autre colonne ou un autre bloc de structure. */
export function moveBlock(content: StructureRow[], blockId: string, target: ColumnRef, targetIndex?: number): StructureRow[] {
  const from = locateBlock(content, blockId);
  if (!from) return content;
  const block = content.find((row) => row.id === from.rowId)?.columns[from.columnIndex][from.index];
  if (!block) return content;
  const without = mapColumn(content, from, (blocks) => blocks.filter((candidate) => candidate.id !== blockId));
  // Même colonne : l'élément prend la place de celui survolé (comportement d'une liste triable).
  // Autre colonne : il s'insère avant l'élément survolé, ou à la fin.
  return mapColumn(without, target, (blocks) => {
    const next = [...blocks];
    const index = Math.min(Math.max(targetIndex ?? next.length, 0), next.length);
    next.splice(index, 0, block);
    return next;
  });
}

export function updateBlock(content: StructureRow[], blockId: string, patch: ContentBlockPatch): StructureRow[] {
  return content.map((row) => ({
    ...row,
    columns: row.columns.map((blocks) => blocks.map((block) => (block.id === blockId ? ({ ...block, ...patch } as ContentBlockData) : block))),
  }));
}

export function duplicateBlock(content: StructureRow[], blockId: string): StructureRow[] {
  const location = locateBlock(content, blockId);
  if (!location) return content;
  return mapColumn(content, location, (blocks) => {
    const copy = cloneContent([{ id: 'tmp', layout: '1', columns: [[blocks[location.index]]] }])[0].columns[0][0];
    const next = [...blocks];
    next.splice(location.index + 1, 0, copy);
    return next;
  });
}

export function removeBlock(content: StructureRow[], blockId: string): StructureRow[] {
  return content.map((row) => ({ ...row, columns: row.columns.map((blocks) => blocks.filter((block) => block.id !== blockId)) }));
}
