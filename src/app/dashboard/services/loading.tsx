export default function ServicesLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des outils…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 180 }} />
      <div className="skel skel-card" style={{ height: 180 }} />
      <div className="skel skel-card" style={{ height: 180 }} />
    </div>
  );
}
