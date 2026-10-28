'use client';

import { useEffect, useId, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import { NewsRichTextEditor } from '@/components/actualites/builder/NewsRichTextEditor';
import { blockDndId } from '@/components/actualites/builder/dnd';
import { ImageField } from '@/components/media-library/field/ImageField';
import { ImageListField } from '@/components/media-library/field/ImageListField';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { Icons } from '@/components/ui/Icons';
import { NEWS_FORM_OPTIONS, NEWS_FORM_RECIPIENTS } from '@/lib/actualites/formMocks';
import { videoEmbedUrl } from '@/lib/actualites/video';
import {
  CONTENT_BLOCK_META,
  DEFAULT_DIAPORAMA_DISPLAY,
  DIAPORAMA_DISPLAY_OPTIONS,
  type ContentBlockData,
  type ContentBlockPatch,
  type DiaporamaDisplay,
  type ImagesBlockData,
} from '@/types/actualites';

const CONTENT_FOLDER = 'Actualités';

interface ContentBlockCardProps {
  block: ContentBlockData;
  onChange: (patch: ContentBlockPatch) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

/** Diaporama : plusieurs imports peuvent aboutir avant le rendu suivant, d'où la liste tenue à jour dans une ref. */
function DiaporamaImages({ imageUrls, onChange }: { imageUrls: string[]; onChange: (patch: ContentBlockPatch) => void }) {
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

function ImagesBody({ block, onChange }: { block: ImagesBlockData; onChange: (patch: ContentBlockPatch) => void }) {
  const sliderLabelId = useId();
  const url = block.imageUrls[0];
  const width = block.widthPercent ?? 100;

  return (
    <Stack spacing={2}>
      <ImageField
        config={{ context: 'Bloc Images', folder: CONTENT_FOLDER, altText: 'ask' }}
        value={url ? { url } : null}
        onChange={(next) => onChange({ imageUrls: next ? [next.url] : [] })}
      />
      {url && (
        <>
          <TextField size="small" label="Légende (optionnelle)" value={block.caption ?? ''} onChange={(event) => onChange({ caption: event.target.value })} fullWidth />
          <Box>
            <Typography id={sliderLabelId} variant="body2" sx={{ fontWeight: 600 }}>
              Dimensions
            </Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Slider
                value={width}
                min={10}
                max={100}
                step={5}
                onChange={(_, value) => onChange({ widthPercent: value as number })}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} %`}
                getAriaValueText={(value) => `${value} %`}
                slotProps={{ input: { 'aria-labelledby': sliderLabelId } }}
              />
              <Typography variant="body2" sx={{ minWidth: 48, textAlign: 'right' }}>
                {width} %
              </Typography>
            </Stack>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
            <TextField
              size="small"
              type="url"
              label="Lien au clic (optionnel)"
              placeholder="https://…"
              value={block.linkUrl ?? ''}
              onChange={(event) => onChange({ linkUrl: event.target.value })}
              sx={{ flex: 1 }}
            />
            <FormControlLabel
              control={<Checkbox checked={block.linkNewTab ?? false} onChange={(event) => onChange({ linkNewTab: event.target.checked })} />}
              label="Nouvel onglet"
              disabled={!block.linkUrl}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
}

function VideoBody({ url, onChange }: { url: string; onChange: (patch: ContentBlockPatch) => void }) {
  const embed = videoEmbedUrl(url);
  const invalid = url.trim() !== '' && !embed;

  return (
    <Stack spacing={1.5}>
      <Box sx={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 1.5, overflow: 'hidden', bgcolor: 'action.hover' }}>
        {embed ? (
          <Box
            component="iframe"
            src={embed}
            title="Aperçu de la vidéo"
            allow="encrypted-media; picture-in-picture; fullscreen"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <Stack spacing={1} sx={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            <PlayCircleOutlinedIcon fontSize="large" aria-hidden="true" />
            <Typography variant="body2">YouTube, Vimeo ou Dailymotion</Typography>
          </Stack>
        )}
      </Box>
      <TextField
        size="small"
        type="url"
        label="Adresse de la vidéo"
        placeholder="https://www.youtube.com/watch?v=…"
        value={url}
        onChange={(event) => onChange({ url: event.target.value })}
        fullWidth
        error={invalid}
        helperText={invalid ? 'Adresse non reconnue : collez un lien YouTube, Vimeo ou Dailymotion.' : undefined}
      />
    </Stack>
  );
}

function FormBody({ formId, recipients, onChange }: { formId: string; recipients: string[]; onChange: (patch: ContentBlockPatch) => void }) {
  const legendId = useId();
  return (
    <Stack spacing={2}>
      <TextField select size="small" label="Formulaire" value={formId} onChange={(event) => onChange({ formId: event.target.value })} fullWidth>
        <MenuItem value="">— Choisir un formulaire —</MenuItem>
        {NEWS_FORM_OPTIONS.map((form) => (
          <MenuItem key={form.id} value={form.id}>
            {form.label}
          </MenuItem>
        ))}
      </TextField>
      <Box component="fieldset" aria-labelledby={legendId} sx={{ border: 0, m: 0, p: 0 }}>
        <Typography id={legendId} variant="caption" sx={{ display: 'block', fontWeight: 700, letterSpacing: '.06em', color: 'text.secondary' }}>
          DESTINATAIRES
        </Typography>
        {NEWS_FORM_RECIPIENTS.map((recipient) => (
          <FormControlLabel
            key={recipient.email}
            sx={{ display: 'flex' }}
            control={
              <Checkbox
                checked={recipients.includes(recipient.email)}
                onChange={(event) =>
                  onChange({ recipients: event.target.checked ? [...recipients, recipient.email] : recipients.filter((email) => email !== recipient.email) })
                }
              />
            }
            label={`${recipient.name} (${recipient.email})`}
          />
        ))}
      </Box>
    </Stack>
  );
}

export function ContentBlockCard({ block, onChange, onDuplicate, onDelete }: ContentBlockCardProps) {
  const meta = CONTENT_BLOCK_META[block.kind];
  const IconEl = Icons[meta.icon];
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: blockDndId(block.id),
    data: { type: 'block', blockId: block.id, label: meta.label },
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        opacity: isDragging ? 0.4 : 1,
      }}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', px: 0.5, py: 0.25, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tooltip title="Déplacer">
          <IconButton
            ref={setActivatorNodeRef}
            size="small"
            aria-label={`Déplacer le contenu « ${meta.label} »`}
            sx={{ cursor: 'grab', touchAction: 'none' }}
            {...attributes}
            {...listeners}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <IconEl size={14} />
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', flex: 1, ml: 0.5 }}>
          {meta.label}
        </Typography>
        <Tooltip title="Dupliquer">
          <IconButton size="small" onClick={onDuplicate} aria-label={`Dupliquer le contenu « ${meta.label} »`}>
            <ContentCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Retirer">
          <IconButton size="small" onClick={onDelete} aria-label={`Retirer le contenu « ${meta.label} »`}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box sx={{ p: 2 }}>
        {block.kind === 'text' && (
          <Stack spacing={1}>
            <TextField
              value={block.heading}
              onChange={(event) => onChange({ heading: event.target.value })}
              placeholder="Titre (optionnel)"
              fullWidth
              variant="standard"
              slotProps={{
                input: { disableUnderline: true, sx: { fontWeight: 700, fontSize: 18 } },
                htmlInput: { 'aria-label': 'Titre du bloc de texte (optionnel)' },
              }}
            />
            <NewsRichTextEditor value={block.body} onChange={(body) => onChange({ body })} ariaLabel="Texte du bloc" placeholder="Rédigez votre texte…" />
          </Stack>
        )}

        {block.kind === 'images' && <ImagesBody block={block} onChange={onChange} />}

        {block.kind === 'diaporama' && (
          <Stack spacing={2}>
            <TextField
              select
              size="small"
              label="Type de Diaporama"
              value={block.display ?? DEFAULT_DIAPORAMA_DISPLAY}
              onChange={(event) => onChange({ display: event.target.value as DiaporamaDisplay })}
              fullWidth
            >
              {DIAPORAMA_DISPLAY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <DiaporamaImages imageUrls={block.imageUrls} onChange={onChange} />
          </Stack>
        )}

        {block.kind === 'attachments' && (
          <Stack spacing={1.5}>
            <TextField
              value={block.title ?? 'Liste de pièces jointes'}
              onChange={(event) => onChange({ title: event.target.value })}
              fullWidth
              variant="standard"
              slotProps={{
                input: { disableUnderline: true, sx: { fontWeight: 700, fontSize: 16 } },
                htmlInput: { 'aria-label': 'Titre de la liste de pièces jointes' },
              }}
            />
            <AttachmentsField attachments={block.attachments} onChange={(attachments) => onChange({ attachments })} addLabel="Ajouter des documents" />
          </Stack>
        )}

        {block.kind === 'video' && <VideoBody url={block.url} onChange={onChange} />}

        {block.kind === 'html' && (
          <TextField
            value={block.code}
            onChange={(event) => onChange({ code: event.target.value })}
            placeholder="<div>Votre code HTML…</div>"
            fullWidth
            multiline
            minRows={4}
            slotProps={{ htmlInput: { 'aria-label': 'Code HTML5', spellCheck: false } }}
            sx={{ '& .MuiInputBase-input': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13 } }}
          />
        )}

        {block.kind === 'form' && <FormBody formId={block.formId} recipients={block.recipients ?? []} onChange={onChange} />}
      </Box>
    </Box>
  );
}
