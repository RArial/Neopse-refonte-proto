'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CATALOG_MODULES, DISCOVER_MODULES, getCatalogModule } from '@/lib/catalogModules';
import { containerOf } from '@/lib/moduleTree';
import { GOOGLE_SHORTCUT_ID, NAV_TREE, ROOT_THEMATIQUE_ID, SEED_MODULES } from '@/lib/navTree';
import type { AddedModule, CatalogModule, ModuleDropContainer, NavChildNode, NavTreeNode, TopLevelItem } from '@/types/content';

type AddModuleInput = Omit<AddedModule, 'id'>;
type UpdateModuleInput = Partial<Omit<AddedModule, 'id'>>;
type AddTabInput = { label: string; thumbnailUrl?: string };

interface ContenuStore {
  modules: AddedModule[];
  catalogModules: CatalogModule[];
  discoverModules: CatalogModule[];
  navTree: NavTreeNode[];
  topLevelItems: TopLevelItem[];
  draftModules: NavChildNode[];
  archivedModules: NavChildNode[];
  addModule: (input: AddModuleInput) => string;
  updateModule: (id: string, patch: UpdateModuleInput) => void;
  archiveModule: (id: string) => void;
  restoreModule: (id: string) => void;
  deleteModule: (id: string) => void;
  moveModuleToContainer: (id: string, container: ModuleDropContainer, targetIndex: number) => void;
  addTab: (input: AddTabInput) => string;
  moveTab: (id: string, targetIndex: number) => void;
  deleteTab: (id: string) => void;
  unlockDiscoverModule: (id: string) => void;
}

const ContenuContext = createContext<ContenuStore | null>(null);

function toNavChildNode(added: AddedModule): NavChildNode {
  return {
    id: added.id,
    label: added.label,
    typeLabel: added.typeLabel,
    enabled: added.enabled,
    kind: added.kind,
    icon: added.icon ?? getCatalogModule(added.catalogModuleId)?.icon,
  };
}

/** Regroupe un ensemble de modules publiés en arbre, selon leur `parentPageId` : un module rattaché à une page parente devient un enfant de celle-ci plutôt qu'un simple frère dans son onglet (ou à la racine). */
function buildModuleTree(scopedModules: AddedModule[]): NavChildNode[] {
  const byId = new Map(scopedModules.map((mod) => [mod.id, mod]));
  const childrenByParentId = new Map<string, AddedModule[]>();
  const roots: AddedModule[] = [];

  for (const mod of scopedModules) {
    if (mod.parentPageId && byId.has(mod.parentPageId)) {
      const siblings = childrenByParentId.get(mod.parentPageId) ?? [];
      siblings.push(mod);
      childrenByParentId.set(mod.parentPageId, siblings);
    } else {
      roots.push(mod);
    }
  }

  function toNode(mod: AddedModule): NavChildNode {
    const kids = childrenByParentId.get(mod.id);
    return { ...toNavChildNode(mod), children: kids?.map(toNode) };
  }

  return roots.map(toNode);
}

/** Identifiants de tous les descendants (via `parentPageId`) d'un module donné. */
function collectDescendantIds(modules: AddedModule[], rootId: string): Set<string> {
  const childrenByParentId = new Map<string, string[]>();
  for (const mod of modules) {
    if (!mod.parentPageId) continue;
    const siblings = childrenByParentId.get(mod.parentPageId) ?? [];
    siblings.push(mod.id);
    childrenByParentId.set(mod.parentPageId, siblings);
  }

  const result = new Set<string>();
  const queue = [...(childrenByParentId.get(rootId) ?? [])];
  while (queue.length > 0) {
    const id = queue.shift();
    if (id === undefined || result.has(id)) continue;
    result.add(id);
    queue.push(...(childrenByParentId.get(id) ?? []));
  }
  return result;
}

