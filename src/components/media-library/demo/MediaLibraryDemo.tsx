'use client';

import { useState, type ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ImagePickerField, type ImageFieldValue } from '@/components/media-library/demo/ImagePickerField';
import { SlideshowField } from '@/components/media-library/demo/SlideshowField';
import { MediaLibraryProvider } from '@/components/media-library/MediaLibraryProvider';
import { withStrongPrimary } from '@/lib/theme';

interface DemoCardProps {
  title: string;
  where: string;
  traits: string[];
  children: ReactNode;
}

function DemoCard({ title, where, traits, children }: DemoCardProps) {
  return (
    <Paper component="section" variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {where}
      </Typography>
      <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75, mb: 2.5 }} aria-label="Configuration de la modale">
        {traits.map((trait) => (
          <Chip key={trait} label={trait} size="small" variant="outlined" />
        ))}
      </Stack>
      {children}
    </Paper>
  );
}

export function MediaLibraryDemo() {
  const [thumbnail, setThumbnail] = useState<ImageFieldValue | null>(null);
  const [contentImage, setContentImage] = useState<ImageFieldValue | null>(null);
  const [slides, setSlides] = useState<string[]>([]);
  const [headerBackground, setHeaderBackground] = useState<ImageFieldValue | null>(null);

  return (
    // Variante contrastée du primaire : la démo montre des boutons pleins hors de la modale.
    <ThemeProvider theme={withStrongPrimary}>
      <MediaLibraryProvider>
        <Box component="main" id="main-content" sx={{ flex: 1, bgcolor: 'background.default', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
          <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Médiathèque : une modale, quatre champs
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 720 }}>
              Chaque champ ouvre la même modale, configurée selon son besoin : une ou plusieurs images, recadrage imposé ou non, texte
              alternatif demandé ou non.
            </Typography>
            <Alert severity="info" variant="outlined" sx={{ mb: 4, maxWidth: 720 }}>
              Prototype sans serveur : les images importées restent en mémoire jusqu&apos;au rechargement de la page et sont rangées
              automatiquement dans le dossier du module. Pour voir un doublon, importez deux fois le même fichier ; pour voir un refus,
              glissez une image WebP.
            </Alert>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DemoCard title="Vignette de l'actualité" where="Actualités › Nouvelle actualité" traits={['Une image', 'Recadrage 4:3', 'Décorative', 'Rangée dans Actualités']}>
                <ImagePickerField
                  config={{ context: "Vignette de l'actualité", folder: 'Actualités', ratio: { width: 4, height: 3 }, recommendation: '1200 × 900 px', altText: 'decorative' }}
                  value={thumbnail}
                  onChange={setThumbnail}
                />
              </DemoCard>

              <DemoCard title="Bloc Images" where="Contenu d'une actualité" traits={['Une image', 'Sans recadrage', 'Texte alternatif demandé', 'Rangée dans Actualités']}>
                <ImagePickerField config={{ context: 'Bloc Images', folder: 'Actualités', altText: 'ask' }} value={contentImage} onChange={setContentImage} />
              </DemoCard>

              <DemoCard title="Diaporama" where="Contenu d'un événement" traits={['Plusieurs images', 'Sans recadrage', 'Texte alternatif demandé', 'Rangée dans Agenda']}>
                <SlideshowField config={{ context: 'Diaporama', folder: 'Agenda', altText: 'ask' }} imageIds={slides} onChange={setSlides} />
              </DemoCard>

              <DemoCard title="Fond d'en-tête" where="Personnalisation › Apparence" traits={['Une image', 'Sans recadrage', 'Décorative', 'Rangée dans Apparence']}>
                <ImagePickerField
                  config={{ context: "Fond d'en-tête", folder: 'Apparence', altText: 'decorative' }}
                  value={headerBackground}
                  onChange={setHeaderBackground}
                />
              </DemoCard>
            </Box>
          </Box>
        </Box>
      </MediaLibraryProvider>
    </ThemeProvider>
  );
}
