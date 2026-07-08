import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function ContenuHeader() {
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
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
        Contenu
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        Organisez la navigation, les modules et leur contenu. Cliquez sur un module dans la structure pour modifier son contenu.
      </Typography>
    </Box>
  );
}
