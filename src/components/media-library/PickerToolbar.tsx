'use client';

import { useRef, type ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import { ACCEPT_ATTRIBUTE } from '@/lib/mediaLibrary/constants';
import type { PickerView } from '@/lib/mediaLibrary/pickerReducer';
import { GRID_SORT_OPTIONS, sortToValue } from '@/lib/mediaLibrary/sort';
import type { MediaFolder, SortState } from '@/types/mediaLibrary';

interface PickerToolbarProps {
  idPrefix: string;
  folderName: string;
  search: string;
  onSearch: (search: string) => void;
  sort: SortState;
  onSort: (sort: SortState) => void;
  view: PickerView;
  onView: (view: PickerView) => void;
  onImport: (files: File[]) => void;
  /** Sélecteur de dossier affiché à la place de l'arborescence sur petit écran. */
  compactFolders?: { folders: MediaFolder[]; folderId: string; onSelect: (folderId: string) => void };
}

export function PickerToolbar({ idPrefix, folderName, search, onSearch, sort, onSort, view, onView, onImport, compactFolders }: PickerToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    onImport(files);
  }

  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      sx={{ alignItems: 'center', px: 3, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexWrap: 'wrap', rowGap: 1.5 }}
    >
      {compactFolders && (
        <TextField
          select
          size="small"
          label="Dossier"
          value={compactFolders.folderId}
          onChange={(event) => compactFolders.onSelect(event.target.value)}
          sx={{ minWidth: 160 }}
        >
          {compactFolders.folders.map((folder) => (
            <MenuItem key={folder.id} value={folder.id}>
              {folder.name}
            </MenuItem>
          ))}
        </TextField>
      )}

      <TextField
        id={`${idPrefix}-search`}
        size="small"
        type="search"
        label="Rechercher par nom"
        placeholder={`Dans « ${folderName} »`}
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        sx={{ flex: '1 1 220px', maxWidth: 360 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onSearch('')} aria-label="Effacer la recherche" edge="end">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
          htmlInput: { 'aria-controls': `${idPrefix}-results` },
        }}
      />

      {view === 'grid' && (
        <TextField
          select
          size="small"
          label="Trier par"
          value={sortToValue(sort)}
          onChange={(event) => {
            const option = GRID_SORT_OPTIONS.find((item) => item.value === event.target.value);
            if (option) onSort(option.sort);
          }}
          sx={{ minWidth: 200 }}
        >
          {GRID_SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}

      <ToggleButtonGroup exclusive size="small" value={view} onChange={(_, next: PickerView | null) => next && onView(next)} aria-label="Affichage">
        <ToggleButton value="grid" aria-label="Afficher en grille" sx={{ minWidth: 44, minHeight: 40 }}>
          <GridViewOutlinedIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="list" aria-label="Afficher en liste" sx={{ minWidth: 44, minHeight: 40 }}>
          <ViewListOutlinedIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ flex: 1 }} />

      <Button variant="outlined" startIcon={<FileUploadOutlinedIcon />} onClick={() => fileInputRef.current?.click()}>
        Importer des images
      </Button>
      <input ref={fileInputRef} type="file" accept={ACCEPT_ATTRIBUTE} multiple hidden onChange={handleFiles} tabIndex={-1} aria-hidden="true" />
    </Stack>
  );
}
