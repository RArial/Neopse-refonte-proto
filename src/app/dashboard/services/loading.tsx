export default function ServicesLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des services…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 140 }} />
      <div className="skel skel-card" style={{ height: 140 }} />
      <div className="skel skel-card" style={{ height: 140 }} />
    </div>
  );
}
