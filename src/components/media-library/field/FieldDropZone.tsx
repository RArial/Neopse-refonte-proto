'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { ACCEPT_ATTRIBUTE, ACCEPTED_FORMATS_LABEL, MAX_FILE_SIZE_BYTES } from '@/lib/mediaLibrary/constants';
import { formatFileSize } from '@/lib/mediaLibrary/format';

export type ImageFieldSize = 'compact' | 'default';

/** Seule la hauteur varie d'un emplacement à l'autre (logos et fonds en compact). */
export const DROP_ZONE_HEIGHT: Record<ImageFieldSize, number> = { compact: 112, default: 160 };
export const PREVIEW_HEIGHT: Record<ImageFieldSize, number> = { compact: 120, default: 200 };

interface FieldDropZoneProps {
  multiple: boolean;
  size?: ImageFieldSize;
  onFiles: (files: File[]) => void;
  onBrowseLibrary: () => void;
}

/** Cas principal : on importe depuis le champ ; la médiathèque ne sert qu'à réutiliser une image existante. */
export function FieldDropZone({ multiple, size = 'default', onFiles, onBrowseLibrary }: FieldDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  function hasFiles(event: DragEvent) {
    return Array.from(event.dataTransfer.types).includes('Files');
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    onFiles(Array.from(event.dataTransfer.files));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    onFiles(files);
  }

  return (
    <Stack spacing={1}>
      <Box
        component="button"
        type="button"
        data-field-import
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          if (!hasFiles(event)) return;
          event.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!hasFiles(event)) return;
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDragOver={(event) => {
          if (!hasFiles(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={handleDrop}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          width: '100%',
          minHeight: DROP_ZONE_HEIGHT[size],
          px: 2,
          py: size === 'compact' ? 1.5 : 3,
          textAlign: 'center',
          font: 'inherit',
          color: 'text.primary',
          cursor: 'pointer',
          borderRadius: 2,
          border: '2px dashed',
          borderColor: dragging ? 'primary.main' : 'grey.600',
          bgcolor: dragging ? 'action.selected' : 'action.hover',
          transition: (theme) => theme.transitions.create(['border-color', 'background-color'], { duration: 150 }),
          '&:hover': { borderColor: 'primary.main', bgcolor: 'action.selected' },
          '&:hover .field-drop-link': { textDecorationThickness: 2 },
          '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <CloudUploadOutlinedIcon color={dragging ? 'primary' : 'action'} aria-hidden="true" />
        <Typography variant="body2" component="span">
          {multiple ? 'Glissez des images ou ' : 'Glissez une image ou '}
          <Box component="span" className="field-drop-link" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            cliquez pour importer
          </Box>
        </Typography>
        {/* Espace explicite : sans lui, le nom accessible colle « importer » et « JPG ». */}
        <span className="sr-only"> </span>
        <Typography variant="caption" component="span" color="text.secondary">
          {ACCEPTED_FORMATS_LABEL} · {formatFileSize(MAX_FILE_SIZE_BYTES)} max
        </Typography>
      </Box>
      <input ref={inputRef} type="file" accept={ACCEPT_ATTRIBUTE} multiple={multiple} hidden onChange={handleChange} tabIndex={-1} aria-hidden="true" />
      <Link component="button" type="button" variant="body2" onClick={onBrowseLibrary} sx={{ alignSelf: 'flex-start' }}>
        {multiple ? 'ou choisir des images existantes' : 'ou choisir une image existante'}
      </Link>
    </Stack>
  );
}
