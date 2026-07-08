'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { ModuleStatus } from '@/types/content';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import { RichTextField } from '@/components/ui/RichTextField';

const rubriqueFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Le nom de la rubrique doit contenir au moins 2 caractères.')
    .max(80, 'Le nom de la rubrique ne doit pas dépasser 80 caractères.'),
  thematiqueId: z.string().min(1, 'Choisissez un onglet thématique.'),
  parentPageId: z.string(),
  headerEnabled: z.boolean(),
  headerTitle: z.string().max(80, 'Le titre affiché ne doit pas dépasser 80 caractères.'),
  headerDescription: z.string().max(2000, 'La description est trop longue.'),
  menuVisible: z.boolean(),
});

type RubriqueFormValues = z.infer<typeof rubriqueFormSchema>;
type FormErrors = Partial<Record<keyof RubriqueFormValues, string>>;

// Ordre d'apparition des champs dans le formulaire, pour retrouver le premier en erreur après validation.
const FIELD_ORDER: (keyof RubriqueFormValues)[] = ['displayName', 'thematiqueId', 'headerTitle', 'headerDescription'];

export function RubriqueForm() {
  const router = useRouter();
  const { navTree, addModule } = useContenuStore();
  const tabs = useMemo(() => navTree.filter((node) => node.kind === 'tab'), [navTree]);
  const [values, setValues] = useState<RubriqueFormValues>(() => ({
    displayName: '',
    thematiqueId: tabs[0]?.id ?? '',
    parentPageId: '',
    headerEnabled: true,
    headerTitle: '',
    headerDescription: '',
    menuVisible: true,
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Une rubrique est forcément rattachée à un onglet ; la page parente ne peut donc venir que des pages
  // de premier niveau de cet onglet (une rubrique peut en revanche être imbriquée à n'importe quel niveau).
  const parentPageOptions = useMemo(() => {
    const tab = tabs.find((node) => node.id === values.thematiqueId);
    return (tab?.children ?? []).filter((child) => child.kind === 'module');
  }, [tabs, values.thematiqueId]);

  function setField<K extends keyof RubriqueFormValues>(key: K, value: RubriqueFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleThematiqueChange(thematiqueId: string) {
    setValues((prev) => ({ ...prev, thematiqueId, parentPageId: '' }));
  }

  // Fait défiler la page jusqu'au premier champ obligatoire en erreur, au cas où il ne serait pas déjà visible à l'écran.
  function scrollToFirstError(fieldErrors: FormErrors) {
    const firstKey = FIELD_ORDER.find((key) => fieldErrors[key]);
    if (!firstKey) return;
    document.getElementById(`rubrique-field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validate() {
    const result = rubriqueFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RubriqueFormValues;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      scrollToFirstError(fieldErrors);
      return null;
    }
    return result.data;
  }

  function commit(status: ModuleStatus) {
    const data = validate();
    if (!data) return;

    addModule({
      catalogModuleId: '',
      label: data.displayName,
      typeLabel: 'Rubrique',
      kind: 'module',
      thematiqueId: data.thematiqueId,
      parentPageId: data.parentPageId,
      enabled: data.menuVisible,
      status,
      headerEnabled: data.headerEnabled,
      headerTitle: data.headerTitle,
      headerDescription: data.headerDescription,
      metaDescription: '',
      metaKeywords: '',
    });

    setSubmitting(true);
    setSuccessMessage(
      status === 'draft' ? `Rubrique « ${data.displayName} » enregistrée comme brouillon.` : `Rubrique « ${data.displayName} » ajoutée.`,
    );
    window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commit('published');
  }

  return (
    <Paper component="form" noValidate onSubmit={handleSubmit} variant="outlined" sx={{ borderRadius: 3 }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Informations générales concernant la rubrique
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            id="rubrique-field-displayName"
            label="Nom de la rubrique"
            value={values.displayName}
            onChange={(event) => setField('displayName', event.target.value)}
            required
            fullWidth
            error={Boolean(errors.displayName)}
            helperText={errors.displayName ?? 'Ce nom sera affiché sur le site et dans le menu.'}
            slotProps={{ formHelperText: { role: errors.displayName ? 'alert' : undefined } }}
          />

          <TextField
            id="rubrique-field-thematiqueId"
            select
            label="Onglet thématique"
            value={values.thematiqueId}
            onChange={(event) => handleThematiqueChange(event.target.value)}
            required
            fullWidth
            error={Boolean(errors.thematiqueId)}
            helperText={errors.thematiqueId ?? 'Onglet dans lequel la rubrique sera rangée.'}
            slotProps={{ formHelperText: { role: errors.thematiqueId ? 'alert' : undefined } }}
          >
            {tabs.map((tab) => (
              <MenuItem key={tab.id} value={tab.id}>
                {tab.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Page parente"
            value={values.parentPageId}
            onChange={(event) => setField('parentPageId', event.target.value)}
            fullWidth
            disabled={parentPageOptions.length === 0}
            helperText={
              parentPageOptions.length === 0
                ? 'Aucune page existante dans cette sélection.'
                : "Facultatif — la page parente détermine où la rubrique apparaît dans l'arborescence."
            }
          >
            <MenuItem value="">Aucune sélection</MenuItem>
            {parentPageOptions.map((page) => (
              <MenuItem key={page.id} value={page.id}>
                {page.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          En-tête de la page
        </Typography>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Visibilité de l&apos;en-tête
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography
                variant="body2"
                color={values.headerEnabled ? 'text.secondary' : 'text.primary'}
                sx={{ fontWeight: values.headerEnabled ? 400 : 600 }}
              >
                Masqué
              </Typography>
              <Switch
                checked={values.headerEnabled}
                onChange={(event) => setField('headerEnabled', event.target.checked)}
                slotProps={{
                  input: { 'aria-label': `Visibilité de l'en-tête : ${values.headerEnabled ? 'affiché' : 'masqué'}` },
                }}
              />
              <Typography
                variant="body2"
                color={values.headerEnabled ? 'text.primary' : 'text.secondary'}
                sx={{ fontWeight: values.headerEnabled ? 600 : 400 }}
              >
                Affiché
              </Typography>
            </Stack>
          </Stack>

          <TextField
            id="rubrique-field-headerTitle"
            label="Titre de l'en-tête"
            value={values.headerTitle}
            onChange={(event) => setField('headerTitle', event.target.value)}
            fullWidth
            error={Boolean(errors.headerTitle)}
            helperText={errors.headerTitle ?? `Laissez vide pour utiliser « ${values.displayName || 'Rubrique'} ».`}
            slotProps={{ formHelperText: { role: errors.headerTitle ? 'alert' : undefined } }}
          />

          <Box id="rubrique-field-headerDescription">
            <RichTextField
              label="Texte de l'en-tête"
              value={values.headerDescription}
              onChange={(html) => setField('headerDescription', html)}
              placeholder="Décrivez la rubrique affichée en en-tête de page…"
              error={Boolean(errors.headerDescription)}
              helperText={errors.headerDescription}
            />
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ px: 3, py: 2.5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Visibilité dans le menu
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography
              variant="body2"
              color={values.menuVisible ? 'text.secondary' : 'text.primary'}
              sx={{ fontWeight: values.menuVisible ? 400 : 600 }}
            >
              Masqué
            </Typography>
            <Switch
              checked={values.menuVisible}
              onChange={(event) => setField('menuVisible', event.target.checked)}
              slotProps={{
                input: { 'aria-label': `Visibilité dans le menu : ${values.menuVisible ? 'affiché' : 'masqué'}` },
              }}
            />
            <Typography
              variant="body2"
              color={values.menuVisible ? 'text.primary' : 'text.secondary'}
              sx={{ fontWeight: values.menuVisible ? 600 : 400 }}
            >
              Affiché
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Divider />

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', px: 3, py: 2.5 }}>
        <Button component={Link} href="/dashboard/contenu" variant="outlined" color="inherit" disabled={submitting}>
          Annuler
        </Button>
        <Button type="button" variant="outlined" onClick={() => commit('draft')} disabled={submitting}>
          Enregistrer comme brouillon
        </Button>
        <Button type="submit" variant="contained" disabled={submitting}>
          Ajouter
        </Button>
      </Stack>

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
    </Paper>
  );
}
