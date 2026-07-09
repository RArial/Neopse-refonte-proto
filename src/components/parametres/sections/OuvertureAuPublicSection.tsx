'use client';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { SiteSettings } from '@/types/parametres';

interface OuvertureAuPublicSectionProps {
  settings: SiteSettings;
  onChange: (patch: Partial<SiteSettings>) => void;
}

export function OuvertureAuPublicSection({ settings, onChange }: OuvertureAuPublicSectionProps) {
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Accès au site
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography
            variant="body2"
            color={settings.publicOpen ? 'text.secondary' : 'text.primary'}
            sx={{ fontWeight: settings.publicOpen ? 400 : 600 }}
          >
            Fermé
          </Typography>
          <Switch
            checked={settings.publicOpen}
            onChange={(event) => onChange({ publicOpen: event.target.checked })}
            slotProps={{
              input: { 'aria-label': `Accès au site : ${settings.publicOpen ? 'ouvert au public' : 'fermé au public'}` },
            }}
          />
          <Typography
            variant="body2"
            color={settings.publicOpen ? 'text.primary' : 'text.secondary'}
            sx={{ fontWeight: settings.publicOpen ? 600 : 400 }}
          >
            Ouvert
          </Typography>
        </Stack>
      </Stack>

      {!settings.publicOpen && (
        <Stack spacing={2.5}>
          <TextField
            id="parametres-field-closedMessage"
            label="Texte affiché sur le site fermé"
            value={settings.closedMessage}
            onChange={(event) => onChange({ closedMessage: event.target.value })}
            multiline
            minRows={3}
            fullWidth
            helperText="Ce message est affiché aux visiteurs tant que le site n'est pas ouvert au public."
          />
          <TextField
            id="parametres-field-accessPassword"
            label="Mot de passe de consultation"
            type="password"
            value={settings.accessPassword}
            onChange={(event) => onChange({ accessPassword: event.target.value })}
            fullWidth
            autoComplete="new-password"
            helperText="Permet aux personnes autorisées de consulter le site malgré la fermeture au public."
          />
        </Stack>
      )}
    </Stack>
  );
}
