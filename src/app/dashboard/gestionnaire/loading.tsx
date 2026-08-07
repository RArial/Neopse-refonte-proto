export default function GestionnaireLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des fichiers…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 44 }} />
      <div className="skel skel-card" style={{ height: 400 }} />
    </div>
  );
}
