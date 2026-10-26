'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { PhoneField } from '@/components/pages-modules/PhoneField';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  CARPOOLING_SEAT_OPTIONS,
  DEFAULT_CARPOOLING_FORM,
  type Carpooling,
  type CarpoolingFormData,
  type CarpoolingStatus,
} from '@/types/covoiturage';
import { readDuplicateFlag } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<CarpoolingStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'vignette', icon: 'Image', navLabel: 'Vignette' },
  { id: 'annonceur', icon: 'Users', navLabel: "Informations sur l'annonceur" },
];
const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'etapes', icon: 'MapPin', navLabel: "Villes d'étapes" },
  { id: 'complementaires', icon: 'IdCard', navLabel: 'Informations complémentaires' },
];
const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialCarpooling?: Carpooling): CarpoolingFormData {
  if (!initialCarpooling) return DEFAULT_CARPOOLING_FORM;
  return {
    ...DEFAULT_CARPOOLING_FORM,
    type: initialCarpooling.annonceType,
    departureCity: initialCarpooling.departureCity,
    arrivalCity: initialCarpooling.arrivalCity,
    status: initialCarpooling.status,
  };
}

interface CarpoolingFormProps {
  mode: 'create' | 'edit';
  initialCarpooling?: Carpooling;
}

