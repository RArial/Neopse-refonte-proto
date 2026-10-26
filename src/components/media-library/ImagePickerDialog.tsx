'use client';

import { useEffect, useId, useMemo, useReducer, useRef, useState, type DragEvent } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { CropStep } from '@/components/media-library/CropStep';
import { FolderTree } from '@/components/media-library/FolderTree';
import { ImageGrid, imageInputId } from '@/components/media-library/ImageGrid';
import { ImageListView } from '@/components/media-library/ImageListView';
import { ImportBanner } from '@/components/media-library/ImportBanner';
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { PickerFooter } from '@/components/media-library/PickerFooter';
import { PickerHeader } from '@/components/media-library/PickerHeader';
import { PickerToolbar } from '@/components/media-library/PickerToolbar';
import { SelectedImagePanel } from '@/components/media-library/SelectedImagePanel';
import { SelectionOrderStrip } from '@/components/media-library/SelectionOrderStrip';
import { UploadCard } from '@/components/media-library/UploadCard';
import { useSimulatedUploads } from '@/hooks/useSimulatedUploads';
import { IMPORT_DONE_BANNER_MS } from '@/lib/mediaLibrary/constants';
import { INITIAL_CROP_STATE, cropStateFromArea, getCropArea, type CropState } from '@/lib/mediaLibrary/crop';
import { pluralize } from '@/lib/mediaLibrary/format';
import { createInitialPickerState, pickerReducer } from '@/lib/mediaLibrary/pickerReducer';
import { buildSections } from '@/lib/mediaLibrary/sections';
import { sortImages } from '@/lib/mediaLibrary/sort';
import { withStrongPrimary } from '@/lib/theme';
import type { ImagePickerConfig, ImagePickerOptions, MediaImage, PickedImage, UploadItem } from '@/types/mediaLibrary';

interface ImagePickerDialogProps {
  open: boolean;
  config: ImagePickerConfig;
  options: ImagePickerOptions;
  onClose: (result: PickedImage[] | null) => void;
}

