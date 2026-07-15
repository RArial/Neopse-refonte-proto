'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/History';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';

function formatEntryDate(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${time}`;
}

export function HistoryButton() {
  const { history, restoreFromHistory } = usePersonnalisation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  function handleRestore(entryId: string) {
    restoreFromHistory(entryId);
    setAnchor(null);
  }

  return (
    <>
      <Button
        variant="text"
        color="inherit"
        size="small"
        startIcon={<HistoryIcon fontSize="small" />}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        Historique
      </Button>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 360, maxHeight: 420, overflowY: 'auto' }}>
          <Typography variant="subtitle2" sx={{ px: 2, pt: 1.5, pb: 1, fontWeight: 700 }}>
            Dernières publications
          </Typography>
          <Divider />
          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              Aucune publication pour le moment.
            </Typography>
          ) : (
            <List dense disablePadding>
              {history.map((entry) => (
                <ListItem
                  key={entry.id}
                  secondaryAction={
                    <Button size="small" onClick={() => handleRestore(entry.id)}>
                      Restaurer
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`${formatEntryDate(entry.publishedAt)} — ${entry.publishedBy}`}
                    secondary={`« ${entry.variantName} »`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}
