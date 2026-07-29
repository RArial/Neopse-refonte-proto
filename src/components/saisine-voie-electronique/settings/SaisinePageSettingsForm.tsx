'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { CategoriesDialog } from '@/components/pages-modules/CategoriesDialog';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { VignetteUploader } from '@/components/pages-modules/VignetteUploader';
import { RichTextField } from '@/components/ui/RichTextField';
import {
  DEFAULT_SAISINE_PAGE_FORM,
  SAISINE_CATEGORIES_SEED,
  type SaisineCategory,
  type SaisinePageFormData,
} from '@/types/saisineVoieElectronique';

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function SaisinePageSettingsForm() {
  const router = useRouter();
  const [data, setData] = useState<SaisinePageFormData>(DEFAULT_SAISINE_PAGE_FORM);
  const [categories, setCategories] = useState<SaisineCategory[]>(SAISINE_CATEGORIES_SEED);
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(DEFAULT_SAISINE_PAGE_FORM) || JSON.stringify(categories) !== JSON.stringify(SAISINE_CATEGORIES_SEED),
    [data, categories],
  );

  function handleChange(patch: Partial<SaisinePageFormData>) {
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
  }

  function handleSubmit() {
    setSuccessMessage('Les réglages de la page Saisine par voie électronique ont bien été enregistrés.');
    window.setTimeout(() => router.push('/dashboard/saisine-voie-electronique'), 1400);
  }

  return (
    <ModuleFormShell
      title='Gérer la page "Saisine par voie électronique"'
      backHref="/dashboard/saisine-voie-electronique"
      backLabel="Retour à la saisine par voie électronique"
      submitLabel="Enregistrer"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations générales concernant l'accès à la Saisine par Voie Electronique">
        <Stack spacing={2.5}>
          <RichTextField
            label="Texte"
            value={data.introText}
            onChange={(introText) => handleChange({ introText })}
            placeholder="Présentez le module de saisine par voie électronique aux usagers…"
          />
          <TextField
            label="Nom du bouton d'accès"
            value={data.accessButtonLabel}
            onChange={(event) => handleChange({ accessButtonLabel: event.target.value })}
            fullWidth
          />
        </Stack>
      </FormSection>

      <FormSection title="Informations concernant la gestion des demandes">
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Catégories
              </Typography>
              <Tooltip title="Catégories proposées aux usagers lors du dépôt d'une saisine.">
                <InfoOutlinedIcon fontSize="small" color="action" />
              </Tooltip>
            </Stack>
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              startIcon={<SettingsOutlinedIcon fontSize="small" />}
              onClick={() => setCategoriesDialogOpen(true)}
            >
              Gérer les catégories
            </Button>
          </Stack>

          <TextField
            label="Texte d'introduction du guide explicatif"
            value={data.guideIntroText}
            onChange={(event) => handleChange({ guideIntroText: event.target.value })}
            multiline
            minRows={2}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Tooltip title="Court texte affiché avant le guide explicatif détaillé.">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
          />

          <RichTextField
            label="Texte du guide explicatif"
            value={data.guideText}
            onChange={(guideText) => handleChange({ guideText })}
            placeholder="Rédigez le guide explicatif du module de téléservice…"
            minHeight={220}
          />
        </Stack>
      </FormSection>

      <FormSection
        title='Widget "Démarches administratives"'
        collapsible
        infoTooltip="Widget affichant un accès rapide aux démarches administratives depuis la page d'accueil."
      >
        <Stack spacing={2.5}>
          <VignetteUploader
            value={data.widgetThumbnailUrl}
            onChange={(widgetThumbnailUrl) => handleChange({ widgetThumbnailUrl })}
            itemLabel="vignette"
          />
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Affichage du bouton dans le widget</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography variant="body2" color={data.widgetButtonActive ? 'text.secondary' : 'text.primary'}>
                Inactif
              </Typography>
              <Switch
                checked={data.widgetButtonActive}
                onChange={(event) => handleChange({ widgetButtonActive: event.target.checked })}
                slotProps={{ input: { 'aria-label': 'Affichage du bouton dans le widget' } }}
              />
              <Typography variant="body2" color={data.widgetButtonActive ? 'text.primary' : 'text.secondary'}>
                Actif
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </FormSection>

      <CategoriesDialog
        open={categoriesDialogOpen}
        onClose={() => setCategoriesDialogOpen(false)}
        categories={categories}
        selectedCategoryId=""
        onAddCategory={addCategory}
        onRenameCategory={renameCategory}
        onDeleteCategory={deleteCategory}
      />
    </ModuleFormShell>
  );
}
