import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

interface ModuleNotFoundPanelProps {
  title?: string;
  message: string;
}

export function ModuleNotFoundPanel({ title = 'Module introuvable', message }: ModuleNotFoundPanelProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 8,
        textAlign: 'center',
      }}
    >
      <SearchOffOutlinedIcon color="disabled" sx={{ fontSize: 40 }} />
      <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        {message}
      </Typography>
      <Link href="/dashboard/contenu" style={{ textDecoration: 'none' }}>
        <Button variant="contained" component="span">
          Retour à Contenu
        </Button>
      </Link>
    </Box>
  );
}
