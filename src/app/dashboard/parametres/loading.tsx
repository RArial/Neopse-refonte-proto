export default function ParametresLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des paramètres…" aria-busy="true">
      <div className="skel skel-title" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skel skel-card" style={{ height: 64 }} />
      ))}
    </div>
  );
}
