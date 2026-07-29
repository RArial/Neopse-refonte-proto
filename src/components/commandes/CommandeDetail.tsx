'use client';

import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { formatCommandeAmount, formatCommandeDate, type CommandeRecord } from '@/types/commandes';

interface CommandeDetailProps {
  commande: CommandeRecord;
}

export function CommandeDetail({ commande }: CommandeDetailProps) {
  const totalHt = commande.lignes.reduce((sum, ligne) => sum + ligne.montantHt, 0);
  const totalTva = (totalHt * commande.tvaRate) / 100;
  const totalTtc = totalHt + totalTva;

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}
        aria-label="Fil d'Ariane"
        className="no-print"
        sx={{ mb: 1.5, fontSize: 13 }}
      >
        <Link component={NextLink} href="/dashboard/mes-commandes" underline="hover" color="text.secondary">
          Mes commandes
        </Link>
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
          Commande {commande.orderNumber}
        </Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Commande {commande.orderNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Passée le {formatCommandeDate(commande.date)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          className="no-print"
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={() => window.print()}
        >
          Télécharger en format PDF
        </Button>
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
        <Table aria-label="Références de la commande">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700 }}>N° Commande</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>N° facture</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {commande.orderNumber}
                <Typography variant="body2" color="text.secondary">
                  {formatCommandeDate(commande.date)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  La facture vous sera envoyée directement sur votre portail Chorus Pro.
                </Typography>
                <Link href={commande.invoiceUrl} target="_blank" rel="noopener noreferrer" underline="hover">
                  Voir sur Chorus Pro
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
        <Table aria-label="Détail des prestations">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700 }}>Prestation</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Tarif HT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commande.lignes.map((ligne) => (
              <TableRow key={ligne.label}>
                <TableCell>
                  <Typography sx={{ fontWeight: 700 }}>{ligne.label}</Typography>
                  {ligne.description ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {ligne.description}
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell align="right" sx={{ verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                  {formatCommandeAmount(ligne.montantHt)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700 }}>Total HT</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCommandeAmount(totalHt)}</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700 }}>
                TVA {commande.tvaRate.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} %
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCommandeAmount(totalTva)}</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ fontWeight: 700, color: 'primary.contrastText', fontSize: 18, borderBottom: 'none' }}>
                Total TTC
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.contrastText', fontSize: 18, borderBottom: 'none' }}>
                {formatCommandeAmount(totalTtc)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box component="section" sx={{ mb: 3 }} aria-labelledby="facturation-heading">
        <Typography id="facturation-heading" component="h2" variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          Données de facturation
        </Typography>
        <Stack spacing={0.5}>
          <Typography variant="body2">{commande.facturation.raisonSociale}</Typography>
          <Typography variant="body2">{commande.facturation.identifiant}</Typography>
          {commande.facturation.adresse.map((ligne) => (
            <Typography variant="body2" key={ligne}>{ligne}</Typography>
          ))}
          <Typography variant="body2">{commande.facturation.pays}</Typography>
        </Stack>
      </Box>

      <Box
        component="section"
        aria-labelledby="cgv-heading"
        sx={{ bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5 }}
      >
        <Typography id="cgv-heading" component="h2" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Conditions Générales de Vente de NEOPSE
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <PictureAsPdfOutlinedIcon fontSize="small" color="action" aria-hidden="true" />
          <Link href={commande.cgvUrl} target="_blank" rel="noopener noreferrer" underline="hover">
            {commande.cgvLabel}
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}
