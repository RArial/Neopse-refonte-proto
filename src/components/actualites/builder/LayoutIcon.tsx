import Box from '@mui/material/Box';

/** Pictogramme d'une structure : une barre par colonne, proportionnelle à sa largeur. */
export function LayoutIcon({ widths, size = 'default' }: { widths: number[]; size?: 'small' | 'default' }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.375, width: size === 'small' ? 22 : 28, height: size === 'small' ? 14 : 18, flexShrink: 0 }} aria-hidden="true">
      {widths.map((width, index) => (
        <Box key={index} sx={{ flex: width, bgcolor: 'primary.main', borderRadius: 0.5 }} />
      ))}
    </Box>
  );
}
