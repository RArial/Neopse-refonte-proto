'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { CategoriesDialog } from '@/components/pages-modules/CategoriesDialog';
import type { QuestionsPageSettings } from '@/types/questionsReponses';

interface SectionProps {
  settings: QuestionsPageSettings;
  onChange: (patch: Partial<QuestionsPageSettings>) => void;
}

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function CategoriesQuestionsSection({ settings, onChange }: SectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  function addCategory(): string {
    const id = randomId('cat');
    onChange({ categories: [...settings.categories, { id, name: '' }] });
    return id;
  }

  function renameCategory(id: string, name: string) {
    onChange({ categories: settings.categories.map((category) => (category.id === id ? { ...category, name } : category)) });
  }

  function deleteCategory(id: string) {
    onChange({ categories: settings.categories.filter((category) => category.id !== id) });
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {settings.categories.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune catégorie pour le moment.
          </Typography>
        ) : (
          settings.categories.map((category) => (
            <Chip key={category.id} label={category.name || 'Catégorie sans nom'} size="small" variant="outlined" />
          ))
        )}
      </Stack>
      <Button
        type="button"
        variant="outlined"
        color="inherit"
        startIcon={<SettingsOutlinedIcon fontSize="small" />}
        onClick={() => setDialogOpen(true)}
        sx={{ alignSelf: 'flex-start' }}
      >
        Gérer les catégories
      </Button>

      <CategoriesDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        categories={settings.categories}
        selectedCategoryId=""
        onAddCategory={addCategory}
        onRenameCategory={renameCategory}
        onDeleteCategory={deleteCategory}
      />
    </Stack>
  );
}
