export default function ActualitesLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des actualités…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 44 }} />
      <div className="skel skel-card" style={{ height: 360 }} />
    </div>
  );
}
