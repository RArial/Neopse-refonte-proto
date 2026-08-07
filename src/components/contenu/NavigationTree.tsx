'use client';

import { useState, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import HorizontalRuleOutlinedIcon from '@mui/icons-material/HorizontalRuleOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import type { AddedModule, ContentItemKind, ModuleDropContainer, NavChildNode, NavNodeKind, NavTreeNode } from '@/types/content';
import type { LegalTemplateId } from '@/types/legal';
import { useContenuStore } from '@/components/contenu/ContenuProvider';
import { useLegalPages } from '@/components/contenu/legal/LegalPagesProvider';
import { LEGAL_PAGE_ROUTES } from '@/lib/legal/legalTemplates';
import { canNestModuleInto, containerOf } from '@/lib/moduleTree';
import { ROOT_THEMATIQUE_ID } from '@/lib/navTree';

const LEGAL_PAGE_ICON: Record<LegalTemplateId, typeof GavelOutlinedIcon> = {
  legal: GavelOutlinedIcon,
  accessibility: AccessibleOutlinedIcon,
};

const KIND_ICON: Record<NavNodeKind, typeof AccountTreeOutlinedIcon> = {
  tab: AccountTreeOutlinedIcon,
};

/** Modules du pied de page toujours présents sur le site : à la différence des modules de la structure
 * de navigation, leur statut ne se pilote pas (pas de dropdown Publié/Non publié), d'où le badge fixe. */
const FOOTER_MANDATORY_MODULES: { id: string; label: string; icon: typeof LinkOutlinedIcon }[] = [
  { id: 'footer-liens', label: 'Liens', icon: LinkOutlinedIcon },
  { id: 'footer-contacts', label: 'Contacts', icon: ContactsOutlinedIcon },
  { id: 'footer-jumelage', label: 'Jumelage', icon: HandshakeOutlinedIcon },
];

/** Code couleur de l'icône selon le type d'élément : teal (primaire) pour un module, bleu foncé (secondaire) pour
 * un raccourci — afin de les distinguer au premier coup d'œil dans la structure de navigation. Un onglet (aucun
 * `kind` de contenu) garde une teinte neutre. */
function contentAvatarSx(kind: ContentItemKind | undefined): { bgcolor: string | ((theme: Theme) => string); color: string } {
  if (kind === 'link') {
    return { bgcolor: (theme: Theme) => alpha(theme.palette.secondary.main, 0.12), color: 'secondary.main' };
  }
  if (kind === 'module') {
    return { bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.12), color: 'primary.main' };
  }
  return { bgcolor: 'action.hover', color: 'text.secondary' };
}

// Décalage horizontal (px) de la ligne de connexion, aligné avec le centre de l'icône de l'onglet parent.
const CONNECTOR_LEFT = 34;

// Décalage supplémentaire (px) par niveau d'imbrication au-delà du premier, pour que chaque niveau
// de page enfant apparaisse clairement plus à droite et rattaché à sa page parente (et non à l'onglet).
const NESTED_CONNECTOR_STEP = 40;

type NavView = 'tree' | 'archived';

/** Où l'élément en cours de glissement se déposerait s'il était lâché maintenant : dans quel conteneur, avant quel frère. */
interface DropPreview {
  /** Identifiant du conteneur ciblé : `ROOT_THEMATIQUE_ID`, l'id d'un onglet, ou l'id d'un module (page parente). */
  containerId: string;
  /** Id du frère avant lequel insérer, ou `null` pour insérer en dernière position du conteneur. */
  beforeId: string | null;
}

/** Zone survolée d'une ligne cible : au-dessus (frère avant), au milieu (imbriquer dedans), en dessous (frère après). */
type DropZone = 'before' | 'inside' | 'after';

interface DragHandleProps {
  attributes: ReturnType<typeof useSortable>['attributes'];
  listeners: ReturnType<typeof useSortable>['listeners'];
}

function nextIdAfter(ids: string[], id: string): string | null {
  const index = ids.indexOf(id);
  if (index === -1 || index + 1 >= ids.length) return null;
  return ids[index + 1];
}

/** Détermine si le pointeur survole le tiers haut (avant), le tiers médian (imbriquer) ou le tiers bas (après) de la cible.
 * On utilise la position réelle du pointeur (événement d'activation + delta), plus fiable que `active.rect` dont la
 * hauteur mesurée ne correspond pas toujours à la hauteur visuelle réelle de la ligne glissée. */
function computeDropZone(
  event: Pick<DragMoveEvent | DragEndEvent, 'activatorEvent' | 'delta'>,
  over: NonNullable<DragEndEvent['over']>,
): DropZone {
  const activatorEvent = event.activatorEvent as (PointerEvent | MouseEvent | TouchEvent) & { clientY?: number };
  const initialY = activatorEvent.clientY ?? ('touches' in activatorEvent ? activatorEvent.touches[0]?.clientY : undefined);
  if (initialY === undefined) return 'before';
  const pointerY = initialY + event.delta.y;
  const ratio = (pointerY - over.rect.top) / over.rect.height;
  if (ratio < 1 / 3) return 'before';
  if (ratio > 2 / 3) return 'after';
  return 'inside';
}

/** Un nœud a-t-il une branche à afficher : des enfants existants, ou a-t-il déjà été ciblé comme conteneur durant
 * ce glisser-déposer ? On se base sur l'ensemble « déjà survolé » (et non sur la cible instantanée) pour que la
 * branche reste stable une fois dépliée, plutôt que d'apparaître/disparaître à chaque léger mouvement du curseur. */
function hasVisibleBranch(node: { id: string; children?: NavChildNode[] }, expandedContainerIds: ReadonlySet<string>): boolean {
  return Boolean(node.children?.length) || expandedContainerIds.has(node.id);
}

