'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ImageField } from '@/components/media-library/field/ImageField';
import { ImageListField } from '@/components/media-library/field/ImageListField';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { Icons } from '@/components/ui/Icons';
import { FORMS } from '@/types/formulaires';
import { CONTENT_BLOCK_META, type ContentBlockData, type ContentBlockPatch } from '@/types/editos';

interface ContentBlockCardProps {
  block: ContentBlockData;
  onChange: (patch: ContentBlockPatch) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const CONTENT_FOLDER = 'Éditos';

/** Diaporama du contenu : plusieurs imports peuvent aboutir avant le rendu suivant, d'où la liste tenue à jour dans une ref. */
function DiaporamaBlockBody({ imageUrls, onChange }: { imageUrls: string[]; onChange: (patch: ContentBlockPatch) => void }) {
  const latestUrls = useRef(imageUrls);
  useEffect(() => {
    latestUrls.current = imageUrls;
  });

  return (
    <ImageListField
      config={{ context: 'Diaporama images', folder: CONTENT_FOLDER, altText: 'ask' }}
      urls={imageUrls}
      onChange={(update) => {
        latestUrls.current = update(latestUrls.current);
        onChange({ imageUrls: latestUrls.current });
      }}
    />
  );
}

export function ContentBlockCard({ block, onChange, onDuplicate, onDelete }: ContentBlockCardProps) {
  const meta = CONTENT_BLOCK_META[block.kind];
  const IconEl = Icons[meta.icon];

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', px: 1.5, py: 1, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <DragIndicatorIcon fontSize="small" sx={{ color: 'text.disabled' }} aria-hidden="true" />
        <IconEl size={14} />
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', flex: 1 }}>
          {meta.label}
        </Typography>
        <Tooltip title="Dupliquer le bloc">
          <IconButton size="small" onClick={onDuplicate} aria-label="Dupliquer le bloc">
            <ContentCopyOutlinedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer le bloc">
          <IconButton size="small" onClick={onDelete} aria-label="Supprimer le bloc">
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box sx={{ p: 2 }}>
        {block.kind === 'text' && (
          <Stack spacing={1.5}>
            <TextField
              value={block.heading}
              onChange={(event) => onChange({ heading: event.target.value })}
              placeholder="Titre du bloc"
              fullWidth
              variant="standard"
              slotProps={{ input: { disableUnderline: true, sx: { fontWeight: 700, fontSize: 17 } } }}
            />
            <TextField
              value={block.body}
              onChange={(event) => onChange({ body: event.target.value })}
              placeholder="Rédigez votre texte…"
              fullWidth
              multiline
              minRows={4}
            />
          </Stack>
        )}

        {/* Bloc « Images » : une image, avec son texte alternatif ; plusieurs images passent par « Diaporama images ». */}
        {block.kind === 'images' && (
          <ImageField
            config={{ context: 'Bloc Images', folder: CONTENT_FOLDER, altText: 'ask' }}
            value={block.imageUrls[0] ? { url: block.imageUrls[0] } : null}
            onChange={(next) => onChange({ imageUrls: next ? [next.url] : [] })}
          />
        )}

        {block.kind === 'diaporama' && <DiaporamaBlockBody imageUrls={block.imageUrls} onChange={onChange} />}

        {block.kind === 'attachments' && (
          <AttachmentsField attachments={block.attachments} onChange={(attachments) => onChange({ attachments })} />
        )}

        {block.kind === 'video' && (
          <TextField
            value={block.url}
            onChange={(event) => onChange({ url: event.target.value })}
            placeholder="Collez l'URL de la vidéo (YouTube, Vimeo…)"
            fullWidth
          />
        )}

        {block.kind === 'html' && (
          <TextField
            value={block.code}
            onChange={(event) => onChange({ code: event.target.value })}
            placeholder="<div>Votre code HTML…</div>"
            fullWidth
            multiline
            minRows={4}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 13 } }}
          />
        )}

        {block.kind === 'form' && (
          <TextField select value={block.formId} onChange={(event) => onChange({ formId: event.target.value })} fullWidth label="Formulaire">
            <MenuItem value="">Aucune sélection</MenuItem>
            {FORMS.map((form) => (
              <MenuItem key={form.id} value={form.id}>
                {form.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>
    </Box>
  );
}
