'use client';

import { useMemo, useState, type SyntheticEvent } from 'react';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import type { CatalogModule } from '@/types/content';

type CatalogView = 'included' | 'discover';

function CatalogTabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 18, fontSize: 11 }} />
    </Stack>
  );
}

export function ModuleCatalog() {
  const { catalogModules, discoverModules } = useContenuStore();
  const [view, setView] = useState<CatalogView>('included');
  const [query, setQuery] = useState('');

  const modules: CatalogModule[] = view === 'included' ? catalogModules : discoverModules;

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return modules;
    return modules.filter((mod) => mod.label.toLowerCase().includes(q));
  }, [query, modules]);

  function handleViewChange(_event: SyntheticEvent, next: CatalogView) {
    setView(next);
    setQuery('');
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, display: 'flex', flexDirection: 'column', maxHeight: { lg: 640 } }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2.5, py: 1.75, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <AddCircleOutlinedIcon color="action" fontSize="small" />
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
          Ajouter un module
        </Typography>
      </Stack>

      <Box sx={{ px: 2.5, pt: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Rechercher…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{
            input: {
              startAdornment: <SearchIcon fontSize="small" color="action" sx={{ mr: 1 }} />,
            },
            htmlInput: { 'aria-label': 'Rechercher un module' },
          }}
        />
      </Box>

      <Tabs
        value={view}
        onChange={handleViewChange}
        aria-label="Catégories de modules"
        variant="fullWidth"
        sx={{ mt: 1.5, minHeight: 40, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab
          value="included"
          label={<CatalogTabLabel text="Inclus" count={catalogModules.length} />}
          sx={{ minHeight: 40, textTransform: 'none' }}
        />
        <Tab
          value="discover"
          label={<CatalogTabLabel text="À découvrir" count={discoverModules.length} />}
          sx={{ minHeight: 40, textTransform: 'none' }}
        />
      </Tabs>

      <List
        sx={{ overflowY: 'auto', flex: 1, px: 0.5, py: 1 }}
        aria-label={view === 'included' ? 'Modules inclus dans votre forfait' : 'Modules à découvrir'}
      >
        {filteredModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <ListItem key={mod.id} disablePadding sx={{ px: 1.5 }}>
              {view === 'included' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', py: 0.75 }}>
                  <Avatar variant="rounded" sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 28, height: 28, mr: 1.5 }}>
                    <Icon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: 600, fontSize: 13 }}>
                    {mod.label}
                  </Typography>
                  <IconButton
                    component={Link}
                    href={`/dashboard/contenu/module/${mod.id}`}
                    size="small"
                    color="primary"
                    aria-label={`Ajouter le module ${mod.label}`}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <ButtonBase
                  component={Link}
                  href={`/dashboard/contenu/module/discover/${mod.id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    py: 0.75,
                    px: 0.5,
                    borderRadius: 1.5,
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    transition: 'background-color 150ms ease',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  aria-label={`Découvrir le module ${mod.label}, non inclus dans votre forfait`}
                >
                  <Avatar variant="rounded" sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 28, height: 28, mr: 1.5 }}>
                    <Icon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: 600, fontSize: 13 }}>
                    {mod.label}
                  </Typography>
                  <Tooltip title="Non inclus dans votre forfait actuel">
                    <LockOutlinedIcon fontSize="small" sx={{ color: 'text.disabled', mr: 0.5 }} />
                  </Tooltip>
                  <ChevronRightIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </ButtonBase>
              )}
            </ListItem>
          );
        })}

        {filteredModules.length === 0 && (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Aucun module ne correspond à « {query} ».
            </Typography>
            <Button variant="text" size="small" onClick={() => setQuery('')}>
              Réinitialiser la recherche
            </Button>
          </Box>
        )}
      </List>
    </Paper>
  );
}
