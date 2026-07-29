export default function EditEvenementLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement de l'événement…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 420 }} />
      <div className="skel skel-card" style={{ height: 160 }} />
    </div>
  );
}
