export default function Loading() {
  return (
    <div className="page-skeleton" aria-label="Chargement — espace réservé…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 260 }} />
    </div>
  );
}
