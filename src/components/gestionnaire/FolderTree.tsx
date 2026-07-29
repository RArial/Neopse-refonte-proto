'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { ROOT_FOLDER_ID, type ManagedFolder } from '@/types/gestionnaire';

interface FolderNode extends ManagedFolder {
  children: FolderNode[];
}

function buildFolderTree(folders: ManagedFolder[]): FolderNode[] {
  const nodesById = new Map<string, FolderNode>(folders.map((folder) => [folder.id, { ...folder, children: [] }]));
  const roots: FolderNode[] = [];
  nodesById.forEach((node) => {
    const parent = node.parentId !== ROOT_FOLDER_ID ? nodesById.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  });
  return roots;
}

interface FolderTreeRowProps {
  node: FolderNode;
  depth: number;
  currentFolderId: string;
  collapsedIds: Set<string>;
  folderCounts: Record<string, number>;
  onSelect: (folderId: string) => void;
  onToggleCollapsed: (folderId: string) => void;
}

function FolderTreeRow({ node, depth, currentFolderId, collapsedIds, folderCounts, onSelect, onToggleCollapsed }: FolderTreeRowProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = !collapsedIds.has(node.id);
  const isActive = currentFolderId === node.id;

  return (
    <Box>
      <Stack
        direction="row"
        spacing={0.5}
        role="treeitem"
        aria-selected={isActive}
        aria-expanded={hasChildren ? isExpanded : undefined}
        tabIndex={0}
        onClick={() => onSelect(node.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(node.id);
          }
        }}
        sx={{
          alignItems: 'center',
          px: 1.25,
          py: 0.75,
          ml: depth * 2,
          borderRadius: 1.5,
          cursor: 'pointer',
          bgcolor: isActive ? 'action.selected' : 'transparent',
          color: isActive ? 'primary.dark' : 'text.secondary',
          '&:hover': { bgcolor: 'action.hover' },
          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
        }}
      >
        <Box sx={{ width: 22, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {hasChildren && (
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onToggleCollapsed(node.id);
              }}
              aria-label={isExpanded ? `Replier « ${node.label} »` : `Déplier « ${node.label} »`}
              sx={{ p: 0.25 }}
            >
              <ChevronRightIcon fontSize="small" sx={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }} />
            </IconButton>
          )}
        </Box>
        <FolderOutlinedIcon fontSize="small" />
        <Typography variant="body2" sx={{ flex: 1, fontWeight: isActive ? 700 : 500 }}>
          {node.label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {folderCounts[node.id] ?? 0}
        </Typography>
      </Stack>

      {hasChildren && isExpanded && (
        <Box role="group">
          {node.children.map((child) => (
            <FolderTreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              currentFolderId={currentFolderId}
              collapsedIds={collapsedIds}
              folderCounts={folderCounts}
              onSelect={onSelect}
              onToggleCollapsed={onToggleCollapsed}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

interface FolderTreeProps {
  folders: ManagedFolder[];
  currentFolderId: string;
  folderCounts: Record<string, number>;
  onSelect: (folderId: string) => void;
}

export function FolderTree({ folders, currentFolderId, folderCounts, onSelect }: FolderTreeProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const tree = useMemo(() => buildFolderTree(folders), [folders]);

  function toggleCollapsed(id: string) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Box role="tree">
      {tree.map((node) => (
        <FolderTreeRow
          key={node.id}
          node={node}
          depth={1}
          currentFolderId={currentFolderId}
          collapsedIds={collapsedIds}
          folderCounts={folderCounts}
          onSelect={onSelect}
          onToggleCollapsed={toggleCollapsed}
        />
      ))}
    </Box>
  );
}
