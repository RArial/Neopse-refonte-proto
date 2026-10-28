import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { BackgroundColor, Color, FontSize, TextStyle } from '@tiptap/extension-text-style';
import { Anchor } from '@/lib/actualites/tiptapAnchor';

/**
 * Même schéma pour l'éditeur et l'aperçu : le contenu est toujours relu par ProseMirror, qui écarte
 * tout ce qu'il ne connaît pas (scripts compris) — pas besoin d'injecter du HTML brut.
 */
export function newsEditorExtensions(placeholder?: string) {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
      codeBlock: false,
      horizontalRule: false,
      link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
    }),
    TextStyle,
    Color,
    BackgroundColor,
    FontSize,
    Subscript,
    Superscript,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Anchor,
    ...(placeholder ? [Placeholder.configure({ placeholder })] : []),
  ];
}
