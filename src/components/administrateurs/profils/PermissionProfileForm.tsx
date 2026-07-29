'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { PermissionMatrix } from '@/components/administrateurs/profils/PermissionMatrix';
import type { PermissionGrants, PermissionProfile, PermissionRight } from '@/types/profils';

interface PermissionProfileFormProps {
  mode: 'create' | 'edit';
  initialProfile?: PermissionProfile;
}

export function PermissionProfileForm({ mode, initialProfile }: PermissionProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialProfile?.name ?? '');
  const [grants, setGrants] = useState<PermissionGrants>(initialProfile?.grants ?? {});
  const [nameError, setNameError] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function toggleRight(moduleId: string, right: PermissionRight, checked: boolean) {
    setGrants((prev) => {
      const current = prev[moduleId] ?? [];
      const next = checked ? [...current, right] : current.filter((r) => r !== right);
      return { ...prev, [moduleId]: next };
    });
  }

  function handleSubmit() {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setSuccessMessage(mode === 'create' ? `Profil « ${name} » créé.` : `Profil « ${name} » mis à jour.`);
    window.setTimeout(() => router.push('/dashboard/administrateurs/profils'), 1200);
  }

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Button
        component={Link}
        href="/dashboard/administrateurs/profils"
        startIcon={<ArrowBackIcon fontSize="small" />}
        color="inherit"
        size="small"
        sx={{ mb: 2, ml: -1, textTransform: 'none', fontWeight: 500 }}
      >
        Retour aux profils
      </Button>

      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em', mb: 2.5 }}>
        {mode === 'create' ? 'Nouveau profil de droits' : 'Modifier le profil de droits'}
      </Typography>

      <TextField
        id="profile-field-name"
        label="Nom du profil"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setNameError(false);
        }}
        error={nameError}
        helperText={nameError ? 'Le nom du profil est obligatoire.' : undefined}
        slotProps={{ formHelperText: { role: nameError ? 'alert' : undefined } }}
        required
        fullWidth
        sx={{ mb: 3.5, maxWidth: 420 }}
      />

      <PermissionMatrix grants={grants} onToggle={toggleRight} />

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 3 }}>
        <Button component={Link} href="/dashboard/administrateurs/profils" variant="outlined" color="inherit" startIcon={<ArrowBackIcon fontSize="small" />}>
          Retour
        </Button>
        <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={handleSubmit}>
          {mode === 'create' ? "Ajouter" : "Enregistrer"}
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
    </Box>
  );
}
