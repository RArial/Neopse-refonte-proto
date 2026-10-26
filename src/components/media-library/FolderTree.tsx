'use client';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import { pluralize } from '@/lib/mediaLibrary/format';
import type { MediaFolder } from '@/types/mediaLibrary';

interface FolderTreeProps {
  folders: MediaFolder[];
  counts: Record<string, number>;
  totalCount: number;
  /** null = « Toutes les images ». */
  folderId: string | null;
  onSelect: (folderId: string | null) => void;
}

interface FolderItemProps {
  label: string;
  count: number;
  depth: number;
  active: boolean;
  icon: typeof FolderOutlinedIcon;
  onClick: () => void;
}

function FolderItem({ label, count, depth, active, icon: Icon, onClick }: FolderItemProps) {
  return (
    <ListItemButton
      selected={active}
      aria-current={active ? 'true' : undefined}
      onClick={onClick}
      sx={{ pl: 1 + depth * 2, pr: 1, borderRadius: 1, minHeight: 40, '&.Mui-selected': { color: 'primary.main' } }}
    >
      <ListItemIcon sx={{ minWidth: 30, color: active ? 'primary.main' : 'text.secondary' }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={label}
        secondary={
          <>
            <span aria-hidden="true">{count}</span>
            <span className="sr-only">, {pluralize(count, 'image', 'images')}</span>
          </>
        }
        slotProps={{
          primary: { sx: { fontWeight: active ? 600 : 400, fontSize: 14, whiteSpace: 'nowrap' } },
          secondary: { component: 'span', sx: { ml: 'auto' } },
        }}
        sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 0 }}
      />
    </ListItemButton>
  );
}

interface FolderBranchProps extends Omit<FolderTreeProps, 'totalCount'> {
  parentId: string | null;
  depth: number;
}

function FolderBranch({ folders, counts, folderId, onSelect, parentId, depth }: FolderBranchProps) {
  const children = folders.filter((folder) => folder.parentId === parentId);
  if (children.length === 0) return null;

  return (
    <List dense disablePadding>
      {children.map((folder) => {
        const active = folder.id === folderId;
        return (
          <li key={folder.id}>
            <FolderItem
              label={folder.name}
              count={counts[folder.id] ?? 0}
              depth={depth}
              active={active}
              icon={active ? FolderOpenOutlinedIcon : FolderOutlinedIcon}
              onClick={() => onSelect(folder.id)}
            />
            <FolderBranch folders={folders} counts={counts} folderId={folderId} onSelect={onSelect} parentId={folder.id} depth={depth + 1} />
          </li>
        );
      })}
    </List>
  );
}

export function FolderTree({ totalCount, ...props }: FolderTreeProps) {
  return (
    <nav aria-label="Filtrer par dossier">
      <List dense disablePadding>
        <li>
          <FolderItem
            label="Toutes les images"
            count={totalCount}
            depth={0}
            active={props.folderId === null}
            icon={PhotoLibraryOutlinedIcon}
            onClick={() => props.onSelect(null)}
          />
        </li>
      </List>
      <FolderBranch {...props} parentId={null} depth={0} />
    </nav>
  );
}
