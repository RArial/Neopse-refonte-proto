'use client';

import { useRouter } from 'next/navigation';
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
import { useLegalPages } from '@/components/contenu/legal/LegalPagesProvider';
import { LEGAL_PAGE_ROUTES } from '@/lib/legal/legalTemplates';

export function PublishDialog() {
  const router = useRouter();
  const { publishTargetId, closePublishConfirm, publishVariant, activeVariant, variants, contrastIssues } = usePersonnalisation();
  const { templates: legalTemplates, getCompletion } = useLegalPages();

  const target = variants.find((v) => v.id === publishTargetId);
  // Les problèmes de contraste ne sont calculés que sur le brouillon en cours d'édition : ils ne
  // sont pertinents que si la variante ciblée est celle actuellement ouverte dans l'éditeur.
  const relevantContrastIssues = target?.id === activeVariant.id ? contrastIssues : [];
  const currentlyPublished = target ? variants.find((v) => v.status === 'published' && v.id !== target.id) : undefined;

  // Publier le site n'est pas bloqué par des pages obligatoires incomplètes — c'est un avertissement,
  // pas un verrou (voir §6 du cahier des charges) : l'utilisateur reste maître de la décision.
  const incompleteLegalPages = legalTemplates
    .map((template) => ({ template, completion: getCompletion(template.id) }))
    .filter(({ completion }) => !completion.complete);

  if (!target) return null;

  const hasWarning = relevantContrastIssues.length > 0 || incompleteLegalPages.length > 0;

  function handleCompleteNow() {
    const firstIncomplete = incompleteLegalPages[0];
    closePublishConfirm();
    if (firstIncomplete) router.push(`${LEGAL_PAGE_ROUTES[firstIncomplete.template.id]}?focus=1`);
  }

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

          {incompleteLegalPages.length > 0 && (
            <Alert severity="warning">
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {incompleteLegalPages.length > 1
                  ? `${incompleteLegalPages.length} pages obligatoires sont incomplètes`
                  : '1 page obligatoire est incomplète'}
              </Typography>
              <Stack component="ul" spacing={0.25} sx={{ m: 0, pl: 2.5 }}>
                {incompleteLegalPages.map(({ template, completion }) => (
                  <Typography key={template.id} component="li" variant="body2">
                    {template.title} — {completion.missingCount} champ{completion.missingCount > 1 ? 's' : ''} manquant
                    {completion.missingCount > 1 ? 's' : ''}
                  </Typography>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Ces pages sont une obligation légale.
              </Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={incompleteLegalPages.length > 0 ? handleCompleteNow : closePublishConfirm}>
          {incompleteLegalPages.length > 0 ? 'Compléter maintenant' : relevantContrastIssues.length > 0 ? 'Corriger' : 'Annuler'}
        </Button>
        <Button variant="contained" color={hasWarning ? 'warning' : 'primary'} onClick={() => publishVariant(target.id)}>
          {hasWarning ? 'Publier quand même' : 'Publier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
