'use client';

import { useEffect, useId, useMemo, useReducer, useRef, useState, type DragEvent } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
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
import { useMediaLibrary } from '@/components/media-library/MediaLibraryProvider';
import { PickerFooter } from '@/components/media-library/PickerFooter';
import { PickerHeader } from '@/components/media-library/PickerHeader';
import { PickerToolbar } from '@/components/media-library/PickerToolbar';
import { SelectedImagePanel } from '@/components/media-library/SelectedImagePanel';
import { SelectionOrderStrip } from '@/components/media-library/SelectionOrderStrip';
import { UploadCard } from '@/components/media-library/UploadCard';
import { useSimulatedUploads } from '@/hooks/useSimulatedUploads';
import { INITIAL_CROP_STATE, cropStateFromArea, getCropArea } from '@/lib/mediaLibrary/crop';
import { pluralize } from '@/lib/mediaLibrary/format';
import { createInitialPickerState, pickerReducer, type UploadBatch } from '@/lib/mediaLibrary/pickerReducer';
import { sortImages } from '@/lib/mediaLibrary/sort';
import { withStrongPrimary } from '@/lib/theme';
import type { ImagePickerConfig, MediaImage, PickedImage } from '@/types/mediaLibrary';

interface ImagePickerDialogProps {
  open: boolean;
  config: ImagePickerConfig;
  onClose: (result: PickedImage[] | null) => void;
}

