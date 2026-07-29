'use client';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import ShortTextOutlinedIcon from '@mui/icons-material/ShortTextOutlined';
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { FORM_ELEMENT_OPTIONS, type FormElementKind } from '@/types/formulaires';

const ELEMENT_ICONS: Record<FormElementKind, typeof TitleOutlinedIcon> = {
  'section-title': TitleOutlinedIcon,
  'presentation-text': NotesOutlinedIcon,
  'short-text': ShortTextOutlinedIcon,
  'long-text': SubjectOutlinedIcon,
  checkboxes: CheckBoxOutlinedIcon,
  radio: RadioButtonCheckedOutlinedIcon,
  select: ArrowDropDownCircleOutlinedIcon,
  email: AlternateEmailOutlinedIcon,
  date: CalendarTodayOutlinedIcon,
  time: AccessTimeOutlinedIcon,
  file: UploadFileOutlinedIcon,
};

interface FormElementPaletteProps {
  onAddElement: (kind: FormElementKind) => void;
}

export function FormElementPalette({ onAddElement }: FormElementPaletteProps) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', position: 'sticky', top: 16 }}>
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Éléments</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Cliquez pour ajouter un élément à la fin du formulaire.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {FORM_ELEMENT_OPTIONS.map((option) => {
            const IconEl = ELEMENT_ICONS[option.kind];
            return (
              <ButtonBase
                key={option.kind}
                onClick={() => onAddElement(option.kind)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 1.5,
                  py: 1.25,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                }}
              >
                <IconEl fontSize="small" color="action" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {option.label}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
