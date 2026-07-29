'use client';

import type { SyntheticEvent } from 'react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { usePersonnalisation, type EditorTab } from '@/components/personnalisation/PersonnalisationProvider';
import { GeneralTabPanel } from '@/components/personnalisation/GeneralTabPanel';
import { ColorsPanel } from '@/components/personnalisation/color-panel/ColorsPanel';
import { ContrastWarnings } from '@/components/personnalisation/ContrastWarnings';

export function EditorPanel() {
  const { contrastIssues, activeEditorTab, setActiveEditorTab } = usePersonnalisation();

  function handleChange(_event: SyntheticEvent, value: EditorTab) {
    setActiveEditorTab(value);
  }

  return (
    <Paper
      component="nav"
      aria-label="Réglages de personnalisation"
      elevation={0}
      square
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Tabs value={activeEditorTab} onChange={handleChange} variant="fullWidth" sx={{ borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <Tab value="general" label="Général" sx={{ textTransform: 'none' }} />
        <Tab
          value="details"
          label={
            contrastIssues.length > 0 ? (
              <Badge badgeContent={contrastIssues.length} color="warning" sx={{ '& .MuiBadge-badge': { right: -10 } }}>
                Détails
              </Badge>
            ) : (
              'Détails'
            )
          }
          sx={{ textTransform: 'none' }}
        />
      </Tabs>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {activeEditorTab === 'general' && <GeneralTabPanel />}
        {activeEditorTab === 'details' && <ColorsPanel />}
      </Box>

      {contrastIssues.length > 0 && activeEditorTab === 'details' && (
        <Box sx={{ position: 'sticky', bottom: 0, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2, flexShrink: 0 }}>
          <ContrastWarnings />
        </Box>
      )}
    </Paper>
  );
}