function normalizeForSearch(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function primaryLabel(config: ImagePickerConfig, withCropStep: boolean, selectedCount: number): string {
  if (config.mode === 'multiple') return selectedCount > 0 ? `Ajouter ${pluralize(selectedCount, 'image', 'images')}` : 'Ajouter des images';
  return withCropStep ? 'Recadrer cette image' : 'Utiliser cette image';
}

function ImportBanner({ batch, folderName }: { batch: UploadBatch | null; folderName: string }) {
  const running = batch !== null && batch.finished < batch.total;
  return (
    <Box aria-live="polite" sx={{ px: 2.5, pt: batch ? 1.5 : 0 }}>
      {batch && running && (
        <Alert severity="info" icon={<CloudUploadOutlinedIcon />} variant="outlined">
          Import dans <strong>{folderName}</strong> · {batch.finished} sur {batch.total} terminée{batch.finished > 1 ? 's' : ''}
        </Alert>
      )}
      {batch && !running && batch.succeeded > 0 && (
        <Alert severity="success" variant="outlined">
          Import terminé : {pluralize(batch.succeeded, 'image ajoutée', 'images ajoutées')} dans <strong>{folderName}</strong>.
        </Alert>
      )}
    </Box>
  );
}

export function ImagePickerDialog({ open, config, onClose }: ImagePickerDialogProps) {
  const { folders, images, addImage, updateAltText } = useMediaLibrary();
  const [state, dispatch] = useReducer(pickerReducer, config.mode, createInitialPickerState);
  const uploads = useSimulatedUploads({ images, dispatch, addImage });
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const focusSelectedOnReturn = useRef(false);

  const withCropStep = config.mode === 'single' && config.ratio !== undefined;
  const imagesById = useMemo(() => new Map(images.map((image) => [image.id, image])), [images]);
  const foldersById = useMemo(() => new Map(folders.map((folder) => [folder.id, folder])), [folders]);
  const folderName = foldersById.get(state.folderId)?.name ?? '';
  const batchFolderName = (state.batch && foldersById.get(state.batch.folderId)?.name) ?? folderName;

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    images.forEach((image) => {
      result[image.folderId] = (result[image.folderId] ?? 0) + 1;
    });
    return result;
  }, [images]);

  const folderImages = useMemo(() => images.filter((image) => image.folderId === state.folderId), [images, state.folderId]);

  const visibleImages = useMemo(() => {
    const query = normalizeForSearch(state.search.trim());
    const matching = query ? folderImages.filter((image) => normalizeForSearch(image.name).includes(query)) : folderImages;
    const sorted = sortImages(matching, state.sort);
    // Les images importées restent en tête quel que soit le tri : on les voit sans les chercher.
    const fresh = sorted.filter((image) => state.newImageIds.includes(image.id));
    const others = sorted.filter((image) => !state.newImageIds.includes(image.id));
    return [...fresh, ...others];
  }, [folderImages, state.search, state.sort, state.newImageIds]);

  const folderUploads = state.uploads.filter((item) => item.folderId === state.folderId);
  const selectedImages = state.selectedIds.map((id) => imagesById.get(id)).filter((image): image is MediaImage => image !== undefined);
  const activeImage = state.activeId ? (imagesById.get(state.activeId) ?? null) : null;
  const panelImage = config.mode === 'single' ? (selectedImages[0] ?? null) : activeImage;
  const showPanel = config.mode === 'single' || config.altText === 'ask';

  useEffect(() => {
    if (state.step !== 'choose' || !focusSelectedOnReturn.current) return;
    focusSelectedOnReturn.current = false;
    const selectedId = state.selectedIds[0];
    if (selectedId) document.getElementById(imageInputId(idPrefix, selectedId))?.focus();
  }, [state.step, state.selectedIds, idPrefix]);

  function handleImport(files: File[]) {
    if (files.length === 0) return;
    scrollRef.current?.scrollTo({ top: 0 });
    uploads.importFiles(files, state.folderId);
  }

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
    handleImport(Array.from(event.dataTransfer.files));
  }

  function startCrop() {
    const image = selectedImages[0];
    if (!image || !config.ratio) return;
    const restored = image.id === config.currentImageId && config.currentCrop;
    dispatch({ type: 'startCrop', crop: restored ? cropStateFromArea(restored, image, config.ratio) : INITIAL_CROP_STATE });
  }

  function confirm() {
    if (state.step === 'crop' && state.crop && config.ratio && selectedImages[0]) {
      onClose([{ image: selectedImages[0], crop: getCropArea(state.crop, selectedImages[0], config.ratio) }]);
      return;
    }
    if (withCropStep) return startCrop();
    onClose(selectedImages.map((image) => ({ image })));
  }

  function backToChoose() {
    focusSelectedOnReturn.current = true;
    dispatch({ type: 'backToChoose' });
  }

  const uploadCards = folderUploads.map((item) => {
    const duplicateOf = item.duplicateOfId ? imagesById.get(item.duplicateOfId) : undefined;
    return (
      <UploadCard
        key={item.id}
        item={item}
        duplicateOf={duplicateOf}
        duplicateFolder={duplicateOf ? foldersById.get(duplicateOf.folderId) : undefined}
        onDiscard={uploads.discardUpload}
        onUseExisting={uploads.keepExistingImage}
        onForceUpload={uploads.forceUpload}
      />
    );
  });

  const groupLabel = `Images du dossier ${folderName}`;
  const toggle = (imageId: string) => dispatch({ type: 'toggleImage', imageId });

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
      onAltTextChange={updateAltText}
    />
  );

  const hasContent = visibleImages.length > 0 || folderUploads.length > 0;

  const results = !hasContent ? (
    <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', py: 6, px: 2 }}>
      {state.search ? (
        <>
          <Typography variant="body1">
            Aucune image ne correspond à « {state.search} » dans « {folderName} ».
          </Typography>
          <Button variant="outlined" onClick={() => dispatch({ type: 'setSearch', search: '' })}>
            Effacer la recherche
          </Button>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Le dossier « {folderName} » est vide.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Glissez des images ici ou utilisez le bouton « Importer des images ».
          </Typography>
        </>
      )}
    </Stack>
  ) : state.view === 'grid' ? (
    <ImageGrid
      images={visibleImages}
      uploadCards={uploadCards}
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
      {uploadCards.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(156px, 1fr))', gap: 2 }}>{uploadCards}</Box>
      )}
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
  const isCropping = state.step === 'crop' && state.crop !== null && config.ratio !== undefined && selectedImages[0] !== undefined;

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
          paper: { sx: { height: isMobile ? '100%' : 'min(860px, calc(100% - 64px))', display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
        }}
      >
        <PickerHeader config={config} step={state.step} withCropStep={withCropStep} titleId={titleId} onClose={() => onClose(null)} />

        {isCropping && config.ratio && state.crop ? (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <CropStep
              idPrefix={idPrefix}
              image={selectedImages[0]}
              ratio={config.ratio}
              crop={state.crop}
              onChange={(crop) => dispatch({ type: 'updateCrop', crop })}
              isNarrow={isNarrow}
            />
          </Box>
        ) : (
          <>
            <PickerToolbar
              idPrefix={idPrefix}
              folderName={folderName}
              search={state.search}
              onSearch={(search) => dispatch({ type: 'setSearch', search })}
              sort={state.sort}
              onSort={(sort) => dispatch({ type: 'setSort', sort })}
              view={state.view}
              onView={(view) => dispatch({ type: 'setView', view })}
              onImport={handleImport}
              compactFolders={isNarrow ? { folders, folderId: state.folderId, onSelect: (folderId) => dispatch({ type: 'setFolder', folderId }) } : undefined}
            />

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: 'grid',
                gridTemplateColumns: isNarrow ? '1fr' : `220px 1fr${showPanel ? ' 300px' : ''}`,
              }}
            >
              {!isNarrow && (
                <Box sx={{ borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto', p: 1 }}>
                  <FolderTree folders={folders} counts={counts} folderId={state.folderId} onSelect={(folderId) => dispatch({ type: 'setFolder', folderId })} />
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
                      {state.search ? 'Tout sélectionner dans les résultats' : `Tout sélectionner dans « ${folderName} »`}
                    </Button>
                    {selectedCount > 0 && (
                      <Button variant="text" size="small" color="inherit" onClick={() => dispatch({ type: 'deselectAll' })}>
                        Tout désélectionner
                      </Button>
                    )}
                  </Stack>
                )}

                <ImportBanner batch={state.batch} folderName={batchFolderName} />

                <Box ref={scrollRef} id={`${idPrefix}-results`} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2.5 }}>
                  {isNarrow && panel && <Box sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>{panel}</Box>}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center', mb: 2, px: 1.5, py: 1, border: '1px dashed', borderColor: 'divider', borderRadius: 2, color: 'text.secondary' }}
                  >
                    <CloudUploadOutlinedIcon fontSize="small" aria-hidden="true" />
                    <Typography variant="body2">
                      Glissez des images ici pour les importer dans <strong>{folderName}</strong>
                    </Typography>
                  </Stack>
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
                        Déposez vos images pour les importer dans « {folderName} »
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
          primaryLabel={isCropping ? 'Valider le recadrage' : primaryLabel(config, withCropStep, selectedCount)}
          primaryDisabled={selectedCount === 0}
          onPrimary={confirm}
          onCancel={() => onClose(null)}
          onBack={isCropping ? backToChoose : undefined}
        />
      </Dialog>
    </ThemeProvider>
  );
}
