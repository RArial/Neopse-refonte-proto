'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { FORM_ELEMENT_OPTIONS, type FormElement, type FormElementPatch } from '@/types/formulaires';

interface FormElementCardProps {
  element: FormElement;
  onChange: (patch: FormElementPatch) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function ChoiceOptionsEditor({ element, onChange }: { element: Extract<FormElement, { kind: 'checkboxes' | 'radio' | 'select' }>; onChange: (patch: FormElementPatch) => void }) {
  function updateOption(index: number, value: string) {
    onChange({ options: element.options.map((option, i) => (i === index ? value : option)) });
  }

  function addOption() {
    onChange({ options: [...element.options, `Option ${element.options.length + 1}`] });
  }

  function removeOption(index: number) {
    onChange({ options: element.options.filter((_, i) => i !== index) });
  }

  return (
    <Stack spacing={1} sx={{ mt: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        Choix proposés
      </Typography>
      {element.options.map((option, index) => (
        <Stack key={index} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <TextField
            value={option}
            onChange={(event) => updateOption(index, event.target.value)}
            size="small"
            fullWidth
            label={`Choix ${index + 1}`}
          />
          <IconButton
            size="small"
            onClick={() => removeOption(index)}
            disabled={element.options.length <= 1}
            aria-label={`Supprimer le choix ${index + 1}`}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      ))}
      <Box
        component="button"
        type="button"
        onClick={addOption}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          border: '1.5px dashed',
          borderColor: 'divider',
          borderRadius: 1.5,
          py: 0.875,
          bgcolor: 'transparent',
          color: 'text.secondary',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 13,
          fontWeight: 600,
          '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
        }}
      >
        <AddOutlinedIcon fontSize="small" /> Ajouter un choix
      </Box>
    </Stack>
  );
}

export function FormElementCard({ element, onChange, onDuplicate, onDelete }: FormElementCardProps) {
  const label = FORM_ELEMENT_OPTIONS.find((option) => option.kind === element.kind)?.label ?? element.kind;

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', px: 1.5, py: 1, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <DragIndicatorIcon fontSize="small" sx={{ color: 'text.disabled' }} aria-hidden="true" />
        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', flex: 1 }}>
          {label}
        </Typography>
        <Tooltip title="Dupliquer l'élément">
          <IconButton size="small" onClick={onDuplicate} aria-label="Dupliquer l'élément">
            <ContentCopyOutlinedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer l'élément">
          <IconButton size="small" onClick={onDelete} aria-label="Supprimer l'élément">
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box sx={{ p: 2 }}>
        {element.kind === 'section-title' && (
          <TextField
            value={element.text}
            onChange={(event) => onChange({ text: event.target.value })}
            placeholder="Titre de section"
            fullWidth
            variant="standard"
            aria-label="Titre de section"
            slotProps={{ input: { disableUnderline: true, sx: { fontWeight: 700, fontSize: 19 } } }}
          />
        )}

        {element.kind === 'presentation-text' && (
          <TextField
            value={element.text}
            onChange={(event) => onChange({ text: event.target.value })}
            placeholder="Texte de présentation…"
            fullWidth
            multiline
            minRows={3}
            aria-label="Texte de présentation"
          />
        )}

        {element.kind !== 'section-title' && element.kind !== 'presentation-text' && (
          <Stack spacing={1.5}>
            <TextField
              value={element.label}
              onChange={(event) => onChange({ label: event.target.value })}
              label="Libellé du champ"
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={<Checkbox checked={element.required} onChange={(event) => onChange({ required: event.target.checked })} size="small" />}
              label="Champ obligatoire"
            />

            {(element.kind === 'checkboxes' || element.kind === 'radio' || element.kind === 'select') && (
              <ChoiceOptionsEditor element={element} onChange={onChange} />
            )}

            {element.kind === 'short-text' && <TextField placeholder="Réponse courte" disabled fullWidth size="small" aria-label="Aperçu du champ" />}
            {element.kind === 'long-text' && <TextField placeholder="Réponse longue" disabled fullWidth multiline minRows={3} aria-label="Aperçu du champ" />}
            {element.kind === 'email' && <TextField placeholder="nom@exemple.fr" disabled fullWidth size="small" type="email" aria-label="Aperçu du champ" />}
            {element.kind === 'date' && <TextField disabled fullWidth size="small" type="date" aria-label="Aperçu du champ" />}
            {element.kind === 'time' && <TextField disabled fullWidth size="small" type="time" aria-label="Aperçu du champ" />}
            {element.kind === 'file' && <TextField disabled fullWidth size="small" type="file" aria-label="Aperçu du champ" />}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
