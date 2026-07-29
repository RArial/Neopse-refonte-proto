'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import { DiaporamaField } from '@/components/pages-modules/DiaporamaField';
import { SommaireLinkedSection } from '@/components/pages-modules/FormAccordionSection';
import { FormSommaire, type SommaireSection } from '@/components/pages-modules/FormSommaire';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import { Icons } from '@/components/ui/Icons';
import { useSectionScrollSpy } from '@/hooks/useSectionScrollSpy';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { readCopyNameParam } from '@/lib/duplicateParams';
import {
  DEFAULT_RESERVED_CONTENT_FORM,
  RESERVED_GROUPS_SEED,
  type ReservedContent,
  type ReservedContentFormData,
} from '@/types/espaceReserve';

const ESSENTIAL_SECTIONS: SommaireSection[] = [
  { id: 'informations-generales', icon: 'FileText', navLabel: 'Informations générales' },
  { id: 'vignette', icon: 'Image', navLabel: 'Vignette' },
];

const COMPLEMENTARY_SECTIONS: SommaireSection[] = [
  { id: 'diaporama', icon: 'Layers', navLabel: "Diaporama d'images" },
  { id: 'video', icon: 'Play', navLabel: 'Vidéo' },
  { id: 'pieces-jointes', icon: 'Paperclip', navLabel: 'Pièces jointes' },
  { id: 'code-html', icon: 'Code', navLabel: 'Code HTML' },
];

const ALL_SECTION_IDS = [...ESSENTIAL_SECTIONS, ...COMPLEMENTARY_SECTIONS].map((section) => section.id);

function buildInitialData(initialContent?: ReservedContent): ReservedContentFormData {
  if (initialContent) {
    return {
      ...DEFAULT_RESERVED_CONTENT_FORM,
      name: initialContent.name,
      active: initialContent.active,
      publicationDate: initialContent.publicationDate,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_RESERVED_CONTENT_FORM, name: copyName } : DEFAULT_RESERVED_CONTENT_FORM;
}

interface ReservedContentFormProps {
  mode: 'create' | 'edit';
  initialContent?: ReservedContent;
}

export function ReservedContentForm({ mode, initialContent }: ReservedContentFormProps) {
  const router = useRouter();
  const [data, setData] = useState<ReservedContentFormData>(() => buildInitialData(initialContent));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const { expanded, activeSectionId, registerSection, toggleSection, handleNavClick } = useSectionScrollSpy(ALL_SECTION_IDS, {
    defaultExpandedIds: ESSENTIAL_SECTIONS.map((section) => section.id),
  });
  const { headerRef, railSx } = useStickyFormLayout();

  function handleChange(patch: Partial<ReservedContentFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function toggleGroup(groupId: string) {
    const isSelected = data.allowedGroupIds.includes(groupId);
    handleChange({
      allowedGroupIds: isSelected ? data.allowedGroupIds.filter((id) => id !== groupId) : [...data.allowedGroupIds, groupId],
    });
  }

  function handleSubmit() {
    if (!data.name.trim()) {
      setNameError(true);
      handleNavClick('informations-generales');
      return;
    }
    setNameError(false);
    setSuccessMessage(mode === 'create' ? `« ${data.name} » a été ajouté.` : `« ${data.name} » a été enregistré.`);
    window.setTimeout(() => router.push('/dashboard/espace-reserve'), 1200);
  }

  const pageTitle = mode === 'create' ? 'Nouveau contenu réservé' : data.name || 'Modifier le contenu réservé';

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
            href="/dashboard/espace-reserve"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 0.5, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour à l&apos;espace réservé
          </Button>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            {pageTitle}
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={handleSubmit}>
          {mode === 'create' ? 'Ajouter' : 'Enregistrer'}
        </Button>
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
            <Stack spacing={2}>
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
                label="Date de désactivation"
                type="date"
                value={data.deactivationDate}
                onChange={(event) => handleChange({ deactivationDate: event.target.value })}
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">Statut</Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2" color={data.active ? 'text.secondary' : 'text.primary'}>
                    Inactif
                  </Typography>
                  <Switch
                    checked={data.active}
                    onChange={(event) => handleChange({ active: event.target.checked })}
                    slotProps={{ input: { 'aria-label': 'Statut du contenu' } }}
                  />
                  <Typography variant="body2" color={data.active ? 'text.primary' : 'text.secondary'}>
                    Actif
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        <Stack spacing={2}>
          <SommaireLinkedSection
            id="informations-generales"
            icon="FileText"
            title="Informations générales concernant le contenu"
            expanded={Boolean(expanded['informations-generales'])}
            onToggle={(value) => toggleSection('informations-generales', value)}
            registerSection={registerSection}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Nom du contenu"
                value={data.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                fullWidth
                required
                error={nameError}
              />
              <TextField
                label="Chapô"
                value={data.chapo}
                onChange={(e) => handleChange({ chapo: e.target.value })}
                multiline
                minRows={2}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <Tooltip title="Court texte introductif affiché avant le contenu détaillé.">
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 1 }}>
                  <FormLabel component="legend" sx={{ fontSize: 13 }}>
                    Groupes autorisés
                  </FormLabel>
                  <Tooltip title="Seuls les usagers identifiés appartenant à l'un de ces groupes pourront consulter ce contenu.">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
                <FormGroup>
                  {RESERVED_GROUPS_SEED.map((group) => (
                    <FormControlLabel
                      key={group.id}
                      control={<Checkbox checked={data.allowedGroupIds.includes(group.id)} onChange={() => toggleGroup(group.id)} />}
                      label={group.name}
                    />
                  ))}
                </FormGroup>
              </Box>

              <RichTextField label="Texte" value={data.text} onChange={(text) => handleChange({ text })} placeholder="Rédigez le contenu réservé…" />
            </Stack>
          </SommaireLinkedSection>

          {nameError && (
            <MuiAlert severity="error" role="alert" sx={{ mt: -1 }}>
              Le nom du contenu est obligatoire.
            </MuiAlert>
          )}

          <SommaireLinkedSection
            id="vignette"
            icon="Image"
            title="Vignette du contenu"
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
              onNotify={setSuccessMessage}
            />
          </SommaireLinkedSection>

          <SommaireLinkedSection
            id="video"
            icon="Play"
            title="Vidéo"
            expanded={Boolean(expanded.video)}
            onToggle={(value) => toggleSection('video', value)}
            registerSection={registerSection}
          >
            <TextField
              label="Adresse URL"
              placeholder="https://"
              type="url"
              value={data.videoUrl}
              onChange={(e) => handleChange({ videoUrl: e.target.value })}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Lien YouTube, Vimeo ou Dailymotion de la vidéo à intégrer.">
                        <InfoOutlinedIcon fontSize="small" color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
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
    </Box>
  );
}
