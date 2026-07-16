'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
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
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

interface CommandeRecord {
  id: string;
  date: string;
  orderNumber: string;
  invoiceUrl: string;
  prestation: string;
  duration: string;
  amountTtc: number;
}

const COMMANDES: CommandeRecord[] = [
  {
    id: 'cmd-622',
    date: '2026-04-09',
    orderNumber: 'RDC-WEB-20260409-622',
    invoiceUrl: 'https://chorus-pro.gouv.fr',
    prestation: 'Outil (Site Internet)',
    duration: '1 an',
    amountTtc: 0,
  },
  {
    id: 'cmd-621',
    date: '2026-04-09',
    orderNumber: 'RDC-WEB-20260409-621',
    invoiceUrl: 'https://chorus-pro.gouv.fr',
    prestation: 'Outil (Site Internet)',
    duration: '1 an',
    amountTtc: 0,
  },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

export function CommandesTable() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return COMMANDES;
    return COMMANDES.filter((commande) =>
      [commande.orderNumber, commande.prestation, commande.duration, formatDate(commande.date)]
        .join(' ')
        .toLowerCase()
        .includes(trimmed),
    );
  }, [query]);

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1080, width: '100%', mx: 'auto' }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Mes commandes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Retrouvez l&apos;historique de vos commandes, factures et prestations Neopse.
        </Typography>
      </Box>

      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Recherche"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une commande' },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table aria-label="Historique de mes commandes">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Date</TableCell>
              <TableCell>N° Commande</TableCell>
              <TableCell>N° facture</TableCell>
              <TableCell>Prestation</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Montant TTC</TableCell>
              <TableCell align="right">Gérer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune commande ne correspond à votre recherche.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell>{formatDate(commande.date)}</TableCell>
                  <TableCell>{commande.orderNumber}</TableCell>
                  <TableCell>
                    <Link href={commande.invoiceUrl} target="_blank" rel="noopener noreferrer" underline="hover">
                      Voir sur Chorus Pro
                    </Link>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{commande.prestation}</TableCell>
                  <TableCell>{commande.duration}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{formatAmount(commande.amountTtc)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={`Voir le détail de la commande ${commande.orderNumber}`}>
                      <IconButton size="small" aria-label={`Voir le détail de la commande ${commande.orderNumber}`}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" sx={{ justifyContent: 'center', mt: 2.5 }}>
        <Pagination count={1} page={1} shape="rounded" color="primary" aria-label="Pagination des commandes" />
      </Stack>
    </Box>
  );
}
