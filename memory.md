# Mémoire de projet — Neopse Refonte

> **Lire ce fichier en premier à chaque nouvelle session.**
> Mis à jour à la fin de chaque session de travail.

---

## État du projet

**Phase actuelle :** Initialisation / Setup — ✅ terminée
**Dernière session :** 2026-06-15
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
