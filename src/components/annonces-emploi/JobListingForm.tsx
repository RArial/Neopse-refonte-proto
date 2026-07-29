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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
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
import { DEFAULT_JOB_FORM, JOB_CONTRACT_TYPES, JOB_SECTORS, type JobListingFormData } from '@/types/pagesModules';

interface JobListingFormProps {
  mode?: 'create' | 'edit';
  initialItem?: ArchivableItem;
}

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'vignette', icon: 'Image', navLabel: "Vignette de l'annonceur" },
  { id: 'localisation', icon: 'MapPin', navLabel: 'Localisation' },
  { id: 'annonceur', icon: 'Users', navLabel: "Informations sur l'annonceur" },
];
const COMPLEMENTARY_SECTIONS: SommaireSection[] = [{ id: 'pieces-jointes', icon: 'Paperclip', navLabel: 'Pièces jointes' }];
const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialItem?: ArchivableItem): JobListingFormData {
  if (initialItem) return { ...DEFAULT_JOB_FORM, name: initialItem.name, status: initialItem.status };
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_JOB_FORM, name: copyName } : DEFAULT_JOB_FORM;
}

export function JobListingForm({ mode = 'create', initialItem }: JobListingFormProps) {
  const router = useRouter();
  const [initialData] = useState<JobListingFormData>(() => buildInitialData(initialItem));
  const [data, setData] = useState<JobListingFormData>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  function handleChange(patch: Partial<JobListingFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function commit(status: ArchivableStatus) {
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name || 'Nouvelle annonce'} » a été publiée.`);
    window.setTimeout(() => router.push('/dashboard/annonces-emploi'), 1200);
  }

  const pageTitle = mode === 'create' ? "Nouvelle annonce d'emploi" : data.name || "Modifier l'annonce d'emploi";

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
            href="/dashboard/annonces-emploi"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux annonces d&apos;emploi
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
            title="Informations générales concernant l'annonce"
            expanded={Boolean(expanded['informations-generales'])}
            onToggle={(value) => toggleSection('informations-generales', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField label="Nom de l'annonce" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
              <TextField select label="Secteur principal" value={data.sector} onChange={(e) => handleChange({ sector: e.target.value })} fullWidth>
                <MenuItem value="">Aucune sélection</MenuItem>
                {JOB_SECTORS.map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label="Type de contrat" value={data.contractType} onChange={(e) => handleChange({ contractType: e.target.value })} fullWidth>
                <MenuItem value="">Aucune sélection</MenuItem>
                {JOB_CONTRACT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <RichTextField
                label="Description"
                value={data.description}
                onChange={(description) => handleChange({ description })}
                placeholder="Décrivez cette annonce d'emploi…"
              />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="vignette"
            icon="Image"
            title="Vignette de l'annonceur"
            expanded={Boolean(expanded.vignette)}
            onToggle={(value) => toggleSection('vignette', value)}
            registerSection={registerSection}
          >
            <VignetteUploader value={data.thumbnailUrl} onChange={(url) => handleChange({ thumbnailUrl: url })} />
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
                value={data.city}
                onChange={(e) => handleChange({ city: e.target.value })}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Utilisée pour situer l'annonce sur la carte.">
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
                  <Tooltip title="Affiche une carte interactive sur la page de l'annonce.">
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
            id="annonceur"
            icon="Users"
            title="Informations concernant l'annonceur"
            expanded={Boolean(expanded.annonceur)}
            onToggle={(value) => toggleSection('annonceur', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField label="Nom de l'annonceur" value={data.advertiserName} onChange={(e) => handleChange({ advertiserName: e.target.value })} fullWidth />
                <TextField label="Nom du contact" value={data.contactName} onChange={(e) => handleChange({ contactName: e.target.value })} fullWidth />
              </Stack>
              <TextField
                label="Adresse email de contact"
                type="email"
                value={data.contactEmail}
                onChange={(e) => handleChange({ contactEmail: e.target.value })}
                fullWidth
              />
              <PhoneField
                id="job-phone"
                country={data.phoneCountry}
                number={data.phoneNumber}
                onCountryChange={(country) => handleChange({ phoneCountry: country })}
                onNumberChange={(number) => handleChange({ phoneNumber: number })}
              />
              <TextField label="Site Internet" placeholder="https://" value={data.website} onChange={(e) => handleChange({ website: e.target.value })} fullWidth />
            </Stack>
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

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="job-listing-leave-title" aria-describedby="job-listing-leave-description">
        <DialogTitle id="job-listing-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="job-listing-leave-description">
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
