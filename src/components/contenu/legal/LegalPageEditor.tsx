'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import { InlineLegalField } from '@/components/contenu/legal/InlineLegalField';
import { useLegalPages } from '@/components/contenu/legal/LegalPagesProvider';
import { RichTextField } from '@/components/ui/RichTextField';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { computeLegalCompletion } from '@/lib/legal/legalCompletion';
import { getLegalTemplate } from '@/lib/legal/legalTemplates';
import type { LegalBlock, LegalTemplateId } from '@/types/legal';

/** Ancre DOM stable d'un champ — utilisée par « Aller au premier champ manquant » pour le retrouver
 * via `document.getElementById` (pas de ref React : cette fonction est appelée pendant le rendu
 * pour construire une liste de blocs, et un scroll/focus n'a de sens que dans un gestionnaire). */
function fieldDomId(key: string): string {
  return `legal-field-${key}`;
}

function renderLegalBlocks(
  blocks: LegalBlock[],
  values: Record<string, string>,
  onFieldChange: (key: string, value: string) => void,
  missingKeys: string[],
): ReactNode[] {
  const missing = new Set(missingKeys);
  const nodes: ReactNode[] = [];
  let paragraph: ReactNode[] = [];
  let paragraphKey = 0;

  function flushParagraph() {
    if (paragraph.length === 0) return;
    nodes.push(
      // component="div" (pas le <p> par défaut de body1) : les champs inline (TextField, Select…)
      // rendent des <div>, invalides comme descendants d'un <p> en HTML.
      <Typography key={`p-${paragraphKey++}`} component="div" variant="body1" sx={{ lineHeight: 1.9, mb: 2.5 }}>
        {paragraph}
      </Typography>,
    );
    paragraph = [];
  }

  blocks.forEach((block, index) => {
    if (block.kind === 'fixed') {
      if (block.as === 'heading') {
        flushParagraph();
        nodes.push(
          <Typography key={`h-${index}`} variant="h6" component="h2" sx={{ fontWeight: 700, mt: index === 0 ? 0 : 4, mb: 2 }}>
            {block.text}
          </Typography>,
        );
        return;
      }
      if (block.as === 'subheading') {
        flushParagraph();
        nodes.push(
          <Typography key={`sh-${index}`} variant="subtitle1" component="h3" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>
            {block.text}
          </Typography>,
        );
        return;
      }
      if (block.newParagraph) flushParagraph();
      paragraph.push(<span key={`t-${index}`}>{block.text}</span>);
      return;
    }

    const { field } = block;
    if (field.type.input === 'richtext') {
      flushParagraph();
      nodes.push(
        <Box key={`f-${index}`} id={fieldDomId(field.key)} sx={{ mb: 2.5 }}>
          <RichTextField
            label={field.label}
            value={values[field.key] ?? ''}
            onChange={(html) => onFieldChange(field.key, html)}
            placeholder={field.help}
            error={missing.has(field.key)}
            helperText={missing.has(field.key) ? `${field.label} — champ obligatoire non renseigné` : field.help}
          />
        </Box>,
      );
      return;
    }

    paragraph.push(
      <InlineLegalField
        key={`f-${index}`}
        field={field}
        value={values[field.key] ?? ''}
        onChange={(value) => onFieldChange(field.key, value)}
        missing={missing.has(field.key)}
        id={fieldDomId(field.key)}
      />,
    );
  });

  flushParagraph();
  return nodes;
}

interface LegalPageEditorProps {
  templateId: LegalTemplateId;
  /** Ouvre directement sur le premier champ manquant — utilisé depuis l'avertissement de publication. */
  autoFocusMissing?: boolean;
}

export function LegalPageEditor({ templateId, autoFocusMissing = false }: LegalPageEditorProps) {
  const template = getLegalTemplate(templateId);
  const { pageStates, saveLegalPageValues } = useLegalPages();
  const savedValues = pageStates[templateId].values;

  const [values, setValues] = useState<Record<string, string>>(savedValues);
  const [successOpen, setSuccessOpen] = useState(false);
  const isDirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(savedValues), [values, savedValues]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);
  const completion = useMemo(() => computeLegalCompletion(template, values), [template, values]);

  function setFieldValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function goToFirstMissing() {
    const key = computeLegalCompletion(template, values).missingFieldKeys[0];
    const el = key ? document.getElementById(fieldDomId(key)) : null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.querySelector<HTMLElement>('input, textarea, select, [contenteditable="true"]')?.focus();
  }

  useEffect(() => {
    if (!autoFocusMissing) return;
    const id = window.setTimeout(goToFirstMissing, 200);
    return () => window.clearTimeout(id);
    // Ouverture initiale uniquement : ne doit pas se redéclencher à chaque saisie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCancel() {
    setValues(savedValues);
  }

  function handleSave() {
    saveLegalPageValues(templateId, values);
    setSuccessOpen(true);
  }

  const content = renderLegalBlocks(template.blocks, values, setFieldValue, completion.missingFieldKeys);

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          position: 'sticky',
          top: 62,
          zIndex: 10,
          bgcolor: 'background.default',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          justifyContent: 'space-between',
          mb: 2.5,
          pt: { xs: 2, md: 2.5 },
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            {template.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Page légale obligatoire. Le texte réglementaire n&apos;est pas modifiable ; seules les informations propres à
            votre collectivité le sont.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <Button
            component={Link}
            href="/dashboard/infos-projet"
            variant="text"
            color="inherit"
            startIcon={<ApartmentOutlinedIcon fontSize="small" />}
            sx={{ color: 'text.secondary' }}
          >
            Modifier les informations de la structure
          </Button>
          <Button type="button" variant="outlined" color="inherit" onClick={handleCancel} disabled={!isDirty}>
            Annuler
          </Button>
          <Button type="button" variant="contained" onClick={handleSave} disabled={!isDirty}>
            Enregistrer
          </Button>
        </Stack>
      </Stack>

      <Alert
        severity={completion.complete ? 'success' : 'warning'}
        variant="outlined"
        sx={{ mb: 3 }}
        action={
          !completion.complete && (
            <Button color="warning" size="small" onClick={goToFirstMissing}>
              Aller au premier champ manquant
            </Button>
          )
        }
      >
        {completion.complete
          ? 'Complète'
          : `À compléter — ${completion.missingCount} champ${completion.missingCount > 1 ? 's' : ''} manquant${completion.missingCount > 1 ? 's' : ''}`}
      </Alert>

      <Box component="article" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 2.5, md: 4 } }}>
        {content}
      </Box>

      <Snackbar open={successOpen} autoHideDuration={4000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          La page « {template.title} » a bien été enregistrée.
        </Alert>
      </Snackbar>

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="legal-leave-title" aria-describedby="legal-leave-description">
        <DialogTitle id="legal-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="legal-leave-description">
            Des modifications n&apos;ont pas été enregistrées. Si vous quittez maintenant, elles seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={cancelLeave} color="inherit" autoFocus>
            Rester sur la page
          </Button>
          <Button onClick={confirmLeave} color="error" variant="contained">
            Quitter sans enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
