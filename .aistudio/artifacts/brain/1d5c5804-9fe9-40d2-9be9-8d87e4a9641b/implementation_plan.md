# Fast-Troc UHD — Grille d'État Terrain (5 Niveaux), Mini-Market Jetons, Profil & Historique, et Assistant SQL Supabase

Cette mise à jour intègre la **grille stricte d'évaluation d'état sur 5 niveaux** (de *Neuf 100% Or* à *Dégradé <40% Rouge*), un **Mini-Market de Jetons**, un **Profil Utilisateur avec Historique complet**, une barre de navigation fixe à **4 onglets + bouton Caméra central**, ainsi qu'un **Assistant Supabase étape par étape** avec le script SQL complet à copier-coller.

## User Review & Critical Decisions

> [!IMPORTANT]
> Voici les fonctionnalités confirmées qui seront construites dès votre validation :

- **Grille d'État Stricte & Sévère (5 Niveaux Terrain)** :
  1. **Neuf (Or `#FBBF24` | 100%)** : Strictement d'origine, scellé ou jamais sorti de sa boîte/utilisé.
  2. **Comme neuf (Vert clair `#4ADE80` | 85%–90%)** : Déballé et testé ou très peu servi, micro-poussière ou trace invisible à première vue.
  3. **Bon état (Bleu `#38BDF8` | 65%–75%)** : Usage quotidien sur quelques mois, micro-rayures visibles de près, rien de cassé.
  4. **État correct (Orange `#FB923C` | 40%–60%)** : Rayures profondes, petits chocs ou usure prononcée, fonctionne toujours mais aspect fatigué.
  5. **Dégradé / Usé (Rouge `#EF4444` | < 40%)** : Fin de vie, défauts majeurs (fissures, pièces tordues, dysfonctionnements partiels).
  - *Intégration complète* : Sélecteur visuel lors de la publication `1:1`, badge couleur + `%` sur chaque carte du marché, jauge détaillée dans l'**Inspecteur UHD**, et certification de l'état sur le **Ticket Officiel WhatsApp**.
- **Navigation Fixe en Bas (4 Onglets + Caméra Centrale)** :
  - `Marché` • `Boutique` (Mini-Market Jetons) • `[ 📷 ]` (Sans texte) • `Matchs` • `Profil`.
- **Mini-Market de Jetons (Boutique Airtel Money & Moov Money)** :
  - Achat de Jetons à l'unité (`1 Jeton = 300 FCFA`), **Packs de Jetons** (Pack Quartier 5 Jetons, Pack Vitesse 10+1 Jetons, Pack Pro 25+4 Jetons) et **Pass Boost Coupe-File (500 FCFA)** avec crédit instantané et enregistrement dans l'historique.
- **Profil Utilisateur, Historique & Assistant Supabase Intégré** :
  - Identité Troqueur (Quartier, WhatsApp, Score de fiabilité, Valeur totale troquée en FCFA, Armes actives avec leur état).
  - **Historique horodaté** de toutes les opérations (Trocs validés par PIN, Achats Cash, Recharges de Jetons, Garantie Jeton 30 min).
  - **Guide & Script SQL Supabase prêt à coller** avec testeur de connexion en direct.

---

## 1. Architecture & Flux Utilisateur

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                   FAST-TROC UHD 120FPS (NAVIGATION 4 ONGLETS)               │
├─────────────────┬─────────────────┬───────────────────┬─────────────────────┤
│   1. MARCHÉ     │   2. BOUTIQUE   │    3. MATCHS      │     4. PROFIL       │
│                 │  (Mini-Market)  │ (Action-Réaction) │  (& Historique)     │
│ • Grille 1:1    │ • Jeton Unité   │ • Alertes 5s      │ • Score Fiabilité   │
│ • Badge État %  │   (300 FCFA)    │ • Timer 30 min    │ • Mes Armes + État  │
│   (Or -> Rouge) │ • Packs 5 / 11  │ • Comparaison     │ • Journal complet   │
│ • Inspecteur    │   / 29 Jetons   │   État Certifié   │   (Trocs, Jetons)   │
│   UHD + Jauge   │ • Boosts 500F   │ • Ticket WhatsApp │ • Assistant SQL     │
│   d'état réelle │ • Airtel / Moov │   avec État & PIN │   Supabase 1-clic   │
└─────────────────┴─────────────────┴───────────────────┴─────────────────────┘
```

---

## 2. Paramétrage Supabase (Script SQL & Guide Étape par Étape)

Dans l'onglet **Profil → Configuration Supabase** (ainsi que dans le panneau latéral et dans mon message final après construction), vous disposerez :
1. Du bouton **« Copier le Script SQL Complet »** (créant les tables `weapons`, `market_items`, `matches`, `activity_history` avec les colonnes d'état `condition_grade`, `condition_percent` et les règles d'accès RLS pour vos clés `SUPABASE_URL` / `SUPABASE_ANON_KEY`).
2. Des instructions exactes :
   - Ouvrir **app.supabase.com** → Sélectionner votre projet
   - Cliquer sur **SQL Editor** dans le menu gauche → **+ New query**
   - Coller le script SQL → Cliquer sur **Run** (en bas à droite)
   - Cliquer sur **« Tester & Synchroniser Supabase »** dans l'application pour injecter et synchroniser vos données en temps réel.
