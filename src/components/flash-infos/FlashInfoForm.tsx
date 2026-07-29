'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { FormSection } from '@/components/pages-modules/FormSection';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  DEFAULT_FLASH_INFO_FORM,
  type FlashInfo,
  type FlashInfoFormData,
  type FlashInfoStatus,
  type FlashInfoUrlTarget,
} from '@/types/flashInfos';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<FlashInfoStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

function buildInitialData(initialFlashInfo?: FlashInfo): FlashInfoFormData {
  if (initialFlashInfo) {
    return {
      ...DEFAULT_FLASH_INFO_FORM,
      name: initialFlashInfo.name,
      publicationDate: initialFlashInfo.publicationDate,
      status: initialFlashInfo.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_FLASH_INFO_FORM, name: copyName } : DEFAULT_FLASH_INFO_FORM;
}

interface FlashInfoFormProps {
  mode: 'create' | 'edit';
  initialFlashInfo?: FlashInfo;
}

export function FlashInfoForm({ mode, initialFlashInfo }: FlashInfoFormProps) {
  const router = useRouter();
  const [data, setData] = useState<FlashInfoFormData>(() => buildInitialData(initialFlashInfo));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { headerRef } = useStickyFormLayout();

  function handleChange(patch: Partial<FlashInfoFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function commit(status: FlashInfoStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publié.`);
    window.setTimeout(() => router.push('/dashboard/flash-infos'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouveau flash info' : data.name || 'Modifier le flash info';

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
            href="/dashboard/flash-infos"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux flash infos
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
              label="Nom de la brève"
              value={data.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              fullWidth
              required
              error={nameError}
            />
            <TextField label="Texte" value={data.text} onChange={(e) => handleChange({ text: e.target.value })} multiline minRows={3} fullWidth />
            <TextField
              label="Adresse URL"
              placeholder="https:// ou /page-du-site"
              value={data.url}
              onChange={(e) => handleChange({ url: e.target.value })}
              fullWidth
            />

            <FormControl>
              <FormLabel id="flash-info-url-target-label" sx={{ fontSize: 13 }}>
                Cible de l&apos;adresse URL
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="flash-info-url-target-label"
                value={data.urlTarget}
                onChange={(e) => handleChange({ urlTarget: e.target.value as FlashInfoUrlTarget })}
              >
                <FormControlLabel value="interne" control={<Radio />} label="Page interne" />
                <FormControlLabel value="nouvelle-page" control={<Radio />} label="Nouvelle page" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </FormSection>

        {nameError && (
          <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
            Le nom de la brève est obligatoire.
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
