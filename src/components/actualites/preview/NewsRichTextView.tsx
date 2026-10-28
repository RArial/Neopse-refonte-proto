'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import Box from '@mui/material/Box';
import { newsEditorExtensions } from '@/lib/actualites/editorExtensions';

/** Rendu en lecture seule par le schéma de l'éditeur : aucun HTML brut injecté. */
export function NewsRichTextView({ html }: { html: string }) {
  const editor = useEditor({ immediatelyRender: false, editable: false, extensions: newsEditorExtensions(), content: html });
  return (
    <Box
      sx={{
        fontSize: 16,
        lineHeight: 1.7,
        '& .ProseMirror': { outline: 'none' },
        '& ul': { listStyle: 'disc', pl: 3 },
        '& ol': { listStyle: 'decimal', pl: 3 },
        '& h2': { fontSize: 24, fontWeight: 700 },
        '& h3': { fontSize: 20, fontWeight: 700 },
        '& h4': { fontSize: 18, fontWeight: 700 },
        '& blockquote': { borderLeft: '3px solid', borderColor: 'divider', pl: 2, ml: 0, color: 'text.secondary' },
        '& a': { color: 'primary.main' },
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
}
