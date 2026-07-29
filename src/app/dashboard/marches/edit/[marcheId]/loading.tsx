export default function EditMarcheLoading() {
  return (
    <div className="page-skeleton" aria-label="Chargement du marché…" aria-busy="true">
      <div className="skel skel-title" />
      <div className="skel skel-card" style={{ height: 420 }} />
      <div className="skel skel-card" style={{ height: 160 }} />
    </div>
  );
}
