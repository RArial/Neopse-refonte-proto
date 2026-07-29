'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { SAISINES_MOCK, SAISINE_CATEGORIES_SEED, type Saisine } from '@/types/saisineVoieElectronique';

function categoryLabel(categoryId: string) {
  return SAISINE_CATEGORIES_SEED.find((category) => category.id === categoryId)?.name ?? 'Sans catégorie';
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function SaisineList() {
  const [saisines] = useState<Saisine[]>(SAISINES_MOCK);
  const [query, setQuery] = useState('');

  const filteredSaisines = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return saisines;
    return saisines.filter(
      (saisine) => saisine.subject.toLowerCase().includes(trimmed) || saisine.requesterName.toLowerCase().includes(trimmed),
    );
  }, [saisines, query]);

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1200, width: '100%', mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Saisine par voie électronique
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Suivez et traitez les démarches déposées en ligne par les usagers.
          </Typography>
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' }, justifyContent: 'flex-end', mb: 1 }}>
        <TextField
          size="small"
          placeholder="Recherche"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: 260 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Rechercher une saisine' },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          component={Link}
          href="/dashboard/saisine-voie-electronique/parametres"
          variant="outlined"
          color="inherit"
          startIcon={<SettingsOutlinedIcon fontSize="small" />}
        >
          Gérer la page &quot;Saisine par voie électronique&quot;
        </Button>
      </Stack>

      <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table aria-label="Saisines par voie électronique">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Objet</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Demandeur</TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <span>Date de l&apos;AEE</span>
                  <Tooltip title="Date de l'accusé d'enregistrement électronique, généré automatiquement à la réception de la demande.">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
              </TableCell>
              <TableCell>Date dernière action</TableCell>
              <TableCell align="right">Gérer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSaisines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Aucune saisine ne correspond à cette recherche.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredSaisines.map((saisine) => {
                return (
                  <TableRow key={saisine.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{saisine.subject}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{categoryLabel(saisine.categoryId)}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{saisine.requesterName}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDate(saisine.aeeDate)}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDate(saisine.lastActionDate)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={`Gérer « ${saisine.subject} »`}>
                        <IconButton
                          component={Link}
                          href={`/dashboard/saisine-voie-electronique/${saisine.id}`}
                          size="small"
                          aria-label={`Gérer la saisine « ${saisine.subject} »`}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
