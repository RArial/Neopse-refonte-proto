export default function ProfilLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement du profil…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 60 }} />
      <div className="skel skel-card" style={{ height: 420 }} />
      <div className="skel skel-card" style={{ height: 220 }} />
    </div>
  );
}
