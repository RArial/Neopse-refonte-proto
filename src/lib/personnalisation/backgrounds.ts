export interface TextureOption {
  id: string;
  label: string;
}

/** Bibliothèque de textures sélectionnables pour un fond graphique — à compléter avec de vraies
 * ressources plus tard ; le mécanisme (mode + dropdown) est prêt à les recevoir dès qu'elles existent. */
export const TEXTURE_OPTIONS: TextureOption[] = [];

export function hasTextureOptions(): boolean {
  return TEXTURE_OPTIONS.length > 0;
}
