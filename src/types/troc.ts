export type ValueTier = 'Tous' | '10k' | '25k' | '50k' | '100k+';
export type ItemTier = '10k' | '25k' | '50k' | '100k+';
export type CashTopUpAmount = 0 | 2000 | 5000 | 10000;
export type SoulteAmount = CashTopUpAmount;

export type MainTab = 'market' | 'shop' | 'matches' | 'profile';
export type ProfileSubTab = 'history' | 'weapons' | 'apps' | 'help' | 'legal';
export type LegalSectionId = 'cgu' | 'privacy' | 'about';

export type ItemCategory =
  | 'Tech & Audio'
  | 'Téléphones'
  | 'Gaming'
  | 'Mode'
  | 'Maison'
  | 'Services & Autres';

export type MarketCategoryFilter = 'Toutes' | ItemCategory;

export type ActiveModal =
  | 'none'
  | 'add_photo'
  | 'inspect_item'
  | 'propose_trade'
  | 'share_item'
  | 'cash_buy'
  | 'ticket_view'
  | 'incoming_alert'
  | 'city_selector'
  | 'market_filter'
  | 'mmedia_hub'
  | 'legal_viewer';

export type GabonCity =
  | 'Libreville'
  | 'Port-Gentil'
  | 'Franceville'
  | 'Oyem'
  | 'Lambaréné'
  | 'Mouila'
  | 'Koulamoutou'
  | 'Tchibanga'
  | 'Makokou';

export type CityFilter = 'Toutes les villes' | GabonCity;

export type ConditionGradeId =
  | 'NEUF'
  | 'COMME_NEUF'
  | 'BON_ETAT'
  | 'ETAT_CORRECT'
  | 'DEGRADE';

export interface ConditionGradeSpec {
  id: ConditionGradeId;
  rank: number;
  label: string;
  colorName: string;
  rangeLabel: string;
  defaultPercent: number;
  minPercent: number;
  maxPercent: number;
  hexColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  barColor: string;
  realityDescription: string;
}

export interface WeaponItem {
  id: string;
  title: string;
  tier: ItemTier;
  tierValue: number;
  emoji: string;
  image: string;
  conditionGrade: ConditionGradeId;
  conditionPercent: number;
  createdAt?: string;
}

export interface MarketItem {
  id: string;
  title: string;
  tier: ItemTier;
  cashPrice: number;
  city: GabonCity;
  quartier: string;
  distance?: string;
  distanceKm?: number;
  boosted: boolean;
  status: 'AVAILABLE' | 'RESERVED_12H';
  reservedUntil?: string;
  owner: string;
  phone: string;
  image: string;
  conditionGrade: ConditionGradeId;
  conditionPercent: number;
  isOwnListing?: boolean;
  category?: ItemCategory;
}

export type MatchStatus =
  | 'PENDING_DECISION'
  | 'ACCEPTED_LOCKED'
  | 'UNLOCKED'
  | 'EXPIRED_REFUNDED'
  | 'CANCELLED_GHOST';

export interface MatchRecord {
  id: string;
  type: 'INCOMING' | 'MUTUAL';
  partnerName: string;
  partnerQuartier: string;
  partnerPhone: string;
  marketItemId?: string;
  theirItem: {
    title: string;
    tier: ItemTier;
    image: string;
    conditionGrade: ConditionGradeId;
    conditionPercent: number;
  };
  myItem: WeaponItem;
  soulte: number;
  soulteDirection: 'NONE' | 'FROM_ME' | 'TO_ME';
  isCoupeFile: boolean;
  status: MatchStatus;
  myPaid: boolean;
  theirPaid: boolean;
  pinCode: string;
  pinVerified?: boolean;
  timestamp: string;
  expiresAt: number;
}

export interface SentOfferInfo {
  weapon: WeaponItem;
  soulte: number;
  isCoupeFile: boolean;
  matchId: string;
}

