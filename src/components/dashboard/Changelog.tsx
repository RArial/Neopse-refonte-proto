'use client';

import { useState } from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { Icons } from '@/components/ui/Icons';
import { ChangelogDetail } from './ChangelogDetail';
import { CHANGELOG_META, changelogColor, type ChangelogEntry, type ChangelogType } from './changelogPalette';

interface ChangelogGroup {
  day: string;
  fresh?: boolean;
  items: Omit<ChangelogEntry, 'day'>[];
}

const ENTRIES: ChangelogGroup[] = [
  {
    day: "Aujourd'hui",
    fresh: true,
    items: [
      { type: 'evolution', time: '10:24', title: 'Éditeur de maquettes refondu',       body: 'Glisser-déposer des blocs, prévisualisation multi-écrans et historique des versions intégré.' },
      { type: 'evolution', time: '08:12', title: 'Recherche globale plus rapide',       body: 'Indexation 3× plus rapide sur les pages et actualités. Résultats en moins de 120 ms.' },
    ],
  },
  {
    day: 'Hier',
    items: [
      { type: 'comm',      time: '15:30', title: 'Webinar Neopse — 14 mai',             body: 'Inscrivez-vous au prochain webinar « Optimiser votre site ». 45 min, en ligne.' },
      { type: 'fix',       time: '17:48', title: 'Correction : export PDF des actualités', body: "Les images en haute résolution ne sont plus tronquées lors de l'export." },
    ],
  },
  {
    day: '15 avr.',
    items: [
      { type: 'security',  time: '14:00', title: 'Authentification à 2 facteurs',       body: 'Disponible pour tous les gestionnaires depuis les paramètres du compte.' },
      { type: 'evolution', time: '09:30', title: 'Module Agenda — invitations',          body: 'Partagez un événement par email avec réponse intégrée (participe / peut-être / non).' },
    ],
  },
  {
    day: '12 avr.',
    items: [
      { type: 'comm',      time: '11:00', title: 'Maintenance planifiée — 20 avr.',      body: 'Interruption prévue de 02:00 à 04:00. Aucune action requise de votre part.' },
      { type: 'evolution', time: '16:15', title: 'Accessibilité — contrastes renforcés', body: "Conforme RGAA 4.1 sur l'ensemble des composants du tableau de bord." },
    ],
  },
  {
    day: '08 avr.',
    items: [
      { type: 'fix',       time: '10:05', title: 'Correctif : envoi de newsletter',      body: "Résolution du retard d'envoi observé sur les listes de plus de 500 destinataires." },
    ],
  },
];

const TABS: Array<{ id: 'all' | ChangelogType; label: string }> = [
  { id: 'all',       label: 'Tout' },
  { id: 'evolution', label: 'Évolutions' },
  { id: 'fix',       label: 'Correctifs' },
  { id: 'comm',      label: 'Communication' },
];

