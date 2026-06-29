# CLAUDE.md — Neopse Refonte Front-End

Projet : refonte complète du front de l'application **Neopse** (CMS collaboratif pour collectivités). Objectif : rendre l'interface plus belle, plus accessible, et plus fluide pour les utilisateurs finaux.

---

## 0. Règle fondamentale : revue obligatoire après chaque modification

**Après CHAQUE modification de code**, exécuter la checklist suivante avant de déclarer la tâche terminée. Pas de raccourci, pas d'exception.

```
REVUE POST-MODIFICATION
├── [ ] Structure & conventions Next.js respectées ? (Section 1)
├── [ ] Séparation Server / Client correcte ? (Section 2)
├── [ ] Sécurité : aucune faille introduite ? (Section 5)
├── [ ] Accessibilité WCAG 2.2 AA respectée ? (Section 4)
├── [ ] UI/UX conforme aux standards visuels ? (Section 3)
├── [ ] Performance : pas de régression ? (Section 6)
└── [ ] TypeScript strict : aucun `any` introduit ? (Section 7)
```

Si un point échoue → corriger avant de livrer. **Jamais livrer un code qui rate la revue.**

---

## 1. Structure du projet

```
src/
├── app/                        # App Router Next.js
│   ├── (auth)/                 # Route group — pages d'authentification
│   ├── (dashboard)/            # Route group — espace connecté
│   │   ├── layout.tsx          # Layout partagé dashboard
│   │   └── page.tsx
│   ├── api/                    # Route Handlers uniquement
│   │   └── [resource]/
│   │       └── route.ts
│   ├── globals.css             # Tokens CSS globaux
│   ├── layout.tsx              # Root layout (fonts, providers)
│   └── page.tsx                # Homepage
├── components/
│   ├── ui/                     # Primitives réutilisables (boutons, inputs…)
│   └── [feature]/              # Composants métier par domaine
├── lib/                        # Utilitaires purs, helpers, constants
├── hooks/                      # Custom hooks React
├── types/                      # Types TypeScript globaux
└── styles/                     # CSS modules ou variables additionnelles
```

### Conventions de fichiers Next.js obligatoires

| Fichier | Rôle |
|---------|------|
| `page.tsx` | UI de la route — Server Component par défaut |
| `layout.tsx` | Layout partagé persistant entre navigations |
| `loading.tsx` | Skeleton/spinner Suspense — TOUJOURS présent |
| `error.tsx` | Boundary d'erreur par route — TOUJOURS présent |
| `not-found.tsx` | Page 404 par segment |
| `route.ts` | Route Handler API — jamais cohabiter avec `page.tsx` dans le même segment |

---

## 2. Server vs Client Components

### Règle par défaut : Server Component

```
Un composant doit-il être Client ?
│
├── useState / useEffect / event handlers → 'use client'
├── useRouter / usePathname / useSearchParams → 'use client' + Suspense
├── Browser APIs (window, localStorage) → 'use client'
│
└── Tout le reste → Server Component (aucune directive)
```

### Règles strictes

- Ne jamais mettre `'use client'` au niveau `layout.tsx` racine.
- Pattern obligatoire : **Server parent → fetch données → props → Client child**.
- Server Actions (`'use server'`) valident TOUJOURS leurs inputs avec **Zod**.
- `useSearchParams` et `usePathname` dans un Client Component exigent un `<Suspense>` parent.

### Patterns de data fetching

| Besoin | Pattern |
|--------|---------|
| Données statiques | `fetch(url)` — cache par défaut |
| ISR | `fetch(url, { next: { revalidate: 60 } })` |
| Dynamique (par requête) | `fetch(url, { cache: 'no-store' })` |
| Mutation | Server Action `'use server'` + `revalidatePath` / `revalidateTag` |
| Éviter les waterfalls | `Promise.all([...])` ou `<Suspense>` parallèle |

---

## 3. Design & UI/UX

### Bibliothèque de composants : MUI (Material UI)

Ce projet utilise **MUI v6** (`@mui/material`) comme bibliothèque de composants principale.

**Règles d'utilisation MUI :**

- **Toujours** préférer un composant MUI natif avant d'en créer un custom (Button, TextField, Dialog, Snackbar, DataGrid…).
- Le thème centralisé est dans `src/lib/theme.ts` — modifier uniquement là pour propager sur toute l'app. **Jamais surcharger le style inline sur un composant MUI.**
- Les composants MUI qui utilisent `useState`, `useTheme`, `useMediaQuery` doivent avoir `'use client'` en tête de fichier.
- Pour styler des composants MUI, utiliser dans cet ordre de priorité :
  1. `theme.ts` (modification globale via `components` overrides)
  2. `sx` prop (one-off contextuel)
  3. `styled()` d'Emotion (composant dérivé réutilisable)
  4. Tailwind en dernier recours pour le layout uniquement
