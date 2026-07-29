'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Icons } from '@/components/ui/Icons';
import {
  CONTENT_BLOCK_DRAG_MIME,
  CONTENT_BLOCK_KINDS,
  CONTENT_BLOCK_META,
  LAYOUT_OPTIONS,
  type ContentBlockKind,
  type ContentTemplate,
  type LayoutKey,
} from '@/types/actualites';

type PaletteTab = 'blocs' | 'informations' | 'templates';

interface BlockPaletteProps {
  onAddRow: (layout: LayoutKey) => void;
  onInsertBlock: (kind: ContentBlockKind) => void;
  templates: ContentTemplate[];
  onSaveTemplate: (name: string) => void;
  onApplyTemplate: (templateId: string) => void;
  /** Décalage sticky (`top`) en px, sous l'en-tête sticky de la page — voir `useStickyFormLayout`.
   * Le panneau calcule sa propre hauteur maximale à partir de cette valeur. */
  stickyTop?: number;
}

function LayoutIcon({ widths }: { widths: number[] }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.375, width: 28, height: 18, flexShrink: 0 }} aria-hidden="true">
      {widths.map((width, index) => (
        <Box key={index} sx={{ flex: width, bgcolor: 'primary.main', borderRadius: 0.5 }} />
      ))}
    </Box>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: 'text.secondary' }}>
      {children}
    </Typography>
  );
}

export function BlockPalette({ onAddRow, onInsertBlock, templates, onSaveTemplate, onApplyTemplate, stickyTop = 16 }: BlockPaletteProps) {
  const [tab, setTab] = useState<PaletteTab>('blocs');
  const [templateName, setTemplateName] = useState('');

  function handleSaveTemplate() {
    const trimmed = templateName.trim();
    if (!trimmed) return;
    onSaveTemplate(trimmed);
    setTemplateName('');
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'sticky',
        top: stickyTop,
        maxHeight: `calc(100vh - ${stickyTop + 16}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, value: PaletteTab) => setTab(value)}
        variant="fullWidth"
        aria-label="Palette de contenu"
        sx={{ minHeight: 44, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}
      >
        <Tab value="blocs" label="Blocs" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700, fontSize: 13 }} />
        <Tab value="informations" label="Informations" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700, fontSize: 13 }} />
        <Tab value="templates" label="Templates" sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700, fontSize: 13 }} />
      </Tabs>

      <Box sx={{ p: 2, overflowY: 'auto', minHeight: 0 }}>
        {tab === 'blocs' && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Cliquez pour ajouter un bloc de structure à la fin du contenu.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {LAYOUT_OPTIONS.map((option) => (
                <ButtonBase
                  key={option.key}
                  onClick={() => onAddRow(option.key)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1.25,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    justifyContent: 'flex-start',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                  }}
                >
                  <LayoutIcon widths={option.widths} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {option.label}
                  </Typography>
                </ButtonBase>
              ))}
            </Box>
          </>
        )}

        {tab === 'informations' && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Cliquez pour insérer dans la colonne sélectionnée, ou glissez-déposez directement sur une colonne.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {CONTENT_BLOCK_KINDS.map((kind) => {
                const meta = CONTENT_BLOCK_META[kind];
                const IconEl = Icons[meta.icon];
                return (
                  <ButtonBase
                    key={kind}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData(CONTENT_BLOCK_DRAG_MIME, kind);
                      event.dataTransfer.effectAllowed = 'copy';
                    }}
                    onClick={() => onInsertBlock(kind)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1,
                      py: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.5,
                      textAlign: 'center',
                      cursor: 'grab',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  >
                    <IconEl size={20} />
                    <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                      {meta.label}
                    </Typography>
                  </ButtonBase>
                );
              })}
            </Box>
          </>
        )}

        {tab === 'templates' && (
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <SectionLabel>Enregistrer la mise en page</SectionLabel>
              <TextField
                value={templateName}
                onChange={(event) => setTemplateName(event.target.value)}
                placeholder="Nom du template"
                size="small"
                fullWidth
                slotProps={{ htmlInput: { 'aria-label': 'Nom du template' } }}
              />
              <Button
                variant="contained"
                color="inherit"
                startIcon={<SaveOutlinedIcon fontSize="small" />}
                onClick={handleSaveTemplate}
                disabled={templateName.trim().length === 0}
                sx={{ bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'text.primary' } }}
              >
                Enregistrer comme template
              </Button>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <SectionLabel>Templates Neopse</SectionLabel>
              <Stack spacing={0.5}>
                {templates.map((template) => (
                  <ButtonBase
                    key={template.id}
                    onClick={() => onApplyTemplate(template.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      px: 1.25,
                      py: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.5,
                      justifyContent: 'flex-start',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  >
                    <Icons.Layers size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {template.label}
                    </Typography>
                  </ButtonBase>
                ))}
              </Stack>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
