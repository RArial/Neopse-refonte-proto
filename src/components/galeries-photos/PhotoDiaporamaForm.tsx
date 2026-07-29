'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { DiaporamaField } from '@/components/pages-modules/DiaporamaField';
import { FormSection } from '@/components/pages-modules/FormSection';
import { RichTextField } from '@/components/ui/RichTextField';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  DEFAULT_PHOTO_DIAPORAMA_FORM,
  type PhotoDiaporama,
  type PhotoDiaporamaFormData,
  type PhotoDiaporamaStatus,
} from '@/types/galeriesPhotos';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<PhotoDiaporamaStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

function buildInitialData(initialDiaporama?: PhotoDiaporama): PhotoDiaporamaFormData {
  if (initialDiaporama) {
    return {
      ...DEFAULT_PHOTO_DIAPORAMA_FORM,
      name: initialDiaporama.name,
      publicationDate: initialDiaporama.publicationDate,
      status: initialDiaporama.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_PHOTO_DIAPORAMA_FORM, name: copyName } : DEFAULT_PHOTO_DIAPORAMA_FORM;
}

interface PhotoDiaporamaFormProps {
  mode: 'create' | 'edit';
  initialDiaporama?: PhotoDiaporama;
}

export function PhotoDiaporamaForm({ mode, initialDiaporama }: PhotoDiaporamaFormProps) {
  const router = useRouter();
  const [data, setData] = useState<PhotoDiaporamaFormData>(() => buildInitialData(initialDiaporama));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { headerRef } = useStickyFormLayout();

  function handleChange(patch: Partial<PhotoDiaporamaFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function commit(status: PhotoDiaporamaStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publié.`);
    window.setTimeout(() => router.push('/dashboard/galeries-photos'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Créer un diaporama' : data.name || 'Modifier le diaporama';

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
            href="/dashboard/galeries-photos"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux galeries de photos
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
        <FormSection title="Informations générales">
          <Stack spacing={2.5}>
            <TextField
              label="Nom du diaporama"
              value={data.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              fullWidth
              required
              error={nameError}
            />
            <RichTextField
              label="Description"
              value={data.description}
              onChange={(description) => handleChange({ description })}
              placeholder="Décrivez ce diaporama…"
            />
          </Stack>
        </FormSection>

        {nameError && (
          <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
            Le nom du diaporama est obligatoire.
          </MuiAlert>
        )}

        <FormSection title="Photos du diaporama">
          <DiaporamaField
            diaporamaType={data.diaporamaType}
            images={data.images}
            onChangeType={(diaporamaType) => handleChange({ diaporamaType })}
            onChangeImages={(images) => handleChange({ images })}
            onNotify={setSnackbarMessage}
          />
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

      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert severity="info" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
