export function PageContenuGabarit() {
  return (
    <article>
      <div
        data-role="internalHeader:internalHeaderBg"
        className="px-6 py-8 mb-8"
        style={{ backgroundColor: 'var(--role-internalHeaderBg)' }}
      >
        <div className="mx-auto max-w-2xl">
          <p
            data-role="internalHeader:internalHeaderTitle"
            className="text-xs font-bold uppercase tracking-wide mb-1 opacity-80"
            style={{ color: 'var(--role-internalHeaderTitle)' }}
          >
            Page de contenu
          </p>
          <h1
            data-role="internalHeader:internalHeaderText"
            className="font-[var(--font-heading)] text-2xl font-bold"
            style={{ color: 'var(--role-internalHeaderText)' }}
          >
            Histoire de la commune
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-12">
        <p className="leading-relaxed mb-4">
          Fondée au bord de la rivière Aisne, la commune de Vercourt tire son nom d&apos;un ancien comptoir marchand
          mentionné dès le XIIe siècle. Aujourd&apos;hui, elle rassemble un peu plus de 3 200 habitants autour d&apos;un
          centre historique préservé et de quartiers résidentiels en plein développement.
        </p>
        <p className="leading-relaxed mb-4">
          La mairie propose de nombreux services aux habitants, consultables en ligne via l&apos;espace{' '}
          <a href="#" data-role="general:linkColor" className="underline underline-offset-2 text-[var(--role-linkColor)]">
            démarches en ligne
          </a>
          , ainsi qu&apos;un{' '}
          <a href="#" data-role="general:linkColor" className="underline underline-offset-2 text-[var(--role-linkColor)]">
            annuaire des associations locales
          </a>
          .
        </p>
        <h2 className="font-[var(--font-heading)] text-lg font-bold mt-8 mb-3">Un patrimoine vivant</h2>
        <p className="leading-relaxed mb-4">
          Le centre ancien conserve son église du XIIIe siècle, ses halles couvertes et plusieurs bâtisses classées.
          Chaque année, les Journées du patrimoine rassemblent plusieurs milliers de visiteurs venus (re)découvrir
          l&apos;histoire locale.
        </p>
        <blockquote data-role="general:linkColor" className="border-l-4 pl-4 italic my-6 border-[var(--role-linkColor)] opacity-90">
          « Vercourt a su conjuguer mémoire et modernité, au service de ses habitants. »
        </blockquote>
        <p className="leading-relaxed">
          Pour toute question, contactez le service culture et patrimoine via la page{' '}
          <a href="#" data-role="general:linkColor" className="underline underline-offset-2 text-[var(--role-linkColor)]">
            contact
          </a>
          .
        </p>
      </div>
    </article>
  );
}
