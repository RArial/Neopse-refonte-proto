import type { CSSProperties } from 'react';
import { tokensToCssVars } from '@/lib/personnalisation/cssVars';
import type { Palette, PageGabaritId, ThemeTokens } from '@/types/personnalisation';
import { SiteChrome } from '@/components/personnalisation/preview-site/SiteChrome';
import { AccueilGabarit } from '@/components/personnalisation/preview-site/AccueilGabarit';
import { PageContenuGabarit } from '@/components/personnalisation/preview-site/PageContenuGabarit';
import { ListeGabarit } from '@/components/personnalisation/preview-site/ListeGabarit';
import { FicheDetailGabarit } from '@/components/personnalisation/preview-site/FicheDetailGabarit';

const GABARIT_COMPONENTS: Record<PageGabaritId, () => React.JSX.Element> = {
  accueil: AccueilGabarit,
  'page-contenu': PageContenuGabarit,
  liste: ListeGabarit,
  'fiche-detail': FicheDetailGabarit,
};

interface PreviewSiteProps {
  pageId: string;
  tokens: ThemeTokens;
  palette: Palette;
}

export function PreviewSite({ pageId, tokens, palette }: PreviewSiteProps) {
  const Gabarit = GABARIT_COMPONENTS[pageId as PageGabaritId] ?? AccueilGabarit;
  const vars = tokensToCssVars(tokens, palette) as CSSProperties;

  return (
    <div style={vars}>
      <SiteChrome>
        <Gabarit />
      </SiteChrome>
    </div>
  );
}
