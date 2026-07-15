import type { ReactNode } from 'react';

const NAV_LINKS = ['Accueil', 'Actualités', 'Agenda', 'Démarches', 'Annuaire', 'Contact'];

interface SiteChromeProps {
  children: ReactNode;
}

export function SiteChrome({ children }: SiteChromeProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)' }}>
      <header data-role="header:headerBg" className="bg-[var(--role-headerBg)] text-[var(--role-headerText)]">
        <div className="mx-auto max-w-5xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <span data-role="header:navText" className="font-[var(--font-heading)] text-lg font-bold tracking-tight">
            Mairie de Neopse
          </span>
          <nav data-role="header:navText" aria-label="Navigation principale">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium">
              {NAV_LINKS.map((link, i) => (
                <li key={link}>
                  <a href="#" className="hover:underline underline-offset-4" aria-current={i === 0 ? 'page' : undefined}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main data-role="general:bodyBg general:bodyText" className="flex-1 bg-[var(--role-bodyBg)] text-[var(--role-bodyText)]">
        {children}
      </main>

      <footer data-role="footer:footerBg footer:footerText" className="bg-[var(--role-footerBg)] text-[var(--role-footerText)]">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm flex flex-wrap justify-between gap-4">
          <div>
            <p data-role="footer:footerTitle" className="font-[var(--font-heading)] font-semibold text-[var(--role-footerTitle)]">
              Mairie de Neopse
            </p>
            <p className="opacity-80">1 place de la République — 00000 Neopse</p>
          </div>
          <div className="opacity-80">
            <p>Tél. 01 23 45 67 89</p>
            <p>contact@neopse.fr</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
