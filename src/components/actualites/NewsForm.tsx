'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { BlockPalette, type PaletteTab } from '@/components/actualites/builder/BlockPalette';
import { ContentBuilder } from '@/components/actualites/builder/ContentBuilder';
import {
  BUILDER_SCREEN_READER_INSTRUCTIONS,
  builderAnnouncements,
  builderCollisionDetection,
  type DndData,
} from '@/components/actualites/builder/dnd';
import { useNews } from '@/components/actualites/NewsProvider';
import { GeneralInfoPanel, NEWS_TITLE_FIELD_ID } from '@/components/actualites/panels/GeneralInfoPanel';
import { NEWS_DEACTIVATION_FIELD_ID, PublicationPanel } from '@/components/actualites/panels/PublicationPanel';
import { ThumbnailPanel } from '@/components/actualites/panels/ThumbnailPanel';
import { useStickyFormLayout } from '@/hooks/useStickyFormLayout';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { insertBlock, insertRow, locateBlock, moveBlock, moveRowTo, type ColumnRef } from '@/lib/actualites/content';
import { cloneContent } from '@/lib/actualites/news';
import {
  MAX_FAVORITE_NEWS,
  NEWS_TEMPLATES,
  createStructureRow,
  type ContentBlockKind,
  type ContentTemplate,
  type LayoutKey,
  type NewsArticle,
  type NewsFormData,
  type StructureRow,
} from '@/types/actualites';

const WIDE_LAYOUT = '(min-width:1100px)';

const SECTIONS = [
  { id: 'news-section-infos', label: 'Informations générales', icon: DescriptionOutlinedIcon },
  { id: 'news-section-vignette', label: "Vignette de l'actualité", icon: ImageOutlinedIcon },
  { id: 'news-section-publication', label: 'Publication', icon: CalendarMonthOutlinedIcon },
] as const;

interface FieldErrors {
  title?: string;
  deactivatedAt?: string;
}

function validate(data: NewsFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.title.trim()) errors.title = "Le nom de l'actualité est requis.";
  if (data.deactivatedAt && data.deactivatedAt <= data.publishedAt) errors.deactivatedAt = 'La date de désactivation doit être postérieure à la date de publication.';
  return errors;
}

function emptyNews(today: string): NewsFormData {
  // Une nouvelle actualité démarre vide et inactive : rien n'est publié tant qu'on ne clique pas sur « Publier ».
  return { title: '', lead: '', favorite: false, publishedAt: today, active: false, content: [] };
}

function toFormData(article: NewsArticle): NewsFormData {
  return {
    title: article.title,
    lead: article.lead,
    favorite: article.favorite,
    thumbnail: article.thumbnail,
    publishedAt: article.publishedAt,
    deactivatedAt: article.deactivatedAt,
    active: article.active,
    content: article.content,
  };
}

type PendingConfirm = { kind: 'template'; template: ContentTemplate };

interface NewsFormProps {
  /** Absent : création. */
  initialArticle?: NewsArticle;
}

