'use client';

import { useEffect, useRef, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import ListIcon from '@mui/icons-material/List';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { SwatchSelect } from '@/components/personnalisation/color-panel/SwatchSelect';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { gabaritLabel, resolveRevealTarget } from '@/lib/personnalisation/previewRoles';
import type { PropertyDef, PropertyIcon } from '@/lib/personnalisation/colorModel';
import type { ColorKey, ModuleKey, Palette, SectionKey } from '@/types/personnalisation';

const ICONS: Record<PropertyIcon, ComponentType<{ fontSize?: 'small' | 'inherit' }>> = {
  fill: FormatColorFillIcon,
  titleText: TextFieldsIcon,
  bodyText: TextFormatIcon,
  button: SmartButtonIcon,
  dropdown: ListIcon,
};

// Le temps de laisser l'accordéon/le drawer contenant la ligne finir de s'ouvrir avant de scroller,
// et la durée pendant laquelle la surbrillance reste visible une fois la ligne atteinte.
const SCROLL_DELAY_MS = 350;
const HIGHLIGHT_DURATION_MS = 2200;

export function propertyRowId(owner: SectionKey | ModuleKey, key: string): string {
  return `property-row-${owner}-${key}`;
}

interface PropertyRowProps {
  owner: SectionKey | ModuleKey;
  def: PropertyDef;
  palette: Palette;
  resolvedColorKey: ColorKey | null;
  alpha: number;
  againstColorKey: ColorKey | null;
  onChangeColor: (colorKey: ColorKey | null) => void;
  onChangeAlpha: (alpha: number) => void;
  /** Si fourni, affiche un bouton « Rétablir » aligné à droite du sélecteur de couleur. */
  onReset?: () => void;
}

export function PropertyRow({ owner, def, palette, resolvedColorKey, alpha, againstColorKey, onChangeColor, onChangeAlpha, onReset }: PropertyRowProps) {
  const Icon = ICONS[def.icon];
  const { highlightTarget, clearHighlight, previewPageId, requestReveal } = usePersonnalisation();
  const isHighlighted = highlightTarget?.owner === owner && highlightTarget?.propertyKey === def.key;
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHighlighted) return;
    const scrollTimer = window.setTimeout(() => {
      rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, SCROLL_DELAY_MS);
    const clearTimer = window.setTimeout(clearHighlight, HIGHLIGHT_DURATION_MS);
    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [isHighlighted, clearHighlight]);

  const revealTarget = resolveRevealTarget(owner, def.key, previewPageId);
  const canVisualize = revealTarget.hasKnownAnchor;
  const eyeTooltip = revealTarget.pageId !== previewPageId ? `Voir sur ${gabaritLabel(revealTarget.pageId)}` : "Voir dans l'aperçu";

  return (
    <Box
      ref={rowRef}
      id={propertyRowId(owner, def.key)}
      sx={{
        py: 1,
        px: 2,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        columnGap: 1,
        rowGap: 0.75,
        transition: 'background-color .4s ease, box-shadow .4s ease',
        bgcolor: isHighlighted ? 'warning.light' : 'transparent',
        boxShadow: isHighlighted ? (theme) => `inset 0 0 0 2px ${theme.palette.warning.main}` : 'none',
        '&:hover .property-row-eye, &:focus-within .property-row-eye': { opacity: 1 },
      }}
    >
      {/* Ligne 1 : icône + titre, sur la grille à deux colonnes. */}
      <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }} aria-hidden="true">
        <Icon fontSize="small" />
      </Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 0, flex: 1, whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {def.label}
        </Typography>
        {canVisualize && (
          <Tooltip title={eyeTooltip}>
            <IconButton
              size="small"
              className="property-row-eye"
              onClick={() => requestReveal(owner, def.key)}
              aria-label={`${eyeTooltip} — ${def.label}`}
              sx={{
                opacity: 0,
                flexShrink: 0,
                '@media (hover: none)': { opacity: 1 },
                '@media (prefers-reduced-motion: no-preference)': { transition: 'opacity 150ms ease' },
              }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* Ligne 2 : sélecteur de couleur + opacité. `gridColumn: '1 / -1'` la fait démarrer au bord
          gauche de la grille — sous l'icône, pas sous le titre — au lieu de rester cantonnée à la
          colonne 2 comme la ligne du dessus. */}
      <Stack direction="row" spacing={1} sx={{ gridColumn: '1 / -1', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {/* Pas de `flex: 1` / `minWidth: 0` ici : le sélecteur a un `minWidth` fixe (voir SwatchSelect) et
            forcer le rétrécissement de ce conteneur en dessous le faisait déborder visuellement sous le
            bouton Rétablir plutôt que de repousser correctement celui-ci. */}
        <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
          <SwatchSelect
            label={def.label}
            palette={palette}
            value={resolvedColorKey}
            againstColorKey={def.kind === 'bg' ? null : againstColorKey}
            allowAuto={def.kind === 'text-derived'}
            onChange={onChangeColor}
          />
          {resolvedColorKey !== null && (
            <Slider
              size="small"
              value={Math.round(alpha * 100)}
              onChange={(_, v) => onChangeAlpha((v as number) / 100)}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
              aria-label={`Opacité : ${def.label}`}
              sx={{ width: '100%', maxWidth: 220 }}
            />
          )}
        </Stack>
        {onReset && (
          <Tooltip title="Réinitialiser cette propriété">
            <IconButton size="small" onClick={onReset} aria-label={`Réinitialiser ${def.label}`} sx={{ flexShrink: 0, ml: 'auto' }}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}
