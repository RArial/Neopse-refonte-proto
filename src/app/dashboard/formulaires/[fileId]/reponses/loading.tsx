export default function FormulaireReponsesLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des réponses…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 80 }} />
      <div className="skel skel-card" style={{ height: 80 }} />
      <div className="skel skel-card" style={{ height: 80 }} />
    </div>
  );
}
