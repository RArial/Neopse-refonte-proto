'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { FormElementCard } from '@/components/formulaires/builder/FormElementCard';
import type { FormElement, FormElementPatch } from '@/types/formulaires';

interface FormBuilderCanvasProps {
  elements: FormElement[];
  onChange: (elements: FormElement[]) => void;
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function FormBuilderCanvas({ elements, onChange }: FormBuilderCanvasProps) {
  function moveElement(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= elements.length) return;
    const next = [...elements];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  }

  function duplicateElement(index: number) {
    const copy = { ...elements[index], id: randomId('field') } as FormElement;
    const next = [...elements];
    next.splice(index + 1, 0, copy);
    onChange(next);
  }

  function deleteElement(index: number) {
    onChange(elements.filter((_, i) => i !== index));
  }

  function updateElement(index: number, patch: FormElementPatch) {
    onChange(elements.map((element, i) => (i === index ? ({ ...element, ...patch } as FormElement) : element)));
  }

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
        Construction du formulaire
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Composez le formulaire en ajoutant des éléments depuis le panneau « Éléments » à droite.
      </Typography>

      {elements.length === 0 ? (
        <Box sx={{ border: '1.5px dashed', borderColor: 'divider', borderRadius: 2, py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Ajoutez un premier élément depuis le panneau « Éléments » à droite.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {elements.map((element, index) => (
            <Stack key={element.id} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
              <Stack sx={{ pt: 1 }}>
                <Tooltip title="Monter">
                  <span>
                    <IconButton size="small" onClick={() => moveElement(index, 'up')} disabled={index === 0} aria-label="Monter cet élément">
                      <ArrowUpwardIcon fontSize="inherit" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Descendre">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => moveElement(index, 'down')}
                      disabled={index === elements.length - 1}
                      aria-label="Descendre cet élément"
                    >
                      <ArrowDownwardIcon fontSize="inherit" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <FormElementCard
                  element={element}
                  onChange={(patch) => updateElement(index, patch)}
                  onDuplicate={() => duplicateElement(index)}
                  onDelete={() => deleteElement(index)}
                />
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
