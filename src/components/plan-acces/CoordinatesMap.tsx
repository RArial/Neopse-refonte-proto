'use client';

import { useRef, type KeyboardEvent, type MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icons } from '@/components/ui/Icons';

// Emprise approximative de la France métropolitaine, pour convertir un clic sur la carte en
// coordonnées plausibles sans dépendre d'un fournisseur de cartes externe.
const LON_MIN = -5;
const LON_MAX = 10;
const LAT_MIN = 41;
const LAT_MAX = 51;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface CoordinatesMapProps {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
}

export function CoordinatesMap({ latitude, longitude, onChange }: CoordinatesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const hasPin = !Number.isNaN(lat) && !Number.isNaN(lon);

  const pinLeftPercent = clamp(((lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100, 0, 100);
  const pinTopPercent = clamp(((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100, 0, 100);

  function pinFromPointer(clientX: number, clientY: number) {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xRatio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const yRatio = clamp((clientY - rect.top) / rect.height, 0, 1);
    const nextLon = LON_MIN + xRatio * (LON_MAX - LON_MIN);
    const nextLat = LAT_MAX - yRatio * (LAT_MAX - LAT_MIN);
    onChange(nextLat.toFixed(5), nextLon.toFixed(5));
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    pinFromPointer(event.clientX, event.clientY);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    // Pas de position de pointeur au clavier : centre le repère sur la carte par défaut.
    onChange((((LAT_MIN + LAT_MAX) / 2)).toFixed(5), (((LON_MIN + LON_MAX) / 2)).toFixed(5));
  }

  return (
    <Box>
      <Box
        ref={mapRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Carte de pointage — cliquez pour positionner le repère à la latitude et la longitude correspondantes"
        sx={{
          position: 'relative',
          height: 260,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          cursor: 'crosshair',
          bgcolor: 'action.hover',
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
        }}
      >
        {hasPin && (
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              left: `${pinLeftPercent}%`,
              top: `${pinTopPercent}%`,
              transform: 'translate(-50%, -100%)',
              color: 'error.main',
              pointerEvents: 'none',
            }}
          >
            <Icons.MapPin size={32} />
          </Box>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
        Cliquez sur la carte pour positionner le repère, ou renseignez directement la latitude et la longitude ci-dessus.
      </Typography>
    </Box>
  );
}
