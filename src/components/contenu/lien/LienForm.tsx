'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import type { AddedModule, LinkType } from '@/types/content';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import { ROOT_THEMATIQUE_ID } from '@/lib/navTree';

const linkFormSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, 'Le nom du raccourci doit contenir au moins 2 caractères.')
      .max(80, 'Le nom du raccourci ne doit pas dépasser 80 caractères.'),
    linkType: z.enum(['internal', 'external']),
    externalUrl: z.string().trim(),
    thematiqueId: z.string(),
    internalTargetId: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.linkType === 'external') {
      if (!data.externalUrl) {
        ctx.addIssue({ code: 'custom', path: ['externalUrl'], message: "Indiquez l'URL du raccourci." });
        return;
      }
      try {
        new URL(data.externalUrl);
      } catch {
        ctx.addIssue({ code: 'custom', path: ['externalUrl'], message: 'Indiquez une URL valide (ex. https://exemple.fr).' });
      }
    } else if (!data.internalTargetId) {
      ctx.addIssue({ code: 'custom', path: ['internalTargetId'], message: 'Choisissez une page de destination.' });
    }
  });

type LienFormValues = z.infer<typeof linkFormSchema>;
type FormErrors = Partial<Record<keyof LienFormValues, string>>;

interface LienFormCreateProps {
  mode: 'create';
}

interface LienFormEditProps {
  mode: 'edit';
  existingLink: AddedModule;
}

type LienFormProps = LienFormCreateProps | LienFormEditProps;

function buildInitialValues(props: LienFormProps, modules: AddedModule[]): LienFormValues {
  if (props.mode === 'create') {
    return { displayName: '', linkType: 'external', externalUrl: '', thematiqueId: ROOT_THEMATIQUE_ID, internalTargetId: '' };
  }
  const { existingLink } = props;
  const internalTargetId = existingLink.internalTargetId ?? '';
  const targetModule = modules.find((mod) => mod.id === internalTargetId);
  return {
    displayName: existingLink.label,
    linkType: existingLink.linkType ?? 'external',
    externalUrl: existingLink.externalUrl ?? '',
    thematiqueId: targetModule?.thematiqueId ?? ROOT_THEMATIQUE_ID,
    internalTargetId,
  };
}

