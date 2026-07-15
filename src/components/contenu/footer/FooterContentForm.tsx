'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { SettingsSection } from '@/components/parametres/SettingsSection';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import {
  createFooterId,
  DEFAULT_FOOTER_CONTENT,
  SOCIAL_NETWORKS,
  SOCIAL_NETWORK_LABELS,
  type FooterContent,
  type FooterLink,
  type SocialLink,
  type SocialNetwork,
} from '@/types/footer';

function nextUnusedNetwork(existing: SocialLink[]): SocialNetwork {
  const used = new Set(existing.map((s) => s.network));
  return SOCIAL_NETWORKS.find((network) => !used.has(network)) ?? SOCIAL_NETWORKS[0];
}

export function FooterContentForm() {
  const [saved, setSaved] = useState<FooterContent>(DEFAULT_FOOTER_CONTENT);
  const [content, setContent] = useState<FooterContent>(DEFAULT_FOOTER_CONTENT);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isDirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleCancel() {
    setContent(saved);
  }

  function handleSave() {
    setSaved(content);
    setSuccessMessage('Le pied de page a bien été enregistré.');
  }

  function updateLink(id: string, patch: Partial<FooterLink>) {
    setContent((prev) => ({ ...prev, links: prev.links.map((link) => (link.id === id ? { ...link, ...patch } : link)) }));
  }

  function addLink() {
    setContent((prev) => ({ ...prev, links: [...prev.links, { id: createFooterId('footer-link'), label: '', url: '' }] }));
  }

  function removeLink(id: string) {
    setContent((prev) => ({ ...prev, links: prev.links.filter((link) => link.id !== id) }));
  }

  function updateSocialLink(id: string, patch: Partial<SocialLink>) {
    setContent((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((social) => (social.id === id ? { ...social, ...patch } : social)),
    }));
  }

  function addSocialLink() {
    setContent((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: createFooterId('footer-social'), network: nextUnusedNetwork(prev.socialLinks), url: '' },
      ],
    }));
  }

  function removeSocialLink(id: string) {
    setContent((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((social) => social.id !== id) }));
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          justifyContent: 'space-between',
          mb: 2.5,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            Pied de page
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Titre, texte, liens et réseaux sociaux affichés en pied de page sur tout le site.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <Button
            component={Link}
            href="/dashboard/personnalisation"
            variant="text"
            color="inherit"
            startIcon={<PaletteOutlinedIcon fontSize="small" />}
            sx={{ color: 'text.secondary' }}
          >
            Modifier l&apos;apparence
          </Button>
          <Button type="button" variant="outlined" color="inherit" onClick={handleCancel} disabled={!isDirty}>
            Annuler
          </Button>
          <Button type="button" variant="contained" onClick={handleSave} disabled={!isDirty}>
            Enregistrer
          </Button>
        </Stack>
      </Stack>

      <Alert severity="info" variant="outlined" sx={{ mb: 2.5 }}>
        Les couleurs du pied de page se règlent dans l&apos;écran Apparence — cet écran ne gère que son contenu.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <SettingsSection
          icon="FileText"
          title="Informations générales"
          description="Titre et texte affichés au-dessus des liens du pied de page"
        >
          <Stack spacing={2.5}>
            <TextField
              label="Titre"
              value={content.title}
              onChange={(event) => setContent((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Texte"
              value={content.text}
              onChange={(event) => setContent((prev) => ({ ...prev, text: event.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </SettingsSection>

        <SettingsSection
          icon="Link"
          title="Liens"
          description="Liens secondaires affichés dans le pied de page (mentions légales, accessibilité…)"
        >
          <Stack spacing={2}>
            {content.links.map((link) => (
              <Stack key={link.id} direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
                <TextField
                  label="Libellé"
                  value={link.label}
                  onChange={(event) => updateLink(link.id, { label: event.target.value })}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="URL"
                  value={link.url}
                  onChange={(event) => updateLink(link.id, { url: event.target.value })}
                  size="small"
                  fullWidth
                />
                <IconButton
                  onClick={() => removeLink(link.id)}
                  aria-label={`Supprimer le lien ${link.label || 'sans titre'}`}
                  sx={{ flexShrink: 0 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            <Button type="button" variant="outlined" startIcon={<AddIcon fontSize="small" />} onClick={addLink} sx={{ alignSelf: 'flex-start' }}>
              Ajouter un lien
            </Button>
          </Stack>
        </SettingsSection>

        <SettingsSection icon="Share" title="Réseaux sociaux" description="Réseaux sociaux de la collectivité, affichés en pied de page">
          <Stack spacing={2}>
            {content.socialLinks.map((social) => (
              <Stack key={social.id} direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
                <TextField
                  select
                  label="Réseau"
                  value={social.network}
                  onChange={(event) => updateSocialLink(social.id, { network: event.target.value as SocialNetwork })}
                  size="small"
                  sx={{ minWidth: 160 }}
                >
                  {SOCIAL_NETWORKS.map((network) => (
                    <MenuItem key={network} value={network}>
                      {SOCIAL_NETWORK_LABELS[network]}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="URL du profil"
                  value={social.url}
                  onChange={(event) => updateSocialLink(social.id, { url: event.target.value })}
                  size="small"
                  fullWidth
                  placeholder="https://…"
                />
                <IconButton
                  onClick={() => removeSocialLink(social.id)}
                  aria-label={`Supprimer le réseau ${SOCIAL_NETWORK_LABELS[social.network]}`}
                  sx={{ flexShrink: 0 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon fontSize="small" />}
              onClick={addSocialLink}
              sx={{ alignSelf: 'flex-start' }}
            >
              Ajouter un réseau
            </Button>
          </Stack>
        </SettingsSection>
      </Box>

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" role="status" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="footer-leave-title" aria-describedby="footer-leave-description">
        <DialogTitle id="footer-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="footer-leave-description">
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
