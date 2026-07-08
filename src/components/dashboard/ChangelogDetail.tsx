'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { Icons, type IconName } from '@/components/ui/Icons';
import { CHANGELOG_META as TYPE_META, changelogColor, type ChangelogEntry, type ChangelogType } from './changelogPalette';

export type { ChangelogEntry, ChangelogType };

interface HighlightItem { icon: IconName; title: string; desc: string; }
type Section =
  | { kind: 'highlights'; title: string; items: HighlightItem[] }
  | { kind: 'text'; title: string; body: string }
  | { kind: 'tags'; items: string[] };

interface Detail {
  type: ChangelogType;
  version: string;
  date: string;
  author: string;
  readTime: string;
  summary: string;
  sections: Section[];
  related: Array<{ type: ChangelogType; title: string; date: string }>;
}

const DETAILS: Record<string, Detail> = {
  'Éditeur de maquettes refondu': {
    type: 'evolution',
    version: 'v 4.12.0',
    date: "Aujourd'hui · 10:24",
    author: 'Équipe Produit Neopse',
    readTime: '3 min de lecture',
    summary: "L'éditeur de maquettes a été entièrement repensé pour vous faire gagner du temps. Glisser-déposer fluide, prévisualisation multi-écrans et historique des versions sont désormais intégrés dans une même interface.",
    sections: [
      {
        kind: 'highlights',
        title: 'Ce qui change',
        items: [
          { icon: 'Edit',     title: 'Drag & drop des blocs',        desc: 'Réorganisez vos sections sans rechargement.' },
          { icon: 'Globe',    title: 'Prévisualisation multi-écrans', desc: 'Mobile, tablette, desktop en un clic.' },
          { icon: 'Clock',    title: 'Historique des versions',      desc: "Revenez à n'importe quelle version sauvegardée." },
          { icon: 'Sparkles', title: 'Suggestions de mise en page',  desc: 'Templates contextuels selon le type de page.' },
        ],
      },
      {
        kind: 'text',
        title: 'Pourquoi ce changement ?',
        body: "Suite à vos retours sur la complexité de l'ancien éditeur, nous l'avons réécrit en gardant un seul objectif : que vous puissiez modifier une page en moins d'une minute. La nouvelle interface réduit de 60 % le nombre de clics nécessaires pour les opérations courantes.",
      },
      { kind: 'tags', items: ['Éditeur', 'Pages', 'Maquettes', 'UX'] },
    ],
    related: [
      { type: 'evolution', title: 'Recherche globale plus rapide', date: "Aujourd'hui" },
      { type: 'evolution', title: 'Module Agenda — invitations',   date: '15 avr.' },
    ],
  },
};

function defaultDetail(entry: ChangelogEntry): Detail {
  return {
    type: entry.type,
    version: 'v 4.12.0',
    date: `${entry.day} · ${entry.time}`,
    author: 'Équipe Produit Neopse',
    readTime: '2 min de lecture',
    summary: entry.body,
    sections: [
      { kind: 'text', title: 'Détails', body: "Cette mise à jour fait partie de notre cycle d'amélioration continue. Aucune action n'est requise de votre part — les changements sont déjà actifs sur votre espace." },
      { kind: 'tags', items: ['Mise à jour', 'Neopse'] },
    ],
    related: [],
  };
}

interface Props {
  entry: ChangelogEntry;
  onClose: () => void;
}

