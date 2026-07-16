export default function AbonnementsLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des abonnements…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 56 }} />
      <div className="skel skel-card" style={{ height: 320 }} />
    </div>
  );
}
