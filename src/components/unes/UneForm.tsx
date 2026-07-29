'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { FormSection } from '@/components/pages-modules/FormSection';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_UNE_FORM, UNE_LINK_TYPES, type Une, type UneFormData, type UneStatus } from '@/types/unes';

const STATUS_CHIP_META: Record<UneStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publiée', color: 'success' },
  archived: { label: 'Archivée', color: 'default' },
};

function buildInitialData(initialUne?: Une): UneFormData {
  if (initialUne) {
    return {
      ...DEFAULT_UNE_FORM,
      name: initialUne.name,
      destination: initialUne.destination,
      publicationDate: initialUne.publicationDate,
      status: initialUne.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_UNE_FORM, name: copyName } : DEFAULT_UNE_FORM;
}

interface UneFormProps {
  mode: 'create' | 'edit';
  initialUne?: Une;
}

export function UneForm({ mode, initialUne }: UneFormProps) {
  const router = useRouter();
  const [data, setData] = useState<UneFormData>(() => buildInitialData(initialUne));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { headerRef } = useStickyFormLayout();

  function handleChange(patch: Partial<UneFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function commit(status: UneStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publiée.`);
    window.setTimeout(() => router.push('/dashboard/unes'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouvelle une' : data.name || 'Modifier la une';

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
            href="/dashboard/unes"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux unes
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
            Publier la une
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <FormSection title="Informations générales concernant la une">
          <Stack spacing={2.5}>
            <TextField
              label="Nom de la Une"
              value={data.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              fullWidth
              required
              error={nameError}
            />
            <TextField label="Chapo" value={data.chapo} onChange={(e) => handleChange({ chapo: e.target.value })} multiline minRows={3} fullWidth />
          </Stack>
        </FormSection>

        {nameError && (
          <Alert severity="error" role="alert" sx={{ mt: -1 }}>
            Le nom de la une est obligatoire.
          </Alert>
        )}

        <FormSection title="Lien de la une">
          <Stack spacing={2.5}>
            <TextField
              select
              label="Type de lien"
              value={data.linkType}
              onChange={(e) => handleChange({ linkType: e.target.value })}
              fullWidth
              sx={{ maxWidth: 340 }}
            >
              <MenuItem value="">Aucune sélection</MenuItem>
              {UNE_LINK_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            {data.linkType && data.linkType !== 'Aucun lien' && (
              <TextField
                label="Page de destination"
                placeholder="https:// ou /page-du-site"
                value={data.destination}
                onChange={(e) => handleChange({ destination: e.target.value })}
                fullWidth
                helperText="Adresse externe ou page interne vers laquelle la une renvoie."
              />
            )}
          </Stack>
        </FormSection>

        <FormSection title="Vignette de la une">
          <VignetteUploader value={data.thumbnailUrl} onChange={(thumbnailUrl) => handleChange({ thumbnailUrl })} itemLabel="vignette" />
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
            <TextField
              label="Date de désactivation"
              type="date"
              value={data.deactivationDate}
              onChange={(event) => handleChange({ deactivationDate: event.target.value })}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </FormSection>
      </Stack>

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
