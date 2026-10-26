'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlipIcon from '@mui/icons-material/Flip';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { CroppedImage, OrientedImage } from '@/components/media-library/CroppedImage';
import { useElementSize } from '@/hooks/useElementSize';
import { MAX_CROP_ZOOM } from '@/lib/mediaLibrary/constants';
import {
  INITIAL_CROP_STATE,
  clampZoom,
  getCropArea,
  nextQuarterTurn,
  normalizeCropState,
  rotatedSize,
  type CropState,
} from '@/lib/mediaLibrary/crop';
import { formatRatio } from '@/lib/mediaLibrary/format';
import type { AspectRatio, MediaImage } from '@/types/mediaLibrary';

interface CropStepProps {
  idPrefix: string;
  image: MediaImage;
  ratio: AspectRatio;
  crop: CropState;
  onChange: (crop: CropState) => void;
  isNarrow: boolean;
}

const STAGE_PADDING = 24;
const KEY_STEP = 0.01;
const KEY_STEP_LARGE = 0.05;
const ZOOM_STEP = 0.1;

export function CropStep({ idPrefix, image, ratio, crop, onChange, isNarrow }: CropStepProps) {
  const [stageRef, stageSize] = useElementSize<HTMLDivElement>();
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; startX: number; startY: number; origin: CropState } | null>(null);
  const [announcement, setAnnouncement] = useState('');

  // Le gestionnaire de molette est natif (non passif) : il lit l'état courant via une ref.
  const latest = useRef({ crop, onChange });
  useEffect(() => {
    latest.current = { crop, onChange };
  });

  const oriented = rotatedSize(image, crop.rotation);
  const area = getCropArea(crop, image, ratio);
  const availableWidth = Math.max(stageSize.width - STAGE_PADDING * 2, 0);
  const availableHeight = Math.max(stageSize.height - STAGE_PADDING * 2, 0);
  const scale = Math.min(availableWidth / oriented.width, availableHeight / oriented.height);
  const box = { width: oriented.width * scale, height: oriented.height * scale };

  function update(next: CropState) {
    onChange(normalizeCropState(next, image, ratio));
  }

  // Le cadre n'existe qu'une fois la scène mesurée : on lui donne le focus à sa première apparition.
  const frameReady = box.width > 0;
  useEffect(() => {
    if (frameReady) frameRef.current?.focus();
  }, [frameReady]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const { crop: current, onChange: emit } = latest.current;
      const zoom = clampZoom(current.zoom * (event.deltaY < 0 ? 1.08 : 1 / 1.08));
      emit(normalizeCropState({ ...current, zoom }, image, ratio));
    }
    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => stage.removeEventListener('wheel', handleWheel);
  }, [image, ratio, stageRef]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, origin: crop };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId || box.width === 0) return;
    const dx = (event.clientX - current.startX) / box.width;
    const dy = (event.clientY - current.startY) / box.height;
    update({ ...current.origin, centerX: current.origin.centerX + dx, centerY: current.origin.centerY + dy });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (moves[event.key]) {
      event.preventDefault();
      const [dx, dy] = moves[event.key];
      const next = normalizeCropState({ ...crop, centerX: crop.centerX + dx, centerY: crop.centerY + dy }, image, ratio);
      onChange(next);
      const nextArea = getCropArea(next, image, ratio);
      setAnnouncement(`Cadre à ${Math.round(nextArea.x * 100)} % du bord gauche et ${Math.round(nextArea.y * 100)} % du haut.`);
      return;
    }
    if (event.key === '+' || event.key === '=' || event.key === '-') {
      event.preventDefault();
      const zoom = clampZoom(crop.zoom + (event.key === '-' ? -ZOOM_STEP : ZOOM_STEP));
      update({ ...crop, zoom });
      setAnnouncement(`Zoom ${Math.round(zoom * 100)} %.`);
    }
  }

  const helpId = `${idPrefix}-crop-help`;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 260px', gridTemplateRows: isNarrow ? 'minmax(260px, 1fr) auto' : '1fr', height: '100%', minHeight: 0 }}>
      <Box
        ref={stageRef}
        sx={{ position: 'relative', minHeight: 0, overflow: 'hidden', bgcolor: 'grey.900', display: 'grid', placeItems: 'center' }}
      >
        {box.width > 0 && (
          <Box sx={{ position: 'relative', width: box.width, height: box.height, overflow: 'hidden' }}>
            <OrientedImage image={image} rotation={crop.rotation} flipped={crop.flipped} alt="" />
            <Box
              ref={frameRef}
              tabIndex={0}
              role="group"
              aria-roledescription="cadre déplaçable"
              aria-label="Zone conservée"
              aria-describedby={helpId}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
              sx={(theme) => ({
                position: 'absolute',
                left: area.x * box.width,
                top: area.y * box.height,
                width: area.width * box.width,
                height: area.height * box.height,
                cursor: 'move',
                touchAction: 'none',
                border: '2px solid',
                borderColor: 'common.white',
                // Assombrit tout ce qui sera coupé, sans calque supplémentaire.
                boxShadow: `0 0 0 9999px ${alpha(theme.palette.common.black, 0.55)}`,
                backgroundImage: `linear-gradient(to right, transparent calc(33.33% - 0.5px), ${alpha(theme.palette.common.white, 0.5)} 33.33%, transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), ${alpha(theme.palette.common.white, 0.5)} 66.66%, transparent calc(66.66% + 0.5px)), linear-gradient(to bottom, transparent calc(33.33% - 0.5px), ${alpha(theme.palette.common.white, 0.5)} 33.33%, transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), ${alpha(theme.palette.common.white, 0.5)} 66.66%, transparent calc(66.66% + 0.5px))`,
                '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.light', outlineOffset: 2 },
              })}
            />
          </Box>
        )}
        <Box aria-live="polite" className="sr-only">
          {announcement}
        </Box>
      </Box>

      <Stack spacing={2.5} sx={{ p: 2.5, borderLeft: isNarrow ? 0 : '1px solid', borderTop: isNarrow ? '1px solid' : 0, borderColor: 'divider', overflowY: 'auto' }}>
        <Box>
          <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
            Format {formatRatio(ratio)}, imposé par l&apos;emplacement
          </Typography>
          <Typography id={helpId} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Faites glisser le cadre pour choisir la partie de l&apos;image à garder. Au clavier : flèches pour le déplacer (Maj pour aller plus vite), + et − pour zoomer.
          </Typography>
        </Box>

        <Box>
          <Typography id={`${idPrefix}-zoom-label`} variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Zoom
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <ZoomOutIcon fontSize="small" color="action" aria-hidden="true" />
            <Slider
              value={crop.zoom}
              min={1}
              max={MAX_CROP_ZOOM}
              step={0.05}
              onChange={(_, value) => update({ ...crop, zoom: value as number })}
              getAriaValueText={(value) => `${Math.round(value * 100)} %`}
              valueLabelFormat={(value) => `${Math.round(value * 100)} %`}
              valueLabelDisplay="auto"
              slotProps={{ input: { 'aria-labelledby': `${idPrefix}-zoom-label` } }}
            />
            <ZoomInIcon fontSize="small" color="action" aria-hidden="true" />
          </Stack>
        </Box>

        <Stack spacing={1}>
          <Button size="small" variant="outlined" startIcon={<RotateRightIcon />} onClick={() => update({ ...crop, rotation: nextQuarterTurn(crop.rotation), centerX: 0.5, centerY: 0.5 })}>
            Pivoter de 90°
          </Button>
          <Button size="small" variant="outlined" startIcon={<FlipIcon />} onClick={() => update({ ...crop, flipped: !crop.flipped, centerX: 1 - crop.centerX })} aria-pressed={crop.flipped}>
            Retourner
          </Button>
          <Button size="small" variant="text" startIcon={<RestartAltIcon />} onClick={() => onChange(INITIAL_CROP_STATE)}>
            Réinitialiser
          </Button>
        </Stack>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75 }}>
            Aperçu
          </Typography>
          <Box sx={{ borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <CroppedImage image={image} crop={area} ratio={ratio} alt="" />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
