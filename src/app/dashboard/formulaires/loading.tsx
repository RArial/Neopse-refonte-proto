export default function FormulairesLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des formulaires…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 44 }} />
      <div className="skel skel-card" style={{ height: 400 }} />
    </div>
  );
}
