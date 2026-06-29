interface SparklineProps {
  data: number[];
}

export function Sparkline({ data }: SparklineProps) {
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
    <svg
      className="kpi-spark"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      width="100%"
      height="40"
      aria-hidden="true"
    >
      <path className="fill" d={area} />
      <path className="line" d={line} />
    </svg>
  );
}
