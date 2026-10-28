'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ContentBlockCard } from '@/components/actualites/builder/ContentBlockCard';
import { blockDndId, columnDndId, rowDndId } from '@/components/actualites/builder/dnd';
import { LayoutIcon } from '@/components/actualites/builder/LayoutIcon';
import { LAYOUT_OPTIONS, type ContentBlockData, type ContentBlockPatch, type StructureRow } from '@/types/actualites';

interface ColumnProps {
  rowId: string;
  columnIndex: number;
  columnCount: number;
  flex: number;
  blocks: ContentBlockData[];
  selected: boolean;
  onSelect: () => void;
  onUpdateBlock: (blockId: string, patch: ContentBlockPatch) => void;
  onDuplicateBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
}

function Column({ rowId, columnIndex, columnCount, flex, blocks, selected, onSelect, onUpdateBlock, onDuplicateBlock, onDeleteBlock }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnDndId(rowId, columnIndex), data: { type: 'column', rowId, columnIndex } });
  const columnLabel = columnCount > 1 ? `colonne ${columnIndex + 1}` : 'colonne';

  return (
    <Box
      ref={setNodeRef}
      sx={(theme) => ({
        flex,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        minWidth: 0,
        p: 1,
        borderRadius: 2,
        border: '2px solid',
        borderColor: isOver || selected ? 'primary.main' : 'transparent',
        bgcolor: isOver || selected ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
        transition: 'border-color 150ms ease, background-color 150ms ease',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      })}
    >
      <SortableContext items={blocks.map((block) => blockDndId(block.id))} strategy={verticalListSortingStrategy}>
        {blocks.map((block) => (
          <ContentBlockCard
            key={block.id}
            block={block}
            onChange={(patch) => onUpdateBlock(block.id, patch)}
            onDuplicate={() => onDuplicateBlock(block.id)}
            onDelete={() => onDeleteBlock(block.id)}
          />
        ))}
      </SortableContext>
      <Box
        component="button"
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Sélectionner la ${columnLabel} pour y ajouter un contenu`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          minHeight: 48,
          border: '1.5px dashed',
          borderColor: selected ? 'primary.main' : 'grey.500',
          borderRadius: 2,
          bgcolor: 'transparent',
          color: selected ? 'primary.main' : 'text.secondary',
          cursor: 'pointer',
          font: 'inherit',
          fontSize: 13,
          fontWeight: 600,
          '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        }}
      >
        <AddOutlinedIcon fontSize="small" aria-hidden="true" /> Glisser &amp; déposer un contenu
      </Box>
    </Box>
  );
}

interface StructureRowCardProps {
  row: StructureRow;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (delta: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUpdateBlock: (blockId: string, patch: ContentBlockPatch) => void;
  onDuplicateBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  selectedColumnIndex: number | null;
  onSelectColumn: (columnIndex: number) => void;
}

export function StructureRowCard({
  row,
  canMoveUp,
  canMoveDown,
  onMove,
  onDuplicate,
  onDelete,
  onUpdateBlock,
  onDuplicateBlock,
  onDeleteBlock,
  selectedColumnIndex,
  onSelectColumn,
}: StructureRowCardProps) {
  const layout = LAYOUT_OPTIONS.find((option) => option.key === row.layout) ?? LAYOUT_OPTIONS[0];
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: rowDndId(row.id),
    data: { type: 'row', rowId: row.id, label: layout.label },
  });

  return (
    <Box
      ref={setNodeRef}
      component="section"
      aria-label={`Bloc de structure ${layout.label}`}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', opacity: isDragging ? 0.4 : 1 }}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', px: 0.5, py: 0.25, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tooltip title="Déplacer">
          <IconButton
            ref={setActivatorNodeRef}
            size="small"
            aria-label={`Déplacer le bloc de structure ${layout.label}`}
            sx={{ cursor: 'grab', touchAction: 'none' }}
            {...attributes}
            {...listeners}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <LayoutIcon widths={layout.widths} size="small" />
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', flex: 1, ml: 1 }}>
          {layout.label}
        </Typography>
        <Tooltip title="Monter">
          <span>
            <IconButton size="small" onClick={() => onMove(-1)} disabled={!canMoveUp} aria-label="Monter ce bloc de structure">
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Descendre">
          <span>
            <IconButton size="small" onClick={() => onMove(1)} disabled={!canMoveDown} aria-label="Descendre ce bloc de structure">
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Dupliquer">
          <IconButton size="small" onClick={onDuplicate} aria-label="Dupliquer ce bloc de structure">
            <ContentCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer">
          <IconButton size="small" onClick={onDelete} aria-label="Supprimer ce bloc de structure" sx={{ '&:hover': { color: 'error.main' } }}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, p: 1.5 }}>
        {row.columns.map((blocks, columnIndex) => (
          <Column
            key={columnIndex}
            rowId={row.id}
            columnIndex={columnIndex}
            columnCount={row.columns.length}
            flex={layout.widths[columnIndex]}
            blocks={blocks}
            selected={selectedColumnIndex === columnIndex}
            onSelect={() => onSelectColumn(columnIndex)}
            onUpdateBlock={onUpdateBlock}
            onDuplicateBlock={onDuplicateBlock}
            onDeleteBlock={onDeleteBlock}
          />
        ))}
      </Box>
    </Box>
  );
}
