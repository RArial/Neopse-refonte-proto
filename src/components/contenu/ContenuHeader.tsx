'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { useContenuStore } from '@/components/contenu/ContenuProvider';

export function ContenuHeader() {
  const { searchQuery, setSearchQuery } = useContenuStore();

  return (
    <Box
      component="header"
      sx={{
        mb: { xs: 2, md: 2.5 },
        pb: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'flex-end' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Gestionnaire des pages
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Organisez la navigation, les modules et leur contenu. Cliquez sur un module dans la structure pour modifier son contenu.
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Rechercher une page, un module…"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          sx={{ minWidth: { md: 280 } }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon fontSize="small" color="action" sx={{ mr: 1 }} />,
            },
            htmlInput: { 'aria-label': 'Rechercher une page, un module activé ou à découvrir' },
          }}
        />
      </Stack>
    </Box>
  );
}
