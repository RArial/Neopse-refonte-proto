import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import { ContenuHeader } from '@/components/contenu/ContenuHeader';
import { NavigationTree } from '@/components/contenu/NavigationTree';
import { ModuleCatalog } from '@/components/contenu/ModuleCatalog';

export const metadata: Metadata = {
  title: 'Contenu',
};

export default function ContenuPage() {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2, md: 3.5 },
        py: { xs: 2, md: 2.5 },
        maxWidth: 1560,
        width: '100%',
        mx: 'auto',
      }}
    >
      <ContenuHeader />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' },
          gap: 2.5,
          alignItems: 'start',
        }}
      >
        <NavigationTree />
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 96 } }}>
          <ModuleCatalog />
        </Box>
      </Box>
    </Box>
  );
}
