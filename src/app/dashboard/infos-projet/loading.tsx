export default function InfosProjetLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des informations du projet…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 420 }} />
      <div className="skel skel-card" style={{ height: 120 }} />
    </div>
  );
}
