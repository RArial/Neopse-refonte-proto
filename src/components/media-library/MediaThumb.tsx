import Image from 'next/image';
import Box from '@mui/material/Box';

interface MediaThumbProps {
  src: string;
  /** Vide par défaut : la vignette accompagne toujours le nom du fichier. */
  alt?: string;
  fit?: 'cover' | 'contain';
  sizes: string;
}

/** Remplit son parent, qui doit être positionné et dimensionné. */
export function MediaThumb({ src, alt = '', fit = 'cover', sizes }: MediaThumbProps) {
  // Object URLs et data URIs : rien à optimiser côté serveur.
  return <Box component={Image} src={src} alt={alt} fill unoptimized sizes={sizes} draggable={false} sx={{ objectFit: fit }} />;
}
