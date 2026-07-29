'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { StructureRowCard } from '@/components/actualites/builder/StructureRowCard';
import { createBlock, type ContentBlockKind, type ContentBlockPatch, type StructureRow } from '@/types/actualites';

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export interface SelectedTarget {
  rowIndex: number;
  columnIndex: number;
}

interface ContentBuilderProps {
  content: StructureRow[];
  onChange: (content: StructureRow[]) => void;
  selectedTarget: SelectedTarget | null;
  onSelectTarget: (target: SelectedTarget) => void;
}

export function ContentBuilder({ content, onChange, selectedTarget, onSelectTarget }: ContentBuilderProps) {
  function moveRow(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= content.length) return;
    const next = [...content];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  }

  function duplicateRow(index: number) {
    const row = content[index];
    const copy: StructureRow = {
      ...row,
      id: randomId('row'),
      columns: row.columns.map((blocks) => blocks.map((block) => ({ ...block, id: randomId('block') }))),
    };
    const next = [...content];
    next.splice(index + 1, 0, copy);
    onChange(next);
  }

  function deleteRow(index: number) {
    onChange(content.filter((_, i) => i !== index));
  }

  function addBlock(rowIndex: number, columnIndex: number, kind: ContentBlockKind) {
    const next = content.map((row, i) => {
      if (i !== rowIndex) return row;
      const columns = row.columns.map((blocks, ci) => (ci === columnIndex ? [...blocks, createBlock(kind)] : blocks));
      return { ...row, columns };
    });
    onChange(next);
  }

  function updateBlock(rowIndex: number, columnIndex: number, blockId: string, patch: ContentBlockPatch) {
    const next = content.map((row, i) => {
      if (i !== rowIndex) return row;
      const columns = row.columns.map((blocks, ci) =>
        ci === columnIndex ? blocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block)) : blocks,
      );
      return { ...row, columns };
    });
    onChange(next);
  }

  function duplicateBlock(rowIndex: number, columnIndex: number, blockId: string) {
    const next = content.map((row, i) => {
      if (i !== rowIndex) return row;
      const columns = row.columns.map((blocks, ci) => {
        if (ci !== columnIndex) return blocks;
        const index = blocks.findIndex((block) => block.id === blockId);
        if (index === -1) return blocks;
        const copy = { ...blocks[index], id: randomId('block') };
        const inserted = [...blocks];
        inserted.splice(index + 1, 0, copy);
        return inserted;
      });
      return { ...row, columns };
    });
    onChange(next);
  }

  function deleteBlock(rowIndex: number, columnIndex: number, blockId: string) {
    const next = content.map((row, i) => {
      if (i !== rowIndex) return row;
      const columns = row.columns.map((blocks, ci) => (ci === columnIndex ? blocks.filter((block) => block.id !== blockId) : blocks));
      return { ...row, columns };
    });
    onChange(next);
  }

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
        Contenu de l&apos;actualité
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Composez la page avec des blocs de structure, puis remplissez chaque colonne avec des informations.
      </Typography>

      {content.length === 0 ? (
        <Box sx={{ border: '1.5px dashed', borderColor: 'divider', borderRadius: 2, py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Ajoutez un premier bloc de structure depuis le panneau « Blocs » à droite.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {content.map((row, index) => (
            <StructureRowCard
              key={row.id}
              row={row}
              canMoveUp={index > 0}
              canMoveDown={index < content.length - 1}
              onMove={(direction) => moveRow(index, direction)}
              onDuplicate={() => duplicateRow(index)}
              onDelete={() => deleteRow(index)}
              onAddBlock={(columnIndex, kind) => addBlock(index, columnIndex, kind)}
              onUpdateBlock={(columnIndex, blockId, patch) => updateBlock(index, columnIndex, blockId, patch)}
              onDuplicateBlock={(columnIndex, blockId) => duplicateBlock(index, columnIndex, blockId)}
              onDeleteBlock={(columnIndex, blockId) => deleteBlock(index, columnIndex, blockId)}
              selectedColumnIndex={selectedTarget?.rowIndex === index ? selectedTarget.columnIndex : null}
              onSelectColumn={(columnIndex) => onSelectTarget({ rowIndex: index, columnIndex })}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
