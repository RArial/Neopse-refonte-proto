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
import MuiLink from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { PhoneField } from '@/components/pages-modules/PhoneField';
import { RichTextField } from '@/components/ui/RichTextField';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { MANAGER_SECTIONS } from '@/types/gestionnaire';
import { CONTACTS_MOCK } from '@/types/pagesModules';
import {
  DEFAULT_MARCHE_PUBLIC_FORM,
  DOMAINE_OPTIONS,
  PROCEDURE_OPTIONS,
  type MarchePublic,
  type MarchePublicFormData,
  type MarchePublicStatus,
} from '@/types/marchesPublics';

const STATUS_CHIP_META: Record<MarchePublicStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

const SITE_FORMS = MANAGER_SECTIONS.find((section) => section.id === 'formulaires')?.files.filter((file) => file.kind === 'form') ?? [];

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'dates', icon: 'Calendar', navLabel: 'Dates' },
];
const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'contact-generales', icon: 'IdCard', navLabel: 'Informations de contact' },
  { id: 'contact-telephone', icon: 'Phone', navLabel: 'Contact par téléphone' },
  { id: 'contact-formulaire', icon: 'Form', navLabel: 'Contact par formulaire' },
  { id: 'pieces-jointes', icon: 'Paperclip', navLabel: 'Pièces jointes' },
];
const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialMarchePublic?: MarchePublic): MarchePublicFormData {
  if (initialMarchePublic) {
    return {
      ...DEFAULT_MARCHE_PUBLIC_FORM,
      objet: initialMarchePublic.objet,
      domaine: initialMarchePublic.domaine,
      status: initialMarchePublic.status,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_MARCHE_PUBLIC_FORM, objet: copyName } : DEFAULT_MARCHE_PUBLIC_FORM;
}

interface MarchePublicFormProps {
  mode: 'create' | 'edit';
  initialMarchePublic?: MarchePublic;
}

export function MarchePublicForm({ mode, initialMarchePublic }: MarchePublicFormProps) {
  const router = useRouter();
  const [data, setData] = useState<MarchePublicFormData>(() => buildInitialData(initialMarchePublic));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [objetError, setObjetError] = useState(false);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const {
    expanded,
    activeSectionId,
    registerSection,
    toggleSection,
    handleNavClick,
  } = useSectionScrollSpy(ALL_SECTION_IDS, { defaultExpandedIds: ESSENTIAL_SECTIONS.map((section) => section.id) });
  const { headerRef, railSx } = useStickyFormLayout();

  function handleChange(patch: Partial<MarchePublicFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function toggleContact(contactId: string) {
    setData((prev) => ({
      ...prev,
      contactIds: prev.contactIds.includes(contactId) ? prev.contactIds.filter((id) => id !== contactId) : [...prev.contactIds, contactId],
    }));
  }

  function commit(status: MarchePublicStatus) {
    if (!data.objet.trim()) {
      setObjetError(true);
      handleNavClick('informations-generales');
      return;
    }
    setObjetError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.objet} » a été publié.`);
    window.setTimeout(() => router.push('/dashboard/marches-publics'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouveau marché public' : data.objet || 'Modifier le marché public';

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
            href="/dashboard/marches-publics"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux marchés publics
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
          {objetError && (
            <MuiAlert severity="error" role="alert">
              L&apos;objet du marché public est obligatoire.
            </MuiAlert>
          )}

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
                label="Objet"
                value={data.objet}
                onChange={(e) => handleChange({ objet: e.target.value })}
                fullWidth
                required
                error={objetError}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField select label="Domaine" value={data.domaine} onChange={(e) => handleChange({ domaine: e.target.value })} fullWidth>
                  <MenuItem value="">Aucune sélection</MenuItem>
                  {DOMAINE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField select label="Procédure" value={data.procedure} onChange={(e) => handleChange({ procedure: e.target.value })} fullWidth>
                  <MenuItem value="">Aucune sélection</MenuItem>
                  {PROCEDURE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <TextField
                label="Code Common Procurement Vocabulary (CPV)"
                placeholder="Ex. 45000000-7"
                value={data.cpvCode}
                onChange={(e) => handleChange({ cpvCode: e.target.value })}
                fullWidth
              />
              <TextField label="Référence" value={data.reference} onChange={(e) => handleChange({ reference: e.target.value })} fullWidth />
              <TextField
                label="Adresse URL de destination"
                placeholder="https://…"
                value={data.destinationUrl}
                onChange={(e) => handleChange({ destinationUrl: e.target.value })}
                fullWidth
              />

              <RichTextField
                label="Description"
                value={data.description}
                onChange={(description) => handleChange({ description })}
                placeholder="Décrivez ce marché public…"
              />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="dates"
            icon="Calendar"
            title="Dates"
            expanded={Boolean(expanded.dates)}
            onToggle={(value) => toggleSection('dates', value)}
            registerSection={registerSection}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <TextField
                label="Date de début"
                type="date"
                value={data.startDate}
                onChange={(e) => handleChange({ startDate: e.target.value })}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Date de fin"
                type="date"
                value={data.endDate}
                onChange={(e) => handleChange({ endDate: e.target.value })}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
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
            id="contact-generales"
            icon="IdCard"
            title="Informations générales de contact"
            expanded={Boolean(expanded['contact-generales'])}
            onToggle={(value) => toggleSection('contact-generales', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Nom du service destinataire de l'offre"
                value={data.contactServiceName}
                onChange={(e) => handleChange({ contactServiceName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Nom du responsable en charge du marché public"
                value={data.contactManagerName}
                onChange={(e) => handleChange({ contactManagerName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Ville / Code postal"
                value={data.cityPostalCode}
                onChange={(e) => handleChange({ cityPostalCode: e.target.value })}
                fullWidth
              />
              <TextField label="Adresse" value={data.address} onChange={(e) => handleChange({ address: e.target.value })} fullWidth />
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
                id="marche-public-field-phone1"
                label="Téléphone 1"
                country={data.phone1Country}
                number={data.phone1}
                onCountryChange={(phone1Country) => handleChange({ phone1Country })}
                onNumberChange={(phone1) => handleChange({ phone1 })}
              />
              <PhoneField
                id="marche-public-field-phone2"
                label="Téléphone 2"
                country={data.phone2Country}
                number={data.phone2}
                onCountryChange={(phone2Country) => handleChange({ phone2Country })}
                onNumberChange={(phone2) => handleChange({ phone2 })}
              />
              <PhoneField
                id="marche-public-field-phone3"
                label="Téléphone 3"
                country={data.phone3Country}
                number={data.phone3}
                onCountryChange={(phone3Country) => handleChange({ phone3Country })}
                onNumberChange={(phone3) => handleChange({ phone3 })}
              />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="contact-formulaire"
            icon="Form"
            title="Éléments de contact par formulaire"
            expanded={Boolean(expanded['contact-formulaire'])}
            onToggle={(value) => toggleSection('contact-formulaire', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <FormLabel component="legend" sx={{ fontSize: 13 }}>
                  Contact(s)
                </FormLabel>
                <FormGroup>
                  {CONTACTS_MOCK.map((contact) => (
                    <FormControlLabel
                      key={contact.id}
                      control={<Checkbox checked={data.contactIds.includes(contact.id)} onChange={() => toggleContact(contact.id)} />}
                      label={contact.name}
                    />
                  ))}
                </FormGroup>
              </Stack>

              <TextField select label="Formulaire" value={data.formId} onChange={(e) => handleChange({ formId: e.target.value })} fullWidth>
                <MenuItem value="">Aucune sélection</MenuItem>
                {SITE_FORMS.map((form) => (
                  <MenuItem key={form.id} value={form.id}>
                    {form.name}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="caption" color="text.secondary">
                Pour créer un nouveau formulaire, rendez-vous dans la{' '}
                <MuiLink component={Link} href="/dashboard/gestionnaire?section=formulaires">
                  section formulaires de la page stockage
                </MuiLink>
                .
              </Typography>
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
        <MuiAlert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
