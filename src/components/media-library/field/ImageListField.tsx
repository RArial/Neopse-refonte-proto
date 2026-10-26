'use client';

import { useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { AltTextField } from '@/components/media-library/field/AltTextField';
import { FieldDropZone } from '@/components/media-library/field/FieldDropZone';
import { FieldUploadStatus } from '@/components/media-library/field/FieldUploadStatus';
import type { ImageFieldConfig } from '@/components/media-library/field/ImageField';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { useFieldUploads } from '@/hooks/useFieldUploads';
import { fileNameFromUrl, pluralize } from '@/lib/mediaLibrary/format';
import { withStrongPrimary } from '@/lib/theme';

interface ImageListFieldProps {
  config: Omit<ImageFieldConfig, 'ratio' | 'recommendation'>;
  urls: string[];
  /** Mise à jour fonctionnelle : plusieurs imports peuvent aboutir avant le rendu suivant. */
  onChange: (update: (urls: string[]) => string[]) => void;
}

function appendUnique(urls: string[], added: string[]): string[] {
  return [...urls, ...added.filter((url) => !urls.includes(url))];
}

/** Champ plusieurs images (diaporama) : ordre conservé, texte alternatif par image si demandé. */
export function ImageListField({ config, urls, onChange }: ImageListFieldProps) {
  const { images, openImagePicker } = useMediaLibrary();
  const listRef = useRef<HTMLDivElement>(null);
  const uploads = useFieldUploads({ folder: config.folder, onImage: (image) => onChange((current) => appendUnique(current, [image.url])) });

  async function browseLibrary() {
    const result = await openImagePicker({ ...config, mode: 'multiple' });
    if (result) onChange((current) => appendUnique(current, result.map((item) => item.image.url)));
  }

  function remove(url: string) {
    onChange((current) => current.filter((item) => item !== url));
    // La ligne retirée emporte le focus : on le place sur le bouton d'import, toujours présent.
    requestAnimationFrame(() => listRef.current?.querySelector<HTMLButtonElement>('[data-field-import]')?.focus());
  }

  return (
    <ThemeProvider theme={withStrongPrimary}>
      <Stack spacing={1.5} ref={listRef}>
        {urls.length > 0 && (
          <>
            <Typography variant="body2" color="text.secondary">
              {pluralize(urls.length, 'image', 'images')}, dans l&apos;ordre d&apos;affichage
            </Typography>
            <Stack component="ol" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {urls.map((url, index) => {
                const image = images.find((item) => item.url === url);
                const name = image?.name ?? fileNameFromUrl(url);
                return (
                  <Stack
                    component="li"
                    key={url}
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: 'flex-start', p: 1, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
                  >
                    <Box sx={{ position: 'relative', width: 96, height: 72, flexShrink: 0, borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover' }}>
                      <MediaThumb src={url} alt={config.altText === 'ask' ? (image?.altText ?? '') : ''} sizes="96px" />
                    </Box>
                    <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" title={name} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Box component="span" sx={{ fontWeight: 700 }}>{index + 1}.</Box> {name}
                      </Typography>
                      {config.altText === 'ask' && image && (
                        <AltTextField image={image} compact ariaLabel={`Texte alternatif de l'image ${index + 1}, ${name}`} />
                      )}
                    </Stack>
                    <IconButton size="small" onClick={() => remove(url)} aria-label={`Retirer ${name}`}>
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                );
              })}
            </Stack>
          </>
        )}

        <FieldUploadStatus uploads={uploads.uploads} onDiscard={uploads.discard} onUseExisting={uploads.keepExisting} onForceUpload={uploads.force} />
        <FieldDropZone multiple onFiles={uploads.importFiles} onBrowseLibrary={browseLibrary} />
      </Stack>
    </ThemeProvider>
  );
}
