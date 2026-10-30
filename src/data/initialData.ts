import { STUDIO_VISUALS } from './productVisuals';
import {
  ActivityHistoryItem,
  ConditionGradeId,
  ConditionGradeSpec,
  MarketItem,
  MatchRecord,
  TokenPackOffer,
  UserProfile,
  WalletMetrics,
  WeaponItem
} from '../types/troc';

// ============================================================================
// GRILLE D'ÉTAT RÉALISTE, STRICTE ET SÉVÈRE (5 NIVEAUX TERRAIN)
// ============================================================================
export const CONDITION_GRADES: ConditionGradeSpec[] = [
  {
    id: 'NEUF',
    rank: 1,
    label: 'Neuf',
    colorName: 'Or',
    rangeLabel: '100%',
    defaultPercent: 100,
    minPercent: 100,
    maxPercent: 100,
    hexColor: '#FBBF24',
    badgeBg: 'bg-amber-400/15',
    badgeBorder: 'border-amber-400/50',
    badgeText: 'text-amber-300',
    barColor: 'bg-amber-400',
    realityDescription:
      "Strictement d'origine, scellé ou absolument jamais sorti de sa boîte/utilisé. Dès qu'il y a la moindre manipulation, on descend d'un cran."
  },
  {
    id: 'COMME_NEUF',
    rank: 2,
    label: 'Comme neuf',
    colorName: 'Vert clair',
    rangeLabel: '85% à 90%',
    defaultPercent: 88,
    minPercent: 85,
    maxPercent: 90,
    hexColor: '#4ADE80',
    badgeBg: 'bg-emerald-400/15',
    badgeBorder: 'border-emerald-400/50',
    badgeText: 'text-emerald-300',
    barColor: 'bg-emerald-400',
    realityDescription:
      'Déballé et testé ou très peu servi, mais on peut trouver une micro-poussière ou une trace invisible à première vue si on cherche bien.'
  },
  {
    id: 'BON_ETAT',
    rank: 3,
    label: 'Bon état',
    colorName: 'Bleu',
    rangeLabel: '65% à 75%',
    defaultPercent: 72,
    minPercent: 65,
    maxPercent: 75,
    hexColor: '#38BDF8',
    badgeBg: 'bg-sky-400/15',
    badgeBorder: 'border-sky-400/50',
    badgeText: 'text-sky-300',
    barColor: 'bg-sky-400',
    realityDescription:
      'C’est l’état standard d’un objet qui a vraiment servi au quotidien pendant quelques mois. Il y a des micro-rayures visibles de près, des frottements normaux, mais rien de cassé.'
  },
  {
    id: 'ETAT_CORRECT',
    rank: 4,
    label: 'État correct',
    colorName: 'Orange',
    rangeLabel: '40% à 60%',
    defaultPercent: 52,
    minPercent: 40,
    maxPercent: 60,
    hexColor: '#FB923C',
    badgeBg: 'bg-orange-400/15',
    badgeBorder: 'border-orange-400/50',
    badgeText: 'text-orange-300',
    barColor: 'bg-orange-400',
    realityDescription:
      'L\'objet a souffert. Il y a des rayures profondes, des petits chocs, des éclats ou une usure prononcée des matériaux. Il fonctionne toujours, mais esthétiquement il fait "vieux" ou "fatigué".'
  },
  {
    id: 'DEGRADE',
    rank: 5,
    label: 'Dégradé / Usé',
    colorName: 'Rouge',
    rangeLabel: '< 40%',
    defaultPercent: 32,
    minPercent: 15,
    maxPercent: 39,
    hexColor: '#EF4444',
    badgeBg: 'bg-red-500/15',
    badgeBorder: 'border-red-500/50',
    badgeText: 'text-red-300',
    barColor: 'bg-red-500',
    realityDescription:
      'L\'objet est en fin de vie. Il cumule les défauts majeurs (fissures, pièces tordues, dysfonctionnements partiels ou aspect très abîmé). À la limite de la mise au rebut ou demande un gros travail de restauration.'
  }
];

export const CONDITION_GRADE_MAP: Record<ConditionGradeId, ConditionGradeSpec> = {
  NEUF: CONDITION_GRADES[0],
  COMME_NEUF: CONDITION_GRADES[1],
  BON_ETAT: CONDITION_GRADES[2],
  ETAT_CORRECT: CONDITION_GRADES[3],
  DEGRADE: CONDITION_GRADES[4]
};

