'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { DiaporamaField } from '@/components/pages-modules/DiaporamaField';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { PhoneField } from '@/components/pages-modules/PhoneField';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import type { ArchivableItem, ArchivableStatus } from '@/components/pages-modules/ArchivableListPage';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { DEFAULT_DIRECTORY_CATEGORIES, DEFAULT_DIRECTORY_FORM, type DirectoryFormData } from '@/types/pagesModules';

interface DirectoryProfessionalFormProps {
  title: string;
  nounLabel: string;
  backHref: string;
  backLabel: string;
  mode?: 'create' | 'edit';
  initialItem?: ArchivableItem;
}

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'vignette', icon: 'Image', navLabel: 'Vignette' },
  { id: 'localisation', icon: 'MapPin', navLabel: 'Localisation' },
];
const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'contact-telephone', icon: 'Phone', navLabel: 'Contact par téléphone' },
  { id: 'contact-internet', icon: 'Link', navLabel: 'Contact par Internet' },
  { id: 'diaporama', icon: 'Layers', navLabel: "Diaporama d'images" },
  { id: 'pieces-jointes', icon: 'Paperclip', navLabel: 'Pièces jointes' },
];
const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialItem?: ArchivableItem): DirectoryFormData {
  if (initialItem) return { ...DEFAULT_DIRECTORY_FORM, name: initialItem.name, status: initialItem.status };
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_DIRECTORY_FORM, name: copyName } : DEFAULT_DIRECTORY_FORM;
}

