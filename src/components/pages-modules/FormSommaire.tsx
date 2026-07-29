'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Icons, type IconName } from '@/components/ui/Icons';

export interface SommaireSection {
  id: string;
  icon: IconName;
  navLabel: string;
}

export interface SommaireGroup {
  /** Titre du groupe (ex. « Essentiel », « Complémentaire »). Omis pour un sommaire à groupe unique. */
  label?: string;
  sections: SommaireSection[];
}

interface FormSommaireItemProps {
  section: SommaireSection;
  active: boolean;
  onClick: () => void;
}

function FormSommaireItem({ section, active, onClick }: FormSommaireItemProps) {
  const IconEl = Icons[section.icon];
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%',
        px: 1,
        py: 0.75,
        borderRadius: 1.5,
        border: 0,
        bgcolor: 'transparent',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
        color: active ? 'text.primary' : 'text.secondary',
        fontWeight: active ? 700 : 500,
        fontSize: 13.5,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      {IconEl && <IconEl size={15} />}
      <Box component="span" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {section.navLabel}
      </Box>
      <Box
        aria-hidden="true"
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: active ? 'primary.main' : 'transparent',
          border: active ? 'none' : '1.5px solid',
          borderColor: 'divider',
        }}
      />
    </Box>
  );
}

interface FormSommaireProps {
  groups: SommaireGroup[];
  activeSectionId: string;
  onNavClick: (id: string) => void;
}

/** Sommaire de navigation affiché en haut de la colonne de gauche des formulaires de création/modification :
 * surligne la section actuellement visible et permet d'y sauter (voir `useSectionScrollSpy`). */
export function FormSommaire({ groups, activeSectionId, onNavClick }: FormSommaireProps) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>
      <Typography variant="overline" sx={{ display: 'block', px: 1, color: 'text.disabled', fontWeight: 700, letterSpacing: '.08em' }}>
        Sommaire
      </Typography>

      {groups.map((group, index) => (
        <Box key={group.label ?? index} sx={{ mt: index === 0 ? 0.5 : 2 }}>
          {group.label && (
            <Typography
              variant="caption"
              sx={{ display: 'block', px: 1, mt: 1.5, mb: 0.5, color: 'text.disabled', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}
            >
              {group.label}
            </Typography>
          )}
          <Stack component="nav" aria-label={group.label ?? 'Sections'} spacing={0.25}>
            {group.sections.map((section) => (
              <FormSommaireItem key={section.id} section={section} active={activeSectionId === section.id} onClick={() => onNavClick(section.id)} />
            ))}
          </Stack>
        </Box>
      ))}
    </Paper>
  );
}
