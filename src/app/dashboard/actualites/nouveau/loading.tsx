export default function NouvelleActualiteLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement du formulaire d'actualité…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 420 }} />
      <div className="skel skel-card" style={{ height: 160 }} />
    </div>
  );
}