- **Icônes** : utiliser `@mui/icons-material` en priorité. SVG custom via `SvgIcon` si absent. Jamais d'emoji.
- Locale française déjà configurée dans le thème (`frFR`) — les composants MUI (DatePicker, DataGrid…) l'utilisent automatiquement.

**Tokens du thème Neopse (`src/lib/theme.ts`) :**

| Token | Valeur | Usage |
|-------|--------|-------|
| `primary.main` | `#1E3A5F` (navy) | Actions principales, liens |
| `secondary.main` | `#F5A623` (amber) | Accent Neopse, badges |
| `background.default` | `#F8F9FA` | Fond de page |
| `background.paper` | `#FFFFFF` | Cards, dialogs |
| `borderRadius` | `8px` | Arrondi global |

**Accessibilité MUI :**
- `minHeight: 44px` sur Button et IconButton déjà configuré dans le thème.
- Focus visible activé par défaut — **ne jamais** ajouter `outline: none` sans alternative.
- Utiliser les props d'accessibilité MUI : `aria-label`, `aria-describedby`, `inputProps={{ 'aria-label': '...' }}`.

### Skills à invoquer systématiquement

- **Toute nouvelle page ou composant UI** → invoquer `/ui-ux-pro-max:ui-ux-pro-max`
- **Refonte d'un composant existant** → invoquer `/frontend-design:frontend-design`
- **Animations et transitions** → invoquer `/motion-foundations` puis `/motion-ui`
- **Choix design system / couleurs / typo** → script de génération :

```bash
python3 ~/.claude/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.5.0/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "collectivités administration CMS collaboratif" \
  --design-system -p "Neopse"
```

### Standards visuels obligatoires

- **Icônes** : `@mui/icons-material` en priorité, sinon SVG via `SvgIcon`. Zéro emoji comme icône UI.
- **Typographie** : base 16px minimum, line-height ≥ 1.5 pour le body.
- **Couleurs** : tokens CSS sémantiques (`--color-primary`, `--color-surface`…) — jamais de hex hardcodé dans les composants.
- **Espacement** : système 4px/8px uniquement (Tailwind spacing scale).
- **Responsive** : mobile-first, breakpoints `sm(640) / md(768) / lg(1024) / xl(1280)`.
- **Dark mode** : chaque composant fonctionne en `dark:` sans régression de contraste.
- **Animations** : durée 150–300ms, `transform`/`opacity` uniquement, `prefers-reduced-motion` respecté.

### Checklist UI pre-livraison

- [ ] Contraste ≥ 4.5:1 (texte normal) / 3:1 (texte large et UI)
- [ ] Touch targets ≥ 44×44px
- [ ] États interactifs visibles : hover, focus, active, disabled
- [ ] Skeletons pour tout chargement > 300ms
- [ ] Empty states informatifs avec action proposée
- [ ] Toasts auto-dismiss 3–5s avec `aria-live="polite"`
- [ ] Un seul CTA primaire par vue

---

## 4. Accessibilité (WCAG 2.2 Level AA — OBLIGATOIRE)

### Skills à invoquer

- **Tout composant interactif** → vérifier contre le skill `/accessibility`
- **Formulaires** → valider labels, gestion des erreurs, focus management

### Règles non négociables (POUR)

```
Perceivable  : alt text, contraste 4.5:1, pas d'info par couleur seule
Operable     : clavier complet, focus visible 2–4px, target ≥ 24px CSS
Understandable : labels visibles, erreurs descriptives + comment corriger
Robust       : HTML sémantique, ARIA correct, role/name/value
```

### Implémentation obligatoire

| Élément | Requis |
|---------|--------|
| Images décoratives | `alt=""` |
| Images informatives | `alt="description précise"` |
| Boutons icon-only | `aria-label="..."` |
| Champs de formulaire | `<label htmlFor>` ou `aria-labelledby` |
| Erreurs formulaire | `aria-describedby` + `role="alert"` |
| Navigation | `<nav aria-label="...">`  |
| Régions principales | `<main>`, `<header>`, `<footer>` |
| Ordre de heading | `h1` → `h2` → `h3` sans sauter de niveau |
| Contenu dynamique | `aria-live="polite"` ou `"assertive"` |
| Modales | Focus piégé + `Escape` ferme + focus retour au déclencheur |
| Skip link | Premier élément de page : "Aller au contenu principal" |

### Tests accessibilité avant livraison

1. Navigation clavier complète (Tab, Shift+Tab, Enter, Space, Escape, flèches)
2. Contrastes vérifiés
3. Attributs ARIA présents et corrects
4. `prefers-reduced-motion` : aucune animation bloquante

---

## 5. Sécurité du code

### Règles absolues — zéro tolérance

```
XSS        : jamais dangerouslySetInnerHTML sauf contenu sanitisé (DOMPurify)
Injection  : TOUJOURS paramètres préparés pour les requêtes DB
CSRF       : Server Actions Next.js protègent nativement — ne pas bypasser
Auth       : vérifier session côté SERVEUR dans chaque Route Handler et Server Action
Secrets    : jamais de clé API ou token dans le code client
Validation : Zod obligatoire sur TOUTES les entrées externes
```

