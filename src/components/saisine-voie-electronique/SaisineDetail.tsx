'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormSection } from '@/components/pages-modules/FormSection';
import { ModuleFormShell } from '@/components/pages-modules/ModuleFormShell';
import { RichTextField } from '@/components/ui/RichTextField';
import {
  SAISINE_CATEGORIES_SEED,
  SAISINE_STATUS_LABELS,
  type Saisine,
  type SaisineStatus,
} from '@/types/saisineVoieElectronique';

const SAISINE_STATUSES: SaisineStatus[] = ['nouvelle', 'en-cours', 'traitee', 'refusee'];

function categoryLabel(categoryId: string) {
  return SAISINE_CATEGORIES_SEED.find((category) => category.id === categoryId)?.name ?? 'Sans catégorie';
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

interface SaisineDetailProps {
  saisine: Saisine;
}

export function SaisineDetail({ saisine: initialSaisine }: SaisineDetailProps) {
  const router = useRouter();
  const [initialData] = useState<Saisine>(initialSaisine);
  const [data, setData] = useState<Saisine>(initialData);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(initialData), [data, initialData]);

  function handleChange(patch: Partial<Saisine>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit() {
    setData((prev) => ({ ...prev, lastActionDate: new Date().toISOString().slice(0, 10) }));
    setSuccessMessage(`« ${data.subject} » a été mise à jour.`);
    window.setTimeout(() => router.push('/dashboard/saisine-voie-electronique'), 1400);
  }

  return (
    <ModuleFormShell
      title={data.subject}
      backHref="/dashboard/saisine-voie-electronique"
      backLabel="Retour à la saisine par voie électronique"
      submitLabel="Enregistrer"
      onSubmit={handleSubmit}
      successMessage={successMessage}
      onSnackbarClose={() => setSuccessMessage(null)}
      isDirty={isDirty}
    >
      <FormSection title="Informations sur la demande">
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              <Typography component="span" variant="body2" color="text.secondary">
                Catégorie —{' '}
              </Typography>
              {categoryLabel(data.categoryId)}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              <Typography component="span" variant="body2" color="text.secondary">
                Date de l&apos;AEE —{' '}
              </Typography>
              {formatDate(data.aeeDate)}
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              <Typography component="span" variant="body2" color="text.secondary">
                Demandeur —{' '}
              </Typography>
              {data.requesterName}
            </Typography>
            <Typography variant="body2" sx={{ flex: 1 }}>
              <Typography component="span" variant="body2" color="text.secondary">
                Adresse e-mail —{' '}
              </Typography>
              {data.requesterEmail}
            </Typography>
          </Stack>
          <TextField label="Message du demandeur" value={data.message} multiline minRows={3} fullWidth slotProps={{ input: { readOnly: true } }} />
        </Stack>
      </FormSection>

      <FormSection title="Traitement de la demande">
        <Stack spacing={2.5}>
          <TextField
            select
            label="Statut"
            value={data.status}
            onChange={(event) => handleChange({ status: event.target.value as SaisineStatus })}
            fullWidth
            sx={{ maxWidth: 320 }}
          >
            {SAISINE_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {SAISINE_STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </TextField>

          {data.status === 'traitee' && (
            <>
              <RichTextField
                label="Réponse publique"
                value={data.responseText}
                onChange={(responseText) => handleChange({ responseText })}
                placeholder="Rédigez la réponse apportée au demandeur…"
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <TextField
                  label="Nom du répondant"
                  value={data.responderName}
                  onChange={(event) => handleChange({ responderName: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Fonction du répondant"
                  value={data.responderFunction}
                  onChange={(event) => handleChange({ responderFunction: event.target.value })}
                  fullWidth
                />
              </Stack>
            </>
          )}

          {data.status === 'refusee' && (
            <TextField
              label="Motif de refus"
              value={data.refusalReason}
              onChange={(event) => handleChange({ refusalReason: event.target.value })}
              multiline
              minRows={3}
              fullWidth
            />
          )}
        </Stack>
      </FormSection>
    </ModuleFormShell>
  );
}
