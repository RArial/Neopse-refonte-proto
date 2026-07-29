'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { GeneralInfoPanel } from '@/components/actualites/panels/GeneralInfoPanel';
import { ThumbnailPanel } from '@/components/actualites/panels/ThumbnailPanel';
import { PublicationPanel } from '@/components/actualites/panels/PublicationPanel';
import { ContentBuilder, type SelectedTarget } from '@/components/actualites/builder/ContentBuilder';
import { BlockPalette } from '@/components/actualites/builder/BlockPalette';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import {
  cloneStructureContent,
  createBlock,
  createStructureRow,
  DEFAULT_NEWS_FORM,
  NEWS_TEMPLATES,
  type ContentBlockKind,
  type LayoutKey,
  type NewsArticle,
  type NewsFormData,
  type NewsStatus,
} from '@/types/actualites';
import { readCopyNameParam } from '@/lib/duplicateParams';

const STATUS_CHIP_META: Record<NewsStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  draft: { label: 'Brouillon', color: 'warning' },
  published: { label: 'Publiée', color: 'success' },
  scheduled: { label: 'Programmée', color: 'default' },
  archived: { label: 'Archivée', color: 'default' },
};

function buildInitialData(initialArticle?: NewsArticle): NewsFormData {
  if (initialArticle) {
    return {
      ...DEFAULT_NEWS_FORM,
      name: initialArticle.title,
      status: initialArticle.status,
      publicationDate: initialArticle.publicationDate,
    };
  }
  const copyName = readCopyNameParam();
  return copyName ? { ...DEFAULT_NEWS_FORM, name: copyName } : DEFAULT_NEWS_FORM;
}

interface NewsFormProps {
  mode: 'create' | 'edit';
  initialArticle?: NewsArticle;
}

export function NewsForm({ mode, initialArticle }: NewsFormProps) {
  const router = useRouter();
  const [data, setData] = useState<NewsFormData>(() => buildInitialData(initialArticle));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(null);
  const [isDuplicate] = useState(() => mode === 'create' && readCopyNameParam() !== null);
  const { headerRef, railSx } = useStickyFormLayout();

  function handleChange(patch: Partial<NewsFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function handleAddRow(layout: LayoutKey) {
    setData((prev) => ({ ...prev, content: [...prev.content, createStructureRow(layout)] }));
  }

  function notify(message: string) {
    setSuccessMessage(message);
  }

  function handleInsertBlock(kind: ContentBlockKind) {
    if (!selectedTarget) {
      notify('Sélectionnez une colonne dans le contenu pour y insérer ce bloc.');
      return;
    }
    setData((prev) => {
      const { rowIndex, columnIndex } = selectedTarget;
      const row = prev.content[rowIndex];
      if (!row || !row.columns[columnIndex]) return prev;
      const content = prev.content.map((candidateRow, i) => {
        if (i !== rowIndex) return candidateRow;
        const columns = candidateRow.columns.map((blocks, ci) => (ci === columnIndex ? [...blocks, createBlock(kind)] : blocks));
        return { ...candidateRow, columns };
      });
      return { ...prev, content };
    });
  }

  function handleSaveTemplate(name: string) {
    notify(`Le template « ${name} » a été enregistré.`);
  }

  function handleApplyTemplate(templateId: string) {
    const template = NEWS_TEMPLATES.find((candidate) => candidate.id === templateId);
    if (!template) return;
    setData((prev) => ({ ...prev, content: [...prev.content, ...cloneStructureContent(template.content)] }));
    notify(`Le template « ${template.label} » a été appliqué.`);
  }

  function commit(status: NewsStatus) {
    if (!data.name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setData((prev) => ({ ...prev, status }));
    setSuccessMessage(status === 'draft' ? 'Brouillon enregistré.' : `« ${data.name} » a été publiée.`);
    window.setTimeout(() => router.push('/dashboard/actualites'), 1400);
  }

  const statusChip = STATUS_CHIP_META[data.status];
  const pageTitle = mode === 'create' ? 'Nouvelle actualité' : data.name || "Modifier l'actualité";

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 1600, width: '100%', mx: 'auto' }}>
      <Stack
        ref={headerRef}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.default',
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          mb: 3,
          pt: { xs: 2, md: 2.5 },
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Button
            component={Link}
            href="/dashboard/actualites"
            startIcon={<ArrowBackIcon fontSize="small" />}
            color="inherit"
            size="small"
            sx={{ mb: 1, ml: -1, textTransform: 'none', fontWeight: 500 }}
          >
            Retour aux actualités
          </Button>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              {pageTitle}
            </Typography>
            {(mode === 'edit' || isDuplicate) && (
              <Chip size="small" label={statusChip.label.toUpperCase()} color={statusChip.color} variant="outlined" sx={{ fontWeight: 700 }} />
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            onClick={() => notify("Aperçu de l'actualité — bientôt disponible.")}
          >
            Aperçu
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<SaveOutlinedIcon fontSize="small" />} onClick={() => commit('draft')}>
            Enregistrer le brouillon
          </Button>
          <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={() => commit('published')}>
            Publier l&apos;actualité
          </Button>
        </Stack>
      </Stack>

      {nameError && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          Le nom de l&apos;actualité est obligatoire.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr) 280px' }, gap: 3, alignItems: 'start' }}>
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 2, ...railSx }}>
          {panelOpen ? (
            <>
              <Button
                size="small"
                color="inherit"
                startIcon={<ChevronLeftIcon fontSize="small" />}
                onClick={() => setPanelOpen(false)}
                sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
              >
                Replier
              </Button>
              <GeneralInfoPanel data={data} onChange={handleChange} nameError={nameError} />
              <ThumbnailPanel data={data} onChange={handleChange} />
              <PublicationPanel data={data} onChange={handleChange} />
            </>
          ) : (
            <Button
              size="small"
              color="inherit"
              startIcon={<ChevronRightIcon fontSize="small" />}
              onClick={() => setPanelOpen(true)}
              sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
            >
              Déplier
            </Button>
          )}
        </Box>

        <ContentBuilder
          content={data.content}
          onChange={(content) => handleChange({ content })}
          selectedTarget={selectedTarget}
          onSelectTarget={setSelectedTarget}
        />

        <BlockPalette
          onAddRow={handleAddRow}
          onInsertBlock={handleInsertBlock}
          templates={NEWS_TEMPLATES}
          onSaveTemplate={handleSaveTemplate}
          onApplyTemplate={handleApplyTemplate}
          stickyTop={railSx.top}
        />
      </Box>

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
