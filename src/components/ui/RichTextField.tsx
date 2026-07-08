'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

interface RichTextFieldProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  minHeight?: number;
}

export function RichTextField({ label, value, onChange, placeholder, error, helperText, minHeight = 140 }: RichTextFieldProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, blockquote: false, codeBlock: false, horizontalRule: false }),
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': label,
      },
    },
  });

  // Garde l'éditeur synchronisé si la valeur est réinitialisée depuis l'extérieur (ex. reset de formulaire).
  useEffect(() => {
    if (editor && value !== editor.getHTML() && value === '') {
      editor.commands.setContent('');
    }
  }, [editor, value]);

  // Force le re-rendu de la barre d'outils quand la sélection ou les marques actives changent
  // (déplacement du curseur, sans forcément de saisie qui déclencherait onUpdate).
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const rerender = () => forceUpdate((n) => n + 1);
    editor.on('transaction', rerender);
    return () => {
      editor.off('transaction', rerender);
    };
  }, [editor]);

  // Empêche le bouton de la barre d'outils de voler le focus au clic : sans ce preventDefault,
  // la sélection dans l'éditeur est perdue et la saisie suivante n'atteint plus le contenu.
  function preventFocusSteal(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
  }

  const helperId = `${label.replace(/\s+/g, '-').toLowerCase()}-helper-text`;

  return (
    <Box>
      <FormLabel component="legend" sx={{ display: 'block', mb: 0.75, fontSize: 13 }} error={error}>
        {label}
      </FormLabel>

      <Box
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          '&:focus-within': {
            borderColor: error ? 'error.main' : 'primary.main',
            boxShadow: (theme) => `0 0 0 1px ${theme.palette[error ? 'error' : 'primary'].main}`,
          },
        }}
      >
        <ToggleButtonGroup
          size="small"
          aria-label={`Options de mise en forme — ${label}`}
          sx={{ px: 1, py: 0.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}
        >
          <ToggleButton
            value="bold"
            selected={Boolean(editor?.isActive('bold'))}
            onMouseDown={preventFocusSteal}
            onChange={() => editor?.chain().focus().toggleBold().run()}
            aria-label="Gras"
            disabled={!editor}
          >
            <FormatBoldIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="italic"
            selected={Boolean(editor?.isActive('italic'))}
            onMouseDown={preventFocusSteal}
            onChange={() => editor?.chain().focus().toggleItalic().run()}
            aria-label="Italique"
            disabled={!editor}
          >
            <FormatItalicIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="underline"
            selected={Boolean(editor?.isActive('underline'))}
            onMouseDown={preventFocusSteal}
            onChange={() => editor?.chain().focus().toggleUnderline().run()}
            aria-label="Souligné"
            disabled={!editor}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="bulletList"
            selected={Boolean(editor?.isActive('bulletList'))}
            onMouseDown={preventFocusSteal}
            onChange={() => editor?.chain().focus().toggleBulletList().run()}
            aria-label="Liste à puces"
            disabled={!editor}
          >
            <FormatListBulletedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="orderedList"
            selected={Boolean(editor?.isActive('orderedList'))}
            onMouseDown={preventFocusSteal}
            onChange={() => editor?.chain().focus().toggleOrderedList().run()}
            aria-label="Liste numérotée"
            disabled={!editor}
          >
            <FormatListNumberedIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Box
          sx={{
            px: 1.75,
            py: 1.25,
            minHeight,
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: 14,
            lineHeight: 1.6,
            '& .ProseMirror': { outline: 'none' },
            '& .ProseMirror ul': { listStyle: 'disc', pl: 3, my: 0.5 },
            '& .ProseMirror ol': { listStyle: 'decimal', pl: 3, my: 0.5 },
            '& .ProseMirror li': { display: 'list-item' },
            '& .ProseMirror p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              color: 'text.disabled',
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
          }}
        >
          <EditorContent editor={editor} aria-describedby={helperText ? helperId : undefined} />
        </Box>
      </Box>

      {helperText && (
        <FormHelperText id={helperId} error={error} role={error ? 'alert' : undefined} sx={{ mx: 1.75 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
