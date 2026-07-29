export default function Loading() {
  return (
    <div className="page-skeleton" aria-label="Chargement — alertes…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 44 }} />
      <div className="skel skel-card" style={{ height: 360 }} />
    </div>
  );
}
