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
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { PhoneField } from '@/components/pages-modules/PhoneField';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import { CategoriesDialog } from '@/components/pages-modules/CategoriesDialog';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { readCopyNameParam } from '@/lib/duplicateParams';
import { FORMS } from '@/types/formulaires';
import { CONTACTS_MOCK } from '@/types/pagesModules';
import {
  DEFAULT_MEMBER_FORM,
  MEMBER_CATEGORIES_SEED,
  type Member,
  type MemberCategory,
  type MemberFormData,
  type MemberStatus,
} from '@/types/trombinoscope';

const STATUS_CHIP_META: Record<MemberStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publié', color: 'success' },
  archived: { label: 'Archivé', color: 'default' },
};

const ESSENTIAL_SECTIONS: SommaireSection[] = [{ id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' }];
const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'contact-formulaire', icon: 'Form', navLabel: 'Contact par formulaire' },
  { id: 'contact-telephone', icon: 'Phone', navLabel: 'Contact par téléphone' },
  { id: 'infos-complementaires', icon: 'IdCard', navLabel: 'Informations complémentaires' },
  { id: 'code-html', icon: 'Code', navLabel: 'Code HTML' },
];
const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialMember?: Member): MemberFormData {
  if (initialMember) {
    return { ...DEFAULT_MEMBER_FORM, lastName: initialMember.lastName, firstName: initialMember.firstName, status: initialMember.status };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_MEMBER_FORM, lastName: copyName } : DEFAULT_MEMBER_FORM;
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface MemberFormProps {
  mode: 'create' | 'edit';
  initialMember?: Member;
}

export function MemberForm({ mode, initialMember }: MemberFormProps) {
  const router = useRouter();
  const [data, setData] = useState<MemberFormData>(() => buildInitialData(initialMember));
  const [categories, setCategories] = useState<MemberCategory[]>(MEMBER_CATEGORIES_SEED);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  function handleChange(patch: Partial<MemberFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function toggleContact(contactId: string) {
    setData((prev) => {
      const isSelected = prev.contactIds.includes(contactId);
      const contactIds = isSelected ? prev.contactIds.filter((id) => id !== contactId) : [...prev.contactIds, contactId];
      return { ...prev, contactIds, formId: contactIds.length === 0 ? '' : prev.formId };
    });
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

  function commit(status: MemberStatus) {
    if (!data.lastName.trim() || !data.firstName.trim()) {
      setNameError(true);
      handleNavClick('informations-generales');
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.firstName} ${data.lastName} » a été enregistré(e).`);
    window.setTimeout(() => router.push('/dashboard/trombinoscope'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const pageTitle = mode === 'create' ? 'Nouveau membre' : fullName || 'Modifier le membre';
  const hasContact = data.contactIds.length > 0;

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
            href="/dashboard/trombinoscope"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour au trombinoscope
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
            Enregistrer comme brouillon
          </Button>
          <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={() => commit('published')}>
            Enregistrer
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
          {nameError && (
            <MuiAlert severity="error" role="alert">
              Le nom et le prénom du membre sont obligatoires.
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField label="Nom" value={data.lastName} onChange={(e) => handleChange({ lastName: e.target.value })} fullWidth required error={nameError} />
                <TextField label="Prénom" value={data.firstName} onChange={(e) => handleChange({ firstName: e.target.value })} fullWidth required error={nameError} />
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
                <TextField
                  select
                  label="Catégorie"
                  value={data.categoryId}
                  onChange={(e) => handleChange({ categoryId: e.target.value })}
                  fullWidth
                >
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

              <TextField label="Sous-catégorie" value={data.subCategory} onChange={(e) => handleChange({ subCategory: e.target.value })} fullWidth />

              <RichTextField
                label="Description"
                value={data.description}
                onChange={(description) => handleChange({ description })}
                placeholder="Présentez ce membre…"
              />

              <VignetteUploader value={data.photoUrl} onChange={(photoUrl) => handleChange({ photoUrl })} itemLabel="photo" itemGender="feminine" />
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
            id="contact-formulaire"
            icon="Form"
            title="Contact par formulaire"
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

              <TextField
                select
                label="Formulaire"
                value={data.formId}
                onChange={(e) => handleChange({ formId: e.target.value })}
                fullWidth
                disabled={!hasContact}
                helperText={!hasContact ? 'Cochez au moins un contact ci-dessus pour choisir un formulaire.' : undefined}
              >
                <MenuItem value="">Aucune sélection</MenuItem>
                {FORMS.map((form) => (
                  <MenuItem key={form.id} value={form.id}>
                    {form.name}
                  </MenuItem>
                ))}
              </TextField>

              <Typography variant="caption" color="text.secondary">
                Pour créer un nouveau formulaire, rendez-vous dans la{' '}
                <MuiLink component={Link} href="/dashboard/formulaires">
                  page Formulaires
                </MuiLink>
                .
              </Typography>
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="contact-telephone"
            icon="Phone"
            title="Contact par téléphone"
            expanded={Boolean(expanded['contact-telephone'])}
            onToggle={(value) => toggleSection('contact-telephone', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <PhoneField
                id="member-field-phone1"
                label="Téléphone 1"
                country={data.phone1Country}
                number={data.phone1}
                onCountryChange={(phone1Country) => handleChange({ phone1Country })}
                onNumberChange={(phone1) => handleChange({ phone1 })}
              />
              <PhoneField
                id="member-field-phone2"
                label="Téléphone 2"
                country={data.phone2Country}
                number={data.phone2}
                onCountryChange={(phone2Country) => handleChange({ phone2Country })}
                onNumberChange={(phone2) => handleChange({ phone2 })}
              />
              <PhoneField
                id="member-field-phone3"
                label="Téléphone 3"
                country={data.phone3Country}
                number={data.phone3}
                onCountryChange={(phone3Country) => handleChange({ phone3Country })}
                onNumberChange={(phone3) => handleChange({ phone3 })}
              />
            </Stack>
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="infos-complementaires"
            icon="IdCard"
            title="Informations complémentaires de contact"
            expanded={Boolean(expanded['infos-complementaires'])}
            onToggle={(value) => toggleSection('infos-complementaires', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField label="Titre" value={data.infoTitle} onChange={(e) => handleChange({ infoTitle: e.target.value })} fullWidth />
              <RichTextField label="Texte" value={data.infoText} onChange={(infoText) => handleChange({ infoText })} placeholder="Informations complémentaires…" />
            </Stack>
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
        inUseMessage="Catégorie utilisée par ce membre"
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
