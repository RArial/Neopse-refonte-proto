export default function PersonnalisationLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement de la personnalisation…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skel skel-card" style={{ height: 220 }} />
        ))}
      </div>
    </div>
  );
}
