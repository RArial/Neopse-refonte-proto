export default function MesCommandesLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement des commandes…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 280 }} />
    </div>
  );
}
