# Brief — Modale médiathèque image (Neopse refonte)

> À lire en entier avant de coder. Commence par explorer le proto (structure, `theme.ts`, composants existants, éditeurs d'actualité / d'apparence), puis **propose un plan et attends validation** avant d'écrire du code. Commit avant toute modification importante.

## Contexte

Dans le Neopse actuel, choisir ou importer une image passe par une modale générique qui ignore le champ qui l'appelle. Problèmes relevés en test :

- Elle annonce « une ou plusieurs images » et propose « Tout sélectionner » même pour un champ à image unique ; à l'inverse, le diaporama (« Ajouter des images ») n'accepte qu'une image par passage.
- Après un import, l'image n'est ni sélectionnée ni mise en avant : il faut la chercher dans la grille (triée par nom). La destination de l'import n'est pas claire.
- Une fenêtre « Compte-rendu » s'ouvre par-dessus la modale après l'import ; les erreurs de format apparaissent derrière elle.
- Le recadrage s'ouvre dans une troisième modale ; ses contrôles sont hors écran et il faut défiler pour valider.
- Recherche conservée d'une ouverture à l'autre, « Je filtre par » qui est en fait un tri, noms tronqués indiscernables, doublons non signalés.

Cible : agents de petites communes, non techniques, usage occasionnel. Priorité à la simplicité et au rassurant.

## Principe

**Un seul composant de modale, configuré par le champ qui l'ouvre.** Pas de modales différentes par contexte. La structure ne change pas ; seul le comportement change.

Configuration suggérée (à adapter aux conventions du proto) :

```ts
type ImagePickerConfig = {
  mode: 'single' | 'multiple';
  context: string;            // libellé affiché, ex. « Vignette de l'actualité »
  ratio?: number;             // ex. 4/3 ; absent = pas de recadrage
  recommendation?: string;    // ex. « 1200 × 900 px » ; optionnel, affiché seulement si renseigné
  altText: 'ask' | 'decorative';
  currentImageId?: string;    // image actuellement en place
};
```

## Structure de la modale

Dialog MUI, hauteur fixe. **En-tête, barre d'outils et pied ne défilent pas ; seule la zone d'images défile.**

1. **En-tête** : titre (« Choisir une image » / « Choisir des images »), puce de contexte, puce de format (ratio + recommandation si renseignée), bouton fermer.
2. **Barre d'outils** : recherche par nom, tri, bascule grille/liste, bouton « Importer des images ».
3. **Corps** : arborescence des dossiers à gauche ; grille ou liste au centre ; en mode `single`, panneau « Image sélectionnée » à droite (aperçu, nom complet, dimensions, poids, date, texte alternatif si `altText: 'ask'`).
4. **Pied** : formats acceptés et poids max (`[TAILLE MAX]`, valeur à confirmer), « Annuler », bouton principal.

## Comportements

### Ouverture
- Recherche vide, dossier par défaut, tri par défaut « Plus récentes d'abord ».
- L'image actuelle (`currentImageId`) porte un badge « Actuelle ». Elle **n'est pas** présélectionnée ; on peut la re-choisir (utile pour la recadrer à nouveau).

### Mode `single`
- Carte avec bouton radio ; un clic remplace la sélection.
- Bouton principal « Utiliser cette image », désactivé tant que rien n'est sélectionné.
- Pas de « Tout sélectionner ».

### Mode `multiple` (diaporama)
- Cases à cocher affichant le **numéro d'ordre** de sélection.
- Compteur « N images sélectionnées », « Tout sélectionner dans « dossier » », « Tout désélectionner » (si sélection non vide).
- Bande « Ordre d'ajout » en bas : miniatures numérotées, retrait possible.
- Bouton principal « Ajouter N images ».

### Import
- Par le bouton ou par glisser-déposer sur la zone d'images. Le sélecteur de fichiers accepte plusieurs fichiers et filtre sur les formats acceptés (`accept`).
- **Destination = dossier affiché**, écrit avant (« Glissez des images ici pour les importer dans **Site** ») et pendant (bandeau « Import dans **test** · 2 sur 4 terminées »). Si une recherche est active, elle est vidée à la fin pour montrer le dossier.
- Les fichiers importés apparaissent **en tête de grille** avec un badge « Nouvelle ». État affiché **sur chaque carte** : progression, succès, refus, doublon. **Aucune fenêtre secondaire.**
- Mode `single` : la dernière image valide importée est **sélectionnée automatiquement**. Mode `multiple` : toutes les images valides sont ajoutées à la sélection.
- **Format refusé** (ex. WebP par glisser-déposer) : carte en erreur avec la raison et l'action (« Format WebP non accepté. Convertissez-la en JPG ou PNG. », bouton « Retirer »).
- **Doublon** (même fichier déjà présent) : carte en avertissement « Cette image est déjà dans la médiathèque », actions « Utiliser l'existante » / « Importer quand même ». Pas de « Remplacer ». Dans le proto, simuler la détection par nom + poids.
- Proto front-only : conserver les fichiers importés en mémoire (object URL) le temps de la session, sans backend.

