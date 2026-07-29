export default function Loading() {
  return (
    <div className="page-skeleton" aria-label="Chargement — nouvelle alerte…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 500 }} />
    </div>
  );
}
