import Image from 'next/image';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import type { ToolItem } from '@/lib/tools';

interface ToolLogoProps {
  tool: ToolItem;
  size?: number;
}

/** Logo d'un outil : les bandeaux qui contiennent déjà le nom stylisé (ex. eTicket) sont affichés dans leurs
 * proportions d'origine ; les marques en simple trait sont posées sur un badge carré teinté de la couleur
 * de marque pour rester lisibles, les logos déjà autoporteurs (fond propre) s'affichent tels quels. */
export function ToolLogo({ tool, size = 44 }: ToolLogoProps) {
  if (tool.logoContainsWordmark) {
    const height = size - 4;
    const width = Math.round((tool.logoWidth / tool.logoHeight) * height);
    return (
      <Box sx={{ position: 'relative', width, height, flexShrink: 0 }}>
        <Image src={tool.logoSrc} alt="" fill style={{ objectFit: 'contain' }} sizes={`${width}px`} />
      </Box>
    );
  }

  const innerSize = tool.logoVariant === 'framed' ? size * 0.6 : size;
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        borderRadius: '12px',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        ...(tool.logoVariant === 'framed' && { bgcolor: alpha(tool.accentColor, 0.14) }),
      }}
    >
      <Box sx={{ position: 'relative', width: innerSize, height: innerSize }}>
        <Image src={tool.logoSrc} alt="" fill style={{ objectFit: 'contain' }} sizes={`${size}px`} />
      </Box>
    </Box>
  );
}
