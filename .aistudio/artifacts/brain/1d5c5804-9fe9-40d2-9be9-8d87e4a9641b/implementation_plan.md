# Boo — Filtre Sémantique Ultra-Intelligent, Signature avec Mini Logo Boo & Espace Exclusif Mmedia Universe

Cette mise à jour dote **Boo** d'un **moteur de recherche et de filtrage linguistique ultra-intelligent (100% déterministe, sans IA)** capable de comprendre les familles de mots, synonymes locaux, pluriels, accents et fautes de frappe (*ex. écran = ecran = écrans = moniteur = pouce = tv = télévision = télé*), remplace la signature par **`© 2026 [Mini Logo Boo] · Une initiative du Groupe Mmedia Universe. Tous droits réservés.`** (sans le mot *« Technologies »*), et crée un **Espace Exclusif Mmedia Universe** dédié à **VYBZ** (**« Découvrez VYBZ »**) et aux futures applications du groupe en cours de développement.

## User Review & Critical Decisions

> [!IMPORTANT]
> Vos choix confirmés ont été intégrés dans l'architecture :

- **Moteur de Filtre Sémantique & Tolérant aux Fautes (Sans IA)** :
  - Équivalence totale entre singulier/pluriel, avec/sans accents, fautes de frappe (distance d'édition de Levenshtein & phonétique) et **familles de mots complètes** :
    - `écran = ecran = écrans = ecrans = moniteur = moniteurs = pouce = pouces = tv = télévision = television = télé = tele = dalle = full hd`
    - Et 7 autres grandes familles lexicales couvrant tous les objets du quotidien au Gabon (*Téléphonie, Audio/Baffles/Casques, Gaming/Consoles, Électroménager/Cuisine, Mode/Sneakers/Montres, Photo/Créateurs, Informatique*).
- **Signature Officielle avec Mini Logo Boo (Sans « Technologies »)** :
  - Suppression du mot *« Technologies »*.
  - Intégration d'un **très mini logo vectoriel Boo** directement dans la signature en bas de page :
    **`© 2026 [Logo Boo] · Une initiative du Groupe Mmedia Universe. Tous droits réservés.`**
- **Espace Exclusif Dédié aux Applications du Groupe Mmedia Universe** :
  - Accessible depuis un **onglet dédié dans `Profil` (`Apps`)** ainsi que via un **accès rapide ouvrant la vitrine plein écran Mmedia Universe**.
  - Met en vedette **VYBZ** avec le bouton court et direct **`Découvrez VYBZ`** (sans jamais afficher d'URL brute) et présente une **grille évolutive de cartes Teaser (*« En développement »*)** pour les prochaines applications du Groupe Mmedia Universe.

---

## 1. Overview & Core Concept

- **What It Does**: Transforme la recherche du Marché en un filtre lexical intelligent qui comprend instantanément l'intention de l'utilisateur même avec des fautes ou des synonymes, ancre la signature visuelle de **Boo**, et offre un véritable hub dédié à l'écosystème d'applications **Mmedia Universe**.
- **Target Audience / Persona**: Utilisateurs mobiles au Gabon qui tapent rapidement d'une seule main (*sans accents, avec abréviations ou synonymes locaux comme « télé », « baffle », « frigo », « basket »*) et souhaitent découvrir les applications du groupe Mmedia Universe dans un espace soigné.
- **Key Value**: Zéro impasse lors d'une recherche sur le Marché et mise en valeur institutionnelle du Groupe Mmedia Universe.

---

## 2. User Experience & Visual Design

### A. Moteur de Filtre Ultra-Intelligent (Familles de Mots + Fautes + Synonymes)
1. **Pipeline de Compréhension Linguistique en 4 Couches** :
   - **Couche 1 — Normalisation & Désaccentuation** : Conversion minuscule, retrait des accents (`é/è/ê → e`, `à → a`, `ô → o`), nettoyage de la ponctuation et réduction des lettres doublées accidentelles (`telle → tele`, `ecraaan → ecran`).
   - **Couche 2 — Racinisation Singulier / Pluriel** : Neutralisation automatique des terminaisons plurielles (`s`, `x`, `aux`) pour que `écrans`, `ecrans`, `moniteurs`, `pouces` convergent vers la même racine.
   - **Couche 3 — Graphe de Familles de Mots & Synonymes** : Chaque terme saisi active automatiquement toute sa famille sémantique :
     - *Famille Écrans & TV* : `ecran`, `ecrans`, `moniteur`, `moniteurs`, `pouce`, `pouces`, `tv`, `television`, `tele`, `full hd`, `hdmi`, `4k`, `display`, `dalle`.
     - *Famille Téléphones & Tablettes* : `telephone`, `tel`, `portable`, `smartphone`, `iphone`, `samsung`, `galaxy`, `tecno`, `infinix`, `tablette`, `ipad`, `wacom`.
     - *Famille Son & Audio* : `enceinte`, `baffle`, `son`, `audio`, `jbl`, `speaker`, `bluetooth`, `casque`, `ecouteur`, `airpods`, `micro`, `cravate`, `sans fil`.
     - *Famille Gaming & Consoles* : `ps4`, `ps5`, `playstation`, `console`, `manette`, `dualsense`, `jeu`, `jeux`, `xbox`, `nintendo`, `gamer`.
     - *Famille Électroménager & Maison* : `four`, `micro-onde`, `microonde`, `blender`, `mixeur`, `cafe`, `expresso`, `cafetiere`, `frigo`, `congelateur`, `clim`, `ventilateur`, `cuisine`.
     - *Famille Mode, Chaussures & Montres* : `chaussure`, `basket`, `sneakers`, `nike`, `air max`, `pointure`, `sac`, `sac a dos`, `montre`, `smartwatch`, `connectee`, `bijou`, `mode`.
     - *Famille Photo, Éclairage & Studio* : `ring light`, `trepied`, `lumiere`, `led`, `camera`, `photo`, `video`, `canon`, `objectif`.
     - *Famille Informatique* : `clavier`, `mecanique`, `rgb`, `ordinateur`, `pc`, `laptop`, `macbook`, `souris`.
   - **Couche 4 — Tolérance aux Fautes de Frappe (Distance de Levenshtein $\le 2$)** : Même si l'utilisateur écrit `moniter`, `télévison`, `ekran`, `ifone` ou `bluetoth`, le moteur corrige vers la famille de mots correspondante.
2. **Retour Visuel Intelligent dans le Tiroir `Filtre`** :
   - Lorsqu'une famille de mots est reconnue (ex. l'utilisateur tape `télé` ou `pouce`), un badge discret indique les termes associés compris par le filtre (*ex. « Famille reconnue : Écran · Moniteur · TV · Pouces »*).

### B. Espace Exclusif Dédié aux Applications du Groupe Mmedia Universe
1. **Accès Fluide & Multi-Points** :
   - **Dans `Profil`** : Nouvel onglet dédié **`Apps`** dans la barre de sous-navigation (`Historique | Objets | Apps | FAQ | Légal`).
   - **Sur le `Marché`** : Une carte d'entrée soignée permettant d'ouvrir la **Vitrine Plein Écran Mmedia Universe** ou de lancer directement **VYBZ**.
2. **Architecture de l'Espace Mmedia Universe** :
   - **En-tête Institutionnel** : Badge *« Écosystème Officiel · Groupe Mmedia Universe »* présentant la vision digitale du groupe au Gabon.
   - **Application en Vedette — VYBZ** :
     - Carte grand format avec le logo officiel **VYBZ**, statut *« Disponible · En ligne »*, présentation claire de l'univers VYBZ et bouton court **`Découvrez VYBZ ↗`** (sans aucune URL visible).
   - **Applications en Cours de Développement (Pipeline Mmedia Universe)** :
     - Grille dédiée aux prochaines applications du groupe en cours de développement (*ex. Mmedia Studio, Mmedia Events, Mmedia Pay...*) avec badges *« En développement · Bientôt »*, conçue pour s'enrichir au fil des lancements.

### C. Signature Officielle de Bas de Page avec Mini Logo Vectoriel Boo
- En bas de chaque écran de l'application :
  > **© 2026 [Mini Logo Boo] · Une initiative du Groupe Mmedia Universe. Tous droits réservés.**
- Le mot *« Technologies »* est supprimé et le mini logo vectoriel **Boo** est intégré directement au cœur de la ligne.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 : Moteur sémantique local déterministe plutôt que recherche exacte `includes()`**
  - *Chosen Approach* : Indexation par graphe de synonymes + racinisation + distance de Levenshtein exécutée en moins de 1 milliseconde sur le téléphone.
  - *Why* : Garantit une vitesse instantanée à 120fps, fonctionne hors-ligne sans IA, et pardonne toutes les fautes de frappe ou variations de vocabulaire (`tv` trouve `Écran Moniteur 27" Full HD`).
- **Decision 2 : Hub dédié Mmedia Universe évolutif**
  - *Chosen Approach* : Créer un composant modulaire `MmediaUniverseHub` utilisable à la fois comme onglet dédié dans `Profil` et comme vitrine plein écran.
  - *Why* : Offre un véritable écrin institutionnel aux créations du Groupe Mmedia Universe, prêt à accueillir les futures applications en développement.

---

## 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     BOO · GROUPE MMEDIA UNIVERSE                         │
├──────────────────────────────────────────────────────────────────────────┤
│  Moteur de Filtre Linguistique (smartSearch.ts)                          │
│  ├── 1. Normalisation (sans accents, minuscules, dédoublonnage)          │
│  ├── 2. Racinisation (singulier/pluriel : écrans -> ecran)               │
│  ├── 3. Graphe de 8 Familles de Synonymes (écran=moniteur=pouce=tv=télé) │
│  └── 4. Tolérance Fautes de Frappe (Distance de Levenshtein <= 2)        │
├──────────────────────────────────────────────────────────────────────────┤
│  Espace Exclusif Mmedia Universe (MmediaUniverseHub.tsx)                 │
│  ├── Accessible via Profil > Onglet "Apps" & Modale Vitrine Plein Écran  │
│  ├── En Vedette : VYBZ + Logo Officiel + Bouton "Découvrez VYBZ"         │
│  └── Pipeline : Cartes "En développement" pour les futures apps du groupe│
├──────────────────────────────────────────────────────────────────────────┤
│  Signature Officielle (BooFooterSignature.tsx)                           │
│  └── "© 2026 [Mini Logo Boo] · Une initiative du Groupe Mmedia Universe. │
│       Tous droits réservés."                                             │
└──────────────────────────────────────────────────────────────────────────┘
```
