'use client';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { pluralize } from '@/lib/mediaLibrary/format';
import type { MediaFolder } from '@/types/mediaLibrary';

interface FolderTreeProps {
  folders: MediaFolder[];
  counts: Record<string, number>;
  folderId: string;
  onSelect: (folderId: string) => void;
}

interface FolderBranchProps extends FolderTreeProps {
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
        const Icon = active ? FolderOpenOutlinedIcon : FolderOutlinedIcon;
        return (
          <li key={folder.id}>
            <ListItemButton
              selected={active}
              aria-current={active ? 'true' : undefined}
              onClick={() => onSelect(folder.id)}
              sx={{ pl: 1.5 + depth * 2, borderRadius: 1, minHeight: 44, '&.Mui-selected': { color: 'primary.main', fontWeight: 600 } }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: active ? 'primary.main' : 'text.secondary' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={folder.name}
                secondary={
                  <>
                    <span aria-hidden="true">{counts[folder.id] ?? 0}</span>
                    <span className="sr-only">, {pluralize(counts[folder.id] ?? 0, 'image', 'images')}</span>
                  </>
                }
                slotProps={{
                  primary: { sx: { fontWeight: active ? 600 : 400, fontSize: 14 } },
                  secondary: { component: 'span', sx: { ml: 'auto' } },
                }}
                sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 0 }}
              />
            </ListItemButton>
            <FolderBranch folders={folders} counts={counts} folderId={folderId} onSelect={onSelect} parentId={folder.id} depth={depth + 1} />
          </li>
        );
      })}
    </List>
  );
}

export function FolderTree(props: FolderTreeProps) {
  return (
    <nav aria-label="Dossiers de la médiathèque">
      <FolderBranch {...props} parentId={null} depth={0} />
    </nav>
  );
}
