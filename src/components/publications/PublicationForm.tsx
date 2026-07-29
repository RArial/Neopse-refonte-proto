'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { CategoriesDialog } from '@/components/pages-modules/CategoriesDialog';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import { Icons } from '@/components/ui/Icons';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  DEFAULT_PUBLICATION_FORM,
  PUBLICATION_CATEGORIES_SEED,
  type Publication,
  type PublicationCategory,
  type PublicationFormData,
  type PublicationStatus,
} from '@/types/publications';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<PublicationStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'vignette', icon: 'Image', navLabel: 'Vignette' },
];

const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'pieces-jointes', icon: 'Paperclip', navLabel: 'Pièces jointes' },
  { id: 'code-html', icon: 'Code', navLabel: 'Code HTML' },
];

const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialPublication?: Publication): PublicationFormData {
  if (initialPublication) {
    return {
      ...DEFAULT_PUBLICATION_FORM,
      name: initialPublication.name,
      categoryId: initialPublication.categoryId,
      publicationDate: initialPublication.publicationDate,
      status: initialPublication.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_PUBLICATION_FORM, name: copyName } : DEFAULT_PUBLICATION_FORM;
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface PublicationFormProps {
  mode: 'create' | 'edit';
  initialPublication?: Publication;
}

export function PublicationForm({ mode, initialPublication }: PublicationFormProps) {
  const router = useRouter();
  const [data, setData] = useState<PublicationFormData>(() => buildInitialData(initialPublication));
  const [categories, setCategories] = useState<PublicationCategory[]>(PUBLICATION_CATEGORIES_SEED);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { expanded, activeSectionId, registerSection, toggleSection, handleNavClick } = useSectionScrollSpy(ALL_SECTION_IDS, {
    defaultExpandedIds: ESSENTIAL_SECTIONS.map((section) => section.id),
  });
  const { headerRef, railSx } = useStickyFormLayout();

  function handleChange(patch: Partial<PublicationFormData>) {
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

  function commit(status: PublicationStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      handleNavClick('informations-generales');
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publié.`);
    window.setTimeout(() => router.push('/dashboard/publication'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouvelle publication' : data.name || 'Modifier la publication';

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1400, width: '100%', mx: 'auto' }}>
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
            href="/dashboard/publication"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux publications
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

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' }, gap: 3, alignItems: 'start' }}>
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 2, ...railSx }}>
          <FormSommaire
            groups={[
              { label: 'Essentiel', sections: ESSENTIAL_SECTIONS },
              { label: 'Complémentaire', sections: COMPLEMENTARY_SECTIONS },
            ]}
            activeSectionId={activeSectionId}
            onNavClick={handleNavClick}
          />

          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
              <Icons.Eye size={16} />
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Affichage</Typography>
            </Stack>
            <TextField
              label="Date de publication"
              type="date"
              value={data.publicationDate}
              onChange={(event) => handleChange({ publicationDate: event.target.value })}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Affichage en une</Typography>
              <Switch
                checked={data.featuredHome}
                onChange={(event) => handleChange({ featuredHome: event.target.checked })}
                slotProps={{ input: { 'aria-label': 'Affichage en une' } }}
              />
            </Stack>
          </Paper>
        </Box>

        <Stack spacing={2}>
          <SommaireLinkedSection
            id="informations-generales"
            icon="FileText"
            title="Informations générales concernant la publication"
            expanded={Boolean(expanded['informations-generales'])}
            onToggle={(value) => toggleSection('informations-generales', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Nom de la publication"
                value={data.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                fullWidth
                required
                error={nameError}
              />
              <TextField label="Chapo" value={data.chapo} onChange={(e) => handleChange({ chapo: e.target.value })} multiline minRows={2} fullWidth />

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

              <RichTextField
                label="Description"
                value={data.description}
                onChange={(description) => handleChange({ description })}
                placeholder="Décrivez cette publication…"
              />
            </Stack>
          </SommaireLinkedSection>

          {nameError && (
            <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
              Le nom de la publication est obligatoire.
            </MuiAlert>
          )}

          <SommaireLinkedSection
            id="vignette"
            icon="Image"
            title="Vignette de la publication"
            expanded={Boolean(expanded.vignette)}
            onToggle={(value) => toggleSection('vignette', value)}
            registerSection={registerSection}
          >
            <VignetteUploader value={data.thumbnailUrl} onChange={(thumbnailUrl) => handleChange({ thumbnailUrl })} itemLabel="vignette" />
          </SommaireLinkedSection>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', pt: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
            >
              Informations complémentaires
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
          </Stack>

          <SommaireLinkedSection
            id="pieces-jointes"
            icon="Paperclip"
            title="Pièces jointes"
            expanded={Boolean(expanded['pieces-jointes'])}
            onToggle={(value) => toggleSection('pieces-jointes', value)}
            registerSection={registerSection}
          >
            <AttachmentsField attachments={data.attachments} onChange={(attachments) => handleChange({ attachments })} />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="code-html"
            icon="Code"
            title="Code HTML"
            expanded={Boolean(expanded['code-html'])}
            onToggle={(value) => toggleSection('code-html', value)}
            registerSection={registerSection}
          >
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
          </SommaireLinkedSection>
        </Stack>
      </Box>

      <CategoriesDialog
        open={categoriesDialogOpen}
        onClose={() => setCategoriesDialogOpen(false)}
        categories={categories}
        selectedCategoryId={data.categoryId}
        inUseMessage="Catégorie utilisée par cette publication"
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
