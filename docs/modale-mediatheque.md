# Brief — Modale médiathèque image (Neopse refonte)

> À lire en entier avant de coder. Commence par explorer le proto (structure, `theme.ts`, composants existants, éditeurs d'actualité / d'apparence), puis **propose un plan et attends validation** avant d'écrire du code. Commit avant toute modification importante.
>
> **Révision 2 (26 oct. 2026)** — intègre les retours de revue du premier proto : densité, panneau de détail, recadrage automatique, import depuis le champ, destination automatique par module. Ces points remplacent les consignes antérieures qui les contredisent.

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

**Le cas principal est l'import direct depuis le champ**, sans ouvrir la modale. La modale sert à réutiliser une image déjà présente dans la médiathèque.

Configuration (adaptée aux conventions du proto) :

```ts
type ImagePickerConfig = {
  mode: 'single' | 'multiple';
  context: string;            // libellé affiché, ex. « Vignette de l'actualité »
  folder: string;             // dossier de destination des imports, ex. « Actualités », « Apparence »
  ratio?: { width: number; height: number }; // ex. 4:3 ; absent = pas de recadrage
  recommendation?: string;    // ex. « 1200 × 900 px » ; optionnel, affiché seulement si renseigné
  altText: 'ask' | 'decorative';
  currentImageId?: string;    // image actuellement en place
  currentCrop?: CropArea;     // cadrage en place, restauré si l'image actuelle est re-choisie
};
```

## Organisation de la médiathèque

- Les images importées vont **automatiquement** dans le dossier de destination du champ (`folder`) : un dossier par module sous « Site » (Actualités, Agenda, etc.). Les imports depuis l'apparence vont dans « Apparence ». Le dossier est créé s'il n'existe pas.
- **Pas de sous-dossiers par année.** Le tri par défaut reste « Plus récentes d'abord ». Option, si simple : intertitres par mois dans la grille (« Octobre 2026 ») quand le tri est chronologique.
- Les images déjà présentes ne sont **jamais déplacées** automatiquement.

## Import depuis le champ (cas principal)

- Un champ image vide affiche une zone de dépôt « Glissez une image ici ou [Importer une image] » (« des images » en mode `multiple`), et en dessous un lien « ou choisir parmi les images du site ».
- « Importer une image » ouvre **directement** le sélecteur de fichiers (`accept` filtré, `multiple` en mode `multiple`), sans passer par la modale. L'image importée va dans le dossier `folder` et se place dans le champ.
- Si un ratio est imposé, le recadrage automatique s'applique (voir Recadrage) ; le champ propose ensuite « Modifier le cadrage ».
- Si `altText: 'ask'`, le champ « Texte alternatif » apparaît sous l'image, dans le champ.
- Erreurs (format refusé, poids max) et doublons s'affichent **dans le champ**, avec la même logique et les mêmes libellés que dans la modale (« Retirer » ; « Utiliser l'existante » / « Importer quand même »).
- La modale ne s'ouvre que via « ou choisir parmi les images du site » (et « Changer d'image » quand le champ est rempli). Dans le champ, « Importer une image » est le bouton principal (plein).

## Structure de la modale

Dialog MUI, hauteur fixe. **En-tête, barre d'outils et pied ne défilent pas ; seule la zone d'images défile.**

Densité alignée sur l'existant Neopse : champs et boutons en `size="small"`, textes secondaires en `body2`, en-tête et barre d'outils d'environ 56 px chacun.

1. **En-tête** : titre (« Choisir une image » / « Choisir des images »), puce de contexte, puce de format (ratio + recommandation si renseignée), bouton fermer.
2. **Barre d'outils** : recherche par nom (tous dossiers), tri, bascule grille/liste, bouton « Importer des images » en bouton secondaire (`outlined`) : le seul bouton plein de la modale est le bouton principal du pied.
3. **Corps** : arborescence à gauche, avec en tête **« Toutes les images »** ; les dossiers servent de filtres. Grille ou liste au centre : **grille à 5 colonnes, vignettes d'environ 110 px de haut**, noms sur 2 lignes max. En mode `single`, panneau « Image sélectionnée » à droite, **environ 260 px**.
4. **Pied** : formats acceptés et poids max (`[TAILLE MAX]`, valeur à confirmer), « Annuler », bouton principal.

### Panneau « Image sélectionnée »

