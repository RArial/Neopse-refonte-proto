'use client';

import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { SUGGESTED_LOCATION, SUGGESTED_PROJECTS, type ProjectSuggestion } from '@/types/abonnements';

export function AbonnementsList() {
  const [query, setQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(SUGGESTED_LOCATION);
  const [projects, setProjects] = useState<ProjectSuggestion[]>(SUGGESTED_PROJECTS);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchedLocation(trimmed);
    setSnackbarMessage(`Recherche de projets NEOPSE autour de « ${trimmed} ».`);
  }

  function handleSubscribe(project: ProjectSuggestion) {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, subscribed: true } : p)));
    setSnackbarMessage(`Vous êtes désormais abonné(e) à « ${project.title} ».`);
  }

  function handlePreview(project: ProjectSuggestion) {
    setSnackbarMessage(`Aperçu de « ${project.title} » — bientôt disponible.`);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 960, width: '100%', mx: 'auto' }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Mes abonnements
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Abonnez-vous aux projets NEOPSE d&apos;une localité pour suivre leur actualité.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3, alignItems: { sm: 'flex-start' } }}>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSearch();
            }
          }}
          label="Ville / Code postal"
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Recherchez une localité pour découvrir les projets NEOPSE à proximité.">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon fontSize="small" />}
          onClick={handleSearch}
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          Rechercher les projets NEOPSE sur cette localité
        </Button>
      </Stack>

      <Box>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Suggestions d&apos;abonnements autour de votre localisation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({searchedLocation})
          </Typography>
          <Tooltip title="Suggestions calculées à partir de la localité renseignée dans votre profil ou recherchée ci-dessus.">
            <InfoOutlinedIcon fontSize="small" color="action" />
          </Tooltip>
        </Stack>

        <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table aria-label="Suggestions d'abonnements">
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell>Projet</TableCell>
                <TableCell>Localisation</TableCell>
                <TableCell align="right">Gérer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      Aucun projet NEOPSE trouvé pour cette localité.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Avatar
                          variant="rounded"
                          src={project.imageUrl ?? undefined}
                          sx={{ width: 48, height: 48, bgcolor: 'action.hover', color: 'text.disabled' }}
                        >
                          <ImageOutlinedIcon fontSize="small" />
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {project.title}
                          </Typography>
                          {project.subtitle && (
                            <Typography variant="body2" color="text.secondary">
                              {project.subtitle}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{project.location}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Tooltip title={`Aperçu de ${project.title}`}>
                          <IconButton size="small" onClick={() => handlePreview(project)} aria-label={`Aperçu de ${project.title}`}>
                            <RemoveRedEyeOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {project.subscribed ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Abonné"
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Button size="small" variant="contained" onClick={() => handleSubscribe(project)}>
                            S&apos;abonner
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