export function CarpoolingForm({ mode, initialCarpooling }: CarpoolingFormProps) {
  const router = useRouter();
  const [data, setData] = useState<CarpoolingFormData>(() => buildInitialData(initialCarpooling));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cityError, setCityError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readDuplicateFlag());
  const {
    expanded,
    activeSectionId,
    registerSection,
    toggleSection,
    handleNavClick,
  } = useSectionScrollSpy(ALL_SECTION_IDS, { defaultExpandedIds: ESSENTIAL_SECTIONS.map((section) => section.id) });
  const { headerRef, railSx } = useStickyFormLayout();

  function handleChange(patch: Partial<CarpoolingFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function commit(status: CarpoolingStatus) {
    if (!data.departureCity.trim() || !data.arrivalCity.trim()) {
      setCityError(true);
      handleNavClick('informations-generales');
      return;
    }
    setCityError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : "L'annonce de covoiturage a été publiée.");
    window.setTimeout(() => router.push('/dashboard/covoiturage'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle =
    mode === 'create'
      ? 'Nouvelle annonce de covoiturage'
      : data.departureCity && data.arrivalCity
        ? `${data.departureCity} → ${data.arrivalCity}`
        : "Modifier l'annonce";

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
            href="/dashboard/covoiturage"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux annonces de covoiturage
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
          {cityError && (
            <MuiAlert severity="error" role="alert">
              Les villes de départ et d&apos;arrivée sont obligatoires.
            </MuiAlert>
          )}

          <SommaireLinkedSection
            id="informations-generales"
            icon="FileText"
            title="Informations générales concernant l'annonce"
            expanded={Boolean(expanded['informations-generales'])}
            onToggle={(value) => toggleSection('informations-generales', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <RadioGroup row value={data.type} onChange={(e) => handleChange({ type: e.target.value as CarpoolingFormData['type'] })}>
                <FormControlLabel value="offre" control={<Radio />} label="Offre" />
                <FormControlLabel value="demande" control={<Radio />} label="Demande" />
              </RadioGroup>

              <TextField
                label="Ville / Code postal - Départ"
                value={data.departureCity}
                onChange={(e) => handleChange({ departureCity: e.target.value })}
                fullWidth
                required
                error={cityError}
                helperText="Point de départ du trajet."
              />
              <TextField
                label="Ville / Code postal - Arrivée"
                value={data.arrivalCity}
                onChange={(e) => handleChange({ arrivalCity: e.target.value })}
                fullWidth
                required
                error={cityError}
                helperText="Destination du trajet."
              />

              <Stack spacing={0.75}>
                <Typography variant="body2">Type de trajet</Typography>
                <RadioGroup row value={data.tripType} onChange={(e) => handleChange({ tripType: e.target.value as CarpoolingFormData['tripType'] })}>
                  <FormControlLabel value="aller" control={<Radio />} label="Aller" />
                  <FormControlLabel value="aller-retour" control={<Radio />} label="Aller-retour" />
                </RadioGroup>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField
                  label="Date de départ"
                  type="date"
                  value={data.departureDate}
                  onChange={(e) => handleChange({ departureDate: e.target.value })}
                  sx={{ maxWidth: 260 }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                {data.tripType === 'aller-retour' && (
                  <TextField
                    label="Date de retour"
                    type="date"
                    value={data.returnDate}
                    onChange={(e) => handleChange({ returnDate: e.target.value })}
                    sx={{ maxWidth: 260 }}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              </Stack>

              <Stack spacing={0.75}>
                <Typography variant="body2">Tarifs</Typography>
                <RadioGroup row value={data.pricing} onChange={(e) => handleChange({ pricing: e.target.value as CarpoolingFormData['pricing'] })}>
                  <FormControlLabel value="gratuit" control={<Radio />} label="Gratuit" />
                  <FormControlLabel value="tarif-unique" control={<Radio />} label="Tarif unique" />
                  <FormControlLabel value="fourchette" control={<Radio />} label="Fourchette de prix" />
                  <FormControlLabel value="non-communique" control={<Radio />} label="Non communiqués" />
                </RadioGroup>
              </Stack>

              <TextField
                select
                label="Places disponibles"
                value={data.availableSeats}
                onChange={(e) => handleChange({ availableSeats: e.target.value })}
                sx={{ maxWidth: 260 }}
              >
                <MenuItem value="">Aucune sélection</MenuItem>
                {CARPOOLING_SEAT_OPTIONS.map((seats) => (
                  <MenuItem key={seats} value={seats}>
                    {seats}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="vignette"
            icon="Image"
            title="Vignette de l'annonce"
            expanded={Boolean(expanded.vignette)}
            onToggle={(value) => toggleSection('vignette', value)}
            registerSection={registerSection}
          >
            <VignetteUploader folder="Annonces de covoiturage" value={data.thumbnailUrl} onChange={(thumbnailUrl) => handleChange({ thumbnailUrl })} itemLabel="vignette" />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="annonceur"
            icon="Users"
            title="Informations concernant l'annonceur"
            expanded={Boolean(expanded.annonceur)}
            onToggle={(value) => toggleSection('annonceur', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField label="Nom de l'annonceur" value={data.advertiserName} onChange={(e) => handleChange({ advertiserName: e.target.value })} fullWidth />
              <TextField
                label="Adresse email de contact"
                type="email"
                value={data.contactEmail}
                onChange={(e) => handleChange({ contactEmail: e.target.value })}
                fullWidth
              />
              <PhoneField
                id="carpooling-phone"
                country={data.phoneCountry}
                number={data.phoneNumber}
                onCountryChange={(country) => handleChange({ phoneCountry: country })}
                onNumberChange={(number) => handleChange({ phoneNumber: number })}
              />
              <Stack spacing={0.75}>
                <Typography variant="body2">Genre</Typography>
                <RadioGroup row value={data.gender} onChange={(e) => handleChange({ gender: e.target.value as CarpoolingFormData['gender'] })}>
                  <FormControlLabel value="homme" control={<Radio />} label="Homme" />
                  <FormControlLabel value="femme" control={<Radio />} label="Femme" />
                </RadioGroup>
              </Stack>
              <TextField label="Âge" type="number" value={data.age} onChange={(e) => handleChange({ age: e.target.value })} sx={{ maxWidth: 160 }} />
              <TextField
                label="Informations complémentaires"
                value={data.advertiserAdditionalInfo}
                onChange={(e) => handleChange({ advertiserAdditionalInfo: e.target.value })}
                multiline
                minRows={3}
                fullWidth
              />
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
            id="etapes"
            icon="MapPin"
            title="Informations concernant les villes d'étapes"
            expanded={Boolean(expanded.etapes)}
            onToggle={(value) => toggleSection('etapes', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField label="Ville / Code postal - Étape 1" value={data.stepCity1} onChange={(e) => handleChange({ stepCity1: e.target.value })} fullWidth />
              <TextField label="Ville / Code postal - Étape 2" value={data.stepCity2} onChange={(e) => handleChange({ stepCity2: e.target.value })} fullWidth />
              <TextField label="Ville / Code postal - Étape 3" value={data.stepCity3} onChange={(e) => handleChange({ stepCity3: e.target.value })} fullWidth />
              <TextField label="Ville / Code postal - Étape 4" value={data.stepCity4} onChange={(e) => handleChange({ stepCity4: e.target.value })} fullWidth />
              <TextField label="Ville / Code postal - Étape 5" value={data.stepCity5} onChange={(e) => handleChange({ stepCity5: e.target.value })} fullWidth />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="complementaires"
            icon="IdCard"
            title="Informations complémentaires concernant l'annonce"
            expanded={Boolean(expanded.complementaires)}
            onToggle={(value) => toggleSection('complementaires', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Animaux acceptés</Typography>
                <Switch
                  checked={data.petsAllowed}
                  onChange={(e) => handleChange({ petsAllowed: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Animaux acceptés' } }}
                />
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Fumeurs acceptés</Typography>
                <Switch
                  checked={data.smokersAllowed}
                  onChange={(e) => handleChange({ smokersAllowed: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Fumeurs acceptés' } }}
                />
              </Stack>
              <TextField label="Type de véhicule" value={data.vehicleType} onChange={(e) => handleChange({ vehicleType: e.target.value })} fullWidth />
            </Stack>
          </SommaireLinkedSection>
        </Stack>
      </Box>

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