Ordre, de haut en bas :
1. Aperçu (moins haut que dans le proto v1). Si un ratio est imposé, le cadre de recadrage automatique est affiché **en surimpression**, avec un lien discret « Ajuster le cadrage » qui ouvre l'étape de recadrage.
2. Texte alternatif (si `altText: 'ask'`) — **visible sans défilement**.
3. Infos sur une seule ligne : « 3312 × 828 px · 50,9 Ko · 26 oct. 2026 · Site ».

Pas de renommage pour l'instant.

## Comportements

### Ouverture
- Vue « Toutes les images » (tous dossiers confondus), recherche vide, tri « Plus récentes d'abord ».
- L'image actuelle (`currentImageId`) porte un badge « Actuelle ». Elle **n'est pas** présélectionnée ; on peut la re-choisir (utile pour la recadrer à nouveau).

### Mode `single`
- Carte avec bouton radio ; un clic remplace la sélection.
- Bouton principal **toujours « Utiliser cette image »**, même quand l'emplacement impose un format ; désactivé tant que rien n'est sélectionné.
- Pas de « Tout sélectionner ».

### Mode `multiple` (diaporama)
- Cases à cocher affichant le **numéro d'ordre** de sélection.
- Compteur « N images sélectionnées », « Tout sélectionner » (dans le filtre courant), « Tout désélectionner » (si sélection non vide).
- Bande « Ordre d'ajout » en bas : miniatures numérotées, retrait possible.
- Bouton principal « Ajouter N images ».

### Import dans la modale
- Par le bouton ou par glisser-déposer sur **toute la zone d'images**. Le sélecteur de fichiers accepte plusieurs fichiers et filtre sur les formats acceptés (`accept`).
- **Destination = dossier `folder` du champ**, quel que soit le filtre affiché. Elle est écrite dans **un seul bandeau** (pas de bandeau + zone de dépôt empilés) : avant (« Glissez des images ici : elles iront dans **Actualités** »), pendant (« Import dans **Actualités** · 2 sur 4 terminées »), puis « Import terminé », qui **disparaît après quelques secondes**. Si une recherche est active, elle est vidée à la fin.
- Les fichiers importés apparaissent **en tête de grille** avec un badge « Nouvelle ». État affiché **sur chaque carte** : progression, succès, refus, doublon. **Aucune fenêtre secondaire.**
- Mode `single` : la dernière image valide importée est **sélectionnée automatiquement**. Mode `multiple` : toutes les images valides sont ajoutées à la sélection.
- **Format refusé** (ex. WebP par glisser-déposer) : carte en erreur avec la raison et l'action (« Format WebP non accepté. Convertissez-la en JPG ou PNG. », bouton « Retirer »).
- **Doublon** (même fichier déjà présent) : carte en avertissement « Cette image est déjà dans la médiathèque », actions « Utiliser l'existante » / « Importer quand même ». Pas de « Remplacer ». Dans le proto, simuler la détection par nom + poids.
- Proto front-only : conserver les fichiers importés en mémoire (object URL) le temps de la session, sans backend.

### Recherche et tri
- La recherche porte sur **tous les dossiers** par défaut ; elle se combine avec le filtre de dossier s'il y en a un.
- Grille : menu de tri (Plus récentes, Plus anciennes, Nom A→Z, Nom Z→A, Poids).
- Liste : tri par clic sur l'en-tête de colonne (Nom, Dimensions, Poids, Ajoutée le), flèche de sens sur la colonne active, `aria-sort`. La liste affiche miniature et dimensions.
- Noms de fichier : 2 lignes max, nom complet au survol et dans le panneau de détail.

### Recadrage (si `ratio` défini)
- **Recadrage automatique** : cadre au ratio imposé, couvrant la plus grande zone possible, centré, **appliqué à la validation** sans étape supplémentaire.
- Le cadre est montré en surimpression dans le panneau « Image sélectionnée » ; « Ajuster le cadrage » ouvre l'**étape 2 de la même modale** (pas une nouvelle modale), avec « Changer d'image » pour revenir à l'étape 1.
- Dans l'étape de recadrage : on glisse le cadre directement ; équivalent clavier obligatoire (flèches quand le cadre a le focus). Panneau de contrôles toujours visible à droite : zoom (curseur), « Pivoter de 90° », « Retourner », « Réinitialiser », petit aperçu du rendu. Molette = zoom uniquement quand le pointeur est sur l'image. Bouton « Valider le recadrage » dans le pied fixe.
- Libellé de format : « 4:3, imposé par l'emplacement ». **Ne pas** mentionner de numéro de maquette.
- Après insertion, le champ propose **« Modifier le cadrage »**, qui rouvre l'étape de recadrage.

