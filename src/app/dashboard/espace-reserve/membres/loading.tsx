export default function Loading() {
  return (
    <div className="page-skeleton" aria-label="Chargement — membres autorisés…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 320 }} />
      <div className="skel skel-card" style={{ height: 160 }} />
    </div>
  );
}
