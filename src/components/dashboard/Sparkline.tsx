'use client';

import Box from '@mui/material/Box';

export type SparklineColor = 'primary' | 'secondary' | 'error' | 'warning' | 'success';

interface SparklineProps {
  data: number[];
  color: SparklineColor;
}

export function Sparkline({ data, color }: SparklineProps) {
  const W = 200;
  const H = 40;
  const P = 2;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = (W - P * 2) / Math.max(data.length - 1, 1);

  const pts = data.map((v, i): [number, number] => [
    P + i * step,
    P + (H - P * 2) * (1 - (v - min) / span),
  ]);

  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      width="100%"
      height="40"
      aria-hidden="true"
      sx={{ height: 34, mt: 'auto' }}
    >
      <Box
        component="path"
        d={area}
        sx={{
          fill: (theme) => theme.palette[color].main,
          opacity: 0,
          animation: 'spark-fade .8s .6s forwards',
          '@keyframes spark-fade': { to: { opacity: 0.12 } },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.12 },
        }}
      />
      <Box
        component="path"
        d={line}
        sx={{
          fill: 'none',
          stroke: (theme) => theme.palette[color].main,
          strokeWidth: 1.75,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeDasharray: 600,
          strokeDashoffset: 600,
          animation: 'spark-draw 1.2s .1s cubic-bezier(.2,.7,.2,1) forwards',
          '@keyframes spark-draw': { to: { strokeDashoffset: 0 } },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none', strokeDashoffset: 0 },
        }}
      />
    </Box>
  );
}
