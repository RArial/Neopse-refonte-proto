'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import { ImageField } from '@/components/media-library/field/ImageField';

const ongletFormSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Le nom de l'onglet doit contenir au moins 2 caractères.")
    .max(60, "Le nom de l'onglet ne doit pas dépasser 60 caractères."),
});

export function OngletForm() {
  const router = useRouter();
  const { addTab } = useContenuStore();
  const [label, setLabel] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = ongletFormSchema.safeParse({ label });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setError(undefined);

    addTab({ label: result.data.label, thumbnailUrl: thumbnailUrl ?? undefined });

    setSubmitting(true);
    setSuccessMessage(`Onglet « ${result.data.label} » ajouté.`);
    window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
  }

  return (
    <Paper component="form" noValidate onSubmit={handleSubmit} variant="outlined" sx={{ borderRadius: 3 }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Informations générales concernant l&apos;onglet
        </Typography>

        <Stack spacing={2.5}>
          <TextField
            label="Nom de l'onglet"
            value={label}
            onChange={(event) => {
              setLabel(event.target.value);
              if (error) setError(undefined);
            }}
            required
            fullWidth
            error={Boolean(error)}
            helperText={error ?? 'Ce nom sera affiché comme onglet dans le menu du site.'}
            slotProps={{ formHelperText: { role: error ? 'alert' : undefined } }}
          />

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Vignette de l&apos;onglet (facultatif)
            </Typography>
            <ImageField
              config={{ context: "Vignette de l'onglet", folder: 'Contenu', altText: 'decorative' }}
              value={thumbnailUrl ? { url: thumbnailUrl } : null}
              onChange={(next) => setThumbnailUrl(next?.url ?? null)}
              size="compact"
            />
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', px: 3, py: 2.5 }}>
        <Button component={Link} href="/dashboard/contenu" variant="outlined" color="inherit" disabled={submitting}>
          Annuler
        </Button>
        <Button type="submit" variant="contained" disabled={submitting}>
          Ajouter l&apos;onglet
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
