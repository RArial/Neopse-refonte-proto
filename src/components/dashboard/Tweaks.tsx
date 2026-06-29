'use client';

import { useEffect, useState } from 'react';
import { Icons } from '@/components/ui/Icons';

type Theme = 'light' | 'dark';
type Density = 'default' | 'compact';
type Accent = 'teal' | 'coral' | 'amber' | 'lilac';

const ACCENTS: Array<{ id: Accent; label: string; color: string }> = [
  { id: 'teal',  label: 'Sarcelle',  color: 'var(--teal-deep)' },
  { id: 'coral', label: 'Corail',    color: 'var(--coral)' },
  { id: 'amber', label: 'Ambre',     color: 'var(--amber)' },
  { id: 'lilac', label: 'Lilas',     color: 'var(--lilac)' },
];

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

  function handleTheme(t: Theme) {
    setTheme(t);
    applyTheme(t);
  }
  function handleDensity(d: Density) {
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
        <div
          className="tweaks-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`tweaks${open ? ' open' : ''}`}
        role="dialog"
        aria-label="Personnalisation de l'interface"
        aria-modal="false"
      >
        <div className="tweaks-head">
          <div className="tweaks-head-left">
            <Icons.Sliders size={15} />
            <span>Personnalisation</span>
          </div>
          <button
            type="button"
            className="tweaks-close"
            onClick={() => setOpen(false)}
            aria-label="Fermer le panneau de personnalisation"
          >
            <Icons.X size={16} />
          </button>
        </div>

        <div className="tweaks-body">
          <div className="tweaks-group">
            <div className="tweaks-label">Apparence</div>
            <div className="seg" role="group" aria-label="Thème">
              <button
                type="button"
                className={theme === 'light' ? 'on' : ''}
                onClick={() => handleTheme('light')}
                aria-pressed={theme === 'light'}
              >
                <Icons.Sun size={13} /> Clair
              </button>
              <button
                type="button"
                className={theme === 'dark' ? 'on' : ''}
                onClick={() => handleTheme('dark')}
                aria-pressed={theme === 'dark'}
              >
                <Icons.Moon size={13} /> Sombre
              </button>
            </div>
          </div>

          <div className="tweaks-group">
            <div className="tweaks-label">Densité</div>
            <div className="seg" role="group" aria-label="Densité">
              <button
                type="button"
                className={density === 'default' ? 'on' : ''}
                onClick={() => handleDensity('default')}
                aria-pressed={density === 'default'}
              >
                <Icons.LayoutGrid size={13} /> Confortable
              </button>
              <button
                type="button"
                className={density === 'compact' ? 'on' : ''}
                onClick={() => handleDensity('compact')}
                aria-pressed={density === 'compact'}
              >
                <Icons.AlignJustify size={13} /> Compacte
              </button>
            </div>
          </div>

          <div className="tweaks-group">
            <div className="tweaks-label">Couleur d&apos;accent</div>
            <div className="swatches" role="group" aria-label="Couleur d'accent">
              {ACCENTS.map(a => (
                <button
                  key={a.id}
                  type="button"
                  className={`swatch${accent === a.id ? ' on' : ''}`}
                  style={{ '--sw': a.color } as React.CSSProperties}
                  onClick={() => handleAccent(a.id)}
                  aria-pressed={accent === a.id}
                  aria-label={a.label}
                  title={a.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
