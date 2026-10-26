# Mémoire de projet — Neopse Refonte

> **Lire ce fichier en premier à chaque nouvelle session.**
> Mis à jour à la fin de chaque session de travail.

---

## État du projet

**Phase actuelle :** Initialisation / Setup — ✅ terminée
**Dernière session :** 2026-10-26 (modale médiathèque image)
**Statut :** Projet prêt, aucune page métier encore créée
**Prochain objectif :** Identifier les pages à refaire, créer le layout Sidebar + Topbar

---

## Session 2026-06-15 — Initialisation du projet

### Ce qui a été fait

**Infrastructure :**
- Projet Next.js 16 scaffoldé avec TypeScript, Tailwind v4, ESLint, App Router (`src/` directory)
- `package.json` renommé `neopse-refont`
- `next.config.ts` configuré avec headers de sécurité (X-Frame-Options, CSP, HSTS, etc.)
- Métadonnées racine mises à jour (titre Neopse, `lang="fr"`)

**Bibliothèques installées :**
- `@mui/material` + `@mui/icons-material` — bibliothèque de composants principale
- `@emotion/react` + `@emotion/styled` + `@emotion/server` + `@emotion/cache` — moteur CSS de MUI
- `clsx` + `tailwind-merge` — utilitaire `cn()` pour classes conditionnelles

**Fichiers créés :**
- `src/lib/theme.ts` — thème MUI centralisé (navy `#1E3A5F`, amber `#F5A623`, locale `frFR`)
- `src/lib/utils.ts` — helper `cn()`
- `src/components/layout/MuiProvider.tsx` — ThemeProvider + CssBaseline Client Component
- `src/components/layout/SkipLink.tsx` — skip link accessibilité WCAG 2.4.1
- `src/app/layout.tsx` — MuiProvider et SkipLink intégrés, `<main id="main-content">`
- `CLAUDE.md` — règles du projet (12 sections)
- `memory.md` — ce fichier

**Structure de dossiers créée :**
```
src/
├── app/
├── components/
│   ├── ui/         (vide — à remplir)
│   └── layout/     (SkipLink, MuiProvider)
├── lib/            (theme.ts, utils.ts)
├── hooks/          (vide)
├── types/          (vide)
└── styles/         (vide)
```

### Décisions prises

| Décision | Raison |
|----------|--------|
| MUI comme bibliothèque de composants | Ecosystème complet, accessibilité native, locale frFR |
| Tailwind en complément de MUI | Layout et spacing — MUI gère les composants |
| Thème centralisé dans `lib/theme.ts` | Un seul endroit pour modifier l'identité visuelle |
| Navy `#1E3A5F` + Amber `#F5A623` | Tokens de l'identité Neopse existante |
| WCAG 2.2 AA obligatoire | Utilisateurs collectivités, obligation légale |

### Correctif TypeScript

- `MuiFocusVisible` n'existe pas comme clé dans `Components<Theme>` MUI v6 → supprimé du thème. Le focus visible est géré par MUI nativement.

### TypeScript & Lint — état final

- `npx tsc --noEmit` : ✅ zéro erreur
- `npm run lint` : ✅ zéro erreur

---

## Session 2026-10-26 — Modale médiathèque image (proto)

Brief : `docs/modale-mediatheque.md` (+ `docs/neopse-modale-image-reponses.pdf`). Démo : `/demo/mediatheque`.

### Ce qui a été fait
- Une seule modale `ImagePickerDialog`, configurée par le champ appelant (`ImagePickerConfig` : mode single/multiple, ratio, recommandation, altText ask/decorative, image actuelle + recadrage actuel).
- `MediaLibraryProvider` (en mémoire, images de démo SVG générées) expose `openImagePicker(config) → Promise<PickedImage[] | null>` et monte une seule instance de modale (remontée à chaque ouverture → état propre).
- Logique pure dans `src/lib/mediaLibrary/` (reducer, tri, validation, crop, seed) ; import simulé dans `src/hooks/useSimulatedUploads.ts`.
- Import : bouton + glisser-déposer, destination = dossier affiché, état par carte (progression, refus, doublon nom+poids), sélection auto, recherche vidée en fin de lot, nouvelles images épinglées en tête.
- Recadrage = étape 2 de la même modale, cadre maximal centré, souris + clavier (flèches, Maj, +/−), molette sur l'image, pivoter/retourner/réinitialiser, aperçu. Stocké en coordonnées (`CropArea`), rendu en CSS.
- Page de démo avec les 4 champs du brief. Aucun écran existant n'a été branché (décision validée).

