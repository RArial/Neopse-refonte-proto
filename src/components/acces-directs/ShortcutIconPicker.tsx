'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Icons, type IconName } from '@/components/ui/Icons';

const ICON_NAMES = Object.keys(Icons) as IconName[];

interface ShortcutIconPickerProps {
  value: IconName | '';
  onChange: (icon: IconName) => void;
}

export function ShortcutIconPicker({ value, onChange }: ShortcutIconPickerProps) {
  return (
    <Box role="radiogroup" aria-label="Icône du raccourci" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {ICON_NAMES.map((name) => {
        const IconEl = Icons[name];
        const selected = value === name;
        return (
          <Tooltip key={name} title={name}>
            <IconButton
              role="radio"
              aria-checked={selected}
              aria-label={name}
              onClick={() => onChange(name)}
              sx={{
                width: 44,
                height: 44,
                border: '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                borderRadius: 1.5,
                bgcolor: selected ? 'primary.main' : 'transparent',
                color: selected ? 'primary.contrastText' : 'text.secondary',
                '&:hover': { bgcolor: selected ? 'primary.dark' : 'action.hover' },
              }}
            >
              <IconEl size={18} />
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
}
