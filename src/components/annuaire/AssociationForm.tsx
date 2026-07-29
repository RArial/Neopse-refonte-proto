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
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import type { ArchivableItem, ArchivableStatus } from '@/components/pages-modules/ArchivableListPage';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { ASSOCIATION_CATEGORIES, DEFAULT_ASSOCIATION_FORM, type AssociationFormData } from '@/types/pagesModules';

interface AssociationFormProps {
  mode?: 'create' | 'edit';
  initialItem?: ArchivableItem;
}

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'vignette', icon: 'Image', navLabel: "Vignette de l'association" },
  { id: 'localisation', icon: 'MapPin', navLabel: 'Localisation' },
];
const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'bureau', icon: 'IdCard', navLabel: "Bureau de l'association" },
  { id: 'contact-telephone', icon: 'Phone', navLabel: 'Contact par téléphone' },
  { id: 'contact-internet', icon: 'Link', navLabel: 'Contact par Internet' },
  { id: 'diaporama', icon: 'Layers', navLabel: "Diaporama d'images" },
  { id: 'pieces-jointes', icon: 'Paperclip', navLabel: 'Pièces jointes' },
];
const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialItem?: ArchivableItem): AssociationFormData {
  if (initialItem) return { ...DEFAULT_ASSOCIATION_FORM, name: initialItem.name, status: initialItem.status };
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_ASSOCIATION_FORM, name: copyName } : DEFAULT_ASSOCIATION_FORM;
}

export function AssociationForm({ mode = 'create', initialItem }: AssociationFormProps) {
  const router = useRouter();
  const [initialData] = useState<AssociationFormData>(() => buildInitialData(initialItem));
  const [data, setData] = useState<AssociationFormData>(initialData);
  const [categories, setCategories] = useState<string[]>(ASSOCIATION_CATEGORIES);
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

  function handleChange(patch: Partial<AssociationFormData>) {
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
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name || 'Nouvelle association'} » a été publiée.`);
    window.setTimeout(() => router.push('/dashboard/annuaire-associations'), 1200);
  }

  const pageTitle = mode === 'create' ? 'Nouvelle association' : data.name || "Modifier l'association";

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
            href="/dashboard/annuaire-associations"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour à l&apos;annuaire des associations
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
            title="Informations générales concernant l'association"
            expanded={Boolean(expanded['informations-generales'])}
            onToggle={(value) => toggleSection('informations-generales', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField label="Nom de l'association" value={data.name} onChange={(e) => handleChange({ name: e.target.value })} fullWidth required />
              <TextField
                label="Objet"
                value={data.purpose}
                onChange={(e) => handleChange({ purpose: e.target.value })}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Objet social déclaré de l'association.">
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
              <TextField
                label="Description"
                value={data.description}
                onChange={(e) => handleChange({ description: e.target.value })}
                multiline
                minRows={5}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <Tooltip title="Présentation détaillée affichée sur la fiche.">
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="vignette"
            icon="Image"
            title="Vignette de l'association"
            expanded={Boolean(expanded.vignette)}
            onToggle={(value) => toggleSection('vignette', value)}
            registerSection={registerSection}
          >
            <VignetteUploader value={data.thumbnailUrl} onChange={(url) => handleChange({ thumbnailUrl: url })} />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="localisation"
            icon="MapPin"
            title="Localisation de l'association"
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
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="bureau"
            icon="IdCard"
            title="Bureau de l'association"
            expanded={Boolean(expanded.bureau)}
            onToggle={(value) => toggleSection('bureau', value)}
            registerSection={registerSection}
          >
            <TextField label="Nom du président" value={data.presidentName} onChange={(e) => handleChange({ presidentName: e.target.value })} fullWidth />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="contact-telephone"
            icon="Phone"
            title="Éléments de contact par téléphone"
            expanded={Boolean(expanded['contact-telephone'])}
            onToggle={(value) => toggleSection('contact-telephone', value)}
            registerSection={registerSection}
          >
            <Typography variant="body2" color="text.secondary">
              Aucun numéro renseigné pour le moment.
            </Typography>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="contact-internet"
            icon="Link"
            title="Éléments de contact par Internet"
            expanded={Boolean(expanded['contact-internet'])}
            onToggle={(value) => toggleSection('contact-internet', value)}
            registerSection={registerSection}
          >
            <TextField label="Site Internet" placeholder="https://" fullWidth />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="diaporama"
            icon="Layers"
            title="Diaporama d'images"
            expanded={Boolean(expanded.diaporama)}
            onToggle={(value) => toggleSection('diaporama', value)}
            registerSection={registerSection}
          >
            <Typography variant="body2" color="text.secondary">
              Aucune image ajoutée pour le moment.
            </Typography>
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

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="association-leave-title" aria-describedby="association-leave-description">
        <DialogTitle id="association-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="association-leave-description">
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