export function DirectoryProfessionalForm({ title, nounLabel, backHref, backLabel, mode = 'create', initialItem }: DirectoryProfessionalFormProps) {
  const router = useRouter();
  const [initialData] = useState<DirectoryFormData>(() => buildInitialData(initialItem));
  const [data, setData] = useState<DirectoryFormData>(initialData);
  const [categories, setCategories] = useState<string[]>(DEFAULT_DIRECTORY_CATEGORIES);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initialData), [data, initialData]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);
  const {
    expanded,
    activeSectionId,
    registerSection,
    toggleSection,
    handleNavClick,
  } = useSectionScrollSpy(ALL_SECTION_IDS, { defaultExpandedIds: ESSENTIAL_SECTIONS.map((section) => section.id) });
  const { headerRef, railSx } = useStickyFormLayout();

  function handleChange(patch: Partial<DirectoryFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function addCategory() {
    const label = window.prompt('Nom de la nouvelle catégorie');
    const trimmed = label?.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
    handleChange({ category: trimmed });
  }

  function commit(status: ArchivableStatus) {
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(
      status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name || `Nouveau ${nounLabel}`} » a été publié(e).`,
    );
    window.setTimeout(() => router.push(backHref), 1200);
  }

  const pageTitle = mode === 'create' ? title : data.name || `Modifier le ${nounLabel}`;

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
            href={backHref}
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            {backLabel}
          </Button>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            {pageTitle}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <Button variant="outlined" color="inherit" startIcon={<SaveOutlinedIcon fontSize="small" />} onClick={() => commit('draft')}>
            Enregistrer comme brouillon
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
            title={`Informations générales concernant le ${nounLabel}`}
            expanded={Boolean(expanded['informations-generales'])}
            onToggle={(value) => toggleSection('informations-generales', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField label={`Nom du ${nounLabel}`} value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
              <TextField label="Nom du responsable" value={data.managerName} onChange={(e) => handleChange({ managerName: e.target.value })} fullWidth />
              <TextField
                label="Activité"
                value={data.activity}
                onChange={(e) => handleChange({ activity: e.target.value })}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Domaine d'activité principal.">
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Stack direction="row" spacing={1.5}>
                <TextField select label="Catégorie" value={data.category} onChange={(e) => handleChange({ category: e.target.value })} fullWidth>
                  <MenuItem value="">Aucune sélection</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
                <Button variant="outlined" color="inherit" onClick={addCategory} sx={{ flexShrink: 0, minWidth: 44, px: 1.5 }} aria-label="Ajouter une catégorie">
                  <AddOutlinedIcon fontSize="small" />
                </Button>
              </Stack>
              <RichTextField
                label="Description"
                value={data.description}
                onChange={(description) => handleChange({ description })}
                placeholder="Présentation détaillée affichée sur la fiche…"
              />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="vignette"
            icon="Image"
            title={`Vignette du ${nounLabel}`}
            expanded={Boolean(expanded.vignette)}
            onToggle={(value) => toggleSection('vignette', value)}
            registerSection={registerSection}
          >
            <VignetteUploader value={data.thumbnailUrl} onChange={(url) => handleChange({ thumbnailUrl: url })} />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="localisation"
            icon="MapPin"
            title={`Localisation du ${nounLabel}`}
            expanded={Boolean(expanded.localisation)}
            onToggle={(value) => toggleSection('localisation', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Ville / Code postal"
                value={data.city}
                onChange={(e) => handleChange({ city: e.target.value })}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Utilisée pour situer la fiche sur la carte.">
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField label="Adresse" value={data.address} onChange={(e) => handleChange({ address: e.target.value })} fullWidth />
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2">Affichage de la carte de localisation</Typography>
                  <Tooltip title="Affiche une carte interactive sur la fiche.">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
                <Switch
                  checked={data.showMap}
                  onChange={(e) => handleChange({ showMap: e.target.checked })}
                  slotProps={{ input: { 'aria-label': 'Affichage de la carte de localisation' } }}
                />
              </Stack>
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="contact-telephone"
            icon="Phone"
            title="Éléments de contact par téléphone"
            expanded={Boolean(expanded['contact-telephone'])}
            onToggle={(value) => toggleSection('contact-telephone', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <PhoneField
                id="directory-field-phone1"
                label="Téléphone 1"
                country={data.phone1Country}
                number={data.phone1}
                onCountryChange={(phone1Country) => handleChange({ phone1Country })}
                onNumberChange={(phone1) => handleChange({ phone1 })}
              />
              <PhoneField
                id="directory-field-phone2"
                label="Téléphone 2"
                country={data.phone2Country}
                number={data.phone2}
                onCountryChange={(phone2Country) => handleChange({ phone2Country })}
                onNumberChange={(phone2) => handleChange({ phone2 })}
              />
              <PhoneField
                id="directory-field-phone3"
                label="Téléphone 3"
                country={data.phone3Country}
                number={data.phone3}
                onCountryChange={(phone3Country) => handleChange({ phone3Country })}
                onNumberChange={(phone3) => handleChange({ phone3 })}
              />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="contact-internet"
            icon="Link"
            title="Éléments de contact par Internet"
            expanded={Boolean(expanded['contact-internet'])}
            onToggle={(value) => toggleSection('contact-internet', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Adresse email de contact"
                type="email"
                value={data.contactEmail}
                onChange={(e) => handleChange({ contactEmail: e.target.value })}
                fullWidth
              />
              <TextField label="Site Internet" placeholder="https://" value={data.website} onChange={(e) => handleChange({ website: e.target.value })} fullWidth />
              <TextField label="Facebook" placeholder="https://facebook.com/…" value={data.facebook} onChange={(e) => handleChange({ facebook: e.target.value })} fullWidth />
              <TextField label="Instagram" placeholder="https://instagram.com/…" value={data.instagram} onChange={(e) => handleChange({ instagram: e.target.value })} fullWidth />
              <TextField label="Twitter" placeholder="https://twitter.com/…" value={data.twitter} onChange={(e) => handleChange({ twitter: e.target.value })} fullWidth />
              <TextField label="YouTube" placeholder="https://youtube.com/…" value={data.youtube} onChange={(e) => handleChange({ youtube: e.target.value })} fullWidth />
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

          <SommaireLinkedSection
            id="pieces-jointes"
            icon="Paperclip"
            title="Pièces jointes"
            expanded={Boolean(expanded['pieces-jointes'])}
            onToggle={(value) => toggleSection('pieces-jointes', value)}
            registerSection={registerSection}
          >
            <Typography variant="body2" color="text.secondary">
              Aucune pièce jointe pour le moment.
            </Typography>
          </SommaireLinkedSection>
        </Stack>
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

      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="directory-leave-title" aria-describedby="directory-leave-description">
        <DialogTitle id="directory-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="directory-leave-description">
            Des modifications n&apos;ont pas été enregistrées. Si vous quittez maintenant, elles seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={cancelLeave} color="inherit" autoFocus>
            Rester sur la page
          </Button>
          <Button onClick={confirmLeave} color="error" variant="contained">
            Quitter sans enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
