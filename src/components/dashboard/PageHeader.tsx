import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';

export function PageHeader() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3.5,
        pb: 2.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -1,
          left: 0,
          width: 68,
          height: 2,
          bgcolor: 'warning.main',
          borderRadius: '2px',
        },
      }}
    >
      <Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            mb: 0.5,
            color: 'text.primary',
            '&:hover .chev': { transform: 'translateY(2px)' },
          }}
        >
          Mairie de Vercourt
          <Box
            component="span"
            className="chev"
            aria-hidden="true"
            sx={{ color: 'text.secondary', transition: 'transform .2s', display: 'inline-flex' }}
          >
            <Icons.ChevronDown size={20} />
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14 }}>
          Vue d&apos;ensemble de votre site — aujourd&apos;hui, 15 juin 2026
        </Typography>
      </Box>
    </Box>
  );
}