export function getConditionSpec(grade?: ConditionGradeId): ConditionGradeSpec {
  if (!grade || !CONDITION_GRADE_MAP[grade]) {
    return CONDITION_GRADES[1]; // Comme neuf par défaut
  }
  return CONDITION_GRADE_MAP[grade];
}

// ============================================================================
// INVENTAIRE INITIAL DE L'UTILISATEUR ("MES ARMES") AVEC ÉTAT RÉALISTE
// ============================================================================
export const INITIAL_WEAPONS: WeaponItem[] = [
  {
    id: 'w1',
    title: 'Casque Pro',
    tier: '25k',
    tierValue: 25000,
    emoji: '📷',
    image: STUDIO_VISUALS.headphones,
    conditionGrade: 'COMME_NEUF',
    conditionPercent: 89
  },
  {
    id: 'w2',
    title: 'Sneakers Nike Air Max T.43',
    tier: '25k',
    tierValue: 25000,
    emoji: '👟',
    image: STUDIO_VISUALS.sneakers,
    conditionGrade: 'BON_ETAT',
    conditionPercent: 74
  },
  {
    id: 'w3',
    title: 'Manette PS5 DualSense',
    tier: '50k',
    tierValue: 50000,
    emoji: '🎮',
    image: STUDIO_VISUALS.controller,
    conditionGrade: 'NEUF',
    conditionPercent: 100
  },
  {
    id: 'w4',
    title: 'iPhone 12 Pro 128Go',
    tier: '100k+',
    tierValue: 150000,
    emoji: '📱',
    image: STUDIO_VISUALS.smartphone,
    conditionGrade: 'COMME_NEUF',
    conditionPercent: 87
  }
];

// ============================================================================
// CATALOGUE DU MARCHÉ LIBREVILLE AVEC LES 5 NIVEAUX D'ÉTAT
// ============================================================================
export const INITIAL_MARKET: MarketItem[] = [
  {
    id: 'm1',
    title: 'Montre Connectée',
    tier: '25k',
    cashPrice: 27000,
    distance: '1,2 km',
    distanceKm: 1.2,
    quartier: 'Louis',
    boosted: false,
    status: 'AVAILABLE',
    owner: 'Marc O.',
    phone: '241077123456',
    image: STUDIO_VISUALS.smartwatch,
    conditionGrade: 'COMME_NEUF',
    conditionPercent: 88
  },
  {
    id: 'm2',
    title: 'Enceinte Bluetooth',
    tier: '25k',
    cashPrice: 25000,
    distance: '2,5 km',
    distanceKm: 2.5,
    quartier: 'Glass',
    boosted: false,
    status: 'AVAILABLE',
    owner: 'Stevy N.',
    phone: '241066987654',
    image: STUDIO_VISUALS.jblSpeaker,
    conditionGrade: 'NEUF',
    conditionPercent: 100
  },
  {
    id: 'm3',
    title: 'Micro Sans Fil',
    tier: '25k',
    cashPrice: 24000,
    distance: '0,8 km',
    distanceKm: 0.8,
    quartier: 'Montagne Sainte',
    boosted: true,
    status: 'AVAILABLE',
    owner: 'Junior Film',
    phone: '241074556677',
    image: STUDIO_VISUALS.wirelessMic,
    conditionGrade: 'BON_ETAT',
    conditionPercent: 72
  },
  {
    id: 'm4',
    title: 'Four Micro-ondes',
    tier: '25k',
    cashPrice: 28000,
    distance: '3,1 km',
    distanceKm: 3.1,
    quartier: 'Nzeng-Ayong',
    boosted: false,
    status: 'AVAILABLE',
    owner: 'Amina K.',
    phone: '241062334455',
    image: STUDIO_VISUALS.microwave,
    conditionGrade: 'ETAT_CORRECT',
    conditionPercent: 55
  },
  {
    id: 'm5',
    title: 'Sac à Dos Imperméable Tech',
    tier: '10k',
    cashPrice: 12000,
    distance: '1,5 km',
    distanceKm: 1.5,
    quartier: 'Akébé',
    boosted: false,
    status: 'AVAILABLE',
    owner: 'Kevin B.',
    phone: '241077889900',
    image: STUDIO_VISUALS.backpack,
    conditionGrade: 'NEUF',
    conditionPercent: 100
  },
  {
    id: 'm6',
    title: 'Ring Light LED + Trépied 2m',
    tier: '10k',
    cashPrice: 11000,
    distance: '0,9 km',
    distanceKm: 0.9,
    quartier: 'Centre-Ville',
    boosted: true,
    status: 'AVAILABLE',
    owner: 'Sarah M.',
    phone: '241065112233',
    image: STUDIO_VISUALS.ringLight,
    conditionGrade: 'BON_ETAT',
    conditionPercent: 68
  },
  {
    id: 'm7',
    title: 'Écran Moniteur 27" Full HD',
    tier: '50k',
    cashPrice: 55000,
    distance: '2,0 km',
    distanceKm: 2.0,
    quartier: 'Charbonnages',
    boosted: false,
    status: 'AVAILABLE',
    owner: 'David T.',
    phone: '241074223344',
    image: STUDIO_VISUALS.monitor,
    conditionGrade: 'DEGRADE',
    conditionPercent: 35
  },
  {
    id: 'm8',
    title: 'PlayStation 4 Slim + 2 Jeux',
    tier: '100k+',
    cashPrice: 115000,
    distance: '4,2 km',
    distanceKm: 4.2,
    quartier: 'Angondjé',
    boosted: true,
    status: 'AVAILABLE',
    owner: 'Yannick E.',
    phone: '241066445566',
    image: STUDIO_VISUALS.ps4Console,
    conditionGrade: 'COMME_NEUF',
    conditionPercent: 86
  }
];

