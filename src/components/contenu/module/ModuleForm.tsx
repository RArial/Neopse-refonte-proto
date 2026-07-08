'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { AddedModule, CatalogModule, ModuleStatus, NavTreeNode } from '@/types/content';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import { ROOT_THEMATIQUE_ID } from '@/lib/navTree';
import { RichTextField } from '@/components/ui/RichTextField';

const moduleFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Le nom du module doit contenir au moins 2 caractères.')
    .max(80, 'Le nom du module ne doit pas dépasser 80 caractères.'),
  thematiqueId: z.string().min(1, 'Choisissez un onglet thématique.'),
  parentPageId: z.string(),
  headerEnabled: z.boolean(),
  headerTitle: z.string().max(80, 'Le titre affiché ne doit pas dépasser 80 caractères.'),
  headerDescription: z.string().max(2000, 'La description est trop longue.'),
  metaDescription: z.string().max(160, 'La description du site ne doit pas dépasser 160 caractères.'),
  metaKeywords: z.string().max(200, 'Les mots clés ne doivent pas dépasser 200 caractères.'),
});

type ModuleFormValues = z.infer<typeof moduleFormSchema>;
type FormErrors = Partial<Record<keyof ModuleFormValues, string>>;

// Ordre d'apparition des champs dans le formulaire, pour retrouver le premier en erreur après validation.
const FIELD_ORDER: (keyof ModuleFormValues)[] = [
  'displayName',
  'thematiqueId',
  'headerTitle',
  'headerDescription',
  'metaDescription',
  'metaKeywords',
];
// Champs situés dans un accordéon replié par défaut : une erreur dessus doit d'abord déplier la section concernée.
const HEADER_ACCORDION_FIELDS = new Set<keyof ModuleFormValues>(['headerTitle', 'headerDescription']);
const SEO_ACCORDION_FIELDS = new Set<keyof ModuleFormValues>(['metaDescription', 'metaKeywords']);

interface ModuleFormCreateProps {
  mode: 'create';
  catalogModule: CatalogModule;
}

interface ModuleFormEditProps {
  mode: 'edit';
  existingModule: AddedModule;
}

type ModuleFormProps = ModuleFormCreateProps | ModuleFormEditProps;

function buildInitialValues(props: ModuleFormProps, thematiques: NavTreeNode[]): ModuleFormValues {
  if (props.mode === 'edit') {
    const { existingModule } = props;
    return {
      displayName: existingModule.label,
      thematiqueId: existingModule.thematiqueId,
      parentPageId: existingModule.parentPageId,
      headerEnabled: existingModule.headerEnabled,
      headerTitle: existingModule.headerTitle,
      headerDescription: existingModule.headerDescription,
      metaDescription: existingModule.metaDescription,
      metaKeywords: existingModule.metaKeywords,
    };
  }
  return {
    displayName: props.catalogModule.label,
    thematiqueId: thematiques[0]?.id ?? '',
    parentPageId: '',
    headerEnabled: true,
    headerTitle: '',
    headerDescription: '',
    metaDescription: '',
    metaKeywords: '',
  };
}

