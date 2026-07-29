'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { FormInfoPanel } from '@/components/formulaires/FormInfoPanel';
import { FormBuilderCanvas } from '@/components/formulaires/builder/FormBuilderCanvas';
import { FormElementPalette } from '@/components/formulaires/builder/FormElementPalette';
import { createFormElement, DEFAULT_FORM_BUILDER_DATA, type FormBuilderData, type FormElementKind } from '@/types/formulaires';
import type { ManagedFile } from '@/types/gestionnaire';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<FormBuilderData['status'], { label: string; color: 'success' | 'warning' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
};

function buildInitialData(initialFile?: ManagedFile): FormBuilderData {
  if (initialFile) return { ...DEFAULT_FORM_BUILDER_DATA, name: initialFile.name, status: 'published' };
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_FORM_BUILDER_DATA, name: copyName } : DEFAULT_FORM_BUILDER_DATA;
}

interface FormBuilderProps {
  mode: 'create' | 'edit';
  initialFile?: ManagedFile;
}

export function FormBuilder({ mode, initialFile }: FormBuilderProps) {
  const router = useRouter();
  const [data, setData] = useState<FormBuilderData>(() => buildInitialData(initialFile));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);

  function handleChange(patch: Partial<FormBuilderData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleAddElement(kind: FormElementKind) {
    setData((prev) => ({ ...prev, elements: [...prev.elements, createFormElement(kind)] }));
  }

  function commit() {
    if (!data.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status: 'published' }));
    setSuccessMessage(mode === 'edit' ? `« ${data.name} » a été mis à jour.` : `« ${data.name} » a été publié.`);
    window.setTimeout(() => router.push('/dashboard/gestionnaire'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'edit' ? data.name || 'Modifier le formulaire' : 'Nouveau formulaire';

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1600, width: '100%', mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.default',
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          mb: 3,
          pt: { xs: 2, md: 2.5 },
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Button
            component={Link}
            href="/dashboard/gestionnaire"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 1, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour au stockage
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
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            onClick={() => setSuccessMessage('Aperçu du formulaire — bientôt disponible.')}
          >
            Aperçu
          </Button>
          <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={commit}>
            {mode === 'edit' ? 'Enregistrer les modifications' : 'Publier le formulaire'}
          </Button>
        </Stack>
      </Stack>

      {nameError && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          Le nom du formulaire est obligatoire.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr) 280px' }, gap: 3, alignItems: 'start' }}>
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 2, position: 'sticky', top: 16 }}>
          {panelOpen ? (
            <>
              <Button
                size="small"
                color="inherit"
                startIcon={<ChevronLeftIcon fontSize="small" />}
                onClick={() => setPanelOpen(false)}
                sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
              >
                Replier
              </Button>
              <FormInfoPanel data={data} onChange={handleChange} nameError={nameError} />
            </>
          ) : (
            <Button
              size="small"
              color="inherit"
              startIcon={<ChevronRightIcon fontSize="small" />}
              onClick={() => setPanelOpen(true)}
              sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
            >
              Déplier
            </Button>
          )}
        </Box>

        <FormBuilderCanvas elements={data.elements} onChange={(elements) => handleChange({ elements })} />

        <FormElementPalette onAddElement={handleAddElement} />
      </Box>

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
