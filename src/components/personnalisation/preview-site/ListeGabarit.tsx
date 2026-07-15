const ITEMS = [
  { title: 'Ouverture de la nouvelle médiathèque', date: '02 juillet 2026', category: 'Culture' },
  { title: 'Travaux rue de la République', date: '28 juin 2026', category: 'Urbanisme' },
  { title: 'Inscriptions périscolaires 2026-2027', date: '20 juin 2026', category: 'Éducation' },
  { title: 'Marché de producteurs, édition d’été', date: '15 juin 2026', category: 'Événement' },
  { title: 'Recrutement : agents d’accueil', date: '10 juin 2026', category: 'Emploi' },
  { title: 'Résultats du budget participatif', date: '02 juin 2026', category: 'Vie municipale' },
];

const FILTERS = ['Tous', 'Culture', 'Urbanisme', 'Éducation', 'Événement'];

export function ListeGabarit() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-[var(--font-heading)] text-2xl font-bold mb-6">Actualités</h1>

      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filtrer les actualités">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            data-role={i === 0 ? 'general:buttonBg' : undefined}
            className={
              i === 0
                ? 'rounded-full px-3 py-1 text-xs font-semibold bg-[var(--role-buttonBg)] text-[var(--role-buttonText)]'
                : 'rounded-full px-3 py-1 text-xs font-semibold border border-black/15'
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ITEMS.map((item) => (
          <article key={item.title} className="rounded-lg border border-black/10 overflow-hidden flex flex-col">
            <div data-role="news:bodyBg" className="h-28" style={{ backgroundColor: 'var(--module-news-bg)' }} aria-hidden="true" />
            <div className="p-4 flex-1 flex flex-col">
              <span
                className="self-start text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-2 bg-[var(--role-accent)]"
                style={{ color: '#fff' }}
              >
                {item.category}
              </span>
              <h2 className="font-semibold text-sm leading-snug">{item.title}</h2>
              <p className="text-xs opacity-60 mt-auto pt-3">{item.date}</p>
            </div>
          </article>
        ))}
      </div>

      <nav className="mt-8 flex justify-center gap-1" aria-label="Pagination">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            type="button"
            data-role={page === 1 ? 'general:buttonBg' : undefined}
            className={
              page === 1
                ? 'h-8 w-8 rounded-md text-sm font-semibold bg-[var(--role-buttonBg)] text-[var(--role-buttonText)]'
                : 'h-8 w-8 rounded-md text-sm font-semibold border border-black/15'
            }
          >
            {page}
          </button>
        ))}
      </nav>
    </div>
  );
}
