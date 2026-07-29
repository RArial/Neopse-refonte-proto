export default function AgendaLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement de l'agenda…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 44 }} />
      <div className="skel skel-card" style={{ height: 260 }} />
    </div>
  );
}
