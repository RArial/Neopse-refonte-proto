'use client';

import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SEED_MODULES } from '@/lib/navTree';
import type { ShortcutFormData, ShortcutLinkType } from '@/types/pagesModules';

const NAME_MAX_LENGTH = 50;

const DESTINATION_PAGES = SEED_MODULES.filter((module) => module.kind === 'module' && module.status === 'published');

interface SectionProps {
  data: ShortcutFormData;
  onChange: (patch: Partial<ShortcutFormData>) => void;
}

export function InformationsGeneralesRaccourciSection({ data, onChange }: SectionProps) {
  function handleLinkTypeChange(linkType: ShortcutLinkType | '') {
    onChange({ linkType, externalUrl: '', internalTargetId: '' });
  }

  return (
    <Stack spacing={2.5}>
      <TextField
        label="Nom du raccourci"
        value={data.name}
        onChange={(event) => onChange({ name: event.target.value.slice(0, NAME_MAX_LENGTH) })}
        fullWidth
        required
        helperText={`${data.name.length} / ${NAME_MAX_LENGTH}`}
        slotProps={{
          formHelperText: { sx: { textAlign: 'right' } },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Nom affiché sur le raccourci, sur la page d'accueil du site.">
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        select
        label="Type de lien"
        value={data.linkType}
        onChange={(event) => handleLinkTypeChange(event.target.value as ShortcutLinkType | '')}
        fullWidth
      >
        <MenuItem value="">Aucune sélection</MenuItem>
        <MenuItem value="internal">Page du site</MenuItem>
        <MenuItem value="external">Lien externe</MenuItem>
      </TextField>

      {data.linkType === 'external' && (
        <TextField
          label="URL du raccourci"
          placeholder="https://exemple.fr"
          value={data.externalUrl}
          onChange={(event) => onChange({ externalUrl: event.target.value })}
          fullWidth
          required
        />
      )}

      {data.linkType === 'internal' && (
        <TextField
          select
          label="Page de destination"
          value={data.internalTargetId}
          onChange={(event) => onChange({ internalTargetId: event.target.value })}
          fullWidth
          required
          disabled={DESTINATION_PAGES.length === 0}
          helperText={DESTINATION_PAGES.length === 0 ? 'Aucune page publiée disponible.' : undefined}
        >
          {DESTINATION_PAGES.map((page) => (
            <MenuItem key={page.id} value={page.id}>
              {page.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Stack>
  );
}
