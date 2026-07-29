export default function EditAnnonceLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement de l’annonce…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 420 }} />
      <div className="skel skel-card" style={{ height: 160 }} />
    </div>
  );
}
