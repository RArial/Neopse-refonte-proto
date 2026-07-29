'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import { usePersonnalisation } from '@/components/personnalisation/PersonnalisationProvider';
import { roleId } from '@/lib/personnalisation/previewRoles';
import { PAGE_GABARITS, type PageGabaritId } from '@/types/personnalisation';
import { PREVIEW_READY_MESSAGE, PREVIEW_REVEAL_MESSAGE, PREVIEW_TOKENS_MESSAGE } from '@/components/personnalisation/preview-site/previewMessages';

const SITE_ID = 'demo-site';
const DEBOUNCE_MS = 60;
const REVEAL_SETTLE_MS = 120;

type Viewport = '375' | '768' | 'full';

const VIEWPORT_WIDTH: Record<Viewport, string> = { '375': '375px', '768': '768px', full: '100%' };

export function PreviewPane() {
  const { draftTokens, activePalette, activeVariant, previewPageId, setPreviewPageId, revealCommand } = usePersonnalisation();
  const [viewport, setViewport] = useState<Viewport>('full');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<number | null>(null);
  // Figé au premier rendu : l'identifiant de variante dans l'URL est informatif (forme d'URL de la
  // spec), mais ne doit jamais faire partie des dépendances qui recalculent `src` — changer de
  // variante ne doit jamais recharger l'iframe, seuls les tokens poussés par postMessage changent.
  const [initialVariantId] = useState(activeVariant.id);

  // Toujours à jour, lus depuis le handler `message` (enregistré une seule fois au montage) pour
  // éviter qu'il ne pousse des tokens figés au premier rendu lors d'un rechargement d'iframe
  // (changement de gabarit) survenant après des modifications.
  const latestPushRef = useRef({ tokens: draftTokens, palette: activePalette });
  useEffect(() => {
    latestPushRef.current = { tokens: draftTokens, palette: activePalette };
  }, [draftTokens, activePalette]);

  // `null` tant qu'aucun "ready" n'a été reçu pour le gabarit actuellement demandé : toute révélation
  // qui arrive avant doit attendre ce premier ready plutôt que de supposer l'iframe déjà chargée.
  const loadedPageIdRef = useRef<PageGabaritId | null>(null);
  const pendingRevealRef = useRef<typeof revealCommand>(null);

  function postTokens() {
    iframeRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_TOKENS_MESSAGE, tokens: latestPushRef.current.tokens, palette: latestPushRef.current.palette },
      window.location.origin,
    );
  }

  function postReveal(command: NonNullable<typeof revealCommand>) {
    iframeRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_REVEAL_MESSAGE, role: roleId(command.owner, command.propertyKey) },
      window.location.origin,
    );
  }

  // Pousse les tokens à chaque changement, avec un debounce de 60ms — sans jamais recharger l'iframe.
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(postTokens, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [draftTokens, activePalette]);

  // Répond au ping "ready" de l'iframe (premier montage, ou rechargement suite à un changement de
  // gabarit) : pousse les tokens à jour, marque le gabarit comme chargé, puis rejoue une révélation
  // qui attendait ce rechargement.
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== PREVIEW_READY_MESSAGE) return;
      postTokens();
      loadedPageIdRef.current = previewPageId;
      if (pendingRevealRef.current) {
        const command = pendingRevealRef.current;
        pendingRevealRef.current = null;
        window.setTimeout(() => postReveal(command), REVEAL_SETTLE_MS);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewPageId]);

  // Une demande de révélation arrive : si le gabarit visé est déjà chargé, on révèle tout de suite ;
  // sinon on la met en attente jusqu'au prochain "ready" (déclenché par le changement de `src` ci-dessous).
  useEffect(() => {
    if (!revealCommand) return;
    if (loadedPageIdRef.current === revealCommand.targetPageId) {
      postReveal(revealCommand);
    } else {
      pendingRevealRef.current = revealCommand;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealCommand]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'grey.100' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}
      >
        <TextField
          select
          size="small"
          value={previewPageId}
          onChange={(e) => setPreviewPageId(e.target.value as PageGabaritId)}
          sx={{ minWidth: 220 }}
          aria-label="Page à prévisualiser"
        >
          {PAGE_GABARITS.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.label}
            </MenuItem>
          ))}
        </TextField>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={viewport}
          onChange={(_, value: Viewport | null) => value && setViewport(value)}
          aria-label="Largeur d'aperçu"
        >
          <ToggleButton value="375" aria-label="375 pixels, mobile">
            <Tooltip title="375 px — mobile">
              <PhoneIphoneIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="768" aria-label="768 pixels, tablette">
            <Tooltip title="768 px — tablette">
              <TabletMacIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="full" aria-label="Pleine largeur">
            <Tooltip title="Pleine largeur (100%)">
              <DesktopWindowsIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', p: viewport === 'full' ? 0 : 2, pb: '72px' }}>
        <Box
          component="iframe"
          ref={iframeRef}
          src={`/preview/${SITE_ID}/${previewPageId}?variant=${initialVariantId}`}
          title="Aperçu du site"
          sandbox="allow-scripts allow-same-origin"
          sx={{
            width: VIEWPORT_WIDTH[viewport],
            maxWidth: '100%',
            height: '100%',
            border: viewport === 'full' ? 0 : '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        />
      </Box>
    </Box>
  );
}
