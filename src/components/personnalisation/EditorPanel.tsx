'use client';

import { useMemo, type SyntheticEvent } from 'react';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { usePersonnalisation, type EditorTab } from '@/components/personnalisation/PersonnalisationProvider';
import { TemplatesTabPanel } from '@/components/personnalisation/TemplatesTabPanel';
import { GeneralTabPanel } from '@/components/personnalisation/GeneralTabPanel';
import { ModulesTabPanel } from '@/components/personnalisation/ModulesTabPanel';
import { ContrastWarnings } from '@/components/personnalisation/ContrastWarnings';
import { MODULE_KEYS, type ModuleKey } from '@/types/personnalisation';

function TabBadgeLabel({ text, count }: { text: string; count: number }) {
  if (count === 0) return <>{text}</>;
  return (
    <Badge badgeContent={count} color="warning" sx={{ '& .MuiBadge-badge': { right: -10 } }}>
      {text}
    </Badge>
  );
}

export function EditorPanel() {
  const {
    contrastIssues,
    activeEditorTab,
    setActiveEditorTab,
    moduleCoexistenceMessage,
    dismissModuleCoexistenceMessage,
  } = usePersonnalisation();

  const sectionIssues = useMemo(() => contrastIssues.filter((issue) => !MODULE_KEYS.includes(issue.section as ModuleKey)), [contrastIssues]);
  const moduleIssues = useMemo(() => contrastIssues.filter((issue) => MODULE_KEYS.includes(issue.section as ModuleKey)), [contrastIssues]);

  function handleChange(_event: SyntheticEvent, value: EditorTab) {
    setActiveEditorTab(value);
  }

  function handleSeeModules() {
    setActiveEditorTab('modules');
    dismissModuleCoexistenceMessage();
  }

  const visibleIssues = activeEditorTab === 'modules' ? moduleIssues : activeEditorTab === 'general' ? sectionIssues : [];

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
        <Tab value="templates" label="Maquettes" sx={{ textTransform: 'none' }} />
        <Tab value="general" label={<TabBadgeLabel text="Général" count={sectionIssues.length} />} sx={{ textTransform: 'none' }} />
        <Tab value="modules" label={<TabBadgeLabel text="Modules" count={moduleIssues.length} />} sx={{ textTransform: 'none' }} />
      </Tabs>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {activeEditorTab === 'templates' && <TemplatesTabPanel />}
        {activeEditorTab === 'general' && <GeneralTabPanel />}
        {activeEditorTab === 'modules' && <ModulesTabPanel />}
      </Box>

      {visibleIssues.length > 0 && (
        <Box sx={{ position: 'sticky', bottom: 0, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2, flexShrink: 0 }}>
          <ContrastWarnings issues={visibleIssues} />
        </Box>
      )}

      <Snackbar
        open={moduleCoexistenceMessage !== null}
        autoHideDuration={6000}
        onClose={dismissModuleCoexistenceMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          variant="filled"
          onClose={dismissModuleCoexistenceMessage}
          action={
            <Button color="inherit" size="small" onClick={handleSeeModules}>
              Voir
            </Button>
          }
          sx={{ width: '100%' }}
        >
          {moduleCoexistenceMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
