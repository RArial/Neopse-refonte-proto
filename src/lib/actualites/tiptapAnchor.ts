import { mergeAttributes, Node } from '@tiptap/react';

/** Ancre nommée (cible d'un lien « #nom ») : nœud en ligne, sans texte. */
export const Anchor = Node.create({
  name: 'anchor',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return { id: { default: null } };
  },

  parseHTML() {
    return [{ tag: 'span[data-anchor]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-anchor': '', class: 'news-anchor' })];
  },
});

/** Nom d'ancre utilisable dans une URL : minuscules, sans accents ni espaces. */
export function slugifyAnchor(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
