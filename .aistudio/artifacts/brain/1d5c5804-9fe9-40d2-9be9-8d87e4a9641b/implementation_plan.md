# Boo — Parcours de Récompense Quotidienne (7 Jours) & Espace Dédié Mmedia Universe dans Profil

Cette mise à jour intègre un **système de récompense d'assiduité sur 7 jours** permettant aux utilisateurs réguliers de gagner gratuitement des **Jetons** et des **Pass Coupe-File** grâce à leurs connexions quotidiennes, et réorganise l'onglet **Profil** en retirant `Apps` de la barre des menus pour lui offrir **son propre espace dédié juste sous la carte d'identité utilisateur**.

## User Review & Critical Decisions

> [!IMPORTANT]
> Vos choix confirmés sont intégrés dans ce plan :

- **Parcours de Connexion Quotidienne sur 7 Jours (Fidélité & Cadeaux Gratuits)** :
  - **Jour 1 & Jour 2** : Validation de présence quotidienne sur la piste de progression.
  - **Jour 3 (Cadeau 1)** : **🎁 +1 Jeton Gratuit** crédité immédiatement.
  - **Jour 4** : Validation de présence vers le prochain palier.
  - **Jour 5 (Cadeau 2)** : **🚀 +1 Pass Prioritaire « Coupe-File » Gratuit**.
  - **Jour 6** : Dernière étape avant le grand coffre.
  - **Jour 7 (Super Coffre Assiduité)** : **🏆 +2 Jetons Gratuits** (puis nouveau cycle de 7 jours).
  - Un mode **« Simuler le jour suivant »** est inclus dans la fenêtre du parcours afin que vous puissiez tester et vérifier les 7 jours et chaque cadeau en quelques secondes.
- **Barre des menus du `Profil` désaturée + Espace Mmedia Universe indépendant** :
  - Retrait de l'onglet `Apps` de la barre des sous-menus du Profil, qui retrouve ses **4 onglets équilibrés** : **`Historique | Objets | FAQ | Légal`**.
  - Création d'une **Carte Espace Mmedia Universe dédiée**, placée **juste sous la carte d'identité du Profil**, permettant en 1 clic soit de lancer **`Découvrez VYBZ`**, soit d'ouvrir la **Vitrine Plein Écran des Applications Mmedia Universe** (applications en ligne et applications du groupe en développement).

---

## 1. Overview & Core Concept

- **What It Does**: Récompense la fidélité quotidienne des utilisateurs de **Boo** par des Jetons et Pass gratuits, tout en aérant la navigation de l'onglet Profil avec un espace noble et indépendant pour les applications du **Groupe Mmedia Universe**.
- **Target Audience / Persona**: Utilisateurs réguliers au Gabon qui consultent le Marché chaque jour et souhaitent débloquer des transactions gratuites grâce à leur assiduité.
- **Key Value**: Rétention quotidienne accrue (effet d'habitude sur 7 jours) et lisibilité optimale du Profil.

---

## 2. User Experience & Visual Design

### A. Parcours de Récompense Quotidienne (7 Jours)
1. **Déclenchement & Accès Rapide** :
   - **À l'ouverture de l'application** : Si la connexion du jour n'a pas encore été validée, le parcours s'affiche pour permettre à l'utilisateur de valider son jour en 1 clic.
   - **Bouton permanent de Série (`🔥 J1..J7`)** : Accessible à tout moment depuis l'en-tête et depuis un encart dédié dans la **Boutique de Jetons** et le **Profil**.
2. **Design de la Piste des 7 Jours** :
   - Grille visuelle des **7 étapes** (J1 à J7) distinguant clairement :
     - Les jours déjà validés (`✓` Émeraude),
     - Le jour actuel à valider (`Aujourd'hui` Orange Boo `#FF6B00`),
     - Les 3 paliers cadeaux mis en relief en **Violet Royal (`#A855F7`)** : **J3 (+1 Jeton)**, **J5 (+1 Pass Boost)**, **J7 (Coffre +2 Jetons)**.
   - Barre de progression fluide et bouton principal **`VALIDER MA CONNEXION DU JOUR`** (ou **`RÉCUPÉRER MON CADEAU 🎁`** aux jours 3, 5 et 7).
   - Traçabilité complète : chaque cadeau récupéré ajoute une ligne officielle dans l'**Historique** du Profil.

### B. Espace Exclusif Mmedia Universe sous la Carte d'Identité du Profil
1. **Barre des sous-onglets revenue à 4 colonnes** :
   - `Historique` | `Objets` | `FAQ` | `Légal` — aucun texte serré ni saturé.
2. **Carte Dédiée « Écosystème Mmedia Universe » (Juste sous la carte d'identité)** :
   - Affiche le logo officiel **VYBZ**, le compteur des applications du groupe (*2 disponibles · 4 en développement*), le bouton direct **`Découvrez VYBZ ↗`** et le bouton **`Ouvrir l'Espace Apps`** qui déploie la vitrine plein écran du Groupe Mmedia Universe.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 : Piste de 7 jours avec 3 paliers cadeaux (J3, J5, J7) + bouton de test rapide**
  - *Chosen Approach* : Persistance de la date du dernier check-in dans `localStorage` + bouton *« Simuler Jour Suivant (+24h) »* pour tester tout le cycle instantanément.
  - *Why* : Offre à la fois une vraie mécanique quotidienne en production et la possibilité de vérifier immédiatement l'attribution des Jetons et Pass gratuits.
- **Decision 2 : Séparation entre les sous-onglets fonctionnels de Boo et l'Espace Mmedia Universe**
  - *Chosen Approach* : Garder les 4 sous-onglets centrés sur Boo (*Historique, Objets, FAQ, Légal*) et donner à Mmedia Universe son propre écrin visuel juste sous l'identité du profil.
  - *Why* : Évite toute saturation de la barre d'onglets tout en rendant l'écosystème Mmedia Universe immédiatement visible dès l'ouverture de l'onglet Profil.

---

## 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     BOO · SYSTÈME D'ASSIDUITÉ & PROFIL                   │
├──────────────────────────────────────────────────────────────────────────┤
│  Parcours Récompense 7 Jours (DailyStreakModal.tsx)                      │
│  ├── J1, J2, J4, J6 : Validation de connexion quotidienne                │
│  ├── J3 : Cadeau +1 Jeton Gratuit ──► Crédite Wallet + Historique        │
│  ├── J5 : Cadeau +1 Pass Coupe-File ──► Crédite Wallet + Historique      │
│  └── J7 : Super Coffre +2 Jetons ──► Crédite Wallet + Nouveau Cycle      │
├──────────────────────────────────────────────────────────────────────────┤
│  Onglet Profil Réorganisé (ProfileTab.tsx)                               │
│  ├── 1. Carte d'Identité Utilisateur + Compteurs                         │
│  ├── 2. Espace Dédié Mmedia Universe (Découvrez VYBZ + Vitrine Apps)     │
│  ├── 3. Barre 4 Sous-Onglets : [Historique] [Objets] [FAQ] [Légal]       │
│  └── 4. Signature Officielle 3 Lignes avec Mini Logo Boo                 │
└──────────────────────────────────────────────────────────────────────────┘
```
