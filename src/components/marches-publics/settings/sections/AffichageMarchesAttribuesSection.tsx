'use client';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AttachmentsField } from '@/components/pages-modules/AttachmentsField';
import type { MarchePublicAwardedListType, MarchePublicPageSettings } from '@/types/marchesPublics';

interface SectionProps {
  settings: MarchePublicPageSettings;
  onChange: (patch: Partial<MarchePublicPageSettings>) => void;
}

export function AffichageMarchesAttribuesSection({ settings, onChange }: SectionProps) {
  const isDocumentsList = settings.awardedListType === 'documents';

  return (
    <Stack spacing={2.5}>
      <FormControl component="fieldset">
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <FormLabel component="legend" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
            Type de liste
          </FormLabel>
          <Tooltip title="« Liste des marchés » affiche les marchés attribués eux-mêmes ; « Liste de documents » affiche une liste de pièces jointes à télécharger.">
            <IconButton size="small" aria-label="Informations sur le type de liste" sx={{ p: 0.25 }}>
              <InfoOutlinedIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
        </Stack>
        <RadioGroup
          row
          aria-label="Type de liste"
          value={settings.awardedListType}
          onChange={(event) => onChange({ awardedListType: event.target.value as MarchePublicAwardedListType })}
        >
          <FormControlLabel value="marches" control={<Radio />} label="Liste des marchés" />
          <FormControlLabel value="documents" control={<Radio />} label="Liste de documents" />
        </RadioGroup>
      </FormControl>

      {isDocumentsList && (
        <Stack spacing={1}>
          <FormLabel component="legend" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
            Pièces jointes
          </FormLabel>
          <AttachmentsField
            attachments={settings.attachments}
            onChange={(attachments) => onChange({ attachments })}
            addLabel="J'ajoute une pièce jointe"
          />
        </Stack>
      )}
    </Stack>
  );
}
