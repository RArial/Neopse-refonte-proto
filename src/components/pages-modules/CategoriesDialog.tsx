'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { Category } from '@/types/pagesModules';

interface CategoriesDialogProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  /** Catégorie actuellement sélectionnée dans le formulaire — ne peut pas être supprimée. */
  selectedCategoryId: string;
  /** Message affiché quand la suppression est bloquée car la catégorie est sélectionnée. */
  inUseMessage?: string;
  onAddCategory: () => string;
  onRenameCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoriesDialog({
  open,
  onClose,
  categories,
  selectedCategoryId,
  inUseMessage = 'Catégorie utilisée par cet élément',
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
}: CategoriesDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleAdd() {
    const id = onAddCategory();
    setEditingId(id);
  }

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="categories-dialog-title" maxWidth="xs" fullWidth>
      <DialogTitle id="categories-dialog-title">Gérer les catégories</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          {categories.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Aucune catégorie pour le moment.
            </Typography>
          )}
          {categories.map((category) => {
            const isEditing = editingId === category.id;
            const isUsed = category.id === selectedCategoryId;
            return (
              <Stack key={category.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {isEditing ? (
                  <TextField
                    label="Nom de la catégorie"
                    value={category.name}
                    onChange={(event) => onRenameCategory(category.id, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        setEditingId(null);
                      }
                    }}
                    size="small"
                    fullWidth
                    autoFocus
                  />
                ) : (
                  <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}>
                    {category.name || 'Catégorie sans nom'}
                  </Typography>
                )}
                {isEditing ? (
                  <Tooltip title="Valider le nom">
                    <IconButton
                      onClick={() => setEditingId(null)}
                      aria-label={`Valider le nom de la catégorie ${category.name || 'sans titre'}`}
                      sx={{ flexShrink: 0 }}
                    >
                      <CheckOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Renommer">
                    <IconButton
                      onClick={() => setEditingId(category.id)}
                      aria-label={`Renommer la catégorie ${category.name || 'sans titre'}`}
                      sx={{ flexShrink: 0 }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={isUsed ? inUseMessage : 'Supprimer'}>
                  <span>
                    <IconButton
                      onClick={() => onDeleteCategory(category.id)}
                      disabled={isUsed}
                      aria-label={`Supprimer la catégorie ${category.name || 'sans titre'}`}
                      sx={{ flexShrink: 0 }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            );
          })}
          <Button type="button" variant="outlined" color="inherit" startIcon={<AddIcon fontSize="small" />} onClick={handleAdd} sx={{ alignSelf: 'flex-start' }}>
            Ajouter une catégorie
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="contained" onClick={onClose}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
