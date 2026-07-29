'use client';

import { useRef } from 'react';
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
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { Icons } from '@/components/ui/Icons';
import { MANAGER_SECTIONS } from '@/types/gestionnaire';
import { CONTENT_BLOCK_META, type ContentBlockData, type ContentBlockPatch } from '@/types/actualites';

const SITE_FORMS = MANAGER_SECTIONS.find((section) => section.id === 'formulaires')?.files.filter((file) => file.kind === 'form') ?? [];

interface ContentBlockCardProps {
  block: ContentBlockData;
  onChange: (patch: ContentBlockPatch) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function MultiImageUploadBody({ imageUrls, onChange }: { imageUrls: string[]; onChange: (patch: ContentBlockPatch) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    const urls = files.filter((file) => file.type.startsWith('image/') && file.size <= MAX_IMAGE_SIZE_BYTES).map((file) => URL.createObjectURL(file));
    if (urls.length > 0) onChange({ imageUrls: [...imageUrls, ...urls] });
  }

  return (
    <Box>
      <Box
        component="button"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          width: '100%',
          minHeight: 140,
          border: '1.5px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: 'action.hover',
          color: 'text.secondary',
          cursor: 'pointer',
          fontFamily: 'inherit',
          p: 0,
          '&:hover': { borderColor: 'primary.main' },
        }}
        aria-label="Glissez une image ou cliquez pour parcourir"
      >
        <Icons.Image size={24} />
        <Typography variant="body2">Glissez une image ou cliquez pour parcourir</Typography>
      </Box>
      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} aria-hidden="true" tabIndex={-1} />
      {imageUrls.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
          {imageUrls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
          ))}
        </Stack>
      )}
    </Box>
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

        {(block.kind === 'images' || block.kind === 'diaporama') && (
          <MultiImageUploadBody imageUrls={block.imageUrls} onChange={onChange} />
        )}

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
            {SITE_FORMS.map((form) => (
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