export function LienForm(props: LienFormProps) {
  const router = useRouter();
  const { modules, navTree, addModule, updateModule } = useContenuStore();
  const tabs = useMemo(() => navTree.filter((node) => node.kind === 'tab'), [navTree]);
  const [values, setValues] = useState<LienFormValues>(() => buildInitialValues(props, modules));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pages publiées de l'onglet (ou de la racine) sélectionné, quel que soit leur niveau d'imbrication.
  const destinationPages = useMemo(
    () =>
      modules.filter(
        (mod) => mod.status === 'published' && mod.kind === 'module' && mod.thematiqueId === values.thematiqueId,
      ),
    [modules, values.thematiqueId],
  );

  function setField<K extends keyof LienFormValues>(key: K, value: LienFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleLinkTypeChange(linkType: LinkType) {
    setValues((prev) => ({ ...prev, linkType }));
    setErrors({});
  }

  function handleThematiqueChange(thematiqueId: string) {
    setValues((prev) => ({ ...prev, thematiqueId, internalTargetId: '' }));
    if (errors.internalTargetId) setErrors((prev) => ({ ...prev, internalTargetId: undefined }));
  }

  function validate() {
    const result = linkFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LienFormValues;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return null;
    }
    return result.data;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = validate();
    if (!data) return;

    if (props.mode === 'create') {
      addModule({
        catalogModuleId: '',
        label: data.displayName,
        typeLabel: 'Raccourci',
        kind: 'link',
        thematiqueId: ROOT_THEMATIQUE_ID,
        parentPageId: '',
        enabled: true,
        status: 'published',
        icon: LinkOutlinedIcon,
        headerEnabled: true,
        headerTitle: '',
        headerDescription: '',
        metaDescription: '',
        metaKeywords: '',
        linkType: data.linkType,
        externalUrl: data.linkType === 'external' ? data.externalUrl : '',
        internalTargetId: data.linkType === 'internal' ? data.internalTargetId : '',
      });
      setSubmitting(true);
      setSuccessMessage(`Raccourci « ${data.displayName} » ajouté.`);
      window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
      return;
    }

    updateModule(props.existingLink.id, {
      label: data.displayName,
      linkType: data.linkType,
      externalUrl: data.linkType === 'external' ? data.externalUrl : '',
      internalTargetId: data.linkType === 'internal' ? data.internalTargetId : '',
    });

    setSubmitting(true);
    setSuccessMessage(`Modifications de « ${data.displayName} » enregistrées.`);
    window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
  }

  return (
    <Paper component="form" noValidate onSubmit={handleSubmit} variant="outlined" sx={{ borderRadius: 3 }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Informations générales concernant le raccourci
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            label="Nom du raccourci"
            value={values.displayName}
            onChange={(event) => setField('displayName', event.target.value)}
            required
            fullWidth
            error={Boolean(errors.displayName)}
            helperText={errors.displayName ?? 'Ce nom sera affiché dans le menu.'}
            slotProps={{ formHelperText: { role: errors.displayName ? 'alert' : undefined } }}
          />

          <FormControl>
            <FormLabel id="link-type-label">Type de raccourci</FormLabel>
            <RadioGroup
              row
              aria-labelledby="link-type-label"
              value={values.linkType}
              onChange={(event) => handleLinkTypeChange(event.target.value as LinkType)}
            >
              <FormControlLabel value="internal" control={<Radio />} label="Interne" />
              <FormControlLabel value="external" control={<Radio />} label="Externe" />
            </RadioGroup>
          </FormControl>

          {values.linkType === 'external' ? (
            <TextField
              label="URL du raccourci"
              value={values.externalUrl}
              onChange={(event) => setField('externalUrl', event.target.value)}
              placeholder="https://exemple.fr"
              required
              fullWidth
              error={Boolean(errors.externalUrl)}
              helperText={errors.externalUrl ?? 'Adresse complète de la page externe visée.'}
              slotProps={{ formHelperText: { role: errors.externalUrl ? 'alert' : undefined } }}
            />
          ) : (
            <>
              <TextField
                select
                label="Onglet thématique"
                value={values.thematiqueId}
                onChange={(event) => handleThematiqueChange(event.target.value)}
                fullWidth
                helperText="Onglet contenant la page visée, ou « Aucun » si elle est à la racine du menu."
              >
                <MenuItem value={ROOT_THEMATIQUE_ID}>Aucun (page à la racine du menu)</MenuItem>
                {tabs.map((tab) => (
                  <MenuItem key={tab.id} value={tab.id}>
                    {tab.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Page de destination"
                value={values.internalTargetId}
                onChange={(event) => setField('internalTargetId', event.target.value)}
                required
                fullWidth
                disabled={destinationPages.length === 0}
                error={Boolean(errors.internalTargetId)}
                helperText={
                  errors.internalTargetId ??
                  (destinationPages.length === 0
                    ? 'Aucune page publiée dans cette sélection.'
                    : 'Page vers laquelle le raccourci pointera.')
                }
                slotProps={{ formHelperText: { role: errors.internalTargetId ? 'alert' : undefined } }}
              >
                {destinationPages.map((page) => (
                  <MenuItem key={page.id} value={page.id}>
                    {page.label}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        </Stack>
      </Box>

      <Divider />

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', px: 3, py: 2.5 }}>
        <Button component={Link} href="/dashboard/contenu" variant="outlined" color="inherit" disabled={submitting}>
          Annuler
        </Button>
        <Button type="submit" variant="contained" disabled={submitting}>
          {props.mode === 'edit' ? 'Enregistrer les modifications' : 'Ajouter le raccourci'}
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
