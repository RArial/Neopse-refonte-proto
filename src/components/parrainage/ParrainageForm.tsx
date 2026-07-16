'use client';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ShareIcon from '@mui/icons-material/Share';

const REFERRAL_CODE = 'LJKEDQAIE';
const MAX_INVITATIONS_PER_DAY = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PendingInvitation {
  id: string;
  email: string;
}

export function ParrainageForm() {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/parrainage/${REFERRAL_CODE}` : `/parrainage/${REFERRAL_CODE}`;
  const invitationsSentToday = pendingInvitations.length;
  const invitationsRemaining = Math.max(0, MAX_INVITATIONS_PER_DAY - invitationsSentToday);

  function handleCopyCode() {
    navigator.clipboard?.writeText(REFERRAL_CODE);
    setSnackbarMessage('Code parrain copié dans le presse-papiers.');
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'Rejoignez Neopse', text: `Utilisez mon code parrain ${REFERRAL_CODE}`, url: referralLink }).catch(() => {});
      return;
    }
    navigator.clipboard?.writeText(referralLink);
    setSnackbarMessage('Lien de parrainage copié dans le presse-papiers.');
  }

  function handleEmailShare() {
    const subject = encodeURIComponent('Rejoignez Neopse');
    const body = encodeURIComponent(`Utilisez mon code parrain ${REFERRAL_CODE} en vous inscrivant : ${referralLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function openInviteDialog() {
    setInviteEmail('');
    setInviteError(null);
    setInviteDialogOpen(true);
  }

  function handleSendInvitation() {
    const trimmed = inviteEmail.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setInviteError('Indiquez une adresse email valide.');
      return;
    }
    if (pendingInvitations.some((invite) => invite.email === trimmed)) {
      setInviteError('Cette adresse a déjà été invitée.');
      return;
    }
    setPendingInvitations((prev) => [...prev, { id: `invite-${Date.now()}`, email: trimmed }]);
    setInviteDialogOpen(false);
    setSnackbarMessage(`Invitation envoyée à ${trimmed}.`);
  }

  return (
    <Box
      component="section"
      sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Parrainage
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Partagez votre code et suivez vos affiliés et vos gains NEOPSE.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ mb: 3, alignItems: 'stretch' }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, flex: 1.4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Mon code Parrain
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: '.05em', mb: 3 }}>
            {REFERRAL_CODE}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Je partage mon code Parrain
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center' }}>
            <Tooltip title="Partager par email">
              <IconButton
                color="primary"
                onClick={handleEmailShare}
                aria-label="Partager mon code parrain par email"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <MailOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Partager">
              <IconButton
                color="primary"
                onClick={handleShare}
                aria-label="Partager mon code parrain"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copier le code">
              <IconButton
                color="primary"
                onClick={handleCopyCode}
                aria-label="Copier le code parrain"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={invitationsRemaining === 0 ? 'Limite quotidienne atteinte' : 'Inviter par email'}>
              <span>
                <IconButton
                  color="secondary"
                  onClick={openInviteDialog}
                  aria-label="Inviter par email"
                  disabled={invitationsRemaining === 0}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <PersonAddAltIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ borderRadius: 3, flex: 1, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: 2.5, py: 1.25 }}>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: '.06em', lineHeight: 1.4 }}>
              Mon portefeuille NEOPSE
            </Typography>
          </Box>
          <Stack spacing={1.5} sx={{ p: 3, alignItems: 'center', textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 48, height: 48, fontWeight: 700 }}>N</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                0 Point(s) NEOPSE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (= 0 €)
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() =>
                setSnackbarMessage("Votre demande d'activation du reversement en euros a bien été prise en compte.")
              }
            >
              Je souhaite activer le reversement en euros
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
          Mes Affiliés
        </Typography>
        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small" aria-label="Mes affiliés">
            <TableHead>
              <TableRow>
                <TableCell>Structure affiliée</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <span>Mon gain</span>
                    <Tooltip title="Gain estimé pour chaque structure affiliée ayant rejoint Neopse via votre code.">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                </TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1.5, textAlign: 'center' }}>
                    Aucun affilié pour le moment.
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Invitations en attente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {invitationsSentToday} / {MAX_INVITATIONS_PER_DAY}
            </Box>{' '}
            invitation{invitationsSentToday > 1 ? 's envoyées' : ' envoyée'} pour les dernières 24h
          </Typography>
        </Stack>
        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small" aria-label="Invitations en attente">
            <TableHead>
              <TableRow>
                <TableCell>Adresse email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingInvitations.length === 0 ? (
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1.5, textAlign: 'center' }}>
                      Aucune invitation en attente.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pendingInvitations.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.email}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} aria-labelledby="invite-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="invite-dialog-title">Inviter par email</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            La personne invitée recevra votre code parrain « {REFERRAL_CODE} » par email.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            type="email"
            label="Adresse email"
            value={inviteEmail}
            onChange={(event) => {
              setInviteEmail(event.target.value);
              setInviteError(null);
            }}
            error={Boolean(inviteError)}
            helperText={inviteError ?? undefined}
            slotProps={{ formHelperText: { role: inviteError ? 'alert' : undefined } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setInviteDialogOpen(false)}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSendInvitation}>
            Envoyer l&apos;invitation
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
