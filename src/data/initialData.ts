import { STUDIO_VISUALS } from './productVisuals';
import {
  ActivityHistoryItem,
  ConditionGradeId,
  ConditionGradeSpec,
  GabonCity,
  MarketItem,
  MatchRecord,
  TokenPackOffer,
  UserProfile,
  WalletMetrics,
  WeaponItem
} from '../types/troc';

// ============================================================================
// LES 9 CAPITALES PROVINCIALES DU GABON
// ============================================================================
export const GABON_CITIES: { name: GabonCity; province: string }[] = [
  { name: 'Libreville', province: 'Estuaire' },
  { name: 'Port-Gentil', province: 'Ogooué-Maritime' },
  { name: 'Franceville', province: 'Haut-Ogooué' },
  { name: 'Oyem', province: 'Woleu-Ntem' },
  { name: 'Lambaréné', province: 'Moyen-Ogooué' },
  { name: 'Mouila', province: 'Ngounié' },
  { name: 'Koulamoutou', province: 'Ogooué-Lolo' },
  { name: 'Tchibanga', province: 'Nyanga' },
  { name: 'Makokou', province: 'Ogooué-Ivindo' }
];

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
    return CONDITION_GRADES[1];
  }
  return CONDITION_GRADE_MAP[grade];
}

// ============================================================================
// INVENTAIRE INITIAL DE L'UTILISATEUR ("MES OBJETS") AVEC ÉTAT RÉALISTE
// ============================================================================
export const INITIAL_WEAPONS: WeaponItem[] = [
  {
    id: 'w1',
    title: 'Casque Pro',
    tier: '25k',
    tierValue: 25000,
    emoji: '🎧',
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
// CATALOGUE DU MARCHÉ PAR VILLE (ZÉRO KM)
// ============================================================================
export const INITIAL_MARKET: MarketItem[] = [
  {
    id: 'm1',
    title: 'Montre Connectée',
    tier: '25k',
    cashPrice: 27000,
    city: 'Libreville',
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
    city: 'Libreville',
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
    city: 'Port-Gentil',
    quartier: 'Bord de Mer',
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
    city: 'Franceville',
    quartier: 'Potos',
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
    city: 'Oyem',
    quartier: 'Centre',
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
    city: 'Libreville',
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
    city: 'Lambaréné',
    quartier: 'Isaac',
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
    city: 'Libreville',
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
    partnerQuartier: 'Libreville • Batterie IV',
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
    partnerQuartier: 'Libreville • Oloumi',
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
    partnerQuartier: 'Libreville • Awendjé',
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
// MINI-MARKET DE JETONS & PACKS (1 JETON = 300 FCFA = 1 TRANSACTION CONCLUE)
// ============================================================================
export const TOKEN_PACKS: TokenPackOffer[] = [
  {
    id: 'pack-1',
    title: '1 Jeton de Transaction',
    subtitle: 'Idéal pour conclure un échange et débloquer le contact WhatsApp',
    tokensCount: 1,
    bonusTokens: 0,
    priceFcfa: 300
  },
  {
    id: 'pack-5',
    title: 'Pack Quartier • 5 Jetons',
    subtitle: 'Le pack standard pour conclure 5 transactions dans votre ville',
    tokensCount: 5,
    bonusTokens: 0,
    priceFcfa: 1500,
    badge: 'POPULAIRE',
    popular: true
  },
  {
    id: 'pack-11',
    title: 'Pack Vitesse • 10 + 1 Offert',
    subtitle: '11 Jetons au prix de 10 (Économisez 300 FCFA sur vos échanges)',
    tokensCount: 10,
    bonusTokens: 1,
    priceFcfa: 3000,
    badge: '+1 JETON OFFERT'
  },
  {
    id: 'pack-29',
    title: 'Pack Commerçant Pro • 25 + 4 Offerts',
    subtitle: '29 Jetons pour les gros échangeurs et vendeurs réguliers',
    tokensCount: 25,
    bonusTokens: 4,
    priceFcfa: 7500,
    badge: '+4 OFFERTS (1 200F)'
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Jean-Marc Ndong',
  handle: '@jeanmarc_gabon',
  city: 'Libreville',
  quartier: 'Louis / Batterie IV',
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
    subtitle: 'Clavier Mécanique RGB (100%) ↔ Casque Pro (+5k FCFA)',
    amountLabel: '-1 Jeton',
    badgeColor: 'emerald',
    pinCode: '7351',
    timestamp: 'Il y a 25 min',
    createdAt: Date.now() - 25 * 60 * 1000
  },
  {
    id: 'hist-2',
    type: 'TOKEN_PURCHASE',
    title: 'Achat Pack Quartier (Mini-Market)',
    subtitle: 'Crédit de +5 Jetons via Airtel Money',
    amountLabel: '+5 Jetons',
    badgeColor: 'amber',
    timestamp: 'Hier à 18:40',
    createdAt: Date.now() - 18 * 3600 * 1000
  },
  {
    id: 'hist-3',
    type: 'TROC_PIN_VERIFIED',
    title: 'Échange validé avec Cédric B.',
    subtitle: 'Objectif Canon 50mm (88%) • Libreville (Glass)',
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
    amountLabel: '+1 Jeton',
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
    partnerQuartier: 'Libreville • Lalala',
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
    partnerQuartier: 'Libreville • Gué-Gué',
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
    partnerQuartier: 'Port-Gentil • Centre',
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