export function ContenuProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<AddedModule[]>(SEED_MODULES);
  const [tabs, setTabs] = useState<NavTreeNode[]>(NAV_TREE);
  // Le lien Google fourni par défaut est initialement placé en dernière position de la racine, mais reste
  // ensuite déplaçable/imbricable exactement comme un module.
  const [rootOrder, setRootOrder] = useState<string[]>(() => [
    ...NAV_TREE.filter((node) => node.kind === 'tab').map((node) => node.id),
    GOOGLE_SHORTCUT_ID,
  ]);
  const [unlockedDiscoverIds, setUnlockedDiscoverIds] = useState<ReadonlySet<string>>(() => new Set());

  const unlockDiscoverModule = useCallback((id: string) => {
    setUnlockedDiscoverIds((prev) => new Set(prev).add(id));
  }, []);

  const addTab = useCallback((input: AddTabInput) => {
    const id = `tab-${Date.now()}`;
    setTabs((prev) => [
      ...prev,
      { id, label: input.label, typeLabel: 'Onglet thématique', kind: 'tab', enabled: true, thumbnailUrl: input.thumbnailUrl },
    ]);
    setRootOrder((prev) => [...prev, id]);
    return id;
  }, []);

  const deleteTab = useCallback((id: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    setRootOrder((prev) => prev.filter((slotId) => slotId !== id));
  }, []);

  const addModule = useCallback((input: AddModuleInput) => {
    const id = input.catalogModuleId ? `${input.catalogModuleId}-${Date.now()}` : `${input.kind}-${Date.now()}`;
    setModules((prev) => [...prev, { ...input, id }]);
    // Un élément publié directement à la racine (hors de tout onglet et de toute page parente) doit rejoindre
    // l'ordre de premier niveau pour apparaître dans la structure de navigation, comme le ferait un onglet.
    if (input.status === 'published' && input.thematiqueId === ROOT_THEMATIQUE_ID && !input.parentPageId) {
      setRootOrder((prev) => [...prev, id]);
    }
    return id;
  }, []);

  const updateModule = useCallback((id: string, patch: UpdateModuleInput) => {
    setModules((prev) => prev.map((mod) => (mod.id === id ? { ...mod, ...patch } : mod)));
  }, []);

  const archiveModule = useCallback((id: string) => {
    setModules((prev) => prev.map((mod) => (mod.id === id ? { ...mod, status: 'archived' } : mod)));
  }, []);

  const restoreModule = useCallback((id: string) => {
    setModules((prev) => prev.map((mod) => (mod.id === id ? { ...mod, status: 'published' } : mod)));
  }, []);

  const deleteModule = useCallback((id: string) => {
    setModules((prev) => prev.filter((mod) => mod.id !== id));
  }, []);

  /** Déplace un module vers un conteneur donné (racine, onglet thématique ou page parente), à une position précise parmi ses futurs frères. */
  const moveModuleToContainer = useCallback((id: string, container: ModuleDropContainer, targetIndex: number) => {
    setModules((prev) => {
      const dragged = prev.find((mod) => mod.id === id);
      if (!dragged) return prev;

      let newThematiqueId: string;
      let newParentPageId: string;
      let targetContainerId: string;
      if (container.kind === 'root') {
        newThematiqueId = ROOT_THEMATIQUE_ID;
        newParentPageId = '';
        targetContainerId = ROOT_THEMATIQUE_ID;
      } else if (container.kind === 'tab') {
        newThematiqueId = container.tabId;
        newParentPageId = '';
        targetContainerId = container.tabId;
      } else {
        const parentModule = prev.find((mod) => mod.id === container.moduleId);
        if (!parentModule) return prev;
        newThematiqueId = parentModule.thematiqueId;
        newParentPageId = container.moduleId;
        targetContainerId = container.moduleId;
      }

      const descendantIds = collectDescendantIds(prev, id);
      const others = prev.filter((mod) => mod.id !== id);
      const updatedDragged: AddedModule = { ...dragged, thematiqueId: newThematiqueId, parentPageId: newParentPageId };

      // Si le module change d'onglet, tout son sous-arbre (pages rattachées, et leurs propres pages rattachées…) le suit.
      const reparented =
        newThematiqueId === dragged.thematiqueId
          ? others
          : others.map((mod) => (descendantIds.has(mod.id) ? { ...mod, thematiqueId: newThematiqueId } : mod));

      const belongsToContainer = (mod: AddedModule) => mod.status === 'published' && containerOf(mod) === targetContainerId;

      const targetGroup = reparented.filter(belongsToContainer);
      const clampedIndex = Math.max(0, Math.min(targetIndex, targetGroup.length));
      const newGroup = [...targetGroup];
      newGroup.splice(clampedIndex, 0, updatedDragged);

      const result: AddedModule[] = [];
      let inserted = false;
      for (const mod of reparented) {
        if (belongsToContainer(mod)) {
          if (!inserted) {
            result.push(...newGroup);
            inserted = true;
          }
          continue;
        }
        result.push(mod);
      }
      if (!inserted) result.push(...newGroup);

      return result;
    });

    setRootOrder((prev) => {
      const without = prev.filter((slotId) => slotId !== id);
      if (container.kind !== 'root') return without;
      const clampedIndex = Math.max(0, Math.min(targetIndex, without.length));
      const next = [...without];
      next.splice(clampedIndex, 0, id);
      return next;
    });
  }, []);

  /** Réordonne un onglet thématique parmi les autres entrées de premier niveau (onglets et modules racine). */
  const moveTab = useCallback((id: string, targetIndex: number) => {
    setRootOrder((prev) => {
      const without = prev.filter((slotId) => slotId !== id);
      const clampedIndex = Math.max(0, Math.min(targetIndex, without.length));
      const next = [...without];
      next.splice(clampedIndex, 0, id);
      return next;
    });
  }, []);

  const catalogModules = useMemo(() => {
    const unlockedDiscover = DISCOVER_MODULES.filter((mod) => unlockedDiscoverIds.has(mod.id));
    return [...CATALOG_MODULES, ...unlockedDiscover].filter(
      (mod) => !modules.some((added) => added.catalogModuleId === mod.id),
    );
  }, [modules, unlockedDiscoverIds]);

  const discoverModules = useMemo(
    () => DISCOVER_MODULES.filter((mod) => !unlockedDiscoverIds.has(mod.id)),
    [unlockedDiscoverIds],
  );

  const navTree = useMemo(() => {
    return tabs.map((node) => {
      const tabModules = modules.filter((added) => added.thematiqueId === node.id && added.status === 'published');
      if (tabModules.length === 0) return node;
      return { ...node, defaultOpen: true, children: buildModuleTree(tabModules) };
    });
  }, [modules, tabs]);

  const rootModuleNodesById = useMemo(() => {
    const rootModules = modules.filter((added) => added.thematiqueId === ROOT_THEMATIQUE_ID && added.status === 'published');
    return new Map(buildModuleTree(rootModules).map((node) => [node.id, node]));
  }, [modules]);

  const topLevelItems = useMemo<TopLevelItem[]>(() => {
    const tabsById = new Map(navTree.filter((node) => node.kind === 'tab').map((node) => [node.id, node]));
    const items: TopLevelItem[] = [];
    for (const id of rootOrder) {
      const tab = tabsById.get(id);
      if (tab) {
        items.push({ type: 'tab', node: tab });
        continue;
      }
      const moduleNode = rootModuleNodesById.get(id);
      if (moduleNode) items.push({ type: 'module', node: moduleNode });
    }
    return items;
  }, [rootOrder, navTree, rootModuleNodesById]);

  const draftModules = useMemo(
    () => modules.filter((added) => added.status === 'draft').map(toNavChildNode),
    [modules],
  );

  const archivedModules = useMemo(
    () => modules.filter((added) => added.status === 'archived').map(toNavChildNode),
    [modules],
  );

  const value = useMemo<ContenuStore>(
    () => ({
      modules,
      catalogModules,
      discoverModules,
      navTree,
      topLevelItems,
      draftModules,
      archivedModules,
      addModule,
      updateModule,
      archiveModule,
      restoreModule,
      deleteModule,
      moveModuleToContainer,
      addTab,
      moveTab,
      deleteTab,
      unlockDiscoverModule,
    }),
    [
      modules,
      catalogModules,
      discoverModules,
      navTree,
      topLevelItems,
      draftModules,
      archivedModules,
      addModule,
      updateModule,
      archiveModule,
      restoreModule,
      deleteModule,
      moveModuleToContainer,
      addTab,
      moveTab,
      deleteTab,
      unlockDiscoverModule,
    ],
  );

  return <ContenuContext.Provider value={value}>{children}</ContenuContext.Provider>;
}

export function useContenuStore() {
  const store = useContext(ContenuContext);
  if (!store) {
    throw new Error('useContenuStore doit être utilisé à l’intérieur de <ContenuProvider>.');
  }
  return store;
}
