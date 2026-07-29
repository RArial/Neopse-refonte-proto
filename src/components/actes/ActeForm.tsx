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
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { CategoriesDialog } from '@/components/pages-modules/CategoriesDialog';
import { FormSection } from '@/components/pages-modules/FormSection';
import { RichTextField } from '@/components/ui/RichTextField';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  ACTE_CATEGORIES_SEED,
  DEFAULT_ACTE_FORM,
  type Acte,
  type ActeCategory,
  type ActeFormData,
  type ActeStatus,
} from '@/types/actes';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<ActeStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

function buildInitialData(initialActe?: Acte): ActeFormData {
  if (initialActe) {
    return {
      ...DEFAULT_ACTE_FORM,
      name: initialActe.name,
      categoryId: initialActe.categoryId,
      publicationDate: initialActe.publicationDate,
      status: initialActe.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_ACTE_FORM, name: copyName } : DEFAULT_ACTE_FORM;
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface ActeFormProps {
  mode: 'create' | 'edit';
  initialActe?: Acte;
}

export function ActeForm({ mode, initialActe }: ActeFormProps) {
  const router = useRouter();
  const [data, setData] = useState<ActeFormData>(() => buildInitialData(initialActe));
  const [categories, setCategories] = useState<ActeCategory[]>(ACTE_CATEGORIES_SEED);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { headerRef } = useStickyFormLayout();

  function handleChange(patch: Partial<ActeFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function addCategory(): string {
    const id = randomId('cat');
    setCategories((prev) => [...prev, { id, name: '' }]);
    return id;
  }

  function renameCategory(id: string, name: string) {
    setCategories((prev) => prev.map((category) => (category.id === id ? { ...category, name } : category)));
  }

  function deleteCategory(id: string) {
    setCategories((prev) => prev.filter((category) => category.id !== id));
    if (data.categoryId === id) handleChange({ categoryId: '' });
  }

  function commit(status: ActeStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publié.`);
    window.setTimeout(() => router.push('/dashboard/publication-des-actes'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouveau compte rendu' : data.name || 'Modifier le compte rendu';

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
            href="/dashboard/publication-des-actes"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour à la publication des actes
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
              label="Nom du compte rendu"
              value={data.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              fullWidth
              required
              error={nameError}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
              <TextField select label="Catégorie" value={data.categoryId} onChange={(e) => handleChange({ categoryId: e.target.value })} fullWidth>
                <MenuItem value="">Aucune sélection</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name || 'Catégorie sans nom'}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                startIcon={<SettingsOutlinedIcon fontSize="small" />}
                onClick={() => setCategoriesDialogOpen(true)}
                sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                Gérer les catégories
              </Button>
            </Stack>

            <TextField label="Chapo" value={data.chapo} onChange={(e) => handleChange({ chapo: e.target.value })} multiline minRows={2} fullWidth />

            <RichTextField
              label="Description"
              value={data.description}
              onChange={(description) => handleChange({ description })}
              placeholder="Détaillez le contenu de ce compte rendu…"
            />
          </Stack>
        </FormSection>

        {nameError && (
          <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
            Le nom du compte rendu est obligatoire.
          </MuiAlert>
        )}

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', pt: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
          >
            Informations complémentaires
          </Typography>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        </Stack>

        <FormSection title="Pièces jointes" collapsible>
          <AttachmentsField attachments={data.attachments} onChange={(attachments) => handleChange({ attachments })} />
        </FormSection>

        <FormSection title="Code HTML" collapsible>
          <TextField
            label="Code HTML"
            placeholder="<div>Votre code HTML…</div>"
            value={data.htmlCode}
            onChange={(e) => handleChange({ htmlCode: e.target.value })}
            multiline
            minRows={4}
            fullWidth
            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: 13 } }}
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
            <TextField
              label="Date de fin d'affichage"
              type="date"
              value={data.endDisplayDate}
              onChange={(event) => handleChange({ endDisplayDate: event.target.value })}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </FormSection>
      </Stack>

      <CategoriesDialog
        open={categoriesDialogOpen}
        onClose={() => setCategoriesDialogOpen(false)}
        categories={categories}
        selectedCategoryId={data.categoryId}
        inUseMessage="Catégorie utilisée par ce compte rendu"
        onAddCategory={addCategory}
        onRenameCategory={renameCategory}
        onDeleteCategory={deleteCategory}
      />

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
