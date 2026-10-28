'use client';

import { useEffect, useId, useRef, useState, type FocusEvent, type MouseEvent, type ReactNode } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AnchorIcon from '@mui/icons-material/Anchor';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import RedoIcon from '@mui/icons-material/Redo';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import UndoIcon from '@mui/icons-material/Undo';
import { BACKGROUND_COLORS, BLOCK_FORMATS, FONT_SIZES, TEXT_COLORS } from '@/lib/actualites/editorStyles';
import { newsEditorExtensions } from '@/lib/actualites/editorExtensions';
import { slugifyAnchor } from '@/lib/actualites/tiptapAnchor';

interface NewsRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  ariaLabel: string;
  placeholder?: string;
}

type OpenPanel = 'color' | 'background' | 'link' | 'anchor' | 'format' | 'size';

// Empêche le bouton de voler le focus : sans cela, la sélection dans l'éditeur est perdue.
function keepSelection(event: MouseEvent<HTMLElement>) {
  event.preventDefault();
}

interface ToolProps {
  label: string;
  icon: ReactNode;
  onClick: (anchorEl: HTMLElement) => void;
  active?: boolean;
  disabled?: boolean;
}

function Tool({ label, icon, onClick, active, disabled }: ToolProps) {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          size="small"
          aria-label={label}
          aria-pressed={active === undefined ? undefined : active}
          disabled={disabled}
          onMouseDown={keepSelection}
          onClick={(event) => onClick(event.currentTarget)}
          sx={{
            minWidth: 34,
            minHeight: 34,
            borderRadius: 1,
            color: active ? 'primary.main' : 'text.primary',
            bgcolor: active ? 'action.selected' : 'transparent',
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function ToolDivider() {
  return <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />;
}

/** URL acceptée pour un lien : web, courriel, téléphone ou ancre de la page. */
function normalizeHref(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.startsWith('#') || /^(https?:|mailto:|tel:)/i.test(value)) return value;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(value)) return `https://${value}`;
  return null;
}

function currentBlockLabel(editor: Editor): string {
  const heading = BLOCK_FORMATS.find((format) => format.level > 0 && editor.isActive('heading', { level: format.level }));
  return heading?.label ?? 'Paragraphe';
}

export function NewsRichTextEditor({ value, onChange, ariaLabel, placeholder }: NewsRichTextEditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [panel, setPanel] = useState<{ kind: OpenPanel; anchorEl: HTMLElement } | null>(null);
  const [linkValue, setLinkValue] = useState('');
  const [anchorValue, setAnchorValue] = useState('');
  const linkFieldId = useId();
  const anchorFieldId = useId();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: newsEditorExtensions(placeholder),
    content: value,
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    editorProps: { attributes: { role: 'textbox', 'aria-multiline': 'true', 'aria-label': ariaLabel } },
  });

  // La barre suit la sélection (marques actives) même sans saisie.
  const [, rerender] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const update = () => rerender((n) => n + 1);
    editor.on('transaction', update);
    return () => {
      editor.off('transaction', update);
    };
  }, [editor]);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    // Les menus de la barre sont rendus hors de l'arbre (portail) : on garde la barre tant qu'un menu est ouvert.
    if (panel || rootRef.current?.contains(event.relatedTarget as Node | null)) return;
    setFocused(false);
  }

  function openPanel(kind: OpenPanel, anchorEl: HTMLElement) {
    if (!editor) return;
    if (kind === 'link') setLinkValue(String(editor.getAttributes('link').href ?? ''));
    if (kind === 'anchor') setAnchorValue('');
    setPanel({ kind, anchorEl });
  }

  function closePanel() {
    setPanel(null);
    editor?.commands.focus();
  }

  function applyLink() {
    const href = normalizeHref(linkValue);
    if (!editor || !href) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setPanel(null);
  }

  function applyAnchor() {
    const id = slugifyAnchor(anchorValue);
    if (!editor || !id) return;
    editor.chain().focus().insertContent({ type: 'anchor', attrs: { id } }).run();
    setPanel(null);
  }

  const showToolbar = focused || panel !== null;
  const can = editor?.can();
  const linkHrefValid = normalizeHref(linkValue) !== null;

  return (
    <Box
      ref={rootRef}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      sx={{
        border: '1px solid',
        borderColor: showToolbar ? 'primary.main' : 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'border-color 150ms ease',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      {showToolbar && editor && (
        <Stack
          role="toolbar"
          aria-label={`Mise en forme — ${ariaLabel}`}
          direction="row"
          useFlexGap
          sx={{ flexWrap: 'wrap', alignItems: 'center', px: 0.5, py: 0.25, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tool label="Annuler" icon={<UndoIcon fontSize="small" />} onClick={() => editor.chain().focus().undo().run()} disabled={!can?.undo()} />
          <Tool label="Rétablir" icon={<RedoIcon fontSize="small" />} onClick={() => editor.chain().focus().redo().run()} disabled={!can?.redo()} />
          <ToolDivider />
          <Tool label="Gras" icon={<FormatBoldIcon fontSize="small" />} active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
          <Tool label="Italique" icon={<FormatItalicIcon fontSize="small" />} active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <Tool label="Souligné" icon={<FormatUnderlinedIcon fontSize="small" />} active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />
          <Tool label="Barré" icon={<StrikethroughSIcon fontSize="small" />} active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} />
          <Tool label="Indice" icon={<SubscriptIcon fontSize="small" />} active={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()} />
          <Tool label="Exposant" icon={<SuperscriptIcon fontSize="small" />} active={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()} />
          <ToolDivider />
          <Tool label="Couleur du texte" icon={<FormatColorTextIcon fontSize="small" />} onClick={(el) => openPanel('color', el)} />
          <Tool label="Couleur de fond" icon={<FormatColorFillIcon fontSize="small" />} onClick={(el) => openPanel('background', el)} />
          <ToolDivider />
          <Tool label="Liste numérotée" icon={<FormatListNumberedIcon fontSize="small" />} active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
          <Tool label="Liste à puces" icon={<FormatListBulletedIcon fontSize="small" />} active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
          <Tool label="Diminuer le retrait" icon={<FormatIndentDecreaseIcon fontSize="small" />} disabled={!can?.liftListItem('listItem')} onClick={() => editor.chain().focus().liftListItem('listItem').run()} />
          <Tool label="Augmenter le retrait" icon={<FormatIndentIncreaseIcon fontSize="small" />} disabled={!can?.sinkListItem('listItem')} onClick={() => editor.chain().focus().sinkListItem('listItem').run()} />
          <Tool label="Citation" icon={<FormatQuoteIcon fontSize="small" />} active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
          <ToolDivider />
          <Tool label="Aligner à gauche" icon={<FormatAlignLeftIcon fontSize="small" />} active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
          <Tool label="Centrer" icon={<FormatAlignCenterIcon fontSize="small" />} active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
          <Tool label="Aligner à droite" icon={<FormatAlignRightIcon fontSize="small" />} active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />
          <Tool label="Justifier" icon={<FormatAlignJustifyIcon fontSize="small" />} active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} />
          <ToolDivider />
          <Tool label="Insérer un lien" icon={<InsertLinkIcon fontSize="small" />} active={editor.isActive('link')} onClick={(el) => openPanel('link', el)} />
          <Tool label="Supprimer le lien" icon={<LinkOffIcon fontSize="small" />} disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()} />
          <Tool label="Insérer une ancre" icon={<AnchorIcon fontSize="small" />} onClick={(el) => openPanel('anchor', el)} />
          <ToolDivider />
          <ButtonBase
            onMouseDown={keepSelection}
            onClick={(event) => openPanel('format', event.currentTarget)}
            aria-haspopup="menu"
            aria-label={`Format : ${currentBlockLabel(editor)}`}
            sx={{ minHeight: 34, px: 1, borderRadius: 1, fontSize: 13, fontWeight: 600 }}
          >
            Format <ArrowDropDownIcon fontSize="small" />
          </ButtonBase>
          <ButtonBase
            onMouseDown={keepSelection}
            onClick={(event) => openPanel('size', event.currentTarget)}
            aria-haspopup="menu"
            aria-label="Taille du texte"
            sx={{ minHeight: 34, px: 1, borderRadius: 1, fontSize: 13, fontWeight: 600 }}
          >
            Taille <ArrowDropDownIcon fontSize="small" />
          </ButtonBase>
        </Stack>
      )}

      <Box
        sx={{
          px: 1.75,
          py: 1.25,
          minHeight: 140,
          fontSize: 15,
          lineHeight: 1.6,
          '& .ProseMirror': { outline: 'none', minHeight: 116 },
          '& .ProseMirror ul': { listStyle: 'disc', pl: 3, my: 0.5 },
          '& .ProseMirror ol': { listStyle: 'decimal', pl: 3, my: 0.5 },
          '& .ProseMirror li': { display: 'list-item' },
          '& .ProseMirror h2': { fontSize: 22, fontWeight: 700, my: 1 },
          '& .ProseMirror h3': { fontSize: 19, fontWeight: 700, my: 1 },
          '& .ProseMirror h4': { fontSize: 17, fontWeight: 700, my: 1 },
          '& .ProseMirror blockquote': { borderLeft: '3px solid', borderColor: 'divider', pl: 2, ml: 0, color: 'text.secondary' },
          '& .ProseMirror a': { color: 'primary.main', textDecoration: 'underline' },
          '& .ProseMirror .news-anchor': { display: 'inline-block', px: 0.5, mx: 0.25, borderRadius: 0.5, bgcolor: 'action.selected', fontSize: 12, verticalAlign: 'middle' },
          '& .ProseMirror .news-anchor::before': { content: '"#" attr(id)', color: 'text.secondary' },
          '& .ProseMirror p.is-editor-empty:first-of-type::before': {
            content: 'attr(data-placeholder)',
            color: 'text.secondary',
            float: 'left',
            height: 0,
            pointerEvents: 'none',
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {/* Menus de la barre : un seul ouvert à la fois. */}
      <Popover
        open={panel?.kind === 'color' || panel?.kind === 'background'}
        anchorEl={panel?.anchorEl}
        onClose={closePanel}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {panel?.kind === 'background' ? 'Couleur de fond' : 'Couleur du texte'}
          </Typography>
          <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', maxWidth: 220 }}>
            {(panel?.kind === 'background' ? BACKGROUND_COLORS : TEXT_COLORS).map((color) => (
              <Tooltip key={color.value} title={color.label}>
                <ButtonBase
                  aria-label={color.label}
                  onClick={() => {
                    if (panel?.kind === 'background') editor?.chain().focus().setBackgroundColor(color.value).run();
                    else editor?.chain().focus().setColor(color.value).run();
                    setPanel(null);
                  }}
                  sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: color.value, border: '1px solid', borderColor: 'divider' }}
                />
              </Tooltip>
            ))}
          </Stack>
          <Button
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              if (panel?.kind === 'background') editor?.chain().focus().unsetBackgroundColor().run();
              else editor?.chain().focus().unsetColor().run();
              setPanel(null);
            }}
          >
            Retirer la couleur
          </Button>
        </Box>
      </Popover>

      <Popover open={panel?.kind === 'link'} anchorEl={panel?.anchorEl} onClose={closePanel} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box component="form" sx={{ p: 2, width: 300 }} onSubmit={(event) => { event.preventDefault(); applyLink(); }}>
          <TextField
            id={linkFieldId}
            size="small"
            fullWidth
            autoFocus
            label="Adresse du lien"
            placeholder="https://… ou #ancre"
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            error={linkValue.trim() !== '' && !linkHrefValid}
            helperText={linkValue.trim() !== '' && !linkHrefValid ? 'Adresse non reconnue : commencez par https://, mailto: ou #.' : ' '}
          />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <Button size="small" color="inherit" onClick={closePanel}>
              Annuler
            </Button>
            <Button size="small" variant="contained" type="submit" disabled={!linkHrefValid}>
              Appliquer
            </Button>
          </Stack>
        </Box>
      </Popover>

      <Popover open={panel?.kind === 'anchor'} anchorEl={panel?.anchorEl} onClose={closePanel} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box component="form" sx={{ p: 2, width: 300 }} onSubmit={(event) => { event.preventDefault(); applyAnchor(); }}>
          <TextField
            id={anchorFieldId}
            size="small"
            fullWidth
            autoFocus
            label="Nom de l'ancre"
            value={anchorValue}
            onChange={(event) => setAnchorValue(event.target.value)}
            helperText={slugifyAnchor(anchorValue) ? `Lien vers cette ancre : #${slugifyAnchor(anchorValue)}` : 'Ex. horaires'}
          />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 1 }}>
            <Button size="small" color="inherit" onClick={closePanel}>
              Annuler
            </Button>
            <Button size="small" variant="contained" type="submit" disabled={!slugifyAnchor(anchorValue)}>
              Insérer
            </Button>
          </Stack>
        </Box>
      </Popover>

      <Menu open={panel?.kind === 'format'} anchorEl={panel?.anchorEl} onClose={closePanel}>
        {BLOCK_FORMATS.map((format) => (
          <MenuItem
            key={format.label}
            selected={editor ? currentBlockLabel(editor) === format.label : false}
            onClick={() => {
              if (format.level === 0) editor?.chain().focus().setParagraph().run();
              else editor?.chain().focus().setHeading({ level: format.level }).run();
              setPanel(null);
            }}
          >
            {format.label}
          </MenuItem>
        ))}
      </Menu>

      <Menu open={panel?.kind === 'size'} anchorEl={panel?.anchorEl} onClose={closePanel}>
        <MenuItem
          onClick={() => {
            editor?.chain().focus().unsetFontSize().run();
            setPanel(null);
          }}
        >
          Par défaut
        </MenuItem>
        {FONT_SIZES.map((size) => (
          <MenuItem
            key={size}
            onClick={() => {
              editor?.chain().focus().setFontSize(size).run();
              setPanel(null);
            }}
          >
            {size.replace('px', ' px')}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