### Tri
- Grille : menu de tri (Plus récentes, Plus anciennes, Nom A→Z, Nom Z→A, Poids).
- Liste : tri par clic sur l'en-tête de colonne (Nom, Dimensions, Poids, Ajoutée le), flèche de sens sur la colonne active, `aria-sort`. La liste affiche miniature et dimensions.
- Noms de fichier : 2 lignes max, nom complet au survol et dans le panneau de détail.

### Recadrage (si `ratio` défini)
- **Étape 2 de la même modale**, pas une nouvelle modale. Bouton « Changer d'image » pour revenir à l'étape 1. Indicateur d'étape (1 Choisir · 2 Recadrer).
- Cadre au ratio imposé, **couvrant par défaut la plus grande zone possible**, centré.
- On glisse le cadre directement ; équivalent clavier obligatoire (flèches quand le cadre a le focus).
- Panneau de contrôles toujours visible à droite : zoom (curseur), « Pivoter de 90° », « Retourner », « Réinitialiser », petit aperçu du rendu. Molette = zoom uniquement quand le pointeur est sur l'image.
- Libellé de format : « 4:3, imposé par l'emplacement ». **Ne pas** mentionner de numéro de maquette.
- Bouton « Valider le recadrage » dans le pied fixe.

### Texte alternatif — décidé par le champ, pas par l'image
- `altText: 'decorative'` (fonds de maquette, bandeau, vignettes de liste) : aucun champ, l'image est rendue avec `alt=""`.
- `altText: 'ask'` (bloc Images du contenu, diaporama) : champ « Texte alternatif » dans le panneau de l'image sélectionnée. Le texte est **enregistré avec l'image dans la médiathèque** et réutilisé partout (le dire sous le champ). Non bloquant : si vide, avertissement « Pas encore de texte alternatif… » mais validation possible.
- Optionnel, pas en V1 : dans le bloc Images, champ texte alternatif propre à cet usage qui remplace celui de la médiathèque.

## Champs déclencheurs à brancher pour la démo

Au moins un de chaque configuration, pour montrer la modale qui s'adapte :

| Champ | mode | ratio | altText |
|---|---|---|---|
| Vignette d'actualité | single | 4:3 | decorative |
| Bloc Images (contenu) | single | — | ask |
| Diaporama | multiple | — | ask |
| Fond d'en-tête (apparence) | single | — | decorative |

Réutiliser les écrans existants du proto quand ils existent ; sinon une page de démo simple avec ces quatre champs.

## Contraintes visuelles et accessibilité

- MUI v5, thème `theme.ts` comme source unique ; pas de styles en dur hors thème.
- **Contraste** : le teal `#47A5B6` avec du texte blanc = 2,87:1, insuffisant (RGAA 4,5:1 ; 3:1 pour une bordure de sélection). Utiliser `#00696B` (6,5:1) pour boutons pleins, liens et sélection ; `#47A5B6` réservé aux fonds teintés. Proposer la modification de `theme.ts`, ne pas l'appliquer sans validation.
- Vrais `button`, `input`, `label` ; `aria-label` sur les boutons-icônes ; focus géré à l'ouverture/fermeture ; Échap ferme.
- Libellés existants conservés quand ils sont connus des utilisateurs, sauf ceux identifiés comme faux (« Je filtre par », « ajouter un par un »).

## Hors périmètre — ne pas toucher

- Recette de la maquette (aperçu non mis à jour, accordéons, réglages de position du fond).
- Harmonisation entre les parcours Actualités / Agenda, et des libellés du site en général.
- Indicateur d'espace utilisé.
- Recommandations de format pour chaque emplacement (seul l'emplacement dans l'en-tête est prévu).

## Questions ouvertes (côté devs, ne pas bloquer le proto)

1. Les modales « images » et « fichiers » sont-elles présentes en même temps dans la page actuelle ? (bugs non reproduits : recadrage au-dessus de « Sélectionner des fichiers », « Terminer » inopérant, recherche muette)
2. Le recadrage est-il stocké comme nouvelle image ou comme coordonnées sur l'original ? Que devient une vignette au changement de maquette ?
3. Les images sont-elles référencées par identifiant ou par nom de fichier ? Que se passe-t-il à l'import d'un nom existant ?
4. Le WebP peut-il être accepté ? Quel poids max par fichier ?
5. Quel dossier est ouvert par défaut quand la modale est appelée depuis un champ ?

## Critères de validation du proto

- Les quatre champs de démo ouvrent la même modale avec le bon comportement.
- Importer une image en mode `single` la rend visible et sélectionnée sans défilement ni recherche.
- Un WebP glissé et un doublon affichent leur état sur leur carte, sans fenêtre secondaire.
- Le recadrage se fait sans défiler, au clavier comme à la souris.
- Rouvrir la modale repart d'un état propre.
