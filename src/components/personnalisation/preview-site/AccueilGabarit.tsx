import type { ModuleKey } from '@/types/personnalisation';

const MODULES: { title: string; description: string; moduleKey: ModuleKey }[] = [
  { title: 'Actualités', description: '12 publications récentes', moduleKey: 'news' },
  { title: 'Agenda', description: '5 événements à venir', moduleKey: 'events' },
  { title: 'Démarches en ligne', description: 'État civil, urbanisme…', moduleKey: 'forms' },
  { title: 'Annuaire', description: 'Services et élus', moduleKey: 'directory' },
];

export function AccueilGabarit() {
  return (
    <div>
      <section data-role="general:buttonBg" className="bg-[var(--role-buttonBg)] text-[var(--role-buttonText)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="font-[var(--font-heading)] text-3xl md:text-4xl font-bold max-w-2xl">
            Bienvenue sur le site de la Mairie de Vercourt
          </h1>
          <p className="mt-3 max-w-xl text-base opacity-90">
            Toute l&apos;actualité de votre commune, vos démarches en ligne et les services de proximité.
          </p>
          <a
            href="#"
            className="mt-6 inline-block rounded-md px-5 py-2.5 text-sm font-semibold bg-[var(--role-bodyBg)] text-[var(--role-bodyText)]"
          >
            Effectuer une démarche
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-[var(--font-heading)] text-xl font-bold mb-6">Vos services en un clic</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MODULES.map((m) => (
            <div
              key={m.title}
              data-role={`${m.moduleKey}:bodyBg`}
              className="rounded-lg border border-black/10 p-4"
              style={{ backgroundColor: `var(--module-${m.moduleKey}-bg)` }}
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full mb-3 bg-[var(--role-accent)]" aria-hidden="true" />
              <p data-role={`${m.moduleKey}:bodyText`} className="font-semibold text-sm" style={{ color: `var(--module-${m.moduleKey}-title)` }}>
                {m.title}
              </p>
              <p
                data-role={`${m.moduleKey}:bodyText`}
                className="text-xs opacity-70 mt-1"
                style={{ color: `var(--module-${m.moduleKey}-title)` }}
              >
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