export const INITIAL_MATCHES: MatchRecord[] = [
  {
    id: 'match-1',
    type: 'INCOMING',
    partnerName: 'Franck M.',
    partnerQuartier: 'Batterie IV (1,4 km)',
    partnerPhone: '241077998877',
    theirItem: {
      title: 'Tablette Graphique Wacom',
      tier: '25k',
      image: STUDIO_VISUALS.tablet,
      conditionGrade: 'COMME_NEUF',
      conditionPercent: 88
    },
    myItem: INITIAL_WEAPONS[0],
    soulte: 2000,
    soulteDirection: 'TO_ME',
    isCoupeFile: true,
    status: 'PENDING_DECISION',
    myPaid: false,
    theirPaid: true,
    pinCode: '4829',
    timestamp: 'Il y a 2 min',
    expiresAt: Date.now() + 28 * 60 * 1000
  },
  {
    id: 'match-2',
    type: 'MUTUAL',
    partnerName: 'Clarisse A.',
    partnerQuartier: 'Oloumi (2,1 km)',
    partnerPhone: '241066123987',
    theirItem: {
      title: 'Machine à Café Expresso',
      tier: '25k',
      image: STUDIO_VISUALS.coffeeMaker,
      conditionGrade: 'BON_ETAT',
      conditionPercent: 72
    },
    myItem: INITIAL_WEAPONS[1],
    soulte: 0,
    soulteDirection: 'NONE',
    isCoupeFile: false,
    status: 'ACCEPTED_LOCKED',
    myPaid: false,
    theirPaid: true,
    pinCode: '9104',
    timestamp: 'Il y a 6 min',
    expiresAt: Date.now() + 24 * 60 * 1000
  },
  {
    id: 'match-3',
    type: 'MUTUAL',
    partnerName: 'Lionel K.',
    partnerQuartier: 'Awendjé (1,9 km)',
    partnerPhone: '241074889911',
    theirItem: {
      title: 'Clavier Mécanique RGB',
      tier: '25k',
      image: STUDIO_VISUALS.keyboard,
      conditionGrade: 'NEUF',
      conditionPercent: 100
    },
    myItem: INITIAL_WEAPONS[0],
    soulte: 5000,
    soulteDirection: 'FROM_ME',
    isCoupeFile: false,
    status: 'UNLOCKED',
    myPaid: true,
    theirPaid: true,
    pinCode: '7351',
    pinVerified: false,
    timestamp: 'Il y a 25 min',
    expiresAt: Date.now() + 30 * 60 * 1000
  }
];

