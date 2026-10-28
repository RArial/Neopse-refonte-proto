'use client';

import type { ReactNode, Ref } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { paletteBlockDndId, paletteLayoutDndId, type DndData } from '@/components/actualites/builder/dnd';
import { LayoutIcon } from '@/components/actualites/builder/LayoutIcon';
import { Icons } from '@/components/ui/Icons';
import { CONTENT_BLOCK_KINDS, CONTENT_BLOCK_META, LAYOUT_OPTIONS, type ContentBlockKind, type ContentTemplate, type LayoutKey } from '@/types/actualites';

export type PaletteTab = 'blocs' | 'informations' | 'templates';

interface BlockPaletteProps {
  tab: PaletteTab;
  onTabChange: (tab: PaletteTab) => void;
  onAddRow: (layout: LayoutKey) => void;
  onInsertBlock: (kind: ContentBlockKind) => void;
  neopseTemplates: ContentTemplate[];
  userTemplates: ContentTemplate[];
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  onSaveTemplate: () => void;
  onDeleteUserTemplate: (template: ContentTemplate) => void;
  onApplyTemplate: (template: ContentTemplate) => void;
  templateNameRef: Ref<HTMLInputElement>;
}

function PaletteDraggable({ id, data, onClick, children, sx }: { id: string; data: DndData; onClick: () => void; children: ReactNode; sx: object }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data });
  return (
    <ButtonBase ref={setNodeRef} onClick={onClick} {...attributes} {...listeners} sx={{ ...sx, opacity: isDragging ? 0.5 : 1, touchAction: 'none' }}>
      {children}
    </ButtonBase>
  );
}

const itemSx = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1.5,
  bgcolor: 'background.paper',
  cursor: 'grab',
  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
  '&.Mui-focusVisible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography variant="caption" component="h3" sx={{ fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'text.secondary' }}>
      {children}
    </Typography>
  );
}

function TemplateButton({ template, onApply }: { template: ContentTemplate; onApply: () => void }) {
  return (
    <ButtonBase onClick={onApply} sx={{ ...itemSx, cursor: 'pointer', flex: 1, justifyContent: 'flex-start', gap: 1.25, px: 1.25, py: 1, textAlign: 'left' }}>
      <Icons.Layers size={16} />
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {template.label}
      </Typography>
    </ButtonBase>
  );
}

export function BlockPalette({
  tab,
  onTabChange,
  onAddRow,
  onInsertBlock,
  neopseTemplates,
  userTemplates,
  templateName,
  onTemplateNameChange,
  onSaveTemplate,
  onDeleteUserTemplate,
  onApplyTemplate,
  templateNameRef,
}: BlockPaletteProps) {
  return (
    <Box component="aside" aria-label="Palette de contenu" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Tabs
        value={tab}
        onChange={(_, value: PaletteTab) => onTabChange(value)}
        variant="fullWidth"
        aria-label="Palette de contenu"
        sx={{ minHeight: 44, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}
      >
        <Tab value="blocs" label="Blocs" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700, fontSize: 13, minWidth: 0 }} />
        <Tab value="informations" label="Informations" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700, fontSize: 13, minWidth: 0 }} />
        <Tab value="templates" label="Templates" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700, fontSize: 13, minWidth: 0 }} />
      </Tabs>

      <Box sx={{ p: 2, overflowY: 'auto', minHeight: 0 }}>
        {tab === 'blocs' && (
          <Stack spacing={1.5}>
            <Alert severity="info" icon={false} variant="outlined" sx={{ py: 0 }}>
              Cliquez pour ajouter à la fin, ou glissez-déposez directement à l&apos;endroit voulu dans le contenu.
            </Alert>
            {LAYOUT_OPTIONS.map((option) => (
              <PaletteDraggable
                key={option.key}
                id={paletteLayoutDndId(option.key)}
                data={{ type: 'palette-layout', layout: option.key, label: option.label }}
                onClick={() => onAddRow(option.key)}
                sx={{ ...itemSx, justifyContent: 'flex-start', gap: 1.5, px: 1.5, py: 1.25 }}
              >
                <LayoutIcon widths={option.widths} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {option.label}
                </Typography>
              </PaletteDraggable>
            ))}
          </Stack>
        )}

        {tab === 'informations' && (
          <Stack spacing={1.5}>
            <Alert severity="info" icon={false} variant="outlined" sx={{ py: 0 }}>
              Cliquez pour insérer dans la colonne sélectionnée, ou glissez-déposez directement sur une colonne.
            </Alert>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {CONTENT_BLOCK_KINDS.map((kind) => {
                const meta = CONTENT_BLOCK_META[kind];
                const IconEl = Icons[meta.icon];
                return (
                  <PaletteDraggable
                    key={kind}
                    id={paletteBlockDndId(kind)}
                    data={{ type: 'palette-block', kind, label: meta.label }}
                    onClick={() => onInsertBlock(kind)}
                    sx={{ ...itemSx, flexDirection: 'column', gap: 0.75, px: 1, py: 1.5, textAlign: 'center' }}
                  >
                    <IconEl size={20} />
                    <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                      {meta.label}
                    </Typography>
                  </PaletteDraggable>
                );
              })}
            </Box>
          </Stack>
        )}

        {tab === 'templates' && (
          <Stack spacing={2.5}>
            <Stack component="section" spacing={1}>
              <SectionLabel>Enregistrer la mise en page</SectionLabel>
              <TextField
                value={templateName}
                onChange={(event) => onTemplateNameChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && templateName.trim()) onSaveTemplate();
                }}
                label="Nom du template"
                size="small"
                fullWidth
                inputRef={templateNameRef}
              />
              <Button variant="contained" size="small" startIcon={<SaveOutlinedIcon fontSize="small" />} onClick={onSaveTemplate} disabled={templateName.trim().length === 0}>
                Enregistrer comme template
              </Button>
            </Stack>

            <Divider />

            <Stack component="section" spacing={1}>
              <SectionLabel>Mes templates</SectionLabel>
              {userTemplates.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucun template enregistré pour l&apos;instant.
                </Typography>
              ) : (
                userTemplates.map((template) => (
                  <Stack key={template.id} direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <TemplateButton template={template} onApply={() => onApplyTemplate(template)} />
                    <Tooltip title="Supprimer le template">
                      <IconButton onClick={() => onDeleteUserTemplate(template)} aria-label={`Supprimer le template « ${template.label} »`} sx={{ '&:hover': { color: 'error.main' } }}>
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))
              )}
            </Stack>

            <Divider />

            <Stack component="section" spacing={1}>
              <SectionLabel>Templates Neopse</SectionLabel>
              {neopseTemplates.map((template) => (
                <Stack key={template.id} direction="row">
                  <TemplateButton template={template} onApply={() => onApplyTemplate(template)} />
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
