'use client';

import { useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
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
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const HT_PRICE = 30;
const VAT_RATE = 0.2;

function formatEuros(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

/** Page d'exemple : illustre l'écran de confirmation de commande d'un module Neopse. Aucun appel
 * réel n'est déclenché — le bouton final se contente de le rappeler à l'utilisateur. */
export function ModuleOrderConfirmation() {
  const [parrainCode, setParrainCode] = useState('');
  const [payment, setPayment] = useState('cb');
  const [cgvAccepted, setCgvAccepted] = useState(false);
  const [demoNoticeOpen, setDemoNoticeOpen] = useState(false);
  const [deferredPaymentDialogOpen, setDeferredPaymentDialogOpen] = useState(false);

  const vat = HT_PRICE * VAT_RATE;
  const total = HT_PRICE + vat;
  const isDeferredPayment = payment === 'cheque' || payment === 'virement';

  function handleCommander() {
    if (isDeferredPayment) {
      setDeferredPaymentDialogOpen(true);
      return;
    }
    setDemoNoticeOpen(true);
  }

  function handleConfirmDeferredPayment() {
    setDeferredPaymentDialogOpen(false);
    setDemoNoticeOpen(true);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 960, width: '100%', mx: 'auto' }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        Mon projet Neopse — exemple
      </Typography>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em', mb: 0.5 }}>
        Confirmation commande module
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Page d&apos;exemple illustrant l&apos;écran de confirmation d&apos;une commande de module. Les données affichées sont
        fictives.
      </Typography>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
        <Table aria-label="Détail de la commande">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Module commandé</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <span>Durée de vie du module</span>
                  <Tooltip title="Durée fixe pour cet exemple.">
                    <IconButton size="small" aria-label="Informations sur la durée du module">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell align="right">Tarif HT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ verticalAlign: 'top' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Module pas activé (30 € HT / an)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 480 }}>
                  Ceci est un exemple de description générique de module, destiné à illustrer le parcours de commande.
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Module rattaché à l&apos;Outil Site Internet
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1.5, py: 0.75, display: 'inline-block', fontSize: 13, color: 'text.secondary' }}>
                  1 an
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ verticalAlign: 'top', fontWeight: 700 }}>
                {formatEuros(HT_PRICE)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1.25, bgcolor: 'action.hover' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Sous-total HT&nbsp;: {formatEuros(HT_PRICE)}
          </Typography>
        </Box>
      </TableContainer>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="J'ajoute mon code Parrain"
          value={parrainCode}
          onChange={(event) => setParrainCode(event.target.value)}
          slotProps={{
            htmlInput: { 'aria-label': "Code parrain (exemple, sans effet)" },
            input: {
              startAdornment: <CardGiftcardOutlinedIcon fontSize="small" color="action" sx={{ mr: 1 }} />,
            },
          }}
        />
        <Button variant="outlined" sx={{ whiteSpace: 'nowrap' }}>
          Enregistrer
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          J&apos;ai 0 point dans mon portefeuille Neopse (exemple).
        </Typography>
        <Button size="small" variant="outlined" disabled>
          J&apos;utilise mes points
        </Button>
      </Box>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ px: 2, py: 1 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Total HT</Typography>
            <Typography variant="body2">{formatEuros(HT_PRICE)}</Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">TVA 20 %</Typography>
            <Typography variant="body2">{formatEuros(vat)}</Typography>
          </Stack>
        </Box>
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700 }}>Total TTC</Typography>
          <Typography sx={{ fontWeight: 700 }}>{formatEuros(total)}</Typography>
        </Box>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Box sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Données de facturation
            </Typography>
            <Tooltip title="Modification désactivée sur cet exemple.">
              <span>
                <IconButton size="small" aria-label="Modifier les données de facturation" disabled>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Collectivité Exemple<br />
            1 rue de la Mairie<br />
            00000 — Ville Exemple<br />
            FRANCE
          </Typography>
        </Box>

        <Box sx={{ flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Moyens de paiement
          </Typography>
          <RadioGroup aria-label="Moyen de paiement" value={payment} onChange={(event) => setPayment(event.target.value)}>
            <FormControlLabel
              value="cb"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                  <CreditCardOutlinedIcon fontSize="small" color="action" />
                  <span>Carte bancaire</span>
                </Stack>
              }
            />
            <FormControlLabel value="cheque" control={<Radio />} label="Chèque" />
            <FormControlLabel value="virement" control={<Radio />} label="Virement" />
          </RadioGroup>
        </Box>
      </Stack>

      <FormControlLabel
        sx={{ mb: 3, alignItems: 'flex-start' }}
        control={<Checkbox checked={cgvAccepted} onChange={(event) => setCgvAccepted(event.target.checked)} sx={{ mt: -0.5 }} />}
        label={
          <Typography variant="body2">
            J&apos;accepte les Conditions Générales de Vente de NEOPSE et j&apos;abandonne le délai de rétractation.
          </Typography>
        }
      />

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
        <Button component={Link} href="/dashboard/module-non-active" variant="outlined" color="inherit">
          Annuler
        </Button>
        <Button variant="contained" disabled={!cgvAccepted} onClick={handleCommander}>
          Commander
        </Button>
      </Stack>

      <Dialog
        open={deferredPaymentDialogOpen}
        onClose={() => setDeferredPaymentDialogOpen(false)}
        aria-labelledby="deferred-payment-dialog-title"
      >
        <DialogTitle id="deferred-payment-dialog-title">Paiement différé</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vous avez choisi le paiement différé par virement. Vous avez donc 30 jours pour effectuer le paiement avant
            que la commande ne soit annulée. Ce moyen de paiement (chèque, virement ou mandat) vous contraint à
            patienter la confirmation de l&apos;encaissement pour pouvoir accéder à votre Module.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" color="inherit" onClick={() => setDeferredPaymentDialogOpen(false)}>
            Modifier le moyen de paiement
          </Button>
          <Button variant="contained" onClick={handleConfirmDeferredPayment} autoFocus>
            Confirmer la commande
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={demoNoticeOpen} autoHideDuration={5000} onClose={() => setDemoNoticeOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" role="status" variant="filled" sx={{ width: '100%' }} onClose={() => setDemoNoticeOpen(false)}>
          Exemple de parcours uniquement — aucune commande réelle n&apos;a été passée.
        </Alert>
      </Snackbar>
    </Box>
  );
}
