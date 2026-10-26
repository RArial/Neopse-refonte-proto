'use client';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { imageInputId } from '@/components/media-library/ImageGrid';
import { MediaThumb } from '@/components/media-library/MediaThumb';
import { formatDate, formatDimensions, formatFileSize } from '@/lib/mediaLibrary/format';
import type { ImagePickerMode, MediaImage, SortDirection, SortKey, SortState } from '@/types/mediaLibrary';

interface ImageListViewProps {
  images: MediaImage[];
  mode: ImagePickerMode;
  caption: string;
  idPrefix: string;
  selectedIds: string[];
  currentImageId?: string;
  newImageIds: string[];
  sort: SortState;
  onSort: (sort: SortState) => void;
  onToggle: (imageId: string) => void;
}

const COLUMNS: { key: SortKey; label: string; firstDirection: SortDirection; align?: 'right' }[] = [
  { key: 'name', label: 'Nom', firstDirection: 'asc' },
  { key: 'dimensions', label: 'Dimensions', firstDirection: 'desc' },
  { key: 'size', label: 'Poids', firstDirection: 'desc', align: 'right' },
  { key: 'date', label: 'Ajoutée le', firstDirection: 'desc' },
];

const DIRECTION_LABEL: Record<SortDirection, string> = { asc: 'croissant', desc: 'décroissant' };

export function ImageListView({ images, mode, caption, idPrefix, selectedIds, currentImageId, newImageIds, sort, onSort, onToggle }: ImageListViewProps) {
  function handleSort(key: SortKey, firstDirection: SortDirection) {
    if (sort.key !== key) return onSort({ key, direction: firstDirection });
    onSort({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
  }

  const SelectionControl = mode === 'single' ? Radio : Checkbox;

  return (
    <Table size="small" stickyHeader aria-label={caption}>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <span className="sr-only">Sélection</span>
          </TableCell>
          <TableCell sx={{ width: 72 }}>
            <span className="sr-only">Aperçu</span>
          </TableCell>
          {COLUMNS.map((column) => {
            const active = sort.key === column.key;
            return (
              <TableCell key={column.key} align={column.align} sortDirection={active ? sort.direction : false} sx={{ whiteSpace: 'nowrap' }}>
                <TableSortLabel
                  active={active}
                  direction={active ? sort.direction : column.firstDirection}
                  onClick={() => handleSort(column.key, column.firstDirection)}
                  sx={{ fontWeight: 600, '&.Mui-active': { color: 'primary.main' }, '&.Mui-active .MuiTableSortLabel-icon': { color: 'primary.main' } }}
                >
                  {column.label}
                  {active && <span className="sr-only">, tri {DIRECTION_LABEL[sort.direction]}</span>}
                </TableSortLabel>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {images.map((image) => {
          const order = selectedIds.indexOf(image.id) + 1;
          const inputId = imageInputId(idPrefix, image.id);
          return (
            <TableRow key={image.id} hover selected={order > 0} onClick={() => onToggle(image.id)} sx={{ cursor: 'pointer' }}>
              <TableCell padding="checkbox">
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <SelectionControl
                    checked={order > 0}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => onToggle(image.id)}
                    slotProps={{ input: { id: inputId, 'aria-label': image.name } }}
                    name={mode === 'single' ? `${idPrefix}-selection` : undefined}
                  />
                  {mode === 'multiple' && order > 0 && (
                    <Typography variant="caption" sx={{ fontWeight: 700, minWidth: 16 }} aria-hidden="true">
                      {order}
                    </Typography>
                  )}
                </Stack>
              </TableCell>
              <TableCell>
                <Box sx={{ position: 'relative', width: 56, height: 42, borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover' }}>
                  <MediaThumb src={image.url} sizes="56px" />
                </Box>
              </TableCell>
              <TableCell sx={{ minWidth: 160, maxWidth: 320 }}>
                <Typography
                  variant="body2"
                  title={image.name}
                  sx={{ wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {image.name}
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.25 }}>
                  {image.id === currentImageId && <Chip label="Actuelle" size="small" color="secondary" />}
                  {newImageIds.includes(image.id) && <Chip label="Nouvelle" size="small" color="primary" />}
                </Stack>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDimensions(image.width, image.height)}</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                {formatFileSize(image.size)}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(image.createdAt)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