/** Pastille « Contenu » indiquant qu'un module mène à une page de contenu éditable — utilisée à l'identique
 * dans la structure de navigation et dans le pied de page, pour signaler la même affordance de clic. Porte
 * elle-même la classe `row-click-hint` (ciblée par le parent au survol) : c'est cet élément, et non un
 * conteneur englobant, qui doit changer de couleur et glisser en place, sous peine de rendre le survol inerte. */
function ContentHintChip({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Box
      className="row-click-hint"
      aria-hidden="true"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.125,
        px: 1,
        py: 0.375,
        borderRadius: '999px',
        border: '1px solid',
        borderColor: 'primary.light',
        bgcolor: 'background.paper',
        color: 'primary.dark',
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        transform: 'translateX(4px)',
        transition: 'transform 150ms ease, background-color 150ms ease, border-color 150ms ease',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        ...sx,
      }}
    >
      Contenu
      <ChevronRightIcon sx={{ fontSize: 14 }} />
    </Box>
  );
}

function NavChildRow({
  child,
  depth = 1,
  dragHandle,
  isNestTarget = false,
}: {
  child: NavChildNode;
  /** 0 = module à la racine du menu, 1 = module dans un onglet (ou à la racine), 2+ = page rattachée à une page parente. */
  depth?: number;
  dragHandle?: DragHandleProps;
  /** Cette ligne est-elle survolée comme future page parente de l'élément glissé ? */
  isNestTarget?: boolean;
}) {
  const { archiveModule, restoreModule, deleteModule, updateModule } = useContenuStore();
  const Icon = child.icon ?? ArticleOutlinedIcon;
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<HTMLElement | null>(null);

  const isArchived = child.status === 'archived';
  const isPublished = child.status === 'published';

  // Chip de statut (dropdown) + Modifier, plus Archiver ou Rétablir + Supprimer définitivement : toujours 3 contrôles,
  // pour réserver la marge de droite et positionner l'indice « Contenu » sans jamais les chevaucher.
  const actionCount = 3;
  // Le chip de statut est plus large qu'un bouton icône : lui réserver un espace dédié plutôt que de le
  // compter comme une action de plus, sous peine de le faire chevaucher l'indice « Contenu ».
  const statusChipWidth = !isArchived ? 116 : 0;

  function openPublishConfirm() {
    setStatusMenuAnchor(null);
    setPublishConfirmOpen(true);
  }

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            {!isArchived && (
              <>
                <Chip
                  onClick={(event) => setStatusMenuAnchor(event.currentTarget)}
                  label={
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <Box
                        aria-hidden="true"
                        sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: isPublished ? 'success.main' : 'text.disabled' }}
                      />
                      <span>{isPublished ? 'Publié' : 'Non publié'}</span>
                      <ArrowDropDownIcon sx={{ fontSize: 20, ml: '-4px !important' }} />
                    </Stack>
                  }
                  aria-haspopup="menu"
                  aria-expanded={Boolean(statusMenuAnchor)}
                  aria-label={`Statut de publication de ${child.label} : ${isPublished ? 'publié' : 'non publié'}`}
                  sx={{
                    height: 30,
                    minWidth: 100,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 0,
                    bgcolor: (theme) => alpha(isPublished ? theme.palette.success.main : theme.palette.text.primary, isPublished ? 0.14 : 0.08),
                    color: isPublished ? 'success.dark' : 'text.secondary',
                    '&:hover': {
                      bgcolor: (theme) => alpha(isPublished ? theme.palette.success.main : theme.palette.text.primary, isPublished ? 0.22 : 0.14),
                    },
                    '& .MuiChip-label': { display: 'flex', alignItems: 'center', pl: 1, pr: 0.75 },
                  }}
                />
                <Menu
                  anchorEl={statusMenuAnchor}
                  open={Boolean(statusMenuAnchor)}
                  onClose={() => setStatusMenuAnchor(null)}
                  slotProps={{ paper: { sx: { borderRadius: 2.5, minWidth: 240, mt: 0.5 } } }}
                >
                  <MenuItem disabled={isPublished} onClick={openPublishConfirm} sx={{ py: 1.25, px: 2, gap: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <CheckCircleIcon sx={{ fontSize: 24, color: isPublished ? 'text.primary' : 'action.active' }} />
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14 }}>
                      Publier maintenant
                    </Typography>
                  </MenuItem>
                  <MenuItem disabled={!isPublished} onClick={openPublishConfirm} sx={{ py: 1.25, px: 2, gap: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                      <RemoveCircleOutlinedIcon sx={{ fontSize: 24, color: 'text.disabled' }} />
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14, color: 'text.secondary' }}>
                      Dépublier
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
            <Tooltip title="Modifier les infos">
              <IconButton
                component={Link}
                href={
                  child.kind === 'link'
                    ? `/dashboard/contenu/lien/edit/${child.id}`
                    : child.kind === 'separator'
                      ? `/dashboard/contenu/separation/edit/${child.id}`
                      : `/dashboard/contenu/module/edit/${child.id}`
                }
                size="small"
                aria-label={`Modifier les infos de ${child.label}`}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {isArchived ? (
              <>
                <Tooltip title="Rétablir">
                  <IconButton size="small" aria-label={`Rétablir ${child.label}`} onClick={() => setRestoreConfirmOpen(true)}>
                    <UnarchiveOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer définitivement">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label={`Supprimer définitivement ${child.label}`}
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <DeleteForeverOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Archiver">
                <IconButton size="small" aria-label={`Archiver ${child.label}`} onClick={() => setArchiveConfirmOpen(true)}>
                  <ArchiveOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        }
      >
        <ListItemButton
          sx={{
            position: 'relative',
            py: 0.75,
            // La poignée de glissement (si présente) reste toujours au même niveau à gauche : seul l'espace
            // entre elle et l'avatar (cf. `mr` de la poignée ci-dessous) grandit avec la profondeur.
            pl: dragHandle ? 1 : depth === 0 ? 3 : 7,
            pr: 7 + (actionCount - 1) * 6 + statusChipWidth / 8,
            minHeight: 'auto',
            transition: 'background-color 150ms ease, transform 150ms ease',
            ...(isNestTarget && nestTargetSx),
            // Une séparation n'est qu'un repère visuel dans le menu : non cliquable, elle ne doit pas réagir au survol.
            ...(child.kind !== 'separator' && {
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.light, 0.22),
                transform: 'translateX(2px)',
              },
            }),
            '&:hover .row-click-hint': {
              transform: 'translateY(-50%) translateX(0)',
              bgcolor: 'primary.light',
              borderColor: 'primary.light',
            },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              '&:hover': { transform: 'none' },
            },
          }}
        >
          {dragHandle && (
            <Tooltip title="Glisser pour déplacer">
              <Box
                {...dragHandle.attributes}
                {...dragHandle.listeners}
                aria-label={`Déplacer ${child.label}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.disabled',
                  cursor: 'grab',
                  px: 0.5,
                  mr: (depth > 0 ? 4.5 : 0.5) + Math.max(0, depth - 1) * 5,
                  touchAction: 'none',
                  '&:active': { cursor: 'grabbing' },
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 1 },
                }}
              >
                <DragIndicatorIcon fontSize="small" />
              </Box>
            </Tooltip>
          )}
          <ListItemAvatar sx={{ minWidth: 42 }}>
            <Avatar variant="rounded" sx={{ ...contentAvatarSx(child.kind), width: 26, height: 26 }}>
              <Icon sx={{ fontSize: 15 }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={child.label}
            secondary={child.typeLabel}
            sx={{ minWidth: 0 }}
            slotProps={{
              primary: {
                variant: 'body2',
                sx: { fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
              },
              secondary: {
                variant: 'caption',
                sx: { fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
              },
            }}
          />
          {/* Un lien ou une séparation ne mène à aucune page de contenu : contrairement à un module, sa carte n'est pas cliquable. */}
          {child.kind === 'module' && (
            <ContentHintChip
              sx={{
                position: 'absolute',
                top: '50%',
                // Ancré à une distance fixe du bord droit, au-delà de la zone des boutons d'icônes
                // (44px par bouton + espacement), pour ne jamais se superposer avec eux.
                right: 80 + (actionCount - 1) * 48 + statusChipWidth,
                transform: 'translateY(-50%) translateX(4px)',
              }}
            />
          )}
        </ListItemButton>
      </ListItem>

      <Dialog open={archiveConfirmOpen} onClose={() => setArchiveConfirmOpen(false)} aria-labelledby={`archive-title-${child.id}`}>
        <DialogTitle id={`archive-title-${child.id}`}>Archiver « {child.label} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ce module ne sera plus visible sur le site, mais vous pourrez le réactiver à tout moment depuis la section « Archivés ».
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveConfirmOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => {
              setArchiveConfirmOpen(false);
              archiveModule(child.id);
            }}
            autoFocus
          >
            Archiver
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={restoreConfirmOpen} onClose={() => setRestoreConfirmOpen(false)} aria-labelledby={`restore-title-${child.id}`}>
        <DialogTitle id={`restore-title-${child.id}`}>Rétablir « {child.label} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Le module sera réintégré au site et redeviendra visible pour les visiteurs.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreConfirmOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={() => {
              setRestoreConfirmOpen(false);
              restoreModule(child.id);
            }}
            autoFocus
          >
            Rétablir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} aria-labelledby={`delete-forever-title-${child.id}`}>
        <DialogTitle id={`delete-forever-title-${child.id}`}>Supprimer définitivement « {child.label} » ?</DialogTitle>
        <DialogContent>
          <DialogContentText>Cette action est irréversible : le module sera définitivement supprimé des archives.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setDeleteConfirmOpen(false);
              deleteModule(child.id);
            }}
            autoFocus
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={publishConfirmOpen} onClose={() => setPublishConfirmOpen(false)} aria-labelledby={`publish-title-${child.id}`}>
        <DialogTitle id={`publish-title-${child.id}`}>
          {isPublished ? 'Dépublier' : 'Publier'} « {child.label} » ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isPublished
              ? 'Ce module ne sera plus visible sur le site pour les visiteurs, mais il reste dans la structure de navigation et peut être republié à tout moment.'
              : 'Ce module deviendra visible sur le site pour les visiteurs.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishConfirmOpen(false)}>Annuler</Button>
          <Button
            color={isPublished ? 'inherit' : 'success'}
            variant="contained"
            onClick={() => {
              setPublishConfirmOpen(false);
              updateModule(child.id, { status: isPublished ? 'draft' : 'published' });
            }}
            autoFocus
          >
            {isPublished ? 'Dépublier' : 'Publier'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function SortableModuleRow({
  child,
  depth = 1,
  isNestTarget = false,
}: {
  child: NavChildNode;
  depth?: number;
  isNestTarget?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: child.id });

  if (isDragging) {
    // N'apparaît plus du tout à son emplacement d'origine : seul l'aperçu à l'endroit de dépose (DragPreviewRow)
    // le représente pendant le glisser, pour éviter qu'il semble dédoublé.
    return <Box ref={setNodeRef} sx={{ height: 0, overflow: 'hidden' }} />;
  }

  return (
    <Box ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} sx={{ bgcolor: 'background.paper' }}>
      <NavChildRow child={child} depth={depth} dragHandle={{ attributes, listeners }} isNestTarget={isNestTarget} />
    </Box>
  );
}

/** Aperçu en opacité réduite du module en cours de glissement, affiché exactement à l'endroit où il atterrirait —
 * avant/après un frère, ou comme premier enfant d'une page parente — pour vérifier le placement avant de lâcher. */
function DragPreviewRow({
  icon: Icon = ArticleOutlinedIcon,
  label,
  typeLabel,
  kind,
  depth,
}: {
  icon?: React.ComponentType<SvgIconProps>;
  label: string;
  typeLabel?: string;
  kind?: ContentItemKind;
  depth: number;
}) {
  // Le contour pointillé ne doit englober que l'icône et le libellé du module, pas la zone d'indentation
  // de l'arborescence à sa gauche : c'est ce décalage qui permet de voir à quel niveau il va se déposer.
  const pl = (depth === 0 ? 3 : 7) + Math.max(0, depth - 1) * 5;

  return (
    <Box sx={{ pl, pr: 2, my: 0.25 }}>
      <Box
        aria-hidden="true"
        sx={{
          border: '1.5px dashed',
          borderColor: 'primary.main',
          borderRadius: 1.5,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
          pointerEvents: 'none',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', py: 0.75, px: 1.5, opacity: 0.55 }}>
          <Avatar variant="rounded" sx={{ ...contentAvatarSx(kind), width: 26, height: 26 }}>
            <Icon sx={{ fontSize: 15 }} />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {label}
            </Typography>
            {typeLabel && (
              <Typography
                variant="caption"
                sx={{ display: 'block', fontSize: 11, color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {typeLabel}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

/** Style appliqué à la ligne actuellement survolée comme future page parente, pour indiquer l'imbrication à venir. */
const nestTargetSx = {
  outline: '2px solid',
  outlineColor: 'primary.main',
  outlineOffset: '-2px',
  bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
};

/** Trace le trait vertical + coude reliant une ligne à son conteneur parent, façon arborescence de fichiers.
 * Chaque ligne ne dessine que son propre tronçon (la moitié haute pour rejoindre le coude, la moitié basse
 * uniquement si un frère suit) : la branche s'arrête ainsi exactement au dernier élément de son niveau, sans
 * se prolonger dans le vide à côté d'un niveau plus profond rendu juste en dessous dans le document. */
function ConnectorSegment({ left = CONNECTOR_LEFT, isLast, children }: { left?: number; isLast: boolean; children: React.ReactNode }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Box aria-hidden="true" sx={{ position: 'absolute', zIndex: 1, left, top: 0, height: '50%', width: '1px', bgcolor: 'divider' }} />
      {!isLast && (
        <Box aria-hidden="true" sx={{ position: 'absolute', zIndex: 1, left, top: '50%', bottom: 0, width: '1px', bgcolor: 'divider' }} />
      )}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          left,
          top: '50%',
          width: 10,
          height: '1px',
          bgcolor: 'divider',
          transform: 'translateY(-50%)',
        }}
      />
      {children}
    </Box>
  );
}

/** Rend récursivement les modules d'un conteneur (onglet ou page parente) : chaque niveau d'imbrication apparaît
 * plus à droite que le précédent et relié par son propre trait d'arborescence, pour bien montrer sa dépendance
 * au module parent. Chaque module y est glissable et peut lui-même recevoir d'autres modules en pages enfants. */
function ModuleBranch({
  containerId,
  containerLabel,
  items,
  depth,
  dropPreview,
  expandedContainerIds,
  activeId,
  activeModule,
}: {
  containerId: string;
  containerLabel: string;
  items: NavChildNode[];
  depth: number;
  dropPreview: DropPreview | null;
  expandedContainerIds: ReadonlySet<string>;
  activeId: string | null;
  activeModule?: AddedModule;
}) {
  const left = CONNECTOR_LEFT + (depth - 1) * NESTED_CONNECTOR_STEP;
  const isThisContainerTargeted = Boolean(activeModule) && dropPreview?.containerId === containerId;
  // Le module en cours de glissement n'apparaît plus à son emplacement d'origine (cf. SortableModuleRow) :
  // on l'exclut donc ici pour que « dernier élément du niveau » corresponde bien au dernier élément visible.
  const visibleItems = items.filter((item) => item.id !== activeId);
  const hasTrailingPreview = isThisContainerTargeted && dropPreview?.beforeId === null;

  return (
    <SortableContext items={visibleItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
      <List disablePadding component="div" role="group" aria-label={`Pages rattachées à ${containerLabel}`}>
        {visibleItems.map((child, index) => {
          const isLastVisible = index === visibleItems.length - 1;
          return (
            <Box key={child.id}>
              {isThisContainerTargeted && dropPreview?.beforeId === child.id && (
                <ConnectorSegment left={left} isLast={false}>
                  <DragPreviewRow icon={activeModule!.icon} label={activeModule!.label} typeLabel={activeModule!.typeLabel} kind={activeModule!.kind} depth={depth} />
                </ConnectorSegment>
              )}
              <ConnectorSegment left={left} isLast={isLastVisible && !hasTrailingPreview}>
                <SortableModuleRow child={child} depth={depth} isNestTarget={dropPreview?.containerId === child.id} />
              </ConnectorSegment>
              {hasVisibleBranch(child, expandedContainerIds) && (
                <ModuleBranch
                  containerId={child.id}
                  containerLabel={child.label}
                  items={child.children ?? []}
                  depth={depth + 1}
                  dropPreview={dropPreview}
                  expandedContainerIds={expandedContainerIds}
                  activeId={activeId}
                  activeModule={activeModule}
                />
              )}
            </Box>
          );
        })}
        {hasTrailingPreview && (
          <ConnectorSegment left={left} isLast>
            <DragPreviewRow icon={activeModule!.icon} label={activeModule!.label} typeLabel={activeModule!.typeLabel} kind={activeModule!.kind} depth={depth} />
          </ConnectorSegment>
        )}
      </List>
    </SortableContext>
  );
}

function NavNodeRow({
  node,
  dropPreview,
  expandedContainerIds,
  activeId,
  activeModule,
}: {
  node: NavTreeNode;
  dropPreview: DropPreview | null;
  expandedContainerIds: ReadonlySet<string>;
  activeId: string | null;
  activeModule?: AddedModule;
}) {
  const { deleteTab } = useContenuStore();
  const hasChildren = Boolean(node.children?.length);
  const [open, setOpen] = useState(Boolean(node.defaultOpen));
  const [enabled, setEnabled] = useState(node.enabled);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const KindIcon = KIND_ICON[node.kind];
  const isTab = node.kind === 'tab';
  const { attributes, listeners, setNodeRef, isOver, isDragging } = useSortable({
    id: node.id,
    disabled: { draggable: !isTab },
  });

  // Déplie automatiquement un onglet qui vient de recevoir son premier module (ex. glissé-déposé).
  const [prevDefaultOpen, setPrevDefaultOpen] = useState(node.defaultOpen);
  if (node.defaultOpen !== prevDefaultOpen) {
    setPrevDefaultOpen(node.defaultOpen);
    if (node.defaultOpen && !open) setOpen(true);
  }

  function handleConfirmDelete() {
    setConfirmOpen(false);
    deleteTab(node.id);
  }

  // Ciblé maintenant (mise en surbrillance immédiate) vs. déjà survolé au moins une fois pendant ce glisser-déposer
  // (dépliage qui reste stable, sans se replier au moindre mouvement du curseur vers un autre élément).
  const isHoverTarget = dropPreview?.containerId === node.id;
  const wasEverExpanded = expandedContainerIds.has(node.id);
  const showBranch = isTab && (hasChildren || wasEverExpanded);
  const isOpen = open || wasEverExpanded;

  if (isDragging) {
    // N'apparaît plus du tout à son emplacement d'origine : seul l'aperçu à l'endroit de dépose le représente.
    return <Box ref={setNodeRef} sx={{ height: 0, overflow: 'hidden' }} />;
  }

  return (
    <>
      <ListItem
        ref={setNodeRef}
        disablePadding
        secondaryAction={
          isTab ? (
            <Tooltip
              title={
                hasChildren
                  ? "L'onglet thématique ne peut pas être supprimé tant qu'il contient des modules."
                  : "Supprimer l'onglet thématique"
              }
            >
              <span>
                <IconButton
                  size="small"
                  color="error"
                  disabled={hasChildren}
                  aria-label={`Supprimer l'onglet ${node.label}`}
                  onClick={() => setConfirmOpen(true)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            <Switch
              size="small"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              slotProps={{ input: { 'aria-label': `Activer ou désactiver ${node.label}` } }}
            />
          )
        }
        sx={{ position: 'relative', bgcolor: isOver ? 'action.selected' : hasChildren && open ? 'action.hover' : 'transparent' }}
      >
        {isTab && (
          <Tooltip title="Glisser pour réorganiser">
            <Box
              {...attributes}
              {...listeners}
              aria-label={`Déplacer l'onglet ${node.label}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
                cursor: 'grab',
                pl: 1,
                touchAction: 'none',
                '&:active': { cursor: 'grabbing' },
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', borderRadius: 1 },
              }}
            >
              <DragIndicatorIcon fontSize="small" />
            </Box>
          </Tooltip>
        )}
        <ListItemButton
          onClick={hasChildren ? () => setOpen((o) => !o) : undefined}
          sx={{
            py: 1,
            pl: isTab ? 0.5 : 2,
            pr: 6,
            cursor: hasChildren ? 'pointer' : 'default',
            ...(isTab && isHoverTarget && nestTargetSx),
          }}
          aria-expanded={hasChildren ? open : undefined}
        >
          <ListItemIcon sx={{ minWidth: 24 }}>
            {hasChildren && (
              <ChevronRightIcon
                fontSize="small"
                sx={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}
              />
            )}
          </ListItemIcon>
          <ListItemAvatar sx={{ minWidth: 44 }}>
            <Avatar variant="rounded" sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 30, height: 30 }}>
              <KindIcon sx={{ fontSize: 16 }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={node.label}
            secondary={node.typeLabel}
            slotProps={{
              primary: { variant: 'body2', sx: { fontWeight: 600 } },
              secondary: { variant: 'caption' },
            }}
          />
        </ListItemButton>
      </ListItem>

      {isTab && (
        <Collapse in={isOpen && showBranch} timeout="auto" unmountOnExit>
          <ModuleBranch
            containerId={node.id}
            containerLabel={node.label}
            items={node.children ?? []}
            depth={1}
            dropPreview={dropPreview}
            expandedContainerIds={expandedContainerIds}
            activeId={activeId}
            activeModule={activeModule}
          />
        </Collapse>
      )}

      {node.kind === 'tab' && (
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} aria-labelledby={`delete-tab-title-${node.id}`}>
          <DialogTitle id={`delete-tab-title-${node.id}`}>Supprimer l&apos;onglet « {node.label} » ?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Cette action est définitive. L&apos;onglet thématique « {node.label} » sera retiré de la structure de navigation.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Annuler</Button>
            <Button color="error" variant="contained" onClick={handleConfirmDelete} autoFocus>
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

function TabLabel({ text, count }: { text: string; count: number }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <span>{text}</span>
      <Chip label={count} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 600, height: 20 }} />
    </Stack>
  );
}

function EmptyViewState({ message }: { message: string }) {
  return (
    <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export function NavigationTree() {
  const router = useRouter();
  const { modules, navTree, topLevelItems, archivedModules, searchQuery, treeSearchResults, moveModuleToContainer, moveTab } =
    useContenuStore();
  const { templates: legalTemplates, getCompletion: getLegalCompletion } = useLegalPages();
  const [view, setView] = useState<NavView>('tree');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropPreview, setDropPreview] = useState<DropPreview | null>(null);
  // Conteneurs déjà survolés pendant le glisser-déposer en cours : une fois dépliés, ils le restent
  // jusqu'à la fin du geste, pour éviter que deux éléments se replient/déplient de façon désordonnée
  // à chaque petit mouvement du curseur.
  const [expandedContainerIds, setExpandedContainerIds] = useState<ReadonlySet<string>>(() => new Set());
  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);

  function handleAddStructureItem(href: string) {
    setAddMenuAnchor(null);
    router.push(href);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleChange(_event: SyntheticEvent, next: NavView) {
    setView(next);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
    setExpandedContainerIds(new Set());
  }

  function endDrag() {
    setActiveId(null);
    setDropPreview(null);
    setExpandedContainerIds(new Set());
  }

  /** Résout, pour un onglet en cours de glissement, l'endroit où il se repositionnerait (toujours au niveau racine). */
  function resolveTabDropPreview(activeIdValue: string, overId: string, zone: DropZone): DropPreview | null {
    const withoutActiveIds = topLevelItems.filter((item) => item.node.id !== activeIdValue).map((item) => item.node.id);
    const isBefore = zone === 'before';

    const overTab = navTree.find((node) => node.kind === 'tab' && node.id === overId);
    if (overTab) {
      return isBefore
        ? { containerId: ROOT_THEMATIQUE_ID, beforeId: overTab.id }
        : { containerId: ROOT_THEMATIQUE_ID, beforeId: nextIdAfter(withoutActiveIds, overTab.id) };
    }
    const overModule = modules.find((mod) => mod.id === overId);
    if (overModule && overModule.thematiqueId === ROOT_THEMATIQUE_ID && !overModule.parentPageId) {
      return isBefore
        ? { containerId: ROOT_THEMATIQUE_ID, beforeId: overId }
        : { containerId: ROOT_THEMATIQUE_ID, beforeId: nextIdAfter(withoutActiveIds, overId) };
    }
    // Un onglet ne peut être repositionné qu'au niveau racine, jamais dans un autre onglet ni dans un module.
    return null;
  }

  /** Résout, pour un module en cours de glissement, le conteneur cible (racine, onglet ou page parente) et la position d'insertion. */
  /** Applique les règles de placement propres à chaque type d'élément : un lien reste libre (racine, onglet ou page
   * parente) ; un module (rubrique comprise) ne peut jamais rester à la racine du menu ; une séparation ne peut
   * jamais être à la racine ni imbriquée dans une page parente — seul un onglet peut être son conteneur direct. */
  function applyPlacementConstraints(activeIdValue: string, preview: DropPreview | null): DropPreview | null {
    if (!preview) return null;
    const dragged = modules.find((mod) => mod.id === activeIdValue);
    if (!dragged || dragged.kind === 'link') return preview;
    if (preview.containerId === ROOT_THEMATIQUE_ID) return null;
    if (dragged.kind === 'separator') {
      const isTabContainer = navTree.some((node) => node.kind === 'tab' && node.id === preview.containerId);
      if (!isTabContainer) return null;
    }
    return preview;
  }

  function resolveModuleDropPreview(activeIdValue: string, overId: string, zone: DropZone): DropPreview | null {
    return applyPlacementConstraints(activeIdValue, resolveRawModuleDropPreview(activeIdValue, overId, zone));
  }

  function resolveRawModuleDropPreview(activeIdValue: string, overId: string, zone: DropZone): DropPreview | null {
    const withoutActiveIds = topLevelItems.filter((item) => item.node.id !== activeIdValue).map((item) => item.node.id);

    const overTab = navTree.find((node) => node.kind === 'tab' && node.id === overId);
    if (overTab) {
      // Tiers haut : le module se replace en frère de l'onglet, au niveau racine. Sinon : il s'imbrique dans l'onglet.
      if (zone === 'before') return { containerId: ROOT_THEMATIQUE_ID, beforeId: overTab.id };
      return { containerId: overTab.id, beforeId: null };
    }

    const overModule = modules.find((mod) => mod.id === overId);
    if (!overModule) return null;

    const isOverAtRoot = overModule.thematiqueId === ROOT_THEMATIQUE_ID && !overModule.parentPageId;
    const overContainerId = containerOf(overModule);

    const siblingsAfter = () => {
      if (isOverAtRoot) return { containerId: ROOT_THEMATIQUE_ID, beforeId: nextIdAfter(withoutActiveIds, overId) };
      const siblingIds = modules
        .filter((mod) => mod.status !== 'archived' && mod.id !== activeIdValue && containerOf(mod) === overContainerId)
        .map((mod) => mod.id);
      return { containerId: overContainerId, beforeId: nextIdAfter(siblingIds, overId) };
    };

    if (zone === 'before') {
      return isOverAtRoot ? { containerId: ROOT_THEMATIQUE_ID, beforeId: overId } : { containerId: overContainerId, beforeId: overId };
    }
    if (zone === 'after') {
      return siblingsAfter();
    }
    // zone === 'inside' : le module glissé s'imbrique dans le module survolé, qui devient sa nouvelle page parente.
    if (canNestModuleInto(modules, activeIdValue, overId)) {
      return { containerId: overId, beforeId: null };
    }
    // Imbrication impossible (profondeur maximale atteinte, ou cible descendante du module glissé) : repli en frère après.
    return siblingsAfter();
  }

  /** Convertit un aperçu de dépose en conteneur + index concrets, prêts pour `moveModuleToContainer`. */
  function previewToContainerIndex(preview: DropPreview, activeIdValue: string): { container: ModuleDropContainer; index: number } {
    if (preview.containerId === ROOT_THEMATIQUE_ID) {
      const ids = topLevelItems.filter((item) => item.node.id !== activeIdValue).map((item) => item.node.id);
      const index = preview.beforeId ? ids.indexOf(preview.beforeId) : ids.length;
      return { container: { kind: 'root' }, index: index === -1 ? ids.length : index };
    }
    const isTabContainer = navTree.some((node) => node.kind === 'tab' && node.id === preview.containerId);
    const ids = modules
      .filter(
        (mod) =>
          mod.status !== 'archived' &&
          mod.id !== activeIdValue &&
          (isTabContainer ? mod.thematiqueId === preview.containerId && !mod.parentPageId : mod.parentPageId === preview.containerId),
      )
      .map((mod) => mod.id);
    const index = preview.beforeId ? ids.indexOf(preview.beforeId) : ids.length;
    return {
      container: isTabContainer ? { kind: 'tab', tabId: preview.containerId } : { kind: 'module', moduleId: preview.containerId },
      index: index === -1 ? ids.length : index,
    };
  }

  function handleDragMove(event: DragMoveEvent) {
    const { active, over } = event;
    if (!over) {
      setDropPreview(null);
      return;
    }
    const activeIdValue = String(active.id);
    const overId = String(over.id);
    if (activeIdValue === overId) {
      setDropPreview(null);
      return;
    }
    const zone = computeDropZone(event, over);
    const activeIsTab = navTree.some((node) => node.kind === 'tab' && node.id === activeIdValue);
    const preview = activeIsTab
      ? resolveTabDropPreview(activeIdValue, overId, zone)
      : resolveModuleDropPreview(activeIdValue, overId, zone);
    setDropPreview(preview);
    if (preview) {
      setExpandedContainerIds((prev) => (prev.has(preview.containerId) ? prev : new Set(prev).add(preview.containerId)));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    endDrag();
    if (!over) return;

    const activeIdValue = String(active.id);
    const overId = String(over.id);
    if (activeIdValue === overId) return;

    const zone = computeDropZone(event, over);
    const activeIsTab = navTree.some((node) => node.kind === 'tab' && node.id === activeIdValue);

    if (activeIsTab) {
      const preview = resolveTabDropPreview(activeIdValue, overId, zone);
      if (!preview) return;
      const withoutActive = topLevelItems.filter((item) => item.node.id !== activeIdValue).map((item) => item.node.id);
      const index = preview.beforeId ? withoutActive.indexOf(preview.beforeId) : withoutActive.length;
      moveTab(activeIdValue, index === -1 ? withoutActive.length : index);
      return;
    }

    const preview = resolveModuleDropPreview(activeIdValue, overId, zone);
    if (!preview) return;
    const { container, index } = previewToContainerIndex(preview, activeIdValue);
    moveModuleToContainer(activeIdValue, container, index);
  }

  const activeModule = activeId ? modules.find((mod) => mod.id === activeId) : undefined;
  const activeTabNode = activeId ? navTree.find((node) => node.kind === 'tab' && node.id === activeId) : undefined;
  const ActiveIcon = activeModule?.icon ?? (activeTabNode ? AccountTreeOutlinedIcon : ArticleOutlinedIcon);
  const activeLabel = activeModule?.label ?? activeTabNode?.label;
  const topLevelIds = topLevelItems.map((item) => item.node.id);
  const isRootTargeted = dropPreview?.containerId === ROOT_THEMATIQUE_ID;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', pl: 1.5, pr: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tabs value={view} onChange={handleChange} aria-label="Sections de la structure et du contenu" sx={{ minHeight: 44 }}>
          <Tab
            value="tree"
            id="nav-tab-tree"
            aria-controls="nav-tabpanel-tree"
            label={<TabLabel text="Structure et contenu" count={navTree.length} />}
            sx={{ minHeight: 44, textTransform: 'none' }}
          />
          <Tab
            value="archived"
            id="nav-tab-archived"
            aria-controls="nav-tabpanel-archived"
            label={<TabLabel text="Archivés" count={archivedModules.length} />}
            sx={{ minHeight: 44, textTransform: 'none' }}
          />
        </Tabs>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddOutlinedIcon />}
          onClick={(event) => setAddMenuAnchor(event.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={Boolean(addMenuAnchor)}
        >
          Ajouter un élément de structure
        </Button>
        <Menu anchorEl={addMenuAnchor} open={Boolean(addMenuAnchor)} onClose={() => setAddMenuAnchor(null)}>
          <MenuItem onClick={() => handleAddStructureItem('/dashboard/contenu/onglet/nouveau')}>
            <ListItemIcon>
              <AccountTreeOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Onglet thématique</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAddStructureItem('/dashboard/contenu/lien/nouveau')}>
            <ListItemIcon>
              <LinkOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Raccourci / Lien externe</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAddStructureItem('/dashboard/contenu/rubrique/nouveau')}>
            <ListItemIcon>
              <ArticleOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rubrique</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAddStructureItem('/dashboard/contenu/separation/nouveau')}>
            <ListItemIcon>
              <HorizontalRuleOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Séparation</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>

      <Box role="tabpanel" id="nav-tabpanel-tree" aria-labelledby="nav-tab-tree" hidden={view !== 'tree'}>
        {view === 'tree' && searchQuery.trim() ? (
          treeSearchResults.length > 0 ? (
            <List disablePadding aria-label={`Résultats de recherche pour « ${searchQuery.trim()} »`}>
              {treeSearchResults.map((child) => (
                <Box key={child.id} sx={{ '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' } }}>
                  <NavChildRow child={child} depth={0} />
                </Box>
              ))}
            </List>
          ) : (
            <EmptyViewState message={`Aucun résultat pour « ${searchQuery.trim()} ».`} />
          )
        ) : (
          view === 'tree' && (
          <>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: 'block', px: 2, pt: 1.5, pb: 0.5, lineHeight: 1.5, letterSpacing: '.06em' }}
          >
            Menu de navigation
          </Typography>
          <DndContext
            id="navigation-tree-dnd"
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={endDrag}
          >
            <SortableContext items={topLevelIds} strategy={verticalListSortingStrategy}>
              <List disablePadding aria-label="Menu de navigation du site">
                {topLevelItems.map((item) => (
                  <Box key={item.node.id}>
                    {isRootTargeted && dropPreview?.beforeId === item.node.id && (
                      <DragPreviewRow icon={ActiveIcon} label={activeLabel ?? ''} typeLabel={activeModule?.typeLabel} kind={activeModule?.kind} depth={0} />
                    )}
                    <Box sx={{ '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' } }}>
                      {item.type === 'tab' ? (
                        <NavNodeRow
                          node={item.node}
                          dropPreview={dropPreview}
                          expandedContainerIds={expandedContainerIds}
                          activeId={activeId}
                          activeModule={activeModule}
                        />
                      ) : (
                        <>
                          <SortableModuleRow child={item.node} depth={0} isNestTarget={dropPreview?.containerId === item.node.id} />
                          {hasVisibleBranch(item.node, expandedContainerIds) && (
                            <ModuleBranch
                              containerId={item.node.id}
                              containerLabel={item.node.label}
                              items={item.node.children ?? []}
                              depth={1}
                              dropPreview={dropPreview}
                              expandedContainerIds={expandedContainerIds}
                              activeId={activeId}
                              activeModule={activeModule}
                            />
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                ))}
                {isRootTargeted && dropPreview?.beforeId === null && (
                  <DragPreviewRow icon={ActiveIcon} label={activeLabel ?? ''} typeLabel={activeModule?.typeLabel} kind={activeModule?.kind} depth={0} />
                )}
              </List>
            </SortableContext>
            <DragOverlay>
              {activeLabel && (
                <Paper elevation={4} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderRadius: 2 }}>
                  <Avatar variant="rounded" sx={{ ...contentAvatarSx(activeModule?.kind), width: 26, height: 26 }}>
                    <ActiveIcon sx={{ fontSize: 15 }} />
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                    {activeLabel}
                  </Typography>
                </Paper>
              )}
            </DragOverlay>
          </DndContext>

          <Divider sx={{ borderColor: 'divider' }} />

          <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: 'block', mb: 1, lineHeight: 1.5, letterSpacing: '.06em' }}
            >
              Modules hors menu
            </Typography>
            <EmptyViewState message="Aucun module hors menu pour le moment." />
          </Box>
          </>
          )
        )}
      </Box>

      <Box role="tabpanel" id="nav-tabpanel-archived" aria-labelledby="nav-tab-archived" hidden={view !== 'archived'}>
        {view === 'archived' &&
          (archivedModules.length > 0 ? (
            <List disablePadding aria-label="Modules archivés">
              {archivedModules.map((child) => (
                <Box key={child.id} sx={{ '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' } }}>
                  <NavChildRow child={child} depth={0} />
                </Box>
              ))}
            </List>
          ) : (
            <EmptyViewState message="Aucun module archivé." />
          ))}
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: 'block', mb: 1, lineHeight: 1.5, letterSpacing: '.06em' }}
        >
          Pied de page
        </Typography>
        <List disablePadding aria-label="Modules du pied de page">
          {FOOTER_MANDATORY_MODULES.map((mod) => (
            <ListItem
              key={mod.id}
              disablePadding
              secondaryAction={<Chip size="small" variant="outlined" color="success" label="Obligatoire" />}
            >
              <ListItemButton
                component={Link}
                href="/dashboard/contenu/pied-de-page"
                sx={{
                  position: 'relative',
                  py: 1.25,
                  pr: 20,
                  borderRadius: 1.5,
                  '&:hover .row-click-hint': {
                    transform: 'translateY(-50%) translateX(0)',
                    bgcolor: 'primary.light',
                    borderColor: 'primary.light',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                  <mod.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={mod.label} slotProps={{ primary: { sx: { fontWeight: 500, fontSize: 14 } } }} />
                <ContentHintChip sx={{ position: 'absolute', top: '50%', right: 108, transform: 'translateY(-50%) translateX(4px)' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: 'block', mb: 1, lineHeight: 1.5, letterSpacing: '.06em' }}
        >
          Pages obligatoires
        </Typography>
        <List disablePadding aria-label="Pages obligatoires du site">
          {legalTemplates.map((template) => {
            const completion = getLegalCompletion(template.id);
            const href = LEGAL_PAGE_ROUTES[template.id];
            const LegalIcon = LEGAL_PAGE_ICON[template.id];

            return (
              <ListItem
                key={template.id}
                disablePadding
                secondaryAction={
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Chip
                      size="small"
                      variant="outlined"
                      color={completion.complete ? 'success' : 'warning'}
                      label={completion.complete ? 'Complète' : `À compléter — ${completion.missingCount}`}
                    />
                    <Button component={Link} href={href} size="small" endIcon={<ChevronRightIcon fontSize="small" />}>
                      Modifier
                    </Button>
                  </Stack>
                }
              >
                <ListItemButton component={Link} href={href} sx={{ py: 1.25, pr: 26, borderRadius: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                    <LegalIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={template.title}
                    slotProps={{ primary: { sx: { fontWeight: 500, fontSize: 14 } } }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
}
