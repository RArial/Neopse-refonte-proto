'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useFooterContent } from '@/components/contenu/footer/FooterContentProvider';
import { createFooterId } from '@/types/footer';

interface FooterLinkFormProps {
  mode: 'create' | 'edit';
  linkId?: string;
}

const PIED_DE_PAGE_HREF = '/dashboard/contenu/pied-de-page';

export function FooterLinkForm({ mode, linkId }: FooterLinkFormProps) {
  const router = useRouter();
  const { content, saveLink } = useFooterContent();
  const existingLink = mode === 'edit' ? content.links.find((link) => link.id === linkId) : undefined;

  const [label, setLabel] = useState(existingLink?.label ?? '');
  const [url, setUrl] = useState(existingLink?.url ?? '');
  const [categoryId, setCategoryId] = useState(existingLink?.categoryId ?? content.linkCategories[0]?.id ?? '');
  const [labelError, setLabelError] = useState(false);
  const [urlError, setUrlError] = useState(false);

  const pageTitle = mode === 'create' ? 'Ajouter un lien' : 'Modifier le lien';

  function renderShell(body: React.ReactNode) {
    return (
      <Box sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 720, width: '100%', mx: 'auto' }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 16 }} />} aria-label="Fil d'Ariane" sx={{ mb: 1.5, fontSize: 13 }}>
          <Link href="/dashboard/contenu" style={{ textDecoration: 'none' }}>
            <Typography component="span" variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              Gestionnaire des pages
            </Typography>
          </Link>
          <Link href={PIED_DE_PAGE_HREF} style={{ textDecoration: 'none' }}>
            <Typography component="span" variant="body2" color="text.secondary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              Pied de page
            </Typography>
          </Link>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {pageTitle}
          </Typography>
        </Breadcrumbs>

        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em', mb: 2.5 }}>
          {pageTitle}
        </Typography>

        {body}
      </Box>
    );
  }

  if (mode === 'edit' && !existingLink) {
    return renderShell(
      <>
        <Alert severity="warning">Ce lien est introuvable — il a peut-être déjà été supprimé.</Alert>
        <Button component={Link} href={PIED_DE_PAGE_HREF} startIcon={<ArrowBackIcon fontSize="small" />} color="inherit" sx={{ mt: 2 }}>
          Retour au pied de page
        </Button>
      </>,
    );
  }

  if (content.linkCategories.length === 0) {
    return renderShell(
      <>
        <Alert severity="info">Créez d&apos;abord une catégorie de liens depuis l&apos;écran « Pied de page » pour pouvoir ajouter un lien.</Alert>
        <Button component={Link} href={PIED_DE_PAGE_HREF} startIcon={<ArrowBackIcon fontSize="small" />} color="inherit" sx={{ mt: 2 }}>
          Retour au pied de page
        </Button>
      </>,
    );
  }

  function handleSubmit() {
    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();
    const hasLabelError = trimmedLabel.length === 0;
    const hasUrlError = trimmedUrl.length === 0;
    setLabelError(hasLabelError);
    setUrlError(hasUrlError);
    if (hasLabelError || hasUrlError) return;

    saveLink({ id: existingLink?.id ?? createFooterId('footer-link'), label: trimmedLabel, url: trimmedUrl, categoryId });
    router.push(PIED_DE_PAGE_HREF);
  }

  return renderShell(
    <>
      <Stack spacing={2.5} sx={{ maxWidth: 480 }}>
        <TextField
          label="Libellé"
          value={label}
          onChange={(event) => {
            setLabel(event.target.value);
            setLabelError(false);
          }}
          error={labelError}
          helperText={labelError ? 'Le libellé est obligatoire.' : undefined}
          slotProps={{ formHelperText: { role: labelError ? 'alert' : undefined } }}
          required
          fullWidth
          autoFocus
        />
        <TextField
          label="URL"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setUrlError(false);
          }}
          error={urlError}
          helperText={urlError ? "L'URL est obligatoire." : undefined}
          slotProps={{ formHelperText: { role: urlError ? 'alert' : undefined } }}
          required
          fullWidth
          placeholder="/mentions-legales ou https://…"
        />
        <TextField select label="Catégorie" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required fullWidth>
          {content.linkCategories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name || 'Catégorie sans nom'}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 3.5 }}>
        <Button component={Link} href={PIED_DE_PAGE_HREF} variant="outlined" color="inherit" startIcon={<ArrowBackIcon fontSize="small" />}>
          Annuler
        </Button>
        <Button variant="contained" startIcon={<CheckOutlinedIcon fontSize="small" />} onClick={handleSubmit}>
          Enregistrer
        </Button>
      </Stack>
    </>,
  );
}
