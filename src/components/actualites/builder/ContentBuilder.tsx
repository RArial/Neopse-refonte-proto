'use client';

import { useDndContext, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { ROWS_END_ID, rowDndId, type DndData } from '@/components/actualites/builder/dnd';
import { StructureRowCard } from '@/components/actualites/builder/StructureRowCard';
import { duplicateBlock, duplicateRow, moveRowBy, removeBlock, removeRow, updateBlock, type ColumnRef } from '@/lib/actualites/content';
import type { StructureRow } from '@/types/actualites';

interface ContentBuilderProps {
  content: StructureRow[];
  /** Mise à jour fonctionnelle : appliquée au contenu le plus récent. */
  onChange: (update: (content: StructureRow[]) => StructureRow[]) => void;
  selectedColumn: ColumnRef | null;
  onSelectColumn: (column: ColumnRef) => void;
}

/** Zone de dépôt « à la fin » : l'état vide, ou un liseré sous la dernière structure pendant un glisser. */
function RowsEndDropZone({ empty }: { empty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: ROWS_END_ID, data: { type: 'rows-end' } });
  const { active } = useDndContext();
  const activeType = (active?.data.current as DndData | undefined)?.type;
  const draggingStructure = activeType === 'row' || activeType === 'palette-layout';

  if (empty) {
    return (
      <Stack
        ref={setNodeRef}
        spacing={1}
        sx={(theme) => ({
          alignItems: 'center',
          textAlign: 'center',
          py: 7,
          px: 2,
          borderRadius: 2,
          border: '2px dashed',
          borderColor: isOver ? 'primary.main' : 'grey.500',
          bgcolor: isOver ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
          color: 'text.secondary',
        })}
      >
        <DescriptionOutlinedIcon fontSize="large" aria-hidden="true" />
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Aucun contenu pour le moment
        </Typography>
        <Typography variant="body2">Glissez un bloc de structure ici, ou cliquez-en un dans le panneau à droite.</Typography>
      </Stack>
    );
  }

  return (
    <Box
      ref={setNodeRef}
      aria-hidden="true"
      sx={{
        height: draggingStructure ? 56 : 8,
        borderRadius: 2,
        border: draggingStructure ? '2px dashed' : 'none',
        borderColor: isOver ? 'primary.main' : 'grey.400',
        transition: 'height 150ms ease',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    />
  );
}

export function ContentBuilder({ content, onChange, selectedColumn, onSelectColumn }: ContentBuilderProps) {
  return (
    <Box component="section" aria-labelledby="news-content-title" sx={{ minWidth: 0 }}>
      <Typography id="news-content-title" variant="h6" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
        Contenu de l&apos;actualité
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Composez la page avec des blocs de structure, puis remplissez chaque colonne avec des informations
      </Typography>

      {content.length === 0 ? (
        <RowsEndDropZone empty />
      ) : (
        <Stack spacing={2}>
          <SortableContext items={content.map((row) => rowDndId(row.id))} strategy={verticalListSortingStrategy}>
            {content.map((row, index) => (
              <StructureRowCard
                key={row.id}
                row={row}
                canMoveUp={index > 0}
                canMoveDown={index < content.length - 1}
                onMove={(delta) => onChange((current) => moveRowBy(current, row.id, delta))}
                onDuplicate={() => onChange((current) => duplicateRow(current, row.id))}
                onDelete={() => onChange((current) => removeRow(current, row.id))}
                onUpdateBlock={(blockId, patch) => onChange((current) => updateBlock(current, blockId, patch))}
                onDuplicateBlock={(blockId) => onChange((current) => duplicateBlock(current, blockId))}
                onDeleteBlock={(blockId) => onChange((current) => removeBlock(current, blockId))}
                selectedColumnIndex={selectedColumn?.rowId === row.id ? selectedColumn.columnIndex : null}
                onSelectColumn={(columnIndex) => onSelectColumn({ rowId: row.id, columnIndex })}
              />
            ))}
          </SortableContext>
          <RowsEndDropZone empty={false} />
        </Stack>
      )}
    </Box>
  );
}