export function ModuleForm(props: ModuleFormProps) {
  const router = useRouter();
  const { navTree, addModule, updateModule } = useContenuStore();
  const thematiques: NavTreeNode[] = useMemo(() => navTree.filter((node) => node.kind === 'tab'), [navTree]);
  const [values, setValues] = useState<ModuleFormValues>(() => buildInitialValues(props, thematiques));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [headerAccordionOpen, setHeaderAccordionOpen] = useState(false);
  const [seoAccordionOpen, setSeoAccordionOpen] = useState(false);

  const originalLabel = props.mode === 'edit' ? props.existingModule.typeLabel : props.catalogModule.label;

  const parentPages = useMemo(
    () => thematiques.find((tab) => tab.id === values.thematiqueId)?.children ?? [],
    [thematiques, values.thematiqueId],
  );

  function setField<K extends keyof ModuleFormValues>(key: K, value: ModuleFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleThematiqueChange(thematiqueId: string) {
    setValues((prev) => ({ ...prev, thematiqueId, parentPageId: '' }));
    if (errors.thematiqueId) setErrors((prev) => ({ ...prev, thematiqueId: undefined }));
  }

  // Si le premier champ en erreur est masqué dans un accordéon replié, le déplier avant d'y faire défiler la page —
  // sans quoi l'utilisateur ne peut pas voir pourquoi la publication échoue.
  function revealAndScrollToError(fieldErrors: FormErrors) {
    const firstKey = FIELD_ORDER.find((key) => fieldErrors[key]);
    if (!firstKey) return;

    const needsAccordion = HEADER_ACCORDION_FIELDS.has(firstKey) || SEO_ACCORDION_FIELDS.has(firstKey);
    if (HEADER_ACCORDION_FIELDS.has(firstKey)) setHeaderAccordionOpen(true);
    if (SEO_ACCORDION_FIELDS.has(firstKey)) setSeoAccordionOpen(true);

    window.setTimeout(
      () => {
        document.getElementById(`module-field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      // Laisse le temps à la transition d'ouverture de l'accordéon (225ms) de se terminer avant de calculer la position de scroll.
      needsAccordion ? 300 : 0,
    );
  }

  function validate() {
    const result = moduleFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ModuleFormValues;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      revealAndScrollToError(fieldErrors);
      return null;
    }
    return result.data;
  }

  function commitCreate(status: ModuleStatus) {
    if (props.mode !== 'create') return;
    const data = validate();
    if (!data) return;

    addModule({
      catalogModuleId: props.catalogModule.id,
      label: data.displayName,
      typeLabel: props.catalogModule.label,
      kind: 'module',
      thematiqueId: data.thematiqueId,
      parentPageId: data.parentPageId,
      enabled: true,
      status,
      headerEnabled: data.headerEnabled,
      headerTitle: data.headerTitle,
      headerDescription: data.headerDescription,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords,
    });

    setSubmitting(true);
    setSuccessMessage(
      status === 'draft'
        ? `Module « ${data.displayName} » enregistré comme brouillon.`
        : `Module « ${data.displayName} » publié avec succès.`,
    );
    window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
  }

  function commitEdit(status?: ModuleStatus) {
    if (props.mode !== 'edit') return;
    const data = validate();
    if (!data) return;

    updateModule(props.existingModule.id, {
      label: data.displayName,
      thematiqueId: data.thematiqueId,
      parentPageId: data.parentPageId,
      headerEnabled: data.headerEnabled,
      headerTitle: data.headerTitle,
      headerDescription: data.headerDescription,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords,
      ...(status ? { status } : {}),
    });

    setSubmitting(true);
    setSuccessMessage(
      status === 'draft'
        ? `Module « ${data.displayName} » enregistré comme brouillon.`
        : status === 'published'
          ? `Module « ${data.displayName} » publié avec succès.`
          : `Modifications de « ${data.displayName} » enregistrées.`,
    );
    window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
  }

  const editingDraft = props.mode === 'edit' && props.existingModule.status === 'draft';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (props.mode === 'edit') {
      commitEdit(editingDraft ? 'published' : undefined);
    } else {
      commitCreate('published');
    }
  }

  return (
    <Paper component="form" noValidate onSubmit={handleSubmit} variant="outlined" sx={{ borderRadius: 3 }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Informations générales concernant le module
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            label="Nom original du module"
            value={originalLabel}
            disabled
            fullWidth
            helperText="Nom de référence défini par Neopse, non modifiable."
          />

          <TextField
            id="module-field-displayName"
            label="Nom du module"
            value={values.displayName}
            onChange={(event) => setField('displayName', event.target.value)}
            required
            fullWidth
            error={Boolean(errors.displayName)}
            helperText={errors.displayName ?? 'Ce nom sera affiché sur le site et dans le menu.'}
            slotProps={{ formHelperText: { role: errors.displayName ? 'alert' : undefined } }}
          />

          <TextField
            id="module-field-thematiqueId"
            select
            label="Thématique"
            value={values.thematiqueId}
            onChange={(event) => handleThematiqueChange(event.target.value)}
            required
            fullWidth
            error={Boolean(errors.thematiqueId)}
            helperText={errors.thematiqueId ?? "Onglet du site dans lequel le module sera rangé."}
            slotProps={{ formHelperText: { role: errors.thematiqueId ? 'alert' : undefined } }}
          >
            {/* Un élément déplacé par glisser-déposer jusqu'à la racine du menu (hors de tout onglet) garde cette
             * position tant qu'elle n'est pas explicitement changée ici. */}
            {values.thematiqueId === ROOT_THEMATIQUE_ID && (
              <MenuItem value={ROOT_THEMATIQUE_ID}>Racine du menu (hors onglet)</MenuItem>
            )}
            {thematiques.map((tab) => (
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
            disabled={parentPages.length === 0}
            helperText={
              parentPages.length === 0
                ? 'Aucune page existante dans cette thématique.'
                : "Optionnel — la page parente détermine où le module apparaît dans l'arborescence."
            }
          >
            <MenuItem value="">Aucune sélection</MenuItem>
            {parentPages.map((page) => (
              <MenuItem key={page.id} value={page.id}>
                {page.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>

      <Accordion
        expanded={headerAccordionOpen}
        onChange={(_, isExpanded) => setHeaderAccordionOpen(isExpanded)}
        disableGutters
        elevation={0}
        square
        sx={{ '&:before': { display: 'none' }, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="module-header-content" id="module-header-header">
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              En-tête de la page
            </Typography>
            <Tooltip title="Personnalisez le titre et la description affichés en haut de la page du module.">
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Tooltip>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 3, pb: 3 }}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Afficher l&apos;en-tête de la page
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
                    input: { 'aria-label': `Afficher l'en-tête de la page : ${values.headerEnabled ? 'affiché' : 'masqué'}` },
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
              id="module-field-headerTitle"
              label="Titre affiché en haut de page"
              value={values.headerTitle}
              onChange={(event) => setField('headerTitle', event.target.value)}
              fullWidth
              error={Boolean(errors.headerTitle)}
              helperText={errors.headerTitle ?? `Laissez vide pour utiliser « ${values.displayName || originalLabel} ».`}
              slotProps={{ formHelperText: { role: errors.headerTitle ? 'alert' : undefined } }}
            />

            <Box id="module-field-headerDescription">
              <RichTextField
                label="Description"
                value={values.headerDescription}
                onChange={(html) => setField('headerDescription', html)}
                placeholder="Décrivez le module affiché en en-tête de page…"
                error={Boolean(errors.headerDescription)}
                helperText={errors.headerDescription}
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={seoAccordionOpen}
        onChange={(_, isExpanded) => setSeoAccordionOpen(isExpanded)}
        disableGutters
        elevation={0}
        square
        sx={{ '&:before': { display: 'none' }, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="module-seo-content" id="module-seo-header">
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Informations concernant le référencement
            </Typography>
            <Tooltip title="Ces informations améliorent la visibilité du module dans les moteurs de recherche.">
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Tooltip>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 3, pb: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              id="module-field-metaDescription"
              label="Description du site (META)"
              value={values.metaDescription}
              onChange={(event) => setField('metaDescription', event.target.value)}
              fullWidth
              multiline
              minRows={3}
              error={Boolean(errors.metaDescription)}
              helperText={errors.metaDescription ?? `${values.metaDescription.length}/160 caractères`}
              slotProps={{ formHelperText: { role: errors.metaDescription ? 'alert' : undefined } }}
            />
            <TextField
              id="module-field-metaKeywords"
              label="Mots clés (META)"
              value={values.metaKeywords}
              onChange={(event) => setField('metaKeywords', event.target.value)}
              fullWidth
              error={Boolean(errors.metaKeywords)}
              helperText={errors.metaKeywords ?? 'Séparez les mots clés par une virgule.'}
              slotProps={{ formHelperText: { role: errors.metaKeywords ? 'alert' : undefined } }}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Divider />

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', px: 3, py: 2.5 }}>
        <Button component={Link} href="/dashboard/contenu" variant="outlined" color="inherit" disabled={submitting}>
          Annuler
        </Button>
        {(props.mode === 'create' || editingDraft) && (
          <Button
            type="button"
            variant="outlined"
            onClick={() => (props.mode === 'create' ? commitCreate('draft') : commitEdit('draft'))}
            disabled={submitting}
          >
            Enregistrer comme brouillon
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={submitting}>
          {props.mode === 'edit' ? (editingDraft ? 'Publier' : 'Enregistrer les modifications') : 'Publier'}
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
