'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { useContenuStore } from '@/components/contenu/ContenuProvider';

interface UnlockModuleActionProps {
  moduleId: string;
  moduleLabel: string;
}

export function UnlockModuleAction({ moduleId, moduleLabel }: UnlockModuleActionProps) {
  const router = useRouter();
  const { unlockDiscoverModule } = useContenuStore();
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  function handleUnlock() {
    unlockDiscoverModule(moduleId);
    setSubmitting(true);
    setSuccessOpen(true);
    window.setTimeout(() => router.push('/dashboard/contenu'), 1400);
  }

  return (
    <>
      <Button variant="contained" size="large" onClick={handleUnlock} disabled={submitting}>
        Ajouter à mon forfait
      </Button>

      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          Module « {moduleLabel} » ajouté à votre forfait. Vous pouvez maintenant le configurer depuis l&apos;onglet « Inclus ».
        </Alert>
      </Snackbar>
    </>
  );
}