export function Changelog() {
  const [tab, setTab] = useState<'all' | ChangelogType>('all');
  const [openEntry, setOpenEntry] = useState<ChangelogEntry | null>(null);

  const filtered = ENTRIES
    .map(g => ({
      ...g,
      items: g.items.filter(it => tab === 'all' || it.type === tab),
    }))
    .filter(g => g.items.length > 0);

  return (
    <>
      <Box
        component="aside"
        aria-labelledby="changelog-heading"
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '14px',
          p: '18px 18px 10px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 120px)',
          minHeight: 540,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              aria-hidden="true"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                bgcolor: 'warning.main',
                color: 'common.white',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Icons.Sparkles size={16} />
            </Box>
            <Box>
              <Typography id="changelog-heading" component="h3" sx={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.005em' }}>
                Journal de bord
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.125 }}>Les nouveautés Neopse</Typography>
            </Box>
          </Box>
          <Box
            component="span"
            aria-label="3 nouveaux éléments"
            sx={(theme) => ({
              bgcolor: 'error.main',
              color: 'common.white',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.04em',
              px: 1,
              py: 0.375,
              borderRadius: '999px',
              textTransform: 'uppercase',
              animation: 'pulse-pill 2.2s ease-in-out infinite',
              '@keyframes pulse-pill': {
                '0%, 100%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0.5)}` },
                '50%': { boxShadow: `0 0 0 6px ${alpha(theme.palette.error.main, 0)}` },
              },
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            })}
          >
            3 new
          </Box>
        </Box>

        <Box
          role="tablist"
          aria-label="Filtrer le journal"
          sx={{ display: 'flex', gap: 0.25, p: 0.375, bgcolor: 'action.hover', borderRadius: '8px', margin: '14px 0 6px' }}
        >
          {TABS.map(t => {
            const isOn = tab === t.id;
            return (
              <Box
                component="button"
                key={t.id}
                onClick={() => setTab(t.id)}
                type="button"
                role="tab"
                aria-selected={isOn}
                sx={{
                  flex: 1,
                  border: 0,
                  bgcolor: isOn ? 'background.paper' : 'transparent',
                  fontSize: 11,
                  fontWeight: 600,
                  color: isOn ? 'text.primary' : 'text.disabled',
                  py: 0.75,
                  px: 0.5,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background .15s, color .15s',
                  fontFamily: 'inherit',
                  boxShadow: isOn ? 1 : 'none',
                }}
              >
                {t.label}
              </Box>
            );
          })}
        </Box>

        <Box
          aria-live="polite"
          aria-atomic="false"
          sx={{
            flex: 1,
            overflowY: 'auto',
            mx: -1,
            px: 1,
            maskImage: 'linear-gradient(to bottom, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)',
          }}
        >
          {filtered.map((group, gi) => (
            <React.Fragment key={gi}>
              <Box
                role="heading"
                aria-level={4}
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'text.disabled',
                  padding: '14px 0 8px',
                }}
              >
                {group.day}
              </Box>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 11,
                    top: 6,
                    bottom: 6,
                    width: 1.5,
                    background: (theme) =>
                      `repeating-linear-gradient(to bottom, ${theme.palette.grey[300]} 0 4px, transparent 4px 8px)`,
                  },
                }}
              >
                {group.items.map((it, ii) => {
                  const meta = CHANGELOG_META[it.type];
                  const TypeIcon = Icons[meta.icon];
                  const isFresh = group.fresh === true && ii === 0;
                  const entry: ChangelogEntry = { ...it, day: group.day };
                  const isLast = ii === group.items.length - 1;
                  return (
                    <Box
                      component="li"
                      key={ii}
                      onClick={() => setOpenEntry(entry)}
                      sx={{
                        position: 'relative',
                        padding: isLast ? '0 0 4px 34px' : '0 0 16px 34px',
                        cursor: 'pointer',
                        '&:hover .tl-dot': {
                          transform: 'scale(1.1)',
                          boxShadow: (theme) => `0 0 0 4px ${alpha(changelogColor(theme, it.type), 0.18)}`,
                        },
                        '&:hover .tl-link': { opacity: 1, transform: 'translateX(0)' },
                      }}
                    >
                      <Box
                        className="tl-dot"
                        aria-hidden="true"
                        sx={[
                          {
                            position: 'absolute',
                            left: 3,
                            top: 2,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            bgcolor: 'background.paper',
                            border: '2px solid',
                            borderColor: (theme) => changelogColor(theme, it.type),
                            display: 'grid',
                            placeItems: 'center',
                            color: (theme) => changelogColor(theme, it.type),
                            transition: 'transform .18s, box-shadow .18s',
                            zIndex: 1,
                          },
                          isFresh && {
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              inset: -3,
                              borderRadius: '50%',
                              border: '2px solid',
                              borderColor: (theme: Theme) => changelogColor(theme, it.type),
                              opacity: 0,
                              animation: 'ping 2s ease-out infinite',
                              '@keyframes ping': {
                                '0%': { transform: 'scale(0.9)', opacity: 0.7 },
                                '100%': { transform: 'scale(1.8)', opacity: 0 },
                              },
                              '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0 },
                            },
                          },
                        ]}
                      >
                        <TypeIcon size={9} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5, flexWrap: 'wrap' }}>
                        <Box
                          component="span"
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '.05em',
                            textTransform: 'uppercase',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: '4px',
                            bgcolor: (theme) => alpha(changelogColor(theme, it.type), 0.12),
                            color: (theme) => changelogColor(theme, it.type),
                          }}
                        >
                          {meta.label}
                        </Box>
                        <Box component="span" sx={{ fontSize: 11, color: 'text.disabled' }}>{it.time}</Box>
                      </Box>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.primary', lineHeight: 1.35, mb: 0.25 }}>
                        {it.title}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5 }}>{it.body}</Typography>
                      <Box
                        component="button"
                        type="button"
                        className="tl-link"
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setOpenEntry(entry); }}
                        aria-label={`En savoir plus sur : ${it.title}`}
                        sx={{
                          mt: 0.75,
                          fontSize: 11,
                          color: 'primary.dark',
                          textDecoration: 'none',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.375,
                          opacity: 0,
                          transform: 'translateX(-4px)',
                          transition: 'opacity .18s, transform .18s',
                          border: 0,
                          bgcolor: 'transparent',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          p: 0,
                        }}
                      >
                        En savoir plus <Icons.ChevronRight size={10} />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </React.Fragment>
          ))}
        </Box>

        <Box
          sx={{
            mt: 0.75,
            pt: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            component="a"
            href="#"
            aria-label="Voir tout le journal de bord"
            sx={{
              fontSize: 12,
              color: 'primary.dark',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Voir tout le journal <Icons.ArrowUpRight size={11} />
          </Box>
          <Box component="span" aria-label="Version 4.12.0" sx={{ fontSize: 11, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
            v 4.12.0
          </Box>
        </Box>
      </Box>

      {openEntry && (
        <ChangelogDetail
          entry={openEntry}
          onClose={() => setOpenEntry(null)}
        />
      )}
    </>
  );
}