export function NewsForm({ initialArticle }: NewsFormProps) {
  const news = useNews();
  const [data, setData] = useState<NewsFormData>(() => (initialArticle ? toFormData(initialArticle) : emptyNews(news.today)));
  const [savedId, setSavedId] = useState<string | null>(initialArticle?.id ?? null);
  // Instantané de la dernière version enregistrée : sert à détecter les modifications non enregistrées.
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(data));
  const [showErrors, setShowErrors] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [paletteTab, setPaletteTab] = useState<PaletteTab>('blocs');
  const [selectedColumn, setSelectedColumn] = useState<ColumnRef | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
  const [activeDrag, setActiveDrag] = useState<DndData | null>(null);
  const templateNameRef = useRef<HTMLInputElement>(null);
  const isWide = useMediaQuery(WIDE_LAYOUT);
  const { headerRef, railSx } = useStickyFormLayout();
  const sensors = useSensors(
    // Un léger déplacement avant de saisir : un simple clic sur la palette reste un clic (ajout).
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const dirty = JSON.stringify(data) !== snapshot;
  const guard = useUnsavedChangesGuard(dirty);
  const errors = showErrors ? validate(data) : {};

  function patch(update: Partial<NewsFormData>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  function updateContent(update: (content: StructureRow[]) => StructureRow[]) {
    setData((prev) => ({ ...prev, content: update(prev.content) }));
  }

  function selectColumn(column: ColumnRef) {
    setSelectedColumn(column);
    setPaletteTab('informations');
  }

  function addRow(layout: LayoutKey, beforeRowId?: string) {
    const row = createStructureRow(layout);
    updateContent((content) => insertRow(content, row, beforeRowId));
    selectColumn({ rowId: row.id, columnIndex: 0 });
  }

  function insertIntoSelected(kind: ContentBlockKind) {
    const stillExists = selectedColumn && data.content.some((row) => row.id === selectedColumn.rowId && row.columns[selectedColumn.columnIndex]);
    if (!selectedColumn || !stillExists) {
      news.notify('Sélectionnez d’abord une colonne : cliquez sur « Glisser & déposer un contenu » dans le contenu.', 'error');
      return;
    }
    updateContent((content) => insertBlock(content, selectedColumn, kind));
  }

  function toggleFavorite() {
    if (!data.favorite && !news.canAddFavorite(savedId ?? undefined)) {
      news.notify(`Vous avez déjà ${MAX_FAVORITE_NEWS} actualités en favori. Retirez-en une pour en ajouter une autre.`, 'error');
      return;
    }
    patch({ favorite: !data.favorite });
  }

  function focusField(id: string) {
    // Le panneau peut être replié : on le déplie, puis on attend son rendu pour atteindre le champ.
    setPanelOpen(true);
    requestAnimationFrame(() => {
      const field = document.getElementById(id);
      field?.scrollIntoView({ block: 'center' });
      field?.focus();
    });
  }

  function save(mode: 'draft' | 'publish') {
    // « Publier » active toujours l'actualité, quel que soit l'état du toggle.
    const next: NewsFormData = mode === 'publish' ? { ...data, active: true } : data;
    setShowErrors(true);
    const nextErrors = validate(next);
    if (nextErrors.title || nextErrors.deactivatedAt) {
      news.notify('Certains champs sont invalides', 'error');
      focusField(nextErrors.title ? NEWS_TITLE_FIELD_ID : NEWS_DEACTIVATION_FIELD_ID);
      return;
    }
    if (next.favorite && !news.canAddFavorite(savedId ?? undefined)) {
      news.notify(`Vous avez déjà ${MAX_FAVORITE_NEWS} actualités en favori. Retirez-en une pour en ajouter une autre.`, 'error');
      return;
    }
    const id = news.saveArticle(savedId, next);
    setData(next);
    setSnapshot(JSON.stringify(next));
    if (!savedId) {
      setSavedId(id);
      // On reste sur la page (pas de remontage, pas de perte de focus) : seule l'URL change.
      window.history.replaceState(null, '', `/dashboard/actualites/edit/${id}`);
    }
    news.notify(mode === 'publish' ? 'Actualité publiée' : 'Actualité enregistrée');
  }

  function openTemplateSave() {
    setPaletteTab('templates');
    requestAnimationFrame(() => {
      templateNameRef.current?.scrollIntoView({ block: 'center' });
      templateNameRef.current?.focus();
    });
  }

  function saveTemplate() {
    const name = templateName.trim();
    if (!name) return;
    if (data.content.length === 0) {
      news.notify('Ajoutez au moins un bloc de structure avant d’enregistrer un template.', 'error');
      return;
    }
    news.addUserTemplate(name, data.content);
    setTemplateName('');
    news.notify(`Le template « ${name} » a été enregistré.`);
  }

  function applyTemplate(template: ContentTemplate) {
    updateContent(() => cloneContent(template.content));
    setSelectedColumn(null);
    news.notify(`Le template « ${template.label} » a été appliqué.`);
  }

  function requestTemplate(template: ContentTemplate) {
    if (data.content.length > 0) setPendingConfirm({ kind: 'template', template });
    else applyTemplate(template);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDrag((event.active.data.current as DndData | undefined) ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveDrag(null);
    const source = active.data.current as DndData | undefined;
    const target = over?.data.current as DndData | undefined;
    if (!source || !target) return;

    if (source.type === 'palette-layout') {
      addRow(source.layout, target.type === 'row' ? target.rowId : undefined);
      return;
    }
    if (source.type === 'row' && target.type === 'row') {
      updateContent((content) => moveRowTo(content, source.rowId, target.rowId));
      return;
    }

    // Contenus : posés sur un autre contenu (à sa place) ou sur une colonne (à la fin).
    const destination: (ColumnRef & { index?: number }) | null =
      target.type === 'column'
        ? { rowId: target.rowId, columnIndex: target.columnIndex }
        : target.type === 'block'
          ? locateBlock(data.content, target.blockId)
          : null;
    if (!destination) return;
    const column = { rowId: destination.rowId, columnIndex: destination.columnIndex };

    if (source.type === 'palette-block') {
      updateContent((content) => insertBlock(content, column, source.kind, destination.index));
      selectColumn(column);
    } else if (source.type === 'block' && source.blockId !== (target.type === 'block' ? target.blockId : null)) {
      updateContent((content) => moveBlock(content, source.blockId, column, destination.index));
    }
  }

  const badge = savedId === null ? { label: 'BROUILLON', color: 'default' as const } : data.active ? { label: 'ACTIF', color: 'success' as const } : { label: 'INACTIF', color: 'default' as const };

  const panels = (
    <>
      <Box id={SECTIONS[0].id}>
        <GeneralInfoPanel data={data} onChange={patch} titleError={errors.title} onToggleFavorite={toggleFavorite} />
      </Box>
      <Box id={SECTIONS[1].id}>
        <ThumbnailPanel data={data} onChange={patch} />
      </Box>
      <Box id={SECTIONS[2].id}>
        <PublicationPanel data={data} onChange={patch} deactivationError={errors.deactivatedAt} />
      </Box>
    </>
  );

  return (
    <Box sx={{ px: { xs: 2, md: 3.5 }, pb: 6, maxWidth: 1600, width: '100%', mx: 'auto' }}>
      <Stack
        ref={headerRef}
        component="header"
        spacing={2}
        useFlexGap
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.default',
          justifyContent: 'space-between',
          // Même seuil que la mise en page : en dessous, les quatre boutons écraseraient le titre.
          flexDirection: 'column',
          [`@media ${WIDE_LAYOUT}`]: { flexDirection: 'row', alignItems: 'center' },
          mb: 3,
          pt: { xs: 2, md: 2.5 },
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Button component={Link} href="/dashboard/actualites" startIcon={<ArrowBackIcon fontSize="small" />} color="inherit" size="small" sx={{ mb: 1, ml: -1, fontWeight: 500 }}>
            Retour aux actualités
          </Button>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em', overflowWrap: 'anywhere' }}>
              {data.title.trim() || 'Nouvelle actualité'}
            </Typography>
            <Chip size="small" label={badge.label} color={badge.color} variant="outlined" sx={{ fontWeight: 700, flexShrink: 0 }} />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', flexShrink: 0 }}>
          <Tooltip title={savedId ? "Ouvrir l'aperçu dans un nouvel onglet" : "Enregistrez l'actualité pour la prévisualiser"}>
            <span>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                disabled={!savedId}
                onClick={() => savedId && window.open(`/preview/actualites/${savedId}`, '_blank')}
              >
                Aperçu
              </Button>
            </span>
          </Tooltip>
          <Button variant="outlined" color="inherit" startIcon={<SaveOutlinedIcon fontSize="small" />} onClick={() => save('draft')}>
            Enregistrer le brouillon
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<BookmarkAddOutlinedIcon fontSize="small" />} onClick={openTemplateSave}>
            Enregistrer comme template
          </Button>
          <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={() => save('publish')}>
            Publier l&apos;actualité
          </Button>
        </Stack>
      </Stack>

      <DndContext
        sensors={sensors}
        collisionDetection={builderCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveDrag(null)}
        accessibility={{ announcements: builderAnnouncements, screenReaderInstructions: BUILDER_SCREEN_READER_INSTRUCTIONS }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            alignItems: 'start',
            gridTemplateColumns: 'minmax(0, 1fr)',
            [`@media ${WIDE_LAYOUT}`]: { gridTemplateColumns: `${panelOpen ? '300px' : '56px'} minmax(0, 1fr) 280px` },
          }}
        >
          <Box component="aside" aria-label="Paramètres de l'actualité" sx={{ display: 'flex', flexDirection: 'column', gap: 2, ...(isWide ? railSx : {}) }}>
            {!isWide || panelOpen ? (
              <>
                {isWide && (
                  <Button size="small" color="inherit" startIcon={<ChevronLeftIcon fontSize="small" />} onClick={() => setPanelOpen(false)} sx={{ alignSelf: 'flex-start' }}>
                    Replier
                  </Button>
                )}
                {panels}
              </>
            ) : (
              <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, py: 1, borderRadius: 2 }}>
                <Tooltip title="Déplier les paramètres" placement="right">
                  <IconButton onClick={() => setPanelOpen(true)} aria-label="Déplier les paramètres">
                    <ChevronRightIcon />
                  </IconButton>
                </Tooltip>
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Tooltip key={section.id} title={section.label} placement="right">
                      <IconButton
                        aria-label={`Ouvrir : ${section.label}`}
                        onClick={() => {
                          setPanelOpen(true);
                          requestAnimationFrame(() => document.getElementById(section.id)?.scrollIntoView({ block: 'start' }));
                        }}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  );
                })}
              </Paper>
            )}
          </Box>

          <ContentBuilder content={data.content} onChange={updateContent} selectedColumn={selectedColumn} onSelectColumn={selectColumn} />

          <Box sx={isWide ? { ...railSx, display: 'flex', flexDirection: 'column' } : undefined}>
            <BlockPalette
              tab={paletteTab}
              onTabChange={setPaletteTab}
              onAddRow={(layout) => addRow(layout)}
              onInsertBlock={insertIntoSelected}
              neopseTemplates={NEWS_TEMPLATES}
              userTemplates={news.userTemplates}
              templateName={templateName}
              onTemplateNameChange={setTemplateName}
              onSaveTemplate={saveTemplate}
              onDeleteUserTemplate={(template) => {
                news.removeUserTemplate(template.id);
                news.notify(`Le template « ${template.label} » a été supprimé.`);
              }}
              onApplyTemplate={requestTemplate}
              templateNameRef={templateNameRef}
            />
          </Box>
        </Box>

        <DragOverlay dropAnimation={null}>
          {activeDrag && 'label' in activeDrag ? (
            <Chip label={activeDrag.label} color="primary" sx={{ fontWeight: 700, boxShadow: 4, cursor: 'grabbing' }} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={pendingConfirm !== null} onClose={() => setPendingConfirm(null)} aria-labelledby="news-template-confirm-title" maxWidth="xs" fullWidth>
        <DialogTitle id="news-template-confirm-title">Remplacer le contenu ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Le contenu actuel de l&apos;actualité sera remplacé par la mise en page du template « {pendingConfirm?.template.label} ».
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" variant="outlined" onClick={() => setPendingConfirm(null)} autoFocus>
            J&apos;annule
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (pendingConfirm) applyTemplate(pendingConfirm.template);
              setPendingConfirm(null);
            }}
          >
            Je remplace
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={guard.isDialogOpen} onClose={guard.cancelLeave} aria-labelledby="news-leave-title" maxWidth="xs" fullWidth>
        <DialogTitle id="news-leave-title">Quitter sans enregistrer ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Vos modifications ne sont pas enregistrées. Si vous quittez la page, elles seront perdues.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" variant="outlined" onClick={guard.cancelLeave} autoFocus>
            Je reste sur la page
          </Button>
          <Button color="error" variant="contained" onClick={guard.confirmLeave}>
            Je quitte sans enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
