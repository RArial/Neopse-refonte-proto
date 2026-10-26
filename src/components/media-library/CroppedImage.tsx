import Image from 'next/image';
import Box from '@mui/material/Box';
import { rotatedSize } from '@/lib/mediaLibrary/crop';
import type { AspectRatio, CropArea, MediaImage } from '@/types/mediaLibrary';

interface OrientedImageProps {
  image: MediaImage;
  rotation: CropArea['rotation'];
  flipped: boolean;
  alt: string;
}

/** Remplit un parent aux proportions de l'image pivotée. */
export function OrientedImage({ image, rotation, flipped, alt }: OrientedImageProps) {
  const turned = rotation % 180 !== 0;
  return (
    <Box
      component={Image}
      src={image.url}
      alt={alt}
      width={image.width}
      height={image.height}
      unoptimized
      draggable={false}
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        maxWidth: 'none',
        width: turned ? `${(image.width / image.height) * 100}%` : '100%',
        height: turned ? `${(image.height / image.width) * 100}%` : '100%',
        // Retournement appliqué après la rotation : il agit dans le sens de lecture de l'écran.
        transform: `translate(-50%, -50%) scaleX(${flipped ? -1 : 1}) rotate(${rotation}deg)`,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  );
}

interface CroppedImageProps {
  image: MediaImage;
  crop: CropArea;
  ratio: AspectRatio;
  alt: string;
}

/** Rendu du recadrage en CSS : l'original n'est pas modifié, seules les coordonnées sont conservées. */
export function CroppedImage({ image, crop, ratio, alt }: CroppedImageProps) {
  const oriented = rotatedSize(image, crop.rotation);
  return (
    <Box sx={{ position: 'relative', width: '100%', aspectRatio: `${ratio.width} / ${ratio.height}`, overflow: 'hidden', bgcolor: 'action.hover' }}>
      <Box
        sx={{
          position: 'absolute',
          width: `${100 / crop.width}%`,
          left: `${(-crop.x / crop.width) * 100}%`,
          top: `${(-crop.y / crop.height) * 100}%`,
          aspectRatio: `${oriented.width} / ${oriented.height}`,
        }}
      >
        <OrientedImage image={image} rotation={crop.rotation} flipped={crop.flipped} alt={alt} />
      </Box>
    </Box>
  );
}
