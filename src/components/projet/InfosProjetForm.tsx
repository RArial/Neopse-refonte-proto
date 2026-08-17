'use client';

import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SettingsSection } from '@/components/parametres/SettingsSection';
import { Icons } from '@/components/ui/Icons';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';

interface ProjectInfo {
  structureType: string;
  category: string;
  identificationNumber: string;
  projectName: string;
  description: string;
  city: string;
  address: string;
  acceptsTerms: boolean;
  thumbnailUrl: string | null;
}

const STRUCTURE_TYPES = ['Association', 'Collectivité', 'Entreprise', 'Établissement public', 'Autre'];

const CATEGORIES = [
  'Ateliers créatifs adultes',
  'Ateliers créatifs enfants',
  'Sport et loisirs',
  'Culture et patrimoine',
  'Solidarité et entraide',
  'Autre',
];

const DEFAULT_PROJECT_INFO: ProjectInfo = {
  structureType: 'Collectivité',
  category: 'Ateliers créatifs adultes',
  identificationNumber: '1996',
  projectName: 'Mairie de Vercourt',
  description: '',
  city: 'Vercourt',
  address: '1 place de la Mairie',
  acceptsTerms: true,
  thumbnailUrl: null,
};

export function InfosProjetForm() {
  const [saved, setSaved] = useState<ProjectInfo>(DEFAULT_PROJECT_INFO);
  const [info, setInfo] = useState<ProjectInfo>(DEFAULT_PROJECT_INFO);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty = useMemo(() => JSON.stringify(info) !== JSON.stringify(saved), [info, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleCancel() {
    setInfo(saved);
  }

  function handleSave() {
    setSaved(info);
    setSuccessMessage('Les informations du projet ont bien été enregistrées.');
  }

  function handleThumbnailChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setInfo((prev) => ({ ...prev, thumbnailUrl: url }));
  }

  return (
    <Box
      component="section"
      sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          position: 'sticky',
          top: 62, // hauteur fixe de la Topbar (elle-même sticky) — évite que ce header ne se cache dessous
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
            Infos du projet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Renseignez les informations générales et la vignette de votre projet Neopse.
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <SettingsSection
          icon="Briefcase"
          title="Informations générales concernant le Projet"
          description="Structure, identité, coordonnées et vignette de votre projet"
          collapsible={false}
        >
          <Stack spacing={2.5}>
            <TextField
              select
              label="Je choisis mon type de structure"
              value={info.structureType}
              onChange={(event) => setInfo((prev) => ({ ...prev, structureType: event.target.value }))}
              fullWidth
            >
              {STRUCTURE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Catégorie"
              value={info.category}
              onChange={(event) => setInfo((prev) => ({ ...prev, category: event.target.value }))}
              fullWidth
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="N° Identification"
              value={info.identificationNumber}
              disabled
              fullWidth
              helperText="Identifiant attribué par NEOPSE, non modifiable."
            />

            <TextField
              label="Nom du projet"
              value={info.projectName}
              onChange={(event) => setInfo((prev) => ({ ...prev, projectName: event.target.value }))}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={info.description}
              onChange={(event) => setInfo((prev) => ({ ...prev, description: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
              slotProps={{
                input: {
                  endAdornment: (
                    <Tooltip title="Cette description est affichée sur la fiche publique de votre projet.">
                      <InfoOutlinedIcon fontSize="small" color="action" sx={{ alignSelf: 'flex-start', mt: 1 }} />
                    </Tooltip>
                  ),
                },
              }}
            />

            <TextField
              label="Ville"
              value={info.city}
              onChange={(event) => setInfo((prev) => ({ ...prev, city: event.target.value }))}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <Tooltip title="Ville utilisée pour situer votre projet sur la carte des structures Neopse.">
                      <InfoOutlinedIcon fontSize="small" color="action" />
                    </Tooltip>
                  ),
                },
              }}
            />

            <TextField
              label="Adresse"
              value={info.address}
              onChange={(event) => setInfo((prev) => ({ ...prev, address: event.target.value }))}
              fullWidth
            />

            <Stack spacing={0.75}>
              <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 700 }}>
                Vignette du projet
              </Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                    bgcolor: 'action.hover',
                    position: 'relative',
                  }}
                >
                  {info.thumbnailUrl ? (
                    <Image src={info.thumbnailUrl} alt="Vignette du projet" fill unoptimized style={{ objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ color: 'text.disabled' }} aria-hidden="true">
                      <Icons.Image size={28} />
                    </Box>
                  )}
                </Box>
                <Stack spacing={0.75}>
                  <Button component="label" variant="contained" size="small" startIcon={<Icons.Folder size={16} />} sx={{ alignSelf: 'flex-start' }}>
                    Ajouter une vignette
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      hidden
                      onChange={handleThumbnailChange}
                      aria-label="Choisir une vignette pour le projet"
                    />
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Format JPG, PNG ou WebP, ratio carré recommandé.
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <FormControlLabel
              control={<Checkbox checked disabled />}
              label={
                <Typography variant="body2" color="text.secondary">
                  J&apos;accepte les{' '}
                  <Link href="#" onClick={(event) => event.preventDefault()}>
                    Conditions Générales d&apos;Utilisation
                  </Link>{' '}
                  de NEOPSE.
                </Typography>
              }
            />
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

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="infos-projet-leave-title" aria-describedby="infos-projet-leave-description">
        <DialogTitle id="infos-projet-leave-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="infos-projet-leave-description">
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