// ============================================================================
// MINI-MARKET DE JETONS & PACKS (1 JETON = 300 FCFA)
// ============================================================================
export const TOKEN_PACKS: TokenPackOffer[] = [
  {
    id: 'pack-1',
    title: '1 Jeton Déblocage Direct',
    subtitle: 'Idéal pour débloquer immédiatement un match validé sur WhatsApp',
    tokensCount: 1,
    bonusTokens: 0,
    priceFcfa: 300
  },
  {
    id: 'pack-5',
    title: 'Pack Quartier • 5 Jetons',
    subtitle: 'Le pack standard pour enchaîner vos trocs de la semaine sans attente',
    tokensCount: 5,
    bonusTokens: 0,
    priceFcfa: 1500,
    badge: 'POPULAIRE',
    popular: true
  },
  {
    id: 'pack-11',
    title: 'Pack Vitesse • 10 + 1 Offert',
    subtitle: '11 Jetons au prix de 10 (Économisez 300 FCFA sur vos déblocages)',
    tokensCount: 10,
    bonusTokens: 1,
    priceFcfa: 3000,
    badge: '+1 JETON OFFERT'
  },
  {
    id: 'pack-29',
    title: 'Pack Commerçant Pro • 25 + 4 Offerts',
    subtitle: '29 Jetons pour les gros échangeurs et revendeurs actifs de Libreville',
    tokensCount: 25,
    bonusTokens: 4,
    priceFcfa: 7500,
    badge: '+4 OFFERTS (1 200F)'
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Jean-Marc Ndong',
  handle: '@jeanmarc_lbv',
  quartier: 'Louis / Batterie IV (Libreville)',
  phone: '241077889900',
  memberSince: 'Octobre 2026',
  trustScore: 98,
  totalVolumeFcfa: 485000
};

export const INITIAL_HISTORY: ActivityHistoryItem[] = [
  {
    id: 'hist-1',
    type: 'MATCH_UNLOCKED',
    title: 'Match débloqué avec Lionel K.',
    subtitle: 'Clavier Mécanique RGB (Neuf 100%) ↔ Casque Pro (+5k FCFA)',
    amountLabel: '-1 Jeton (300F)',
    badgeColor: 'emerald',
    pinCode: '7351',
    timestamp: 'Il y a 25 min',
    createdAt: Date.now() - 25 * 60 * 1000
  },
  {
    id: 'hist-2',
    type: 'TOKEN_PURCHASE',
    title: 'Achat Pack Quartier (Mini-Market)',
    subtitle: 'Crédit de +5 Jetons de Troc via Airtel Money',
    amountLabel: '+5 Jetons (1 500F)',
    badgeColor: 'amber',
    timestamp: 'Hier à 18:40',
    createdAt: Date.now() - 18 * 3600 * 1000
  },
  {
    id: 'hist-3',
    type: 'TROC_PIN_VERIFIED',
    title: 'Échange terrain validé avec Cédric B.',
    subtitle: 'Objectif Canon 50mm (Comme neuf 88%) • Remise Point Relais Glass',
    amountLabel: 'PIN 8210 ✓',
    badgeColor: 'emerald',
    pinCode: '8210',
    timestamp: 'Il y a 2 jours',
    createdAt: Date.now() - 48 * 3600 * 1000
  },
  {
    id: 'hist-4',
    type: 'TOKEN_REFUND_30M',
    title: 'Garantie Anti-Blocage 30 min',
    subtitle: 'Désistement du partenaire • Jeton automatiquement recrédité',
    amountLabel: '+1 Jeton Gratuit',
    badgeColor: 'sky',
    timestamp: 'Il y a 3 jours',
    createdAt: Date.now() - 72 * 3600 * 1000
  }
];

export const INITIAL_WALLET: WalletMetrics = {
  tokens: 2,
  boostCredits: 1,
  verifiedTrades: 14,
  platformRevenueFcfa: 31100,
  coupeFileCount: 3,
  cashCommissionFcfa: 2600,
  blockedGhosts: []
};

export const PRESET_PHOTOS = [
  {
    label: '⌚ Montre / Bijou',
    url: STUDIO_VISUALS.smartwatch,
    defaultName: 'Montre Homme Acier',
    emoji: '⌚'
  },
  {
    label: '📱 Smartphone',
    url: STUDIO_VISUALS.smartphone,
    defaultName: 'Smartphone 128Go Pro',
    emoji: '📱'
  },
  {
    label: '🎒 Mode / Sac Tech',
    url: STUDIO_VISUALS.backpack,
    defaultName: 'Sac Imperméable Urbain',
    emoji: '🎒'
  },
  {
    label: '🔌 Électroménager',
    url: STUDIO_VISUALS.blender,
    defaultName: 'Blender Mixeur Pro',
    emoji: '🔌'
  }
];

export const INCOMING_CHALLENGERS = [
  {
    partnerName: 'Brice Ndong',
    partnerQuartier: 'Lalala à droite (1,1 km)',
    partnerPhone: '241077441122',
    theirItem: {
      title: 'Enceinte JBL Flip 6 Rouge',
      tier: '25k' as const,
      image: STUDIO_VISUALS.jblSpeaker,
      conditionGrade: 'NEUF' as const,
      conditionPercent: 100
    },
    soulte: 2000,
    isCoupeFile: true
  },
  {
    partnerName: 'Prisca Mba',
    partnerQuartier: 'Haut de Gué-Gué (1,8 km)',
    partnerPhone: '241066558899',
    theirItem: {
      title: 'Montre Connectée Sport GPS',
      tier: '25k' as const,
      image: STUDIO_VISUALS.smartwatch,
      conditionGrade: 'COMME_NEUF' as const,
      conditionPercent: 88
    },
    soulte: 5000,
    isCoupeFile: false
  },
  {
    partnerName: 'Ulrich Obiang',
    partnerQuartier: 'IAI / Golf (2,3 km)',
    partnerPhone: '241074119933',
    theirItem: {
      title: 'Micro Cravate Sans Fil Pro',
      tier: '25k' as const,
      image: STUDIO_VISUALS.wirelessMic,
      conditionGrade: 'BON_ETAT' as const,
      conditionPercent: 72
    },
    soulte: 0,
    isCoupeFile: true
  }
];

// ============================================================================
// SCRIPT SQL SUPABASE COMPLET (TABLES + COLONNES D'ÉTAT + PROFIL + RLS)
// ============================================================================
export const SUPABASE_SCHEMA_SQL = `-- ============================================================================
-- SCRIPT D'INITIALISATION SUPABASE POUR FAST-TROC LIBREVILLE (UHD)
-- À coller dans : Dashboard Supabase -> SQL Editor -> + New query -> Run
-- ============================================================================

-- 1. Table de vos objets ("Mes Armes") avec grille d'état (Neuf 100% à Dégradé <40%)
CREATE TABLE IF NOT EXISTS public.weapons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('10k', '25k', '50k', '100k+')),
  tier_value INTEGER NOT NULL,
  emoji TEXT DEFAULT '📷',
  image TEXT NOT NULL,
  condition_grade TEXT DEFAULT 'COMME_NEUF',
  condition_percent INTEGER DEFAULT 88,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ajout sécurisé des colonnes d'état si la table existait déjà
ALTER TABLE public.weapons ADD COLUMN IF NOT EXISTS condition_grade TEXT DEFAULT 'COMME_NEUF';
ALTER TABLE public.weapons ADD COLUMN IF NOT EXISTS condition_percent INTEGER DEFAULT 88;

-- 2. Table du catalogue Marché Libreville
CREATE TABLE IF NOT EXISTS public.market_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('10k', '25k', '50k', '100k+')),
  cash_price INTEGER NOT NULL,
  distance TEXT NOT NULL,
  distance_km NUMERIC(4,1) NOT NULL,
  quartier TEXT NOT NULL,
  boosted BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED_12H')),
  reserved_until TEXT,
  owner TEXT NOT NULL,
  phone TEXT NOT NULL,
  image TEXT NOT NULL,
  condition_grade TEXT DEFAULT 'COMME_NEUF',
  condition_percent INTEGER DEFAULT 88,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS condition_grade TEXT DEFAULT 'COMME_NEUF';
ALTER TABLE public.market_items ADD COLUMN IF NOT EXISTS condition_percent INTEGER DEFAULT 88;

-- 3. Table des Matchs & Accords Action-Réaction
CREATE TABLE IF NOT EXISTS public.matches (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  partner_quartier TEXT NOT NULL,
  partner_phone TEXT NOT NULL,
  their_item JSONB NOT NULL,
  my_item JSONB NOT NULL,
  soulte INTEGER DEFAULT 0,
  soulte_direction TEXT DEFAULT 'NONE',
  is_coupe_file BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL,
  my_paid BOOLEAN DEFAULT FALSE,
  their_paid BOOLEAN DEFAULT FALSE,
  pin_code CHAR(4) NOT NULL,
  pin_verified BOOLEAN DEFAULT FALSE,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table de l'Historique d'Activité & Mini-Market Jetons
CREATE TABLE IF NOT EXISTS public.activity_history (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  amount_label TEXT NOT NULL,
  badge_color TEXT DEFAULT 'emerald',
  pin_code TEXT,
  timestamp_label TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

-- 5. Activation RLS + Politiques d'accès pour la clé SUPABASE_ANON_KEY
ALTER TABLE public.weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access weapons" ON public.weapons;
CREATE POLICY "Public full access weapons" ON public.weapons FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access market_items" ON public.market_items;
CREATE POLICY "Public full access market_items" ON public.market_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access matches" ON public.matches;
CREATE POLICY "Public full access matches" ON public.matches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access activity_history" ON public.activity_history;
CREATE POLICY "Public full access activity_history" ON public.activity_history FOR ALL USING (true) WITH CHECK (true);`;
