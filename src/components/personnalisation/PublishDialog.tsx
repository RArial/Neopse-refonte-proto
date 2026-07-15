'use client';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';

export function PublishDialog() {
  const { publishTargetId, closePublishConfirm, publishVariant, activeVariant, variants, contrastIssues } = usePersonnalisation();

  const target = variants.find((v) => v.id === publishTargetId);
  // Les problèmes de contraste ne sont calculés que sur le brouillon en cours d'édition : ils ne
  // sont pertinents que si la variante ciblée est celle actuellement ouverte dans l'éditeur.
  const relevantContrastIssues = target?.id === activeVariant.id ? contrastIssues : [];
  const currentlyPublished = target ? variants.find((v) => v.status === 'published' && v.id !== target.id) : undefined;

  if (!target) return null;

  return (
    <Dialog open={publishTargetId !== null} onClose={closePublishConfirm} aria-labelledby="publish-dialog-title" maxWidth="xs" fullWidth>
      <DialogTitle id="publish-dialog-title">Publier « {target.name} » ?</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <DialogContentText>
            {currentlyPublished ? (
              <>
                La variante actuellement en ligne, « {currentlyPublished.name} », sera remplacée. Elle restera
                accessible dans la liste des variantes enregistrées.
              </>
            ) : (
              'Cette variante deviendra la version en ligne du site.'
            )}
          </DialogContentText>

          {relevantContrastIssues.length > 0 && (
            <Alert severity="warning">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Cette variante contient {relevantContrastIssues.length} problème{relevantContrastIssues.length > 1 ? 's' : ''} de
                contraste.
              </Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={closePublishConfirm}>
          {relevantContrastIssues.length > 0 ? 'Corriger' : 'Annuler'}
        </Button>
        <Button
          variant="contained"
          color={relevantContrastIssues.length > 0 ? 'warning' : 'primary'}
          onClick={() => publishVariant(target.id)}
        >
          {relevantContrastIssues.length > 0 ? 'Publier quand même' : 'Publier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
