import { closestCenter, pointerWithin, type Announcements, type CollisionDetection } from '@dnd-kit/core';
import type { ContentBlockKind, LayoutKey } from '@/types/actualites';

export const ROWS_END_ID = 'rows-end';

export const rowDndId = (rowId: string) => `row:${rowId}`;
export const blockDndId = (blockId: string) => `block:${blockId}`;
export const columnDndId = (rowId: string, columnIndex: number) => `col:${rowId}:${columnIndex}`;
export const paletteLayoutDndId = (layout: LayoutKey) => `palette-layout:${layout}`;
export const paletteBlockDndId = (kind: ContentBlockKind) => `palette-block:${kind}`;

export type DndData =
  | { type: 'row'; rowId: string; label: string }
  | { type: 'block'; blockId: string; label: string }
  | { type: 'column'; rowId: string; columnIndex: number }
  | { type: 'palette-layout'; layout: LayoutKey; label: string }
  | { type: 'palette-block'; kind: ContentBlockKind; label: string }
  | { type: 'rows-end' };

/** Ce qu'on déplace détermine où on peut le poser : une structure entre les structures, un contenu dans une colonne. */
function acceptsDrop(activeType: DndData['type'] | undefined, overType: DndData['type'] | undefined): boolean {
  if (activeType === 'row' || activeType === 'palette-layout') return overType === 'row' || overType === 'rows-end';
  if (activeType === 'block' || activeType === 'palette-block') return overType === 'block' || overType === 'column';
  return false;
}

export const builderCollisionDetection: CollisionDetection = (args) => {
  const activeType = (args.active.data.current as DndData | undefined)?.type;
  const droppableContainers = args.droppableContainers.filter((container) =>
    acceptsDrop(activeType, (container.data.current as DndData | undefined)?.type),
  );
  const filtered = { ...args, droppableContainers };
  const within = pointerWithin(filtered);
  // Un contenu survolé est plus précis que sa colonne, qui le contient aussi.
  const blockHit = within.find((collision) => String(collision.id).startsWith('block:'));
  if (blockHit) return [blockHit];
  return within.length > 0 ? within : closestCenter(filtered);
};

function labelOf(data: DndData | undefined): string {
  return data && 'label' in data ? `« ${data.label} »` : "l'élément";
}

export const BUILDER_SCREEN_READER_INSTRUCTIONS = {
  draggable:
    "Pour déplacer cet élément, appuyez sur Espace ou Entrée, utilisez les flèches pour le déplacer, puis Espace ou Entrée pour le déposer. Échap annule.",
};

export const builderAnnouncements: Announcements = {
  onDragStart: ({ active }) => `${labelOf(active.data.current as DndData)} saisi.`,
  onDragOver: ({ active, over }) => (over ? `${labelOf(active.data.current as DndData)} au-dessus d'un emplacement valide.` : `${labelOf(active.data.current as DndData)} hors d'une zone de dépôt.`),
  onDragEnd: ({ active, over }) => (over ? `${labelOf(active.data.current as DndData)} déposé.` : `${labelOf(active.data.current as DndData)} relâché sans être déplacé.`),
  onDragCancel: ({ active }) => `Déplacement de ${labelOf(active.data.current as DndData)} annulé.`,
};
