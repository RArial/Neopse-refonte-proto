export default function EditVideoLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement de la vidéo…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 420 }} />
      <div className="skel skel-card" style={{ height: 160 }} />
    </div>
  );
}
