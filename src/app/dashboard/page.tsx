import Box from '@mui/material/Box';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Shortcuts } from '@/components/dashboard/Shortcuts';
import { Kpis } from '@/components/dashboard/Kpis';
import { Modules } from '@/components/dashboard/Modules';
import { Changelog } from '@/components/dashboard/Changelog';

export default function DashboardPage() {
  return (
    <Box
      sx={{
        p: '28px 36px 64px',
        maxWidth: 1560,
        width: '100%',
        mx: 'auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 3.5,
        alignItems: 'start',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <PageHeader />
        <Shortcuts />
        <Kpis />
        <Modules />
      </Box>
      <Changelog />
    </Box>
  );
}
