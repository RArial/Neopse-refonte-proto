import type { Theme } from '@mui/material/styles';
import type { IconName } from '@/components/ui/Icons';

export type ChangelogType = 'evolution' | 'fix' | 'security' | 'comm';

export interface ChangelogEntry {
  type: ChangelogType;
  time: string;
  title: string;
  body: string;
  day: string;
}

type PaletteKey = 'primary' | 'secondary' | 'error' | 'warning';

const PALETTE_KEY: Record<ChangelogType, PaletteKey> = {
  evolution: 'secondary',
  fix: 'error',
  security: 'warning',
  comm: 'primary',
};

export const CHANGELOG_META: Record<ChangelogType, { label: string; icon: IconName }> = {
  evolution: { label: 'Évolution', icon: 'Sparkles' },
  fix: { label: 'Correctif', icon: 'Bug' },
  security: { label: 'Sécurité', icon: 'Shield' },
  comm: { label: 'Communication', icon: 'Megaphone' },
};

export function changelogColor(theme: Theme, type: ChangelogType) {
  const key = PALETTE_KEY[type];
  return key === 'error' || key === 'secondary' ? theme.palette[key].main : theme.palette[key].dark;
}
