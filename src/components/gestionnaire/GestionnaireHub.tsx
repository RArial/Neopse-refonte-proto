'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { FileManagerPanel } from '@/components/gestionnaire/FileManagerPanel';
import { MANAGER_SECTIONS, type ManagerSectionId } from '@/types/gestionnaire';

const STORAGE_USED_LABEL = '3,0 Mo';
const STORAGE_TOTAL_LABEL = '7 Go';
const STORAGE_USED_PERCENT = 0.86;

export function GestionnaireHub() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<ManagerSectionId>(() => {
    const requested = searchParams.get('section');
    return MANAGER_SECTIONS.some((section) => section.id === requested) ? (requested as ManagerSectionId) : MANAGER_SECTIONS[0].id;
  });

  const totalFiles = useMemo(() => MANAGER_SECTIONS.reduce((sum, section) => sum + section.files.length, 0), []);
  const activeSection = MANAGER_SECTIONS.find((section) => section.id === tab) ?? MANAGER_SECTIONS[0];

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1320, width: '100%', mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', mb: 2.5 }}
      >
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Stockage
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {totalFiles} fichiers dans {MANAGER_SECTIONS.length} dossiers principaux
          </Typography>
        </Box>

        <Box sx={{ minWidth: 220 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
            <Typography variant="caption" color="text.secondary">
              Espace utilisé
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {STORAGE_USED_LABEL} / {STORAGE_TOTAL_LABEL}
            </Typography>
          </Stack>
          <Box
            role="progressbar"
            aria-valuenow={STORAGE_USED_PERCENT}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${STORAGE_USED_PERCENT} % du stockage utilisé`}
            sx={{ height: 6, borderRadius: '999px', bgcolor: (theme) => alpha(theme.palette.success.main, 0.14), overflow: 'hidden', mt: 0.5 }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${STORAGE_USED_PERCENT}%`,
                background: (theme) => `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                borderRadius: '999px',
              }}
            />
          </Box>
        </Box>
      </Stack>

      <Tabs
        value={tab}
        onChange={(_, value: ManagerSectionId) => setTab(value)}
        aria-label="Type de contenu"
        sx={{ mb: 2.5, borderBottom: '1px solid', borderColor: 'divider', minHeight: 44 }}
      >
        {MANAGER_SECTIONS.map((section) => (
          <Tab key={section.id} value={section.id} label={section.label} sx={{ minHeight: 44, textTransform: 'none', fontWeight: 700 }} />
        ))}
      </Tabs>

      <FileManagerPanel key={activeSection.id} section={activeSection} />
    </Box>
  );
}
