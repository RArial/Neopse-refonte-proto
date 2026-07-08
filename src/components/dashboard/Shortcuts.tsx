import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { Icons, type IconName } from '@/components/ui/Icons';

interface ShortcutItem {
  icon: IconName;
  title: string;
  sub: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { icon: 'Pages',     title: 'Gestion du site', sub: '42 pages publiées' },
  { icon: 'Edit',      title: 'Maquettes',        sub: 'Charte & gabarits' },
  { icon: 'Newspaper', title: 'Unes',              sub: '3 à la une' },
  { icon: 'Megaphone', title: 'Actualités',        sub: '12 publications' },
  { icon: 'Calendar',  title: 'Agenda',            sub: '5 événements à venir' },
  { icon: 'Bell',      title: 'Alertes',           sub: '2 alertes diffusées' },
];

export function Shortcuts() {
  return (
    <Box component="section" sx={{ mb: 4.5 }} aria-labelledby="shortcuts-heading">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75 }}>
        <Typography id="shortcuts-heading" component="h2" variant="h6" sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>
          Mes raccourcis de gestion du site
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {SHORTCUTS.map((item, i) => {
          const IconEl = Icons[item.icon];
          return (
            <ButtonBase
              key={i}
              aria-label={`${item.title} — ${item.sub}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.75,
                p: 2.5,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '14px',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                justifyContent: 'flex-start',
                transition: 'transform .18s, box-shadow .18s, border-color .18s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                  borderColor: 'grey.300',
                },
                '&:hover .shortcut-ico': { transform: 'rotate(-4deg) scale(1.05)' },
                '&:hover .shortcut-arrow': { opacity: 1, transform: 'translateX(0)' },
              }}
            >
              <Box
                className="shortcut-ico"
                aria-hidden="true"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'warning.main',
                  color: 'common.white',
                  flex: '0 0 40px',
                  transition: 'transform .2s',
                }}
              >
                <IconEl size={20} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14, color: 'text.primary' }}>{item.title}</Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: 'text.disabled',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.sub}
                </Typography>
              </Box>
              <Box
                className="shortcut-arrow"
                aria-hidden="true"
                sx={{
                  ml: 'auto',
                  color: 'text.disabled',
                  opacity: 0,
                  transform: 'translateX(-6px)',
                  transition: 'opacity .18s, transform .18s',
                  flexShrink: 0,
                  display: 'inline-flex',
                }}
              >
                <Icons.ArrowUpRight size={16} />
              </Box>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
