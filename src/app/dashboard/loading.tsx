export default function DashboardLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement du tableau de bord…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skel skel-card" />
        ))}
      </div>
      <div className="skel-grid skel-grid--kpi">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skel skel-kpi" />
        ))}
      </div>
    </div>
  );
}
