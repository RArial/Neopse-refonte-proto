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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { FormSection } from '@/components/pages-modules/FormSection';
import { RichTextField } from '@/components/ui/RichTextField';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { ALERT_LINK_TYPES, DEFAULT_ALERT_FORM, type Alert, type AlertFormData, type AlertStatus } from '@/types/alertes';

const STATUS_CHIP_META: Record<AlertStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publiée', color: 'success' },
  archived: { label: 'Archivée', color: 'default' },
};

function buildInitialData(initialAlert?: Alert): AlertFormData {
  if (initialAlert) {
    return { ...DEFAULT_ALERT_FORM, name: initialAlert.name, publicationDate: initialAlert.publicationDate, status: initialAlert.status };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_ALERT_FORM, name: copyName } : DEFAULT_ALERT_FORM;
}

interface AlertFormProps {
  mode: 'create' | 'edit';
  initialAlert?: Alert;
}

export function AlertForm({ mode, initialAlert }: AlertFormProps) {
  const router = useRouter();
  const [data, setData] = useState<AlertFormData>(() => buildInitialData(initialAlert));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { headerRef } = useStickyFormLayout();

  function handleChange(patch: Partial<AlertFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function commit(status: AlertStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publiée.`);
    window.setTimeout(() => router.push('/dashboard/alertes'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouvelle alerte' : data.name || "Modifier l'alerte";

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
            href="/dashboard/alertes"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux alertes
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
            Publier l&apos;alerte
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <FormSection title="Informations générales concernant l'alerte">
          <Stack spacing={2.5}>
            <TextField
              label="Nom de l'alerte"
              value={data.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              fullWidth
              required
              error={nameError}
            />
            <RichTextField
              label="Texte"
              value={data.text}
              onChange={(text) => handleChange({ text })}
              placeholder="Rédigez le message de l'alerte…"
            />
            <TextField
              select
              label="Type de lien"
              value={data.linkType}
              onChange={(e) => handleChange({ linkType: e.target.value })}
              fullWidth
              sx={{ maxWidth: 340 }}
            >
              <MenuItem value="">Aucune sélection</MenuItem>
              {ALERT_LINK_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </FormSection>

        {nameError && (
          <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
            Le nom de l&apos;alerte est obligatoire.
          </MuiAlert>
        )}

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
        <MuiAlert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
