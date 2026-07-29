export default function Loading() {
  return (
    <div className="page-skeleton" aria-label="Chargement — saisine…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 420 }} />
    </div>
  );
}
