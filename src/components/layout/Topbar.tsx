'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import { Icons, type IconName } from '@/components/ui/Icons';
import { NotificationsMenu } from '@/components/notifications/NotificationsMenu';
import { cn } from '@/lib/utils';

interface Tool {
  id: string;
  icon: IconName;
  desc: string;
}

const TOOLS: Tool[] = [
  { id: 'Site internet',       icon: 'Globe',     desc: 'Site vitrine & pages' },
  { id: 'Billetterie',         icon: 'Ticket',    desc: 'Vente de billets en ligne' },
  { id: 'Espace collaboratif', icon: 'Briefcase', desc: 'Documents & équipes' },
];

interface Project {
  id: string;
  icon: IconName;
  desc: string;
}

const PROJECTS: Project[] = [
  { id: 'Mairie de Vercourt',        icon: 'AccountTree', desc: 'Projet de démonstration' },
  { id: 'Ville de Sainte-Aldegonde', icon: 'MapPin',       desc: 'Site officiel de la collectivité' },
  { id: 'Intranet agents',           icon: 'Layers',       desc: 'Espace interne collaborateurs' },
];

function ProjectDropdown() {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<string>('Mairie de Vercourt');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const current = PROJECTS.find(p => p.id === project) ?? PROJECTS[0];
  const CurrentIcon = Icons[current.icon];

  const selectProject = useCallback((id: string) => {
    setProject(id);
    setOpen(false);
  }, []);

  return (
    <div className="tool-dd" ref={menuRef}>
      <button
        className={cn('tool-dd-btn', open && 'open')}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Projet actif : ${project}`}
      >
        <CurrentIcon size={13} />
        <span>Mon projet {project}</span>
        <Icons.ChevronDown size={12} />
      </button>

      {open && (
        <div className="tool-dd-menu" role="listbox" aria-label="Choisir un projet">
          {PROJECTS.map(p => {
            const ProjectIcon = Icons[p.icon];
            const isSelected = p.id === project;
            return (
              <button
                key={p.id}
                className={cn('tool-dd-item', isSelected && 'on')}
                onClick={() => selectProject(p.id)}
                type="button"
                role="option"
                aria-selected={isSelected}
              >
                <span className="tool-dd-ico"><ProjectIcon size={16} /></span>
                <span className="tool-dd-lbl">
                  <span className="tool-dd-t">{p.id}</span>
                  <span className="tool-dd-d">{p.desc}</span>
                </span>
                {isSelected && <Icons.ChevronRight size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ToolDropdown() {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<string>('Site internet');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const current = TOOLS.find(t => t.id === tool) ?? TOOLS[0];
  const CurrentIcon = Icons[current.icon];

  const selectTool = useCallback((id: string) => {
    setTool(id);
    setOpen(false);
  }, []);

  return (
    <div className="tool-dd" ref={menuRef}>
      <button
        className={cn('tool-dd-btn', open && 'open')}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Outil actif : ${tool}`}
      >
        <CurrentIcon size={13} />
        <span>{tool}</span>
        <Icons.ChevronDown size={12} />
      </button>

      {open && (
        <div className="tool-dd-menu" role="listbox" aria-label="Choisir un outil">
          {TOOLS.map(t => {
            const ToolIcon = Icons[t.icon];
            const isSelected = t.id === tool;
            return (
              <button
                key={t.id}
                className={cn('tool-dd-item', isSelected && 'on')}
                onClick={() => selectTool(t.id)}
                type="button"
                role="option"
                aria-selected={isSelected}
              >
                <span className="tool-dd-ico"><ToolIcon size={16} /></span>
                <span className="tool-dd-lbl">
                  <span className="tool-dd-t">{t.id}</span>
                  <span className="tool-dd-d">{t.desc}</span>
                </span>
                {isSelected && <Icons.ChevronRight size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const CURRENT_USER = { initials: 'QG', name: 'Quentin Girard' };

function AccountMenu() {
  const router = useRouter();
  const menuId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = anchorEl !== null;

  const closeMenu = useCallback(() => setAnchorEl(null), []);

  function handleLogout() {
    closeMenu();
    router.push('/');
  }

  return (
    <>
      <button
        className="avatar"
        type="button"
        aria-label={`${CURRENT_USER.name} — Ouvrir le menu du compte`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {CURRENT_USER.initials}
      </button>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { 'aria-label': 'Menu du compte', dense: true } }}
      >
        <MenuItem component={Link} href="/dashboard/profil" onClick={closeMenu}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          Mon profil
        </MenuItem>
        <MenuItem component={Link} href="/dashboard/abonnements" onClick={closeMenu}>
          <ListItemIcon>
            <NotificationsNoneIcon fontSize="small" />
          </ListItemIcon>
          Mes abonnements
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Déconnexion
        </MenuItem>
      </Menu>
    </>
  );
}

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-crumb" aria-label="Fil d'Ariane">
        <ProjectDropdown />
        <span className="sep" aria-hidden="true">/</span>
        <ToolDropdown />
      </div>

      <div className="topbar-spacer" />

      <div className="topbar-actions">
        <NotificationsMenu />
        <AccountMenu />
      </div>
    </header>
  );
}
