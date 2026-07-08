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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import HorizontalRuleOutlinedIcon from '@mui/icons-material/HorizontalRuleOutlined';
import type { AddedModule } from '@/types/content';
import { useContenuStore } from '@/components/contenu/ContenuProvider';

const separationFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Le nom de la séparation doit contenir au moins 2 caractères.')
    .max(80, 'Le nom de la séparation ne doit pas dépasser 80 caractères.'),
  thematiqueId: z.string().min(1, 'Choisissez un onglet thématique.'),
});

type SeparationFormValues = z.infer<typeof separationFormSchema>;
type FormErrors = Partial<Record<keyof SeparationFormValues, string>>;

interface SeparationFormCreateProps {
  mode: 'create';
}

interface SeparationFormEditProps {
  mode: 'edit';
  existingSeparation: AddedModule;
}

type SeparationFormProps = SeparationFormCreateProps | SeparationFormEditProps;

function buildInitialValues(props: SeparationFormProps, defaultThematiqueId: string): SeparationFormValues {
  if (props.mode === 'edit') {
    return { displayName: props.existingSeparation.label, thematiqueId: props.existingSeparation.thematiqueId };
  }
  return { displayName: '', thematiqueId: defaultThematiqueId };
}

export function SeparationForm(props: SeparationFormProps) {
  const router = useRouter();
  const { navTree, addModule, updateModule } = useContenuStore();
  const tabs = useMemo(() => navTree.filter((node) => node.kind === 'tab'), [navTree]);
  const [values, setValues] = useState<SeparationFormValues>(() => buildInitialValues(props, tabs[0]?.id ?? ''));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function setField<K extends keyof SeparationFormValues>(key: K, value: SeparationFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const result = separationFormSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof SeparationFormValues;
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
        typeLabel: 'Séparation',
        kind: 'separator',
        thematiqueId: data.thematiqueId,
        parentPageId: '',
        enabled: true,
        status: 'published',
        icon: HorizontalRuleOutlinedIcon,
        headerEnabled: false,
        headerTitle: '',
        headerDescription: '',
        metaDescription: '',
        metaKeywords: '',
      });
      setSubmitting(true);
      setSuccessMessage(`Séparation « ${data.displayName} » ajoutée.`);
      window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
      return;
    }

    updateModule(props.existingSeparation.id, { label: data.displayName, thematiqueId: data.thematiqueId });
    setSubmitting(true);
    setSuccessMessage(`Modifications de « ${data.displayName} » enregistrées.`);
    window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
  }

  return (
    <Paper component="form" noValidate onSubmit={handleSubmit} variant="outlined" sx={{ borderRadius: 3 }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Informations générales concernant la séparation
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            label="Nom de la séparation"
            value={values.displayName}
            onChange={(event) => setField('displayName', event.target.value)}
            required
            fullWidth
            error={Boolean(errors.displayName)}
            helperText={errors.displayName ?? 'Ce nom sera affiché comme libellé de la séparation dans le menu.'}
            slotProps={{ formHelperText: { role: errors.displayName ? 'alert' : undefined } }}
          />

          <TextField
            select
            label="Onglet thématique"
            value={values.thematiqueId}
            onChange={(event) => setField('thematiqueId', event.target.value)}
            required
            fullWidth
            error={Boolean(errors.thematiqueId)}
            helperText={errors.thematiqueId ?? 'Onglet dans lequel la séparation sera insérée.'}
            slotProps={{ formHelperText: { role: errors.thematiqueId ? 'alert' : undefined } }}
          >
            {tabs.map((tab) => (
              <MenuItem key={tab.id} value={tab.id}>
                {tab.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>

      <Divider />

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', px: 3, py: 2.5 }}>
        <Button component={Link} href="/dashboard/contenu" variant="outlined" color="inherit" disabled={submitting}>
          Annuler
        </Button>
        <Button type="submit" variant="contained" disabled={submitting}>
          {props.mode === 'edit' ? 'Enregistrer les modifications' : 'Ajouter la séparation'}
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
