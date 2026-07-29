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
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { CategoriesDialog } from '@/components/pages-modules/CategoriesDialog';
import { DiaporamaField } from '@/components/pages-modules/DiaporamaField';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { PhoneField } from '@/components/pages-modules/PhoneField';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  ANNONCE_CATEGORIES_SEED,
  ANNONCE_PRICING_LABELS,
  ANNONCE_TYPE_LABELS,
  DEFAULT_ANNONCE_FORM,
  type Annonce,
  type AnnonceCategory,
  type AnnonceFormData,
  type AnnoncePricing,
  type AnnonceStatus,
  type AnnonceType,
} from '@/types/petitesAnnonces';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<AnnonceStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

const ANNONCE_TYPES: AnnonceType[] = ['offre', 'demande'];
const ANNONCE_PRICINGS: AnnoncePricing[] = ['gratuit', 'tarif-unique', 'fourchette', 'non-communique'];

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'vignette', icon: 'Image', navLabel: 'Vignette' },
  { id: 'localisation', icon: 'MapPin', navLabel: 'Localisation' },
];
const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'annonceur', icon: 'Users', navLabel: "Informations sur l'annonceur" },
  { id: 'diaporama', icon: 'Layers', navLabel: "Diaporama d'images" },
];
const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialAnnonce?: Annonce): AnnonceFormData {
  if (initialAnnonce) {
    return {
      ...DEFAULT_ANNONCE_FORM,
      name: initialAnnonce.name,
      annonceType: initialAnnonce.annonceType,
      status: initialAnnonce.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_ANNONCE_FORM, name: copyName } : DEFAULT_ANNONCE_FORM;
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface AnnonceFormProps {
  mode: 'create' | 'edit';
  initialAnnonce?: Annonce;
}

export function AnnonceForm({ mode, initialAnnonce }: AnnonceFormProps) {
  const router = useRouter();
  const [data, setData] = useState<AnnonceFormData>(() => buildInitialData(initialAnnonce));
  const [categories, setCategories] = useState<AnnonceCategory[]>(ANNONCE_CATEGORIES_SEED);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const {
    expanded,
    activeSectionId,
    registerSection,
    toggleSection,
    handleNavClick,
  } = useSectionScrollSpy(ALL_SECTION_IDS, { defaultExpandedIds: ESSENTIAL_SECTIONS.map((section) => section.id) });
  const { headerRef, railSx } = useStickyFormLayout();

  function handleChange(patch: Partial<AnnonceFormData>) {
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

  function commit(status: AnnonceStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      handleNavClick('informations-generales');
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publiée.`);
    window.setTimeout(() => router.push('/dashboard/petites-annonces'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouvelle annonce' : data.name || "Modifier l'annonce";

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
            href="/dashboard/petites-annonces"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux petites annonces
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
        </Box>

        <Stack spacing={2}>
          <SommaireLinkedSection
            id="informations-generales"
            icon="FileText"
            title="Informations générales"
            expanded={Boolean(expanded['informations-generales'])}
            onToggle={(value) => toggleSection('informations-generales', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Nom de l'annonce"
                value={data.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                fullWidth
                required
                error={nameError}
              />

              <FormControl>
                <FormLabel id="annonce-type-label" sx={{ fontSize: 13 }}>
                  Type d&apos;annonce
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="annonce-type-label"
                  value={data.annonceType}
                  onChange={(e) => handleChange({ annonceType: e.target.value as AnnonceType })}
                >
                  {ANNONCE_TYPES.map((type) => (
                    <FormControlLabel key={type} value={type} control={<Radio />} label={ANNONCE_TYPE_LABELS[type]} />
                  ))}
                </RadioGroup>
              </FormControl>

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
                placeholder="Décrivez cette annonce…"
              />

              <FormControl>
                <FormLabel id="annonce-pricing-label" sx={{ fontSize: 13 }}>
                  Tarifs
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="annonce-pricing-label"
                  value={data.pricing}
                  onChange={(e) => handleChange({ pricing: e.target.value as AnnoncePricing })}
                >
                  {ANNONCE_PRICINGS.map((pricing) => (
                    <FormControlLabel key={pricing} value={pricing} control={<Radio />} label={ANNONCE_PRICING_LABELS[pricing]} />
                  ))}
                </RadioGroup>
              </FormControl>

              {data.pricing === 'tarif-unique' && (
                <TextField
                  label="Prix"
                  placeholder="Ex. 50 €"
                  value={data.price}
                  onChange={(e) => handleChange({ price: e.target.value })}
                  fullWidth
                  sx={{ maxWidth: 260 }}
                />
              )}

              {data.pricing === 'fourchette' && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <TextField
                    label="Prix minimum"
                    placeholder="Ex. 30 €"
                    value={data.priceMin}
                    onChange={(e) => handleChange({ priceMin: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Prix maximum"
                    placeholder="Ex. 80 €"
                    value={data.priceMax}
                    onChange={(e) => handleChange({ priceMax: e.target.value })}
                    fullWidth
                  />
                </Stack>
              )}
            </Stack>
          </SommaireLinkedSection>

          {nameError && (
            <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
              Le nom de l&apos;annonce est obligatoire.
            </MuiAlert>
          )}

          <SommaireLinkedSection
            id="vignette"
            icon="Image"
            title="Vignette"
            expanded={Boolean(expanded.vignette)}
            onToggle={(value) => toggleSection('vignette', value)}
            registerSection={registerSection}
          >
            <VignetteUploader value={data.thumbnailUrl} onChange={(thumbnailUrl) => handleChange({ thumbnailUrl })} itemLabel="vignette" />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="localisation"
            icon="MapPin"
            title="Localisation de l'annonce"
            expanded={Boolean(expanded.localisation)}
            onToggle={(value) => toggleSection('localisation', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Ville / Code postal"
                placeholder="Ex. Paris 8ème 75008, France"
                value={data.cityPostalCode}
                onChange={(e) => handleChange({ cityPostalCode: e.target.value })}
                fullWidth
              />
              <TextField label="Adresse" value={data.address} onChange={(e) => handleChange({ address: e.target.value })} fullWidth />
            </Stack>
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
            id="annonceur"
            icon="Users"
            title="Informations concernant l'annonceur"
            expanded={Boolean(expanded.annonceur)}
            onToggle={(value) => toggleSection('annonceur', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Nom de l'annonceur"
                value={data.advertiserName}
                onChange={(e) => handleChange({ advertiserName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Adresse mail de contact"
                type="email"
                value={data.advertiserEmail}
                onChange={(e) => handleChange({ advertiserEmail: e.target.value })}
                fullWidth
              />
              <PhoneField
                id="annonce-field-advertiser-phone"
                country={data.advertiserPhoneCountry}
                number={data.advertiserPhone}
                onCountryChange={(advertiserPhoneCountry) => handleChange({ advertiserPhoneCountry })}
                onNumberChange={(advertiserPhone) => handleChange({ advertiserPhone })}
              />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="diaporama"
            icon="Layers"
            title="Diaporama d'images"
            expanded={Boolean(expanded.diaporama)}
            onToggle={(value) => toggleSection('diaporama', value)}
            registerSection={registerSection}
          >
            <DiaporamaField
              diaporamaType={data.diaporamaType}
              images={data.images}
              onChangeType={(diaporamaType) => handleChange({ diaporamaType })}
              onChangeImages={(images) => handleChange({ images })}
              onNotify={setSnackbarMessage}
            />
          </SommaireLinkedSection>
        </Stack>
      </Box>

      <CategoriesDialog
        open={categoriesDialogOpen}
        onClose={() => setCategoriesDialogOpen(false)}
        categories={categories}
        selectedCategoryId={data.categoryId}
        inUseMessage="Catégorie utilisée par cette annonce"
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
