'use client';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { OrientedImage } from '@/components/media-library/CroppedImage';
import { useElementSize } from '@/hooks/useElementSize';
import { rotatedSize } from '@/lib/mediaLibrary/crop';
import type { CropArea, MediaImage } from '@/types/mediaLibrary';

interface CropOverlayPreviewProps {
  image: MediaImage;
  crop: CropArea;
  height: number;
}

/** Image entière avec la zone conservée en surimpression : l'agent voit ce qui sera coupé avant de valider. */
export function CropOverlayPreview({ image, crop, height }: CropOverlayPreviewProps) {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const oriented = rotatedSize(image, crop.rotation);
  const scale = Math.min(size.width / oriented.width, height / oriented.height);

  return (
    <Box ref={ref} sx={{ width: '100%', height, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', borderRadius: 1.5, overflow: 'hidden' }}>
      {scale > 0 && (
        <Box sx={{ position: 'relative', width: oriented.width * scale, height: oriented.height * scale, overflow: 'hidden' }}>
          <OrientedImage image={image} rotation={crop.rotation} flipped={crop.flipped} alt="" />
          <Box
            aria-hidden="true"
            sx={(theme) => ({
              position: 'absolute',
              left: `${crop.x * 100}%`,
              top: `${crop.y * 100}%`,
              width: `${crop.width * 100}%`,
              height: `${crop.height * 100}%`,
              border: '2px solid',
              borderColor: 'common.white',
              boxShadow: `0 0 0 9999px ${alpha(theme.palette.common.black, 0.5)}`,
            })}
          />
        </Box>
      )}
    </Box>
  );
}
