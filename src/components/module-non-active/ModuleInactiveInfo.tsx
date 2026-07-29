import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/** Page d'exemple : illustre l'écran affiché lorsqu'un module n'est pas actif sur l'Outil Site
 * Internet, avant de lancer son parcours de commande. Contenu volontairement générique. */
export function ModuleInactiveInfo() {
  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 960, width: '100%', mx: 'auto' }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Module pas activé
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Page d&apos;exemple illustrant le parcours de commande d&apos;un module non activé.
        </Typography>
      </Box>

      <Alert severity="warning" sx={{ mb: 3 }}>
        Le module « Module pas activé » n&apos;est pas actif dans l&apos;Outil Site Internet.
      </Alert>

      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Le module « Module pas activé »</strong> fait partie des modules « Basiques » et peut être commandé « à
        la carte » pour l&apos;Outil Site Internet.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        <strong>Description du module :</strong> ceci est un exemple de description générique, destiné à illustrer le
        parcours de commande d&apos;un module Neopse. Remplacez ce texte par la présentation réelle du module concerné.
      </Typography>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
        <Table aria-label="Tarif du module">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell align="center">
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <span>Tarif à l&apos;année</span>
                  <Tooltip title="Tarif indicatif, à titre d'exemple.">
                    <IconButton size="small" aria-label="Informations sur le tarif">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                30,00 € HT soit <strong>36,00 € TTC</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href="/dashboard/module-non-active/commande" style={{ textDecoration: 'none' }}>
          <Button
            component="span"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon fontSize="small" />}
          >
            Commander
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