function normalizeForSearch(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function primaryLabel(config: ImagePickerConfig, selectedCount: number): string {
  if (config.mode === 'single') return 'Utiliser cette image';
  return selectedCount > 0 ? `Ajouter ${pluralize(selectedCount, 'image', 'images')}` : 'Ajouter des images';
}

export function ImagePickerDialog({ open, config, options, onClose }: ImagePickerDialogProps) {
  const { folders, images, updateAltText } = useMediaLibrary();
  const [state, dispatch] = useReducer(pickerReducer, undefined, () => {
    const current = images.find((image) => image.id === config.currentImageId);
    const ratio = config.ratio;
    const initialCrop =
      options.startInCrop && config.mode === 'single' && ratio && current
        ? { imageId: current.id, state: config.currentCrop ? cropStateFromArea(config.currentCrop, current, ratio) : INITIAL_CROP_STATE }
        : undefined;
    return createInitialPickerState({ mode: config.mode, initialCrop });
  });
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const focusSelectedOnReturn = useRef(false);

  const uploads = useSimulatedUploads(config.folder, {
    onQueued: (items) => {
      scrollRef.current?.scrollTo({ top: 0 });
      dispatch({ type: 'queueUploads', items });
    },
    onProgress: (uploadId, progress) => dispatch({ type: 'uploadProgress', uploadId, progress }),
    onSucceeded: (uploadId, image) => dispatch({ type: 'uploadSucceeded', uploadId, imageId: image.id }),
    onFailed: (uploadId, reason) => dispatch({ type: 'uploadFailed', uploadId, reason }),
  });

  const imagesById = useMemo(() => new Map(images.map((image) => [image.id, image])), [images]);
  const foldersById = useMemo(() => new Map(folders.map((folder) => [folder.id, folder])), [folders]);
  const filterName = state.folderId ? (foldersById.get(state.folderId)?.name ?? null) : null;

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    images.forEach((image) => {
      result[image.folderId] = (result[image.folderId] ?? 0) + 1;
    });
    return result;
  }, [images]);

  const sortedImages = useMemo(() => {
    const inFolder = state.folderId === null ? images : images.filter((image) => image.folderId === state.folderId);
    const query = normalizeForSearch(state.search.trim());
    const matching = query ? inFolder.filter((image) => normalizeForSearch(image.name).includes(query)) : inFolder;
    return sortImages(matching, state.sort);
  }, [images, state.folderId, state.search, state.sort]);

  const sections = useMemo(() => buildSections(sortedImages, state.newImageIds, state.sort), [sortedImages, state.newImageIds, state.sort]);
  const visibleImages = useMemo(() => sections.flatMap((section) => section.images), [sections]);

  const selectedImages = state.selectedIds.map((id) => imagesById.get(id)).filter((image): image is MediaImage => image !== undefined);
  const activeImage = state.activeId ? (imagesById.get(state.activeId) ?? null) : null;
  const panelImage = config.mode === 'single' ? (selectedImages[0] ?? null) : activeImage;
  const showPanel = config.mode === 'single' || config.altText === 'ask';
  const cropImage = state.crop ? imagesById.get(state.crop.imageId) : undefined;
  const isCropping = state.step === 'crop' && state.crop !== null && config.ratio !== undefined && cropImage !== undefined;

  // Recadrage automatique par défaut ; un cadrage ajusté à la main, ou celui déjà en place, a priorité.
  function cropStateFor(image: MediaImage): CropState {
    if (state.crop?.imageId === image.id) return state.crop.state;
    if (image.id === config.currentImageId && config.currentCrop && config.ratio) return cropStateFromArea(config.currentCrop, image, config.ratio);
    return INITIAL_CROP_STATE;
  }

  const batchDone = state.batch !== null && state.batch.finished >= state.batch.total;
  useEffect(() => {
    if (!batchDone) return;
    const timer = window.setTimeout(() => dispatch({ type: 'clearBatch' }), IMPORT_DONE_BANNER_MS);
    return () => window.clearTimeout(timer);
  }, [batchDone]);

  useEffect(() => {
    if (state.step !== 'choose' || !focusSelectedOnReturn.current) return;
    focusSelectedOnReturn.current = false;
    const selectedId = state.selectedIds[0];
    if (selectedId) document.getElementById(imageInputId(idPrefix, selectedId))?.focus();
  }, [state.step, state.selectedIds, idPrefix]);

  function hasFiles(event: DragEvent) {
    return Array.from(event.dataTransfer.types).includes('Files');
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    if (!hasFiles(event)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    uploads.importFiles(Array.from(event.dataTransfer.files));
  }

  function discardUpload(item: UploadItem) {
    uploads.releaseUpload(item);
    dispatch({ type: 'removeUpload', uploadId: item.id });
  }

  function keepExisting(item: UploadItem, existing: MediaImage) {
    uploads.releaseUpload(item);
    dispatch({ type: 'useExisting', uploadId: item.id, imageId: existing.id });
  }

  function forceUpload(item: UploadItem) {
    dispatch({ type: 'forceUpload', uploadId: item.id });
    uploads.forceUpload(item);
  }

  function confirm() {
    if (isCropping && state.crop && config.ratio && cropImage) {
      onClose([{ image: cropImage, crop: getCropArea(state.crop.state, cropImage, config.ratio) }]);
      return;
    }
    const ratio = config.ratio;
    onClose(selectedImages.map((image) => ({ image, crop: ratio && config.mode === 'single' ? getCropArea(cropStateFor(image), image, ratio) : undefined })));
  }

  function backToChoose() {
    focusSelectedOnReturn.current = true;
    dispatch({ type: 'backToChoose' });
  }

  const uploadCards = state.uploads.map((item) => {
    const duplicateOf = item.duplicateOfId ? imagesById.get(item.duplicateOfId) : undefined;
    return (
      <UploadCard
        key={item.id}
        item={item}
        duplicateOf={duplicateOf}
        duplicateFolder={duplicateOf ? foldersById.get(duplicateOf.folderId) : undefined}
        onDiscard={discardUpload}
        onUseExisting={keepExisting}
        onForceUpload={forceUpload}
      />
    );
  });

  const groupLabel = filterName ? `Images du dossier ${filterName}` : 'Toutes les images';
  const toggle = (imageId: string) => dispatch({ type: 'toggleImage', imageId });
  const panelCrop = config.ratio && panelImage && config.mode === 'single' ? getCropArea(cropStateFor(panelImage), panelImage, config.ratio) : undefined;

  const panel = showPanel && (
    <SelectedImagePanel
      idPrefix={idPrefix}
      title={config.mode === 'single' ? 'Image sélectionnée' : panelImage ? `Image n° ${state.selectedIds.indexOf(panelImage.id) + 1}` : 'Texte alternatif'}
      image={panelImage}
      folderName={panelImage ? foldersById.get(panelImage.folderId)?.name : undefined}
      altTextPolicy={config.altText}
      isCurrent={panelImage?.id === config.currentImageId}
      isNew={panelImage ? state.newImageIds.includes(panelImage.id) : false}
      emptyMessage={
        config.mode === 'single'
          ? "Cliquez sur une image pour la choisir. Son aperçu et ses informations s'afficheront ici."
          : 'Cochez des images : vous pourrez compléter leur texte alternatif ici.'
      }
      crop={panelCrop}
      onAdjustCrop={panelImage ? () => dispatch({ type: 'startCrop', crop: { imageId: panelImage.id, state: cropStateFor(panelImage) } }) : undefined}
      onAltTextChange={updateAltText}
    />
  );

  const hasContent = visibleImages.length > 0 || uploadCards.length > 0;
  const selectAllLabel = state.search ? 'Tout sélectionner dans les résultats' : filterName ? `Tout sélectionner dans « ${filterName} »` : 'Tout sélectionner';

  const results = !hasContent ? (
    <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', py: 6, px: 2 }}>
      {state.search ? (
        <>
          <Typography variant="body1">
            Aucune image ne correspond à « {state.search} »{filterName ? ` dans « ${filterName} »` : ''}.
          </Typography>
          <Button size="small" variant="outlined" onClick={() => dispatch({ type: 'setSearch', search: '' })}>
            Effacer la recherche
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {filterName ? `Le dossier « ${filterName} » est vide.` : 'La médiathèque est vide.'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Glissez des images ici ou utilisez le bouton « Importer des images ».
          </Typography>
        </>
      )}
    </Stack>
  ) : state.view === 'grid' ? (
    <ImageGrid
      sections={sections}
      uploadCards={uploadCards}
      columns={isMobile ? 2 : isNarrow ? 3 : 5}
      mode={config.mode}
      groupLabel={groupLabel}
      idPrefix={idPrefix}
      selectedIds={state.selectedIds}
      currentImageId={config.currentImageId}
      newImageIds={state.newImageIds}
      onToggle={toggle}
    />
  ) : (
    <Stack spacing={2}>
      {uploadCards.length > 0 && <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : isNarrow ? 3 : 5}, minmax(0, 1fr))`, gap: 1.5 }}>{uploadCards}</Box>}
      {visibleImages.length > 0 && (
        <ImageListView
          images={visibleImages}
          mode={config.mode}
          caption={groupLabel}
          idPrefix={idPrefix}
          selectedIds={state.selectedIds}
          currentImageId={config.currentImageId}
          newImageIds={state.newImageIds}
          sort={state.sort}
          onSort={(sort) => dispatch({ type: 'setSort', sort })}
          onToggle={toggle}
        />
      )}
    </Stack>
  );

  const selectedCount = state.selectedIds.length;

  return (
    <ThemeProvider theme={withStrongPrimary}>
      <Dialog
        open={open}
        // Un clic à côté ne doit pas faire perdre une sélection ou un import en cours ; Échap ferme toujours.
        onClose={(_, reason) => reason !== 'backdropClick' && onClose(null)}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        aria-labelledby={titleId}
        slotProps={{
          // Le piège à focus de la Dialog prend le focus à l'ouverture : on le rend ensuite à la recherche.
          transition: { onEntered: () => document.getElementById(`${idPrefix}-search`)?.focus() },
          paper: { sx: { height: isMobile ? '100%' : 'min(820px, calc(100% - 64px))', display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
        }}
      >
        <PickerHeader config={config} step={state.step} withCropStep={isCropping} titleId={titleId} onClose={() => onClose(null)} />

        {isCropping && config.ratio && state.crop && cropImage ? (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <CropStep
              idPrefix={idPrefix}
              image={cropImage}
              ratio={config.ratio}
              crop={state.crop.state}
              onChange={(crop) => dispatch({ type: 'updateCrop', state: crop })}
              isNarrow={isNarrow}
            />
          </Box>
        ) : (
          <>
            <PickerToolbar
              idPrefix={idPrefix}
              filterName={filterName}
              search={state.search}
              onSearch={(search) => dispatch({ type: 'setSearch', search })}
              sort={state.sort}
              onSort={(sort) => dispatch({ type: 'setSort', sort })}
              view={state.view}
              onView={(view) => dispatch({ type: 'setView', view })}
              onImport={uploads.importFiles}
              compactFolders={isNarrow ? { folders, folderId: state.folderId, onSelect: (folderId) => dispatch({ type: 'setFolder', folderId }) } : undefined}
            />

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: 'grid',
                gridTemplateColumns: isNarrow ? '1fr' : `200px 1fr${showPanel ? ' 260px' : ''}`,
              }}
            >
              {!isNarrow && (
                <Box sx={{ borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto', p: 1 }}>
                  <FolderTree
                    folders={folders}
                    counts={counts}
                    totalCount={images.length}
                    folderId={state.folderId}
                    onSelect={(folderId) => dispatch({ type: 'setFolder', folderId })}
                  />
                </Box>
              )}

              <Box
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0 }}
              >
                {config.mode === 'multiple' && (
                  <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', px: 2.5, py: 0.5, borderBottom: '1px solid', borderColor: 'divider', flexWrap: 'wrap' }}>
                    <Typography variant="body2" aria-live="polite" sx={{ fontWeight: 600, mr: 1 }}>
                      {selectedCount === 0 ? 'Aucune image sélectionnée' : pluralize(selectedCount, 'image sélectionnée', 'images sélectionnées')}
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      disabled={visibleImages.length === 0}
                      onClick={() => dispatch({ type: 'selectAll', imageIds: visibleImages.map((image) => image.id) })}
                    >
                      {selectAllLabel}
                    </Button>
                    {selectedCount > 0 && (
                      <Button variant="text" size="small" color="inherit" onClick={() => dispatch({ type: 'deselectAll' })}>
                        Tout désélectionner
                      </Button>
                    )}
                  </Stack>
                )}

                <ImportBanner batch={state.batch} destination={config.folder} />

                <Box ref={scrollRef} id={`${idPrefix}-results`} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2.5, py: 1.5 }}>
                  {isNarrow && panel && <Box sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>{panel}</Box>}
                  {results}
                </Box>

                {config.mode === 'multiple' && (
                  <SelectionOrderStrip
                    images={selectedImages}
                    activeId={state.activeId}
                    flagMissingAlt={config.altText === 'ask'}
                    onActivate={(imageId) => dispatch({ type: 'setActive', imageId })}
                    onRemove={toggle}
                  />
                )}

                {dragging && (
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      inset: 8,
                      zIndex: 1,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      bgcolor: 'background.paper',
                      opacity: 0.95,
                      pointerEvents: 'none',
                    }}
                  >
                    <Stack spacing={1} sx={{ alignItems: 'center', color: 'primary.main' }}>
                      <CloudUploadOutlinedIcon fontSize="large" />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Déposez vos images : elles iront dans « {config.folder} »
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Box>

              {!isNarrow && panel && <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', overflowY: 'auto' }}>{panel}</Box>}
            </Box>
          </>
        )}

        <PickerFooter
          primaryLabel={isCropping ? 'Valider le recadrage' : primaryLabel(config, selectedCount)}
          primaryDisabled={!isCropping && selectedCount === 0}
          onPrimary={confirm}
          onCancel={() => onClose(null)}
          onBack={isCropping ? backToChoose : undefined}
        />
      </Dialog>
    </ThemeProvider>
  );
}
