'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Icons } from '@/components/ui/Icons';
import { ContentBlockCard } from '@/components/editos/builder/ContentBlockCard';
import {
  CONTENT_BLOCK_DRAG_MIME,
  CONTENT_BLOCK_KINDS,
  CONTENT_BLOCK_META,
  LAYOUT_OPTIONS,
  type ContentBlockKind,
  type ContentBlockPatch,
  type StructureRow,
} from '@/types/editos';

interface StructureRowCardProps {
  row: StructureRow;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: 'up' | 'down') => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddBlock: (columnIndex: number, kind: ContentBlockKind) => void;
  onUpdateBlock: (columnIndex: number, blockId: string, patch: ContentBlockPatch) => void;
  onDuplicateBlock: (columnIndex: number, blockId: string) => void;
  onDeleteBlock: (columnIndex: number, blockId: string) => void;
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
  onAddBlock,
  onUpdateBlock,
  onDuplicateBlock,
  onDeleteBlock,
  selectedColumnIndex,
  onSelectColumn,
}: StructureRowCardProps) {
  const layout = LAYOUT_OPTIONS.find((option) => option.key === row.layout) ?? LAYOUT_OPTIONS[0];
  const [addMenu, setAddMenu] = useState<{ columnIndex: number; anchorEl: HTMLElement } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null);

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ alignItems: 'center', px: 1.5, py: 1, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Box aria-hidden="true" sx={{ width: 22, height: 14, borderRadius: 0.5, bgcolor: 'grey.400', mr: 1 }} />
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', flex: 1 }}>
          {layout.widths.length} colonne{layout.widths.length > 1 ? 's' : ''}
        </Typography>
        <Tooltip title="Monter">
          <span>
            <IconButton size="small" onClick={() => onMove('up')} disabled={!canMoveUp} aria-label="Monter ce bloc de structure">
              <ArrowUpwardIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Descendre">
          <span>
            <IconButton size="small" onClick={() => onMove('down')} disabled={!canMoveDown} aria-label="Descendre ce bloc de structure">
              <ArrowDownwardIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Dupliquer">
          <IconButton size="small" onClick={onDuplicate} aria-label="Dupliquer ce bloc de structure">
            <ContentCopyOutlinedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer">
          <IconButton size="small" onClick={onDelete} aria-label="Supprimer ce bloc de structure">
            <DeleteOutlineIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, p: 2 }}>
        {row.columns.map((blocks, columnIndex) => {
          const isSelected = selectedColumnIndex === columnIndex;
          const isDragOver = dragOverColumn === columnIndex;
          return (
            <Box
              key={columnIndex}
              onClick={() => onSelectColumn(columnIndex)}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverColumn(columnIndex);
              }}
              onDragLeave={() => setDragOverColumn((current) => (current === columnIndex ? null : current))}
              onDrop={(event) => {
                event.preventDefault();
                setDragOverColumn(null);
                const kind = event.dataTransfer.getData(CONTENT_BLOCK_DRAG_MIME) as ContentBlockKind;
                if (CONTENT_BLOCK_KINDS.includes(kind)) {
                  onSelectColumn(columnIndex);
                  onAddBlock(columnIndex, kind);
                }
              }}
              sx={{
                flex: layout.widths[columnIndex],
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                minWidth: 0,
                p: 1,
                borderRadius: 2,
                border: '2px solid',
                borderColor: isDragOver ? 'primary.main' : isSelected ? 'primary.light' : 'transparent',
                bgcolor: isDragOver ? 'action.hover' : 'transparent',
                transition: 'border-color 150ms ease, background-color 150ms ease',
              }}
            >
              {blocks.map((block) => (
                <ContentBlockCard
                  key={block.id}
                  block={block}
                  onChange={(patch) => onUpdateBlock(columnIndex, block.id, patch)}
                  onDuplicate={() => onDuplicateBlock(columnIndex, block.id)}
                  onDelete={() => onDeleteBlock(columnIndex, block.id)}
                />
              ))}
              <Box
                component="button"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectColumn(columnIndex);
                  setAddMenu({ columnIndex, anchorEl: event.currentTarget });
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.75,
                  border: '1.5px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  py: 1.25,
                  bgcolor: 'transparent',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                }}
              >
                <AddOutlinedIcon fontSize="small" /> Ajouter
              </Box>
            </Box>
          );
        })}
      </Box>

      <Menu anchorEl={addMenu?.anchorEl} open={addMenu !== null} onClose={() => setAddMenu(null)}>
        {CONTENT_BLOCK_KINDS.map((kind) => {
          const meta = CONTENT_BLOCK_META[kind];
          const IconEl = Icons[meta.icon];
          return (
            <MenuItem
              key={kind}
              onClick={() => {
                onAddBlock(addMenu!.columnIndex, kind);
                setAddMenu(null);
              }}
            >
              <ListItemIcon>
                <IconEl size={16} />
              </ListItemIcon>
              {meta.label}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