export function ChangelogDetail({ entry, onClose }: Props) {
  const detail = DETAILS[entry.title] ?? defaultDetail(entry);
  const meta = TYPE_META[detail.type];
  const TypeIcon = Icons[meta.icon];

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      transitionDuration={320}
      slotProps={{
        paper: { sx: { width: 'min(720px, 96vw)', boxShadow: '-20px 0 60px -20px rgba(0,0,0,.25)' } },
        backdrop: {
          sx: { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.35), backdropFilter: 'blur(4px)' },
        },
      }}
    >
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '16px 28px',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 2,
        }}
      >
        <Button
          onClick={onClose}
          startIcon={<Icons.ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />}
          sx={{ color: 'text.secondary', fontWeight: 600, fontSize: 13 }}
        >
          Retour au journal
        </Button>
        <IconButton onClick={onClose} aria-label="Fermer le panneau" sx={{ bgcolor: 'action.hover', color: 'text.secondary', borderRadius: '10px' }}>
          <Icons.X size={18} />
        </IconButton>
      </Box>

      <Box sx={{ position: 'relative', p: '36px 36px 28px', overflow: 'hidden' }}>
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: (theme) =>
              `radial-gradient(60% 80% at 90% 10%, ${alpha(changelogColor(theme, detail.type), 0.22)}, transparent 60%), linear-gradient(180deg, ${alpha(changelogColor(theme, detail.type), 0.12)}, transparent 75%)`,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.625,
              bgcolor: (theme) => changelogColor(theme, detail.type),
              color: 'common.white',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              px: 1.25,
              py: 0.625,
              borderRadius: '999px',
              mb: 1.75,
            }}
          >
            <TypeIcon size={12} />
            {meta.label}
          </Box>
          <Typography component="h1" sx={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, m: '0 0 14px', color: 'text.primary' }}>
            {entry.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 12, color: 'text.secondary', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>
              <Icons.Clock size={12} />{detail.date}
            </Box>
            <Box aria-hidden="true" sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>
              <Icons.User size={12} />{detail.author}
            </Box>
            <Box aria-hidden="true" sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.625 }}>{detail.readTime}</Box>
            <Box
              sx={{
                ml: 'auto',
                fontSize: 11,
                color: 'text.disabled',
                px: 1,
                py: 0.375,
                borderRadius: '6px',
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {detail.version}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: '8px 36px 36px' }}>
        <Typography
          sx={{
            fontSize: 16,
            lineHeight: 1.6,
            color: 'text.primary',
            m: '16px 0 28px',
            p: '18px 20px',
            borderLeft: '3px solid',
            borderColor: (theme) => changelogColor(theme, detail.type),
            bgcolor: 'action.hover',
            borderRadius: '0 10px 10px 0',
          }}
        >
          {detail.summary}
        </Typography>

        {detail.sections.map((s, i) => {
          if (s.kind === 'highlights') {
            return (
              <Box component="section" key={i} sx={{ mb: 3.5 }}>
                <Typography component="h2" sx={{ fontSize: 14, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'text.secondary', m: '0 0 12px' }}>
                  {s.title}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.25 }}>
                  {s.items.map((h, j) => {
                    const HIcon = Icons[h.icon];
                    return (
                      <Box
                        key={j}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          p: 1.75,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: '12px',
                          bgcolor: 'background.paper',
                          transition: 'border-color .15s, transform .15s',
                          '&:hover': { borderColor: (theme) => changelogColor(theme, detail.type), transform: 'translateY(-1px)' },
                        }}
                      >
                        <Box
                          aria-hidden="true"
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '9px',
                            bgcolor: (theme) => alpha(changelogColor(theme, detail.type), 0.12),
                            color: (theme) => changelogColor(theme, detail.type),
                            display: 'grid',
                            placeItems: 'center',
                            flex: '0 0 32px',
                          }}
                        >
                          <HIcon size={16} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', mb: 0.25 }}>{h.title}</Typography>
                          <Typography sx={{ fontSize: 12, color: 'text.disabled', lineHeight: 1.4 }}>{h.desc}</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          }
          if (s.kind === 'text') {
            return (
              <Box component="section" key={i} sx={{ mb: 3.5 }}>
                <Typography component="h2" sx={{ fontSize: 14, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'text.secondary', m: '0 0 12px' }}>
                  {s.title}
                </Typography>
                <Typography sx={{ fontSize: 14, lineHeight: 1.65, color: 'text.primary', m: 0 }}>{s.body}</Typography>
              </Box>
            );
          }
          if (s.kind === 'tags') {
            return (
              <Box component="section" key={i} aria-label="Étiquettes" sx={{ mb: 3.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {s.items.map((tag, j) => (
                  <Box
                    component="span"
                    key={j}
                    sx={{ fontSize: 11, fontWeight: 600, px: 1.25, py: 0.5, borderRadius: '999px', bgcolor: 'action.hover', color: 'text.secondary', border: '1px solid', borderColor: 'divider' }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            );
          }
          return null;
        })}

        {detail.related.length > 0 && (
          <Box component="section" sx={{ mb: 3.5 }}>
            <Typography component="h2" sx={{ fontSize: 14, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'text.secondary', m: '0 0 12px' }}>
              Autres évolutions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {detail.related.map((r, i) => {
                const rMeta = TYPE_META[r.type];
                const RIcon = Icons[rMeta.icon];
                return (
                  <Box
                    component="a"
                    key={i}
                    href="#"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: '12px 14px',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: 'text.primary',
                      transition: 'border-color .15s, transform .15s',
                      '&:hover': { borderColor: (theme) => changelogColor(theme, r.type), transform: 'translateX(2px)' },
                    }}
                  >
                    <Box
                      aria-hidden="true"
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        bgcolor: (theme) => alpha(changelogColor(theme, r.type), 0.12),
                        color: (theme) => changelogColor(theme, r.type),
                        display: 'grid',
                        placeItems: 'center',
                        flex: '0 0 28px',
                      }}
                    >
                      <RIcon size={14} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{r.title}</Typography>
                      <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{TYPE_META[r.type].label} · {r.date}</Typography>
                    </Box>
                    <Icons.ChevronRight size={14} />
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        <Box
          component="footer"
          sx={{ mt: 4, pt: 2.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
        >
          <Button variant="outlined" color="inherit" startIcon={<Icons.BookOpen size={14} />} sx={{ color: 'text.secondary', borderColor: 'divider' }}>
            Lire l&apos;article complet
          </Button>
          <Button variant="contained" sx={{ ml: 'auto' }}>
            Voir tout le journal
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
