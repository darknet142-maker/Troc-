export type ValueTier = 'Tous' | '10k' | '25k' | '50k' | '100k+';
export type ItemTier = '10k' | '25k' | '50k' | '100k+';
export type SoulteAmount = 0 | 2000 | 5000 | 10000;

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
  distance: string;
  distanceKm: number;
  quartier: string;
  boosted: boolean;
  status: 'AVAILABLE' | 'RESERVED_12H';
  reservedUntil?: string;
  owner: string;
  phone: string;
  image: string;
  conditionGrade: ConditionGradeId;
  conditionPercent: number;
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
  isCoupeFile: boolean; // Offre prioritaire 500 FCFA
  status: MatchStatus;
  myPaid: boolean;
  theirPaid: boolean;
  pinCode: string;
  pinVerified?: boolean;
  timestamp: string;
  expiresAt: number; // Epoch ms for 30-min anti-blockage countdown
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
  badgeColor: 'emerald' | 'amber' | 'orange' | 'sky' | 'red';
  pinCode?: string;
  timestamp: string;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  handle: string;
  quartier: string;
  phone: string;
  memberSince: string;
  trustScore: number; // ex: 98%
  totalVolumeFcfa: number;
}

export interface WalletMetrics {
  tokens: number; // 1 Jeton = 300 FCFA
  boostCredits: number; // Crédits Coupe-File d'avance
  verifiedTrades: number; // Compteur de remises validées par PIN
  platformRevenueFcfa: number; // 600F/match + 500F Coupe-File + 5% Cash
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
