'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { FormSection } from '@/components/pages-modules/FormSection';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  DEFAULT_VIDEO_FORM,
  VIDEO_LINK_TYPE_LABELS,
  type Video,
  type VideoFormData,
  type VideoLinkType,
  type VideoStatus,
} from '@/types/videos';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<VideoStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

const LINK_TYPES: VideoLinkType[] = ['youtube', 'dailymotion', 'vimeo', 'autre-html'];

function buildInitialData(initialVideo?: Video): VideoFormData {
  if (initialVideo) {
    return {
      ...DEFAULT_VIDEO_FORM,
      name: initialVideo.name,
      publicationDate: initialVideo.publicationDate,
      status: initialVideo.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_VIDEO_FORM, name: copyName } : DEFAULT_VIDEO_FORM;
}

interface VideoFormProps {
  mode: 'create' | 'edit';
  initialVideo?: Video;
}

export function VideoForm({ mode, initialVideo }: VideoFormProps) {
  const router = useRouter();
  const [data, setData] = useState<VideoFormData>(() => buildInitialData(initialVideo));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { headerRef } = useStickyFormLayout();

  function handleChange(patch: Partial<VideoFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function commit(status: VideoStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publiée.`);
    window.setTimeout(() => router.push('/dashboard/galerie-videos'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouvelle vidéo' : data.name || 'Modifier la vidéo';
  const isHtmlSource = data.linkType === 'autre-html';

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}>
      <Stack
        ref={headerRef}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.default',
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          mb: 2,
          pt: 1,
          pb: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Button
            component={Link}
            href="/dashboard/galerie-videos"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour à la galerie de vidéos
          </Button>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              {pageTitle}
            </Typography>
            {(mode === 'edit' || isDuplicate) && (
              <Chip size="small" label={statusChip.label.toUpperCase()} color={statusChip.color} variant="outlined" sx={{ fontWeight: 700 }} />
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <Button variant="outlined" color="inherit" startIcon={<SaveOutlinedIcon fontSize="small" />} onClick={() => commit('draft')}>
            Enregistrer le brouillon
          </Button>
          <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={() => commit('published')}>
            Publier
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <FormSection title="Informations générales concernant la vidéo">
          <Stack spacing={2.5}>
            <TextField
              label="Nom de la vidéo"
              value={data.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              fullWidth
              required
              error={nameError}
            />

            <TextField
              select
              label="Type de lien"
              value={data.linkType}
              onChange={(e) => handleChange({ linkType: e.target.value as VideoLinkType })}
              fullWidth
              sx={{ maxWidth: 340 }}
            >
              {LINK_TYPES.map((linkType) => (
                <MenuItem key={linkType} value={linkType}>
                  {VIDEO_LINK_TYPE_LABELS[linkType]}
                </MenuItem>
              ))}
            </TextField>

            {isHtmlSource ? (
              <TextField
                label="Code HTML"
                placeholder="<iframe …></iframe>"
                value={data.htmlCode}
                onChange={(e) => handleChange({ htmlCode: e.target.value })}
                multiline
                minRows={4}
                fullWidth
                sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 13 } }}
              />
            ) : (
              <TextField
                label="URL de la vidéo"
                placeholder="https://www.youtube.com/watch?v=…"
                value={data.videoUrl}
                onChange={(e) => handleChange({ videoUrl: e.target.value })}
                fullWidth
              />
            )}

            <RichTextField
              label="Description"
              value={data.description}
              onChange={(description) => handleChange({ description })}
              placeholder="Décrivez cette vidéo…"
            />
          </Stack>
        </FormSection>

        {nameError && (
          <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
            Le nom de la vidéo est obligatoire.
          </MuiAlert>
        )}

        <FormSection title="Vignette de la vidéo">
          <VignetteUploader folder="Galerie de vidéos" value={data.thumbnailUrl} onChange={(thumbnailUrl) => handleChange({ thumbnailUrl })} itemLabel="vignette" />
        </FormSection>

        <FormSection title="Affichage">
          <Stack spacing={2.5}>
            <TextField
              label="Date de publication"
              type="date"
              value={data.publicationDate}
              onChange={(event) => handleChange({ publicationDate: event.target.value })}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Affichage en une</Typography>
              <Switch
                checked={data.featuredHome}
                onChange={(event) => handleChange({ featuredHome: event.target.checked })}
                slotProps={{ input: { 'aria-label': 'Affichage en une' } }}
              />
            </Stack>
          </Stack>
        </FormSection>
      </Stack>

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
