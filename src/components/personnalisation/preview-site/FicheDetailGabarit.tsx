export function FicheDetailGabarit() {
  return (
    <article>
      <div
        data-role="news:bodyBg"
        className="h-56 md:h-72 flex items-end"
        style={{ backgroundColor: 'var(--module-news-bg)' }}
        aria-hidden="true"
      >
        <div className="mx-auto max-w-3xl px-6 pb-8 w-full">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-wide rounded px-2 py-0.5 mb-3 bg-[var(--role-accent)]"
            style={{ color: '#fff' }}
          >
            Culture
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 -mt-6 relative">
        <div className="bg-[var(--role-bodyBg)] text-[var(--role-bodyText)] rounded-lg border border-black/10 p-6 md:p-8">
          <h1
            data-role="news:bodyText"
            className="font-[var(--font-heading)] text-2xl font-bold mb-2"
            style={{ color: 'var(--module-news-title)' }}
          >
            Ouverture de la nouvelle médiathèque
          </h1>
          <p className="text-sm opacity-60 mb-6">Publié le 2 juillet 2026 — Service culture</p>

          <p className="leading-relaxed mb-4">
            La nouvelle médiathèque municipale ouvrira ses portes le 15 juillet prochain, place de la République.
            Ce nouvel espace de 1 200 m² proposera un fonds de plus de 30 000 documents, un espace numérique et
            une programmation culturelle renouvelée tout au long de l&apos;année.
          </p>
          <p className="leading-relaxed mb-6">
            L&apos;inscription reste gratuite pour tous les habitants de la commune. Les horaires d&apos;ouverture
            seront étendus le mercredi et le samedi.
          </p>

          <a
            href="#"
            data-role="general:buttonBg"
            className="inline-block rounded-md px-4 py-2 text-sm font-semibold bg-[var(--role-buttonBg)] text-[var(--role-buttonText)]"
          >
            Retour aux actualités
          </a>
        </div>
      </div>
    </article>
  );
}
