export default function NouveauFormulaireLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement du formulaire…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 420 }} />
      <div className="skel skel-card" style={{ height: 160 }} />
    </div>
  );
}
