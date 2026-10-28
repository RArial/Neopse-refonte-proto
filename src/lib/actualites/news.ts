import type { NewsArticle, NewsStatus, StructureRow } from '@/types/actualites';

export function deriveNewsStatus(article: Pick<NewsArticle, 'active' | 'publishedAt'>, today: string): NewsStatus {
  if (!article.active) return 'inactive';
  return article.publishedAt > today ? 'scheduled' : 'published';
}

export function compareByDate(a: NewsArticle, b: NewsArticle): number {
  return b.publishedAt.localeCompare(a.publishedAt);
}

/** Favoris en tête, puis date de publication décroissante. */
export function compareForList(a: NewsArticle, b: NewsArticle): number {
  return Number(b.favorite) - Number(a.favorite) || compareByDate(a, b);
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ');
}

/** Texte indexé par la recherche : titre, chapô et tout le texte lisible du contenu. */
export function newsSearchText(article: NewsArticle): string {
  const parts: string[] = [article.title, article.lead];
  article.content.forEach((row) =>
    row.columns.forEach((blocks) =>
      blocks.forEach((block) => {
        if (block.kind === 'text') parts.push(block.heading, stripTags(block.body));
        if (block.kind === 'images' && block.caption) parts.push(block.caption);
        if (block.kind === 'attachments') parts.push(block.title ?? '', ...block.attachments.map((item) => item.name));
      }),
    ),
  );
  return parts.join(' ');
}

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function randomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Copie profonde avec de nouveaux identifiants : la copie ne partage aucune référence avec l'original. */
export function cloneContent(rows: StructureRow[]): StructureRow[] {
  return rows.map((row) => ({
    ...row,
    id: randomId('row'),
    columns: row.columns.map((blocks) => blocks.map((block) => structuredClone({ ...block, id: randomId('block') }))),
  }));
}

export function newNewsId(): string {
  return randomId('actualite');
}
