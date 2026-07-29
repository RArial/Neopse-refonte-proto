'use client';

import { useState, type ChangeEvent, type FormEvent, type SyntheticEvent } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type AssistanceTab = 'documentation' | 'support';

interface AssistancePopoverProps {
  /** Élément déclencheur — la pop-up s'ancre à sa position. `null` = fermée. */
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export function AssistancePopover({ anchorEl, onClose }: AssistancePopoverProps) {
  const [tab, setTab] = useState<AssistanceTab>('documentation');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  function handleTabChange(_event: SyntheticEvent, value: AssistanceTab) {
    setTab(value);
  }

  function handleClose() {
    onClose();
  }

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files;
    if (!selected || selected.length === 0) return;
    setAttachments((prev) => [...prev, ...Array.from(selected)]);
    event.target.value = '';
  }

  function handleRemoveAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // TODO: brancher l'envoi réel de la demande de support
    handleClose();
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      aria-labelledby="assistance-popover-title"
      slotProps={{
        paper: {
          sx: { width: 400, maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100vh - 32px)', borderRadius: 2, overflow: 'hidden' },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 2.5,
          pr: 1,
          py: 1.25,
          bgcolor: 'var(--coral)',
          color: '#fff',
        }}
      >
        <Typography id="assistance-popover-title" variant="subtitle1" sx={{ fontWeight: 700 }}>
          Assistance
        </Typography>
        <IconButton aria-label="Fermer" onClick={handleClose} size="small" sx={{ color: 'inherit' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tab value="documentation" label="Documentation" sx={{ textTransform: 'none' }} />
        <Tab value="support" label="Support" sx={{ textTransform: 'none' }} />
      </Tabs>

      <Box sx={{ p: 2.5, overflowY: 'auto' }}>
        {tab === 'documentation' && (
          <Stack spacing={1.5} role="tabpanel" aria-labelledby="assistance-popover-title">
            <Typography variant="body2">
              Retrouvez ici les guides d&apos;utilisation de Neopse : prise en main du tableau de bord, gestion du
              contenu, personnalisation du site et paramètres du compte.
            </Typography>
            <Typography variant="body2">
              Si vous ne trouvez pas la réponse à votre question, utilisez l&apos;onglet « Support » pour contacter
              notre équipe.
            </Typography>
          </Stack>
        )}

        {tab === 'support' && (
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              label="Nom"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <TextField
              fullWidth
              type="email"
              label="Adresse e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Comment pouvons-nous vous aider ?"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />

            <Stack spacing={1}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<AttachFileIcon />}
                sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
              >
                Ajouter des pièces jointes
                <input type="file" multiple hidden onChange={handleFilesSelected} />
              </Button>

              {attachments.length > 0 && (
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {attachments.map((file, index) => (
                    <Box
                      key={`${file.name}-${index}`}
                      component="li"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 1,
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Typography variant="body2" noWrap sx={{ maxWidth: 280 }}>
                        {file.name}
                      </Typography>
                      <IconButton
                        aria-label={`Retirer la pièce jointe ${file.name}`}
                        size="small"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
              <Button color="inherit" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" variant="contained">
                Envoyer
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Popover>
  );
}
