import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function MediathequeDemoLoading() {
  return (
    <Box aria-label="Chargement de la démo médiathèque…" aria-busy="true" sx={{ maxWidth: 1120, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 }, width: '100%' }}>
      <Skeleton variant="text" width="50%" height={48} />
      <Skeleton variant="text" width="70%" />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 4 }}>
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} variant="rounded" height={360} />
        ))}
      </Box>
    </Box>
  );
}