export type HistoryEventType =
  | 'TROC_PIN_VERIFIED'
  | 'OFFER_SENT'
  | 'MATCH_UNLOCKED'
  | 'TOKEN_PURCHASE'
  | 'TOKEN_REFUND_30M'
  | 'CASH_PURCHASE'
  | 'BOOST_COUPE_FILE'
  | 'ITEM_PUBLISHED'
  | 'GHOST_BLOCKED';

export interface ActivityHistoryItem {
  id: string;
  type: HistoryEventType;
  title: string;
  subtitle: string;
  amountLabel: string;
  badgeColor: 'emerald' | 'amber' | 'orange' | 'sky' | 'red' | 'purple';
  pinCode?: string;
  timestamp: string;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  handle: string;
  city: GabonCity;
  quartier: string;
  phone: string;
  memberSince: string;
  trustScore: number;
  totalVolumeFcfa: number;
}

export interface WalletMetrics {
  tokens: number;
  boostCredits: number;
  verifiedTrades: number;
  platformRevenueFcfa: number;
  coupeFileCount: number;
  cashCommissionFcfa: number;
  blockedGhosts: string[];
}

export interface TokenPackOffer {
  id: string;
  title: string;
  subtitle: string;
  tokensCount: number;
  bonusTokens: number;
  priceFcfa: number;
  badge?: string;
  popular?: boolean;
}

export function deriveTierFromPrice(priceFcfa: number): ItemTier {
  if (priceFcfa <= 17500) return '10k';
  if (priceFcfa <= 37500) return '25k';
  if (priceFcfa <= 75000) return '50k';
  return '100k+';
}

export function formatCompactFcfa(priceFcfa: number, fallbackTier?: ItemTier): string {
  if (!priceFcfa || priceFcfa <= 0) return fallbackTier || '25k';
  return `${priceFcfa.toLocaleString('fr-FR')} F`;
}

export const MARKET_CATEGORIES: MarketCategoryFilter[] = [
  'Toutes',
  'Tech & Audio',
  'Téléphones',
  'Gaming',
  'Mode',
  'Maison',
  'Services & Autres'
];

export function inferItemCategory(
  title: string,
  explicitCategory?: ItemCategory
): ItemCategory {
  if (explicitCategory) return explicitCategory;
  const lower = title.toLowerCase();
  if (
    lower.includes('iphone') ||
    lower.includes('smartphone') ||
    lower.includes('samsung') ||
    lower.includes('galaxy') ||
    lower.includes('tablette') ||
    lower.includes('ipad')
  ) {
    return 'Téléphones';
  }
  if (
    lower.includes('ps4') ||
    lower.includes('ps5') ||
    lower.includes('playstation') ||
    lower.includes('manette') ||
    lower.includes('xbox') ||
    lower.includes('nintendo') ||
    lower.includes('console') ||
    lower.includes('jeu')
  ) {
    return 'Gaming';
  }
  if (
    lower.includes('sac') ||
    lower.includes('sneakers') ||
    lower.includes('nike') ||
    lower.includes('chaussure') ||
    lower.includes('montre') ||
    lower.includes('bijou') ||
    lower.includes('veste') ||
    lower.includes('mode')
  ) {
    return 'Mode';
  }
  if (
    lower.includes('four') ||
    lower.includes('micro-ondes') ||
    lower.includes('blender') ||
    lower.includes('mixeur') ||
    lower.includes('café') ||
    lower.includes('expresso') ||
    lower.includes('électro') ||
    lower.includes('maison')
  ) {
    return 'Maison';
  }
  if (
    lower.includes('enceinte') ||
    lower.includes('micro') ||
    lower.includes('ring light') ||
    lower.includes('écran') ||
    lower.includes('moniteur') ||
    lower.includes('casque') ||
    lower.includes('clavier') ||
    lower.includes('canon') ||
    lower.includes('audio') ||
    lower.includes('tech')
  ) {
    return 'Tech & Audio';
  }
  return 'Services & Autres';
}
