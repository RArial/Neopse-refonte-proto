'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { EditorAppBar } from '@/components/personnalisation/EditorAppBar';
import { EditorPanel } from '@/components/personnalisation/EditorPanel';
import { PreviewPane } from '@/components/personnalisation/PreviewPane';
import { SwitchVariantDialog } from '@/components/personnalisation/SwitchVariantDialog';

// 62px = hauteur du Topbar sticky du dashboard (src/styles/dashboard.css `.topbar`) : l'éditeur
// occupe exactement le reste du viewport pour que la preview ne scrolle jamais avec la page.
const EDITOR_HEIGHT = 'calc(100dvh - 62px)';

export function ThemeEditorPage() {
  const { isDirty } = usePersonnalisation();
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  return (
    <Box sx={{ height: EDITOR_HEIGHT, display: 'flex', flexDirection: 'column' }}>
      <EditorAppBar />

      <Box sx={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)' }}>
        <EditorPanel />
        <PreviewPane />
      </Box>

      <SwitchVariantDialog />

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="editor-leave-title" aria-describedby="editor-leave-description">
        <DialogTitle id="editor-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="editor-leave-description">
            Des modifications n&apos;ont pas été enregistrées. Si vous quittez maintenant, elles seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={cancelLeave} color="inherit" autoFocus>
            Rester sur la page
          </Button>
          <Button onClick={confirmLeave} color="error" variant="contained">
            Quitter sans enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
