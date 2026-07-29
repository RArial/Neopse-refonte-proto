'use client';

import { useMemo, useState } from 'react';
import NextLink from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { SettingsSection } from '@/components/parametres/SettingsSection';
import { useFooterContent } from '@/components/contenu/footer/FooterContentProvider';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { SEED_VARIANTS } from '@/lib/personnalisation/seed';
import { SOCIAL_NETWORKS, SOCIAL_NETWORK_LABELS, type SocialNetwork } from '@/types/footer';

const LIENS_EXCLUDED_PREFIXES = ['/dashboard/contenu/pied-de-page/liens'];

const PUBLISHED_VARIANT_ID = (SEED_VARIANTS.find((variant) => variant.status === 'published') ?? SEED_VARIANTS[0]).id;

export function FooterContentForm() {
  const {
    content,
    isDirty,
    save,
    cancel,
    setTitle,
    setText,
    removeLink,
    addLinkCategory,
    updateLinkCategory,
    removeLinkCategory,
    updateSocialLink,
    addSocialLink,
    removeSocialLink,
  } = useFooterContent();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty, { excludePrefixes: LIENS_EXCLUDED_PREFIXES });

  const categoryById = useMemo(() => new Map(content.linkCategories.map((category) => [category.id, category])), [content.linkCategories]);

  function handleCancel() {
    cancel();
  }

  function handleSave() {
    save();
    setSuccessMessage('Le pied de page a bien été enregistré.');
  }

  function handleRemoveLinkCategory(id: string, name: string) {
    const removed = removeLinkCategory(id);
    setCategoryError(removed ? null : `Impossible de supprimer « ${name || 'cette catégorie'} » : elle est utilisée par au moins un lien.`);
    if (removed && editingCategoryId === id) setEditingCategoryId(null);
  }

  function handleAddLinkCategory() {
    const id = addLinkCategory();
    setEditingCategoryId(id);
  }

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
            Pied de page
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Titre, texte, liens et réseaux sociaux affichés en pied de page sur tout le site.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
          <Button type="button" variant="outlined" color="inherit" onClick={handleCancel} disabled={!isDirty}>
            Annuler
          </Button>
          <Button type="button" variant="contained" onClick={handleSave} disabled={!isDirty}>
            Enregistrer
          </Button>
        </Stack>
      </Stack>

      <Alert severity="info" variant="outlined" sx={{ mb: 2.5 }}>
        Les couleurs du pied de page se règlent dans l&apos;écran{' '}
        <Link component={NextLink} href={`/dashboard/personnalisation/${PUBLISHED_VARIANT_ID}?section=footer`} sx={{ fontWeight: 600 }}>
          Personnalisation
        </Link>{' '}
        — cet écran ne gère que son contenu.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <SettingsSection
          icon="FileText"
          title="Informations générales"
          description="Titre et texte affichés au-dessus des liens du pied de page"
        >
          <Stack spacing={2.5}>
            <TextField label="Titre" value={content.title} onChange={(event) => setTitle(event.target.value)} fullWidth />
            <TextField
              label="Texte"
              value={content.text}
              onChange={(event) => setText(event.target.value)}
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
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Catégories
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Organisez les liens par catégorie. Chaque lien doit appartenir à une catégorie.
              </Typography>
              {categoryError && (
                <Alert severity="error" role="alert" sx={{ mb: 1.5 }} onClose={() => setCategoryError(null)}>
                  {categoryError}
                </Alert>
              )}
              <Stack spacing={1.5}>
                {content.linkCategories.map((category) => {
                  const isEditing = editingCategoryId === category.id;
                  const isUsed = content.links.some((link) => link.categoryId === category.id);
                  return (
                    <Stack key={category.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      {isEditing ? (
                        <TextField
                          label="Nom de la catégorie"
                          value={category.name}
                          onChange={(event) => updateLinkCategory(category.id, { name: event.target.value })}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              setEditingCategoryId(null);
                            }
                          }}
                          size="small"
                          fullWidth
                          autoFocus
                        />
                      ) : (
                        <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, minWidth: 0 }}>
                          {category.name || 'Catégorie sans nom'}
                        </Typography>
                      )}
                      {isEditing ? (
                        <Tooltip title="Valider le nom">
                          <IconButton
                            onClick={() => setEditingCategoryId(null)}
                            aria-label={`Valider le nom de la catégorie ${category.name || 'sans titre'}`}
                            sx={{ flexShrink: 0 }}
                          >
                            <CheckOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Renommer">
                          <IconButton
                            onClick={() => setEditingCategoryId(category.id)}
                            aria-label={`Renommer la catégorie ${category.name || 'sans titre'}`}
                            sx={{ flexShrink: 0 }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={isUsed ? 'Catégorie utilisée par au moins un lien' : ''}>
                        <span>
                          <IconButton
                            onClick={() => handleRemoveLinkCategory(category.id, category.name)}
                            disabled={isUsed}
                            aria-label={`Supprimer la catégorie ${category.name || 'sans titre'}`}
                            sx={{ flexShrink: 0 }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  );
                })}
                <Button
                  type="button"
                  variant="outlined"
                  color="inherit"
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={handleAddLinkCategory}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Ajouter une catégorie
                </Button>
              </Stack>
            </Box>

            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Liens
                </Typography>
                <Button
                  component={NextLink}
                  href="/dashboard/contenu/pied-de-page/liens/nouveau"
                  variant="outlined"
                  startIcon={<AddIcon fontSize="small" />}
                  disabled={content.linkCategories.length === 0}
                >
                  Ajouter un lien
                </Button>
              </Stack>

              {content.linkCategories.length === 0 ? (
                <Alert severity="info" variant="outlined">
                  Créez d&apos;abord une catégorie ci-dessus pour pouvoir ajouter des liens.
                </Alert>
              ) : content.links.length === 0 ? (
                <Alert severity="info" variant="outlined">
                  Aucun lien pour le moment.
                </Alert>
              ) : (
                <Stack spacing={1.25}>
                  {content.links.map((link) => (
                    <Stack
                      key={link.id}
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      sx={{
                        alignItems: { sm: 'center' },
                        justifyContent: 'space-between',
                        p: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {link.label || 'Sans titre'}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
                          <Typography
                            component="a"
                            href={link.url || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.4,
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            Consulter
                            <OpenInNewIcon sx={{ fontSize: 14 }} />
                          </Typography>
                          <Chip size="small" label={categoryById.get(link.categoryId)?.name || 'Catégorie inconnue'} sx={{ bgcolor: 'action.hover' }} />
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                        <Tooltip title={`Modifier « ${link.label || 'sans titre'} »`}>
                          <IconButton
                            component={NextLink}
                            href={`/dashboard/contenu/pied-de-page/liens/edit/${link.id}`}
                            size="small"
                            aria-label={`Modifier « ${link.label || 'sans titre'} »`}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Supprimer « ${link.label || 'sans titre'} »`}>
                          <IconButton size="small" onClick={() => removeLink(link.id)} aria-label={`Supprimer « ${link.label || 'sans titre'} »`}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>
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