### Checklist sécurité post-modification

- [ ] Toute entrée utilisateur validée avec **Zod** avant traitement
- [ ] Aucun secret dans du code client (`'use client'`)
- [ ] Variables `NEXT_PUBLIC_` uniquement si nécessité côté client confirmée
- [ ] Authentification vérifiée côté serveur
- [ ] `dangerouslySetInnerHTML` absent ou contenu sanitisé avec DOMPurify
- [ ] Aucune donnée sensible dans les logs côté client

### Headers de sécurité (`next.config.ts`)

```typescript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

Ces headers doivent être appliqués via `headers()` dans `next.config.ts`.

---

## 6. Performance

- **Images** : TOUJOURS `next/image` — jamais `<img>`. `width`, `height`, `alt` obligatoires. `priority` pour le LCP.
- **Fonts** : TOUJOURS `next/font` — jamais de `<link>` Google Fonts dans le HTML.
- **Scripts tiers** : TOUJOURS `next/script` avec `strategy="lazyOnload"` ou `"afterInteractive"`.
- **Composants lourds** : `dynamic(() => import(...), { ssr: false })`.
- **Listes longues** : virtualiser dès 50+ éléments.
- **Core Web Vitals cibles** : CLS < 0.1, LCP < 2.5s, INP < 200ms.

---

## 7. TypeScript

- **Strict mode activé** dans `tsconfig.json` — ne jamais désactiver.
- **Zéro `any`** : utiliser `unknown` + type guard, ou typer correctement.
- **Interface pour les props** de chaque composant.
- **Types pour Server Actions** : paramètres et retour toujours typés.

```typescript
// ✅ Correct
interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

// ❌ Interdit
const myFunc = (data: any) => { ... }
```

---

## 8. Conventions de code

### Composants

- Un composant = un fichier. Nom en PascalCase.
- Export nommé uniquement (sauf `page.tsx` et `layout.tsx` qui utilisent default export).
- Props déstructurées dans la signature.
- Commentaires uniquement pour le **pourquoi** — jamais pour expliquer ce que fait le code.

### CSS / Tailwind

- Classes Tailwind uniquement — pas de style inline sauf valeurs dynamiques calculées.
- Tokens CSS (`--`) pour les valeurs qui changent entre thèmes.
- `cn()` (clsx + tailwind-merge) pour les classes conditionnelles.
- Pas de `!important`.

### Naming

| Type | Convention |
|------|-----------|
| Composants | `PascalCase.tsx` |
| Hooks | `useNomDuHook.ts` |
| Utils / lib | `camelCase.ts` |
| Types / interfaces | `PascalCase` |
| Constantes | `SCREAMING_SNAKE_CASE` |

---

## 9. Workflow de développement

### Avant de commencer une tâche UI

1. Invoquer `/ui-ux-pro-max:ui-ux-pro-max` pour les recommandations de design
2. Générer le design system si nouvelle page (`--design-system`)
3. Vérifier si un composant `src/components/ui/` peut être réutilisé

### Avant de livrer du code

1. `npm run lint` — zéro erreur
2. `npx tsc --noEmit` — zéro erreur TypeScript
3. Revue manuelle de la checklist Section 0
4. Test navigation clavier du composant modifié

### Skills à invoquer selon le contexte

| Contexte | Skill |
|----------|-------|
| Nouvelle page / layout | `/ui-ux-pro-max:ui-ux-pro-max` + `/frontend-design:frontend-design` |
| Composant interactif | `/accessibility` |
| Animation / transition | `/motion-foundations` + `/motion-ui` |
| Patterns Next.js | `/vercel:nextjs` + `/nextjs-best-practices` |
| Revue React/TSX | `/vercel:react-best-practices` |
| Patterns populaires | `/popular-web-designs` |

---

## 10. Mémoire de session (memory.md)

Ce projet maintient un fichier `memory.md` à la racine qui **doit être mis à jour à la fin de chaque session de travail**.

### Règle obligatoire en fin de session

Avant de clore une session, mettre à jour `memory.md` avec :
1. **Ce qui a été fait** : composants créés, pages modifiées, décisions prises
2. **État actuel du projet** : ce qui fonctionne, ce qui est en cours, ce qui est bloqué
3. **Décisions de design** : choix retenus et pourquoi
4. **Prochaines étapes** : tâches à reprendre à la session suivante

`memory.md` est le point d'entrée de chaque nouvelle session — le lire en premier avant de commencer à travailler.

---

## 12. Objectif de la refonte

Refaire l'interface front de **Neopse** pour :
- Une UI **moderne et esthétique** adaptée à des agents de collectivités
- Une **accessibilité exemplaire** (cible : WCAG 2.2 AA intégrale)
- Une **expérience fluide** pour des profils non-techniques
- Un **design system cohérent** via tokens CSS centralisés

Chaque décision de design sert l'utilisateur final, pas la complexité technique.
