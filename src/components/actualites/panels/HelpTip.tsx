'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';

/** Aide « (?) » focusable : l'infobulle s'ouvre aussi au clavier, pas seulement au survol. */
export function HelpTip({ text }: { text: string }) {
  return (
    <Tooltip title={text} describeChild>
      <IconButton size="small" aria-label={`Aide : ${text}`} sx={{ minWidth: 32, minHeight: 32, p: 0.5, color: 'text.secondary' }}>
        <HelpOutlineIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
}
