'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Icons } from '@/components/ui/Icons';

type Theme = 'light' | 'dark';
type Density = 'default' | 'compact';
type Accent = 'teal' | 'coral' | 'amber' | 'lilac';

const ACCENTS: Array<{ id: Accent; label: string }> = [
  { id: 'teal',  label: 'Sarcelle' },
  { id: 'coral', label: 'Corail' },
  { id: 'amber', label: 'Ambre' },
  { id: 'lilac', label: 'Lilas' },
];

const ACCENT_SWATCH_COLOR: Record<Accent, string> = {
  teal: 'primary.main',
  coral: 'error.main',
  amber: 'warning.main',
  lilac: 'secondary.main',
};

const ACCENT_CSS: Record<Accent, Record<string, string>> = {
  teal:  { '--accent': 'var(--teal-deep)', '--accent-soft': 'var(--teal-soft)', '--accent-deep': 'oklch(0.30 0.08 185)' },
  coral: { '--accent': 'var(--coral)',     '--accent-soft': 'var(--coral-soft)', '--accent-deep': 'oklch(0.35 0.10 18)' },
  amber: { '--accent': 'var(--amber)',     '--accent-soft': 'var(--amber-soft)', '--accent-deep': 'oklch(0.55 0.14 85)' },
  lilac: { '--accent': 'var(--lilac)',     '--accent-soft': 'var(--lilac-soft)', '--accent-deep': 'oklch(0.40 0.10 290)' },
};

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('neopse:theme', theme); } catch {}
}
function applyDensity(density: Density) {
  if (density === 'compact') {
    document.documentElement.setAttribute('data-density', 'compact');
  } else {
    document.documentElement.removeAttribute('data-density');
  }
  try { localStorage.setItem('neopse:density', density); } catch {}
}
function applyAccent(accent: Accent) {
  const styles = ACCENT_CSS[accent];
  Object.entries(styles).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
  try { localStorage.setItem('neopse:accent', accent); } catch {}
}

export function Tweaks() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('neopse:theme') as Theme | null) ?? 'light';
  });
  const [density, setDensity] = useState<Density>(() => {
    if (typeof window === 'undefined') return 'default';
    return (localStorage.getItem('neopse:density') as Density | null) ?? 'default';
  });
  const [accent, setAccent] = useState<Accent>(() => {
    if (typeof window === 'undefined') return 'teal';
    return (localStorage.getItem('neopse:accent') as Accent | null) ?? 'teal';
  });

  useEffect(() => {
    applyTheme(theme);
    applyDensity(density);
    applyAccent(accent);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === '__activate_edit_mode') setOpen(true);
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function handleTheme(t: Theme | null) {
    if (!t) return;
    setTheme(t);
    applyTheme(t);
  }
  function handleDensity(d: Density | null) {
    if (!d) return;
    setDensity(d);
    applyDensity(d);
  }
  function handleAccent(a: Accent) {
    setAccent(a);
    applyAccent(a);
  }

  return (
    <>
      {open && (
        <Box
          onClick={() => setOpen(false)}
          aria-hidden="true"
          sx={{ position: 'fixed', inset: 0, zIndex: 39 }}
        />
      )}
      <Grow in={open} unmountOnExit>
        <Paper
          role="dialog"
          aria-label="Personnalisation de l'interface"
          aria-modal="false"
          elevation={0}
          sx={{
            position: 'fixed',
            right: 20,
            top: 78,
            width: 280,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: '14px',
            p: 2,
            boxShadow: 6,
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.75,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 13, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'text.secondary' }}>
              <Icons.Sliders size={15} />
              <span>Personnalisation</span>
            </Box>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              aria-label="Fermer le panneau de personnalisation"
              sx={{ color: 'text.disabled', minWidth: 28, minHeight: 28 }}
            >
              <Icons.X size={16} />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>Apparence</Typography>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={theme}
                onChange={(_e, v: Theme | null) => handleTheme(v)}
                aria-label="Thème"
                size="small"
                sx={{ bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: 0.375, gap: 0.375 }}
              >
                <ToggleButton value="light" sx={{ border: 0, borderRadius: '7px !important', textTransform: 'none', fontSize: 12, gap: 0.5 }}>
                  <Icons.Sun size={13} /> Clair
                </ToggleButton>
                <ToggleButton value="dark" sx={{ border: 0, borderRadius: '7px !important', textTransform: 'none', fontSize: 12, gap: 0.5 }}>
                  <Icons.Moon size={13} /> Sombre
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>Densité</Typography>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={density}
                onChange={(_e, v: Density | null) => handleDensity(v)}
                aria-label="Densité"
                size="small"
                sx={{ bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: 0.375, gap: 0.375 }}
              >
                <ToggleButton value="default" sx={{ border: 0, borderRadius: '7px !important', textTransform: 'none', fontSize: 12, gap: 0.5 }}>
                  <Icons.LayoutGrid size={13} /> Confortable
                </ToggleButton>
                <ToggleButton value="compact" sx={{ border: 0, borderRadius: '7px !important', textTransform: 'none', fontSize: 12, gap: 0.5 }}>
                  <Icons.AlignJustify size={13} /> Compacte
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>Couleur d&apos;accent</Typography>
              <Box role="group" aria-label="Couleur d'accent" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {ACCENTS.map(a => {
                  const isOn = accent === a.id;
                  return (
                    <ButtonBase
                      key={a.id}
                      onClick={() => handleAccent(a.id)}
                      aria-pressed={isOn}
                      aria-label={a.label}
                      title={a.label}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        bgcolor: ACCENT_SWATCH_COLOR[a.id],
                        border: '2px solid',
                        borderColor: isOn ? 'text.primary' : 'transparent',
                        transition: 'transform .15s',
                        '&:hover': { transform: 'scale(1.08)' },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grow>
    </>
  );
}