### Décisions
- **Contraste** : `primary.main` NON modifié. Nouveau token `palette.primaryStrong` (`#00696b` clair, teal[300] + texte foncé en sombre) appliqué à la modale via `withStrongPrimary` (ThemeProvider imbriqué). Bascule globale à décider plus tard.
- Mode multiple + `altText: 'ask'` : le panneau de droite affiche l'image active de la sélection (clic dans la bande d'ordre) pour saisir le texte alternatif — interprétation du brief, qui ne prévoit le panneau qu'en single.
- Recherche limitée au dossier affiché. Clic sur le fond de la modale ne ferme pas (Échap oui).
- Valeurs provisoires : 5 Mo max, JPG/PNG, dossier par défaut « Site ».

### Révision 2 (même jour, après revue) — brief mis à jour en conséquence
- **Import direct depuis le champ** (cas principal) : `FieldDropZone` + `useFieldUploads` ; erreurs/doublons affichés dans le champ (`FieldUploadStatus`) ; la modale ne s'ouvre que via « ou choisir parmi les images du site ».
- **Destination automatique** : `config.folder` ; `ensureFolder()` crée le dossier sous « Site » (seule racine : Actualités, Agenda, Apparence…). Les images existantes ne bougent jamais.
- **Modale** : ouverture sur « Toutes les images », dossiers = filtres, recherche globale, grille 5 colonnes / vignettes 110 px, intertitres par mois (tri chronologique) + « Importées à l'instant », bandeau d'import unique qui s'efface après 4 s.
- **Recadrage automatique** : bouton toujours « Utiliser cette image » ; cadre max centré en surimpression dans le panneau + « Ajuster le cadrage » ; « Valider le recadrage » insère et ferme (décision validée) ; « Modifier le cadrage » depuis le champ ouvre directement l'étape 2 (`openImagePicker(config, { startInCrop: true })`).
- `withStrongPrimary` appliqué aussi à la page de démo (boutons pleins hors modale) — validé, à revoir lors de la bascule globale du primaire.
- « Importer des images » dans la modale : `outlined` (correction après revue, le seul bouton plein est le CTA du pied). Dans le champ, « Importer une image » reste plein.
- Tests Playwright : avertissement d'hydratation `caret-color` = artefact Playwright (capture avant hydratation), pas un bug du code.
- La ligne d'infos du panneau passe à la ligne entre les segments (body2 dans 260 px) : jugé acceptable.

### Prochaines étapes
- Faire valider la démo ; trancher la bascule globale du primaire vers `#00696B`.
- Réponses devs attendues : WebP, poids max, stockage du recadrage, référencement par id/nom, dossier par défaut.
- Brancher la modale sur les vrais champs (vignettes, blocs Images/Diaporama, fonds de personnalisation) une fois validée.

---

## Prochaines étapes

- [ ] Identifier les pages/vues à refaire en priorité (demander à Quentin)
- [ ] Créer le layout principal (Sidebar + Topbar) avec MUI
- [ ] Implémenter les premiers composants dans `src/components/ui/`
- [ ] Définir la palette complète dark mode dans `theme.ts`
- [ ] Installer Zod pour la validation des formulaires

---

## Décisions de design system

| Élément | Valeur |
|---------|--------|
| Couleur primaire | `#1E3A5F` (navy) |
| Couleur accent | `#F5A623` (amber) |
| Border radius | `8px` |
| Font | Geist Sans (variable CSS `--font-geist-sans`) |
| Breakpoints | sm 640 / md 768 / lg 1024 / xl 1280 |
| Touch target min | 44×44px (configuré dans thème MUI) |

---

## Points de vigilance

- MUI utilise Emotion (CSS-in-JS) — les composants MUI **nécessitent** `'use client'`
- Ne pas mélanger `sx` prop MUI et classes Tailwind sur le même élément pour les couleurs/spacing (conflits)
- Le thème MUI ne connaît pas les variables CSS Tailwind — les tokens doivent être définis dans `theme.ts` ET dans `globals.css`