### Texte alternatif — décidé par le champ, pas par l'image
- `altText: 'decorative'` (fonds de maquette, bandeau, vignettes de liste) : aucun champ, l'image est rendue avec `alt=""`.
- `altText: 'ask'` (bloc Images du contenu, diaporama) : champ « Texte alternatif » dans le panneau de l'image sélectionnée, et sous l'image dans le champ après un import direct. Le texte est **enregistré avec l'image dans la médiathèque** et réutilisé partout (le dire sous le champ). Non bloquant : si vide, avertissement « Pas encore de texte alternatif… » mais validation possible.
- Optionnel, pas en V1 : dans le bloc Images, champ texte alternatif propre à cet usage qui remplace celui de la médiathèque.

## Champs déclencheurs à brancher pour la démo

Page de démo `/demo/mediatheque` uniquement — **ne pas toucher aux écrans existants**. Au moins un de chaque configuration, pour montrer la modale qui s'adapte :

| Champ | mode | ratio | altText | folder |
|---|---|---|---|---|
| Vignette d'actualité | single | 4:3 | decorative | Actualités |
| Bloc Images (contenu) | single | — | ask | Actualités |
| Diaporama | multiple | — | ask | Agenda |
| Fond d'en-tête (apparence) | single | — | decorative | Apparence |

## Contraintes visuelles et accessibilité

- MUI (v9 dans le proto), thème `theme.ts` comme source unique ; pas de styles en dur hors thème.
- **Contraste** : le teal `#47A5B6` avec du texte blanc = 2,87:1, insuffisant (RGAA 4,5:1 ; 3:1 pour une bordure de sélection). Décision : `primary.main` inchangé pour l'instant ; token `palette.primaryStrong` (`#00696B`, 6,5:1) appliqué à la médiathèque uniquement. La bascule globale sera décidée plus tard.
- Vrais `button`, `input`, `label` ; `aria-label` sur les boutons-icônes ; focus géré à l'ouverture/fermeture ; Échap ferme.
- Libellés existants conservés quand ils sont connus des utilisateurs, sauf ceux identifiés comme faux (« Je filtre par », « ajouter un par un »).

## Hors périmètre — ne pas toucher

- Écrans existants du back-office (branchement après validation de la démo).
- Recette de la maquette (aperçu non mis à jour, accordéons, réglages de position du fond).
- Harmonisation entre les parcours Actualités / Agenda, et des libellés du site en général.
- Indicateur d'espace utilisé.
- Recommandations de format pour chaque emplacement (seul l'emplacement dans l'en-tête est prévu).
- Renommage des images.

## Questions ouvertes (côté devs, ne pas bloquer le proto)

1. Les modales « images » et « fichiers » sont-elles présentes en même temps dans la page actuelle ? (bugs non reproduits : recadrage au-dessus de « Sélectionner des fichiers », « Terminer » inopérant, recherche muette)
2. Le recadrage est-il stocké comme nouvelle image ou comme coordonnées sur l'original ? Que devient une vignette au changement de maquette ?
3. Les images sont-elles référencées par identifiant ou par nom de fichier ? Que se passe-t-il à l'import d'un nom existant ?
4. Le WebP peut-il être accepté ? Quel poids max par fichier ?
5. Le classement automatique par module (un dossier par module sous « Site », « Apparence » à part) est-il faisable côté serveur ? Que deviennent les dossiers créés manuellement par les agents ?

## Critères de validation du proto

- Les quatre champs de démo permettent un import direct (sans modale) et ouvrent la même modale via « ou choisir parmi les images du site ».
- Un import direct dans un champ à ratio imposé place l'image recadrée automatiquement, avec « Modifier le cadrage ».
- Importer une image en mode `single` dans la modale la rend visible et sélectionnée sans défilement ni recherche, dans le dossier du module.
- Un WebP glissé et un doublon affichent leur état sur leur carte (modale) ou dans le champ, sans fenêtre secondaire.
- Le texte alternatif du panneau est visible sans défilement.
- Le recadrage se fait sans défiler, au clavier comme à la souris.
- Rouvrir la modale repart d'un état propre, sur « Toutes les images ».
