'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { ACCEPT_ATTRIBUTE, ACCEPTED_FORMATS_LABEL, MAX_FILE_SIZE_BYTES } from '@/lib/mediaLibrary/constants';
import { formatFileSize } from '@/lib/mediaLibrary/format';

interface FieldDropZoneProps {
  multiple: boolean;
  folder: string;
  onFiles: (files: File[]) => void;
  onBrowseLibrary: () => void;
}

/** Cas principal : on importe depuis le champ ; la médiathèque ne sert qu'à réutiliser une image existante. */
export function FieldDropZone({ multiple, folder, onFiles, onBrowseLibrary }: FieldDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  function hasFiles(event: DragEvent) {
    return Array.from(event.dataTransfer.types).includes('Files');
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
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
          gap: 1,
          minHeight: 160,
          px: 2,
          py: 3,
          textAlign: 'center',
          borderRadius: 2,
          border: '2px dashed',
          borderColor: dragging ? 'primary.main' : 'divider',
          bgcolor: dragging ? 'action.selected' : 'action.hover',
          transition: (theme) => theme.transitions.create(['border-color', 'background-color'], { duration: 150 }),
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <CloudUploadOutlinedIcon color={dragging ? 'primary' : 'action'} aria-hidden="true" />
        <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2">{multiple ? 'Glissez des images ici ou' : 'Glissez une image ici ou'}</Typography>
          <Button size="small" variant="contained" onClick={() => inputRef.current?.click()}>
            {multiple ? 'Importer des images' : 'Importer une image'}
          </Button>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {ACCEPTED_FORMATS_LABEL} · {formatFileSize(MAX_FILE_SIZE_BYTES)} max · rangée{multiple ? 's' : ''} dans « {folder} »
        </Typography>
        <input ref={inputRef} type="file" accept={ACCEPT_ATTRIBUTE} multiple={multiple} hidden onChange={handleChange} tabIndex={-1} aria-hidden="true" />
      </Box>
      <Link component="button" type="button" variant="body2" onClick={onBrowseLibrary} sx={{ alignSelf: 'flex-start' }}>
        ou choisir parmi les images du site
      </Link>
    </Stack>
  );
}
