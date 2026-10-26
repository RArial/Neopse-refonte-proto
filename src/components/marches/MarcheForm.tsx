'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { DiaporamaField } from '@/components/pages-modules/DiaporamaField';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  DEFAULT_MARCHE_FORM,
  PERIODICITY_OPTIONS,
  PRODUCT_TYPES,
  STRUCTURE_OPTIONS,
  type Marche,
  type MarcheFormData,
  type MarcheStatus,
} from '@/types/marches';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<MarcheStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'vignette', icon: 'Image', navLabel: 'Vignette' },
  { id: 'localisation', icon: 'MapPin', navLabel: 'Localisation' },
];
const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'diaporama', icon: 'Layers', navLabel: "Diaporama d'images" },
  { id: 'pieces-jointes', icon: 'Paperclip', navLabel: 'Pièces jointes' },
  { id: 'code-html', icon: 'Code', navLabel: 'Code HTML' },
];
const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialMarche?: Marche): MarcheFormData {
  if (initialMarche) {
    return {
      ...DEFAULT_MARCHE_FORM,
      name: initialMarche.name,
      activity: initialMarche.activity,
      status: initialMarche.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_MARCHE_FORM, name: copyName } : DEFAULT_MARCHE_FORM;
}

interface MarcheFormProps {
  mode: 'create' | 'edit';
  initialMarche?: Marche;
}

export function MarcheForm({ mode, initialMarche }: MarcheFormProps) {
  const router = useRouter();
  const [data, setData] = useState<MarcheFormData>(() => buildInitialData(initialMarche));
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

  function handleChange(patch: Partial<MarcheFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function toggleProductType(id: string) {
    setData((prev) => ({
      ...prev,
      productTypes: prev.productTypes.includes(id) ? prev.productTypes.filter((candidate) => candidate !== id) : [...prev.productTypes, id],
    }));
  }

  function commit(status: MarcheStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      handleNavClick('informations-generales');
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publié.`);
    window.setTimeout(() => router.push('/dashboard/marches'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouveau marché' : data.name || 'Modifier le marché';

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
            href="/dashboard/marches"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux marchés
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
                label="Nom du marché"
                value={data.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                fullWidth
                required
                error={nameError}
              />
              <TextField label="Activité" value={data.activity} onChange={(e) => handleChange({ activity: e.target.value })} fullWidth />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField select label="Structure" value={data.structure} onChange={(e) => handleChange({ structure: e.target.value })} fullWidth>
                  <MenuItem value="">Aucune sélection</MenuItem>
                  {STRUCTURE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField select label="Périodicité" value={data.periodicity} onChange={(e) => handleChange({ periodicity: e.target.value })} fullWidth>
                  <MenuItem value="">Aucune sélection</MenuItem>
                  {PERIODICITY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack spacing={1}>
                <FormLabel component="legend" sx={{ fontSize: 13 }}>
                  Types de produits disponibles
                </FormLabel>
                <FormGroup>
                  {PRODUCT_TYPES.map((productType) => (
                    <FormControlLabel
                      key={productType.id}
                      control={<Checkbox checked={data.productTypes.includes(productType.id)} onChange={() => toggleProductType(productType.id)} />}
                      label={productType.label}
                    />
                  ))}
                </FormGroup>
              </Stack>

              <RichTextField
                label="Description"
                value={data.description}
                onChange={(description) => handleChange({ description })}
                placeholder="Décrivez ce marché…"
              />
            </Stack>
          </SommaireLinkedSection>

          {nameError && (
            <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
              Le nom du marché est obligatoire.
            </MuiAlert>
          )}

          <SommaireLinkedSection
            id="vignette"
            icon="Image"
            title="Vignette du marché"
            expanded={Boolean(expanded.vignette)}
            onToggle={(value) => toggleSection('vignette', value)}
            registerSection={registerSection}
          >
            <VignetteUploader folder="Marchés" value={data.thumbnailUrl} onChange={(thumbnailUrl) => handleChange({ thumbnailUrl })} itemLabel="vignette" />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="localisation"
            icon="MapPin"
            title="Localisation du marché"
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
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Affichage de la carte de localisation</Typography>
                <Switch
                  checked={data.showLocationMap}
                  onChange={(e) => handleChange({ showLocationMap: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Affichage de la carte de localisation' } }}
                />
              </Stack>
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
            id="diaporama"
            icon="Layers"
            title="Diaporama d'images"
            expanded={Boolean(expanded.diaporama)}
            onToggle={(value) => toggleSection('diaporama', value)}
            registerSection={registerSection}
          >
            <DiaporamaField
              folder="Marchés"
              diaporamaType={data.diaporamaType}
              images={data.images}
              onChangeType={(diaporamaType) => handleChange({ diaporamaType })}
              onChangeImages={(images) => handleChange({ images })}
              onNotify={setSnackbarMessage}
            />
          </SommaireLinkedSection>

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
