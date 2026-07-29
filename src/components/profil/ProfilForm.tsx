'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { ChangeEmailDialog } from '@/components/profil/ChangeEmailDialog';
import { ChangePasswordDialog } from '@/components/profil/ChangePasswordDialog';
import { ProfileSection } from '@/components/profil/ProfileSection';
import { DEFAULT_PROFILE, PHONE_COUNTRIES, type ProfileSettings } from '@/types/profil';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export function ProfilForm() {
  const [saved, setSaved] = useState<ProfileSettings>(DEFAULT_PROFILE);
  const [profile, setProfile] = useState<ProfileSettings>(DEFAULT_PROFILE);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [acceptTermsError, setAcceptTermsError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty = useMemo(() => JSON.stringify(profile) !== JSON.stringify(saved), [profile, saved]);
  const { isDialogOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty);

  function handleChange(patch: Partial<ProfileSettings>) {
    setProfile((prev) => ({ ...prev, ...patch }));
  }

  function handleCancel() {
    setProfile(saved);
    setAcceptTermsError(null);
  }

  function handleSave() {
    if (!profile.acceptTerms) {
      setAcceptTermsError('Vous devez accepter les Conditions Générales d’Utilisation pour continuer.');
      return;
    }
    setAcceptTermsError(null);
    setSaved(profile);
    setSuccessMessage('Vos informations personnelles ont bien été enregistrées.');
  }

  function handleAvatarButtonClick() {
    fileInputRef.current?.click();
  }

  function handleAvatarFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > MAX_AVATAR_SIZE_BYTES) {
      setSuccessMessage(null);
      return;
    }
    const url = URL.createObjectURL(file);
    handleChange({ avatarUrl: url });
  }

  function handleEmailConfirm(newEmail: string) {
    setPendingEmail(newEmail);
    setSuccessMessage(`Un email de confirmation a été envoyé à ${newEmail}.`);
  }

  return (
    <Box component="section" sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 2.5 }, maxWidth: 880, width: '100%', mx: 'auto' }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
          Mon profil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Gérez vos informations personnelles et vos préférences de compte.
        </Typography>
      </Box>

      <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 3 }}>
        Mes informations personnelles restent confidentielles. NEOPSE s&apos;engage à ne pas les utiliser à des fins
        commerciales.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <ProfileSection icon="User" title="Informations générales concernant le Membre">
          <Stack spacing={2.5}>
            <FormControl>
              <FormLabel id="profil-civilite-label" sx={{ mb: 0.5, fontSize: 14 }}>
                Je suis
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="profil-civilite-label"
                value={profile.civilite}
                onChange={(event) => handleChange({ civilite: event.target.value as ProfileSettings['civilite'] })}
              >
                <FormControlLabel value="M" control={<Radio />} label="M." />
                <FormControlLabel value="Mme" control={<Radio />} label="Mme." />
              </RadioGroup>
            </FormControl>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <TextField
                id="profil-field-firstName"
                label="Prénom"
                value={profile.firstName}
                onChange={(event) => handleChange({ firstName: event.target.value })}
                required
                fullWidth
              />
              <TextField
                id="profil-field-lastName"
                label="Nom"
                value={profile.lastName}
                onChange={(event) => handleChange({ lastName: event.target.value })}
                required
                fullWidth
              />
            </Stack>

            <TextField
              id="profil-field-username"
              label="Nom d'utilisateur"
              value={profile.username}
              disabled
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Le nom d'utilisateur ne peut pas être modifié.">
                        <InfoOutlinedIcon fontSize="small" color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'flex-start' } }}>
              <TextField
                id="profil-field-email"
                label="Adresse email"
                type="email"
                value={pendingEmail ?? profile.email}
                disabled
                fullWidth
                helperText={pendingEmail ? 'Confirmation en attente sur la nouvelle adresse.' : undefined}
              />
              <Button
                variant="outlined"
                onClick={() => setEmailDialogOpen(true)}
                sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                Modifier mon adresse email
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'flex-start' } }}>
              <TextField
                id="profil-field-password"
                label="Mot de passe"
                type="password"
                value="********"
                disabled
                fullWidth
                slotProps={{ htmlInput: { 'aria-label': 'Mot de passe (masqué)' } }}
              />
              <Button
                variant="outlined"
                onClick={() => setPasswordDialogOpen(true)}
                sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
              >
                Modifier mon mot de passe
              </Button>
            </Stack>

            <TextField
              id="profil-field-city"
              label="Ville / Code postal"
              value={profile.city}
              onChange={(event) => handleChange({ city: event.target.value })}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Utilisée pour vous proposer des projets NEOPSE près de chez vous.">
                        <InfoOutlinedIcon fontSize="small" color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box>
              <Typography component="label" htmlFor="profil-field-phone-number" variant="body2" sx={{ display: 'block', mb: 0.75, fontWeight: 500 }}>
                Téléphone
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <TextField
                  select
                  value={profile.phoneCountry}
                  onChange={(event) => handleChange({ phoneCountry: event.target.value })}
                  sx={{ minWidth: 200 }}
                  slotProps={{ select: { 'aria-label': 'Indicatif téléphonique du pays' } }}
                >
                  {PHONE_COUNTRIES.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.label.toUpperCase()} ({country.dial})
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="profil-field-phone-number"
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(event) => handleChange({ phoneNumber: event.target.value })}
                  fullWidth
                  aria-label="Numéro de téléphone"
                />
              </Stack>
            </Box>

            <TextField
              id="profil-field-bio"
              label="Biographie"
              value={profile.bio}
              onChange={(event) => handleChange({ bio: event.target.value })}
              multiline
              minRows={4}
              fullWidth
            />

            <Stack spacing={0.5}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.shareContactInfo}
                    onChange={(event) => handleChange({ shareContactInfo: event.target.checked })}
                  />
                }
                label="J'accepte que certaines informations personnelles enregistrées dans mon profil NEOPSE (adresse email, numéro de téléphone et biographie) soient affichées dans les espaces NEOPSE le proposant."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.acceptTerms}
                    onChange={(event) => {
                      handleChange({ acceptTerms: event.target.checked });
                      setAcceptTermsError(null);
                    }}
                    required
                  />
                }
                label={
                  <>
                    J&apos;accepte les{' '}
                    <Link href="/cgu" style={{ color: 'inherit', fontWeight: 600 }}>
                      Conditions Générales d&apos;Utilisation
                    </Link>{' '}
                    de NEOPSE.
                  </>
                }
              />
              {acceptTermsError && (
                <Typography role="alert" variant="caption" color="error" sx={{ pl: 1.75 }}>
                  {acceptTermsError}
                </Typography>
              )}
            </Stack>
          </Stack>
        </ProfileSection>

        <ProfileSection icon="Photo" title="Photo de profil du Membre">
          <Stack spacing={2} sx={{ alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
            <Box sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}>
              <Button
                variant="outlined"
                startIcon={<PhotoCameraOutlinedIcon fontSize="small" />}
                onClick={handleAvatarButtonClick}
              >
                Modifier ma photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarFileChange}
                aria-label="Choisir une photo de profil"
              />
            </Box>
            <Avatar
              src={profile.avatarUrl ?? undefined}
              sx={{ width: 140, height: 140, bgcolor: 'action.hover', color: 'text.disabled', alignSelf: 'center' }}
            >
              {!profile.avatarUrl && <PersonIcon sx={{ fontSize: 72 }} />}
            </Avatar>
          </Stack>
        </ProfileSection>
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', mt: 3 }}>
        <Button type="button" variant="outlined" color="inherit" onClick={handleCancel} disabled={!isDirty}>
          Annuler
        </Button>
        <Button type="button" variant="contained" onClick={handleSave}>
          Enregistrer mes paramètres
        </Button>
      </Stack>

      <ChangeEmailDialog
        open={emailDialogOpen}
        currentEmail={profile.email}
        onClose={() => setEmailDialogOpen(false)}
        onConfirm={handleEmailConfirm}
      />
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        onConfirm={() => setSuccessMessage('Votre mot de passe a bien été modifié.')}
      />

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

      <Dialog open={isDialogOpen} onClose={cancelLeave} aria-labelledby="profil-unsaved-title" aria-describedby="profil-unsaved-description">
        <DialogTitle id="profil-unsaved-title">Quitter cette page ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="profil-unsaved-description">
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
