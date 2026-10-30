import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  INITIAL_HISTORY,
  INITIAL_MARKET,
  INITIAL_MATCHES,
  INITIAL_PROFILE,
  INITIAL_WALLET,
  INITIAL_WEAPONS
} from '../data/initialData';
import {
  ActivityHistoryItem,
  MarketItem,
  MatchRecord,
  SentOfferInfo,
  UserProfile,
  WalletMetrics,
  WeaponItem
} from '../types/troc';

const STORAGE_KEYS = {
  WEAPONS: 'fast_troc_weapons_v3',
  MARKET: 'fast_troc_market_v3',
  MATCHES: 'fast_troc_matches_v3',
  WALLET: 'fast_troc_wallet_v3',
  SENT_OFFERS: 'fast_troc_sent_offers_v3',
  PROFILE: 'fast_troc_profile_v3',
  HISTORY: 'fast_troc_history_v3'
};

// Lecture des clés Supabase depuis les Secrets AI Studio (SUPABASE_URL / SUPABASE_ANON_KEY ou VITE_*)
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof process !== 'undefined' ? process.env.SUPABASE_URL : '') ||
  '';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : '') ||
  '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('http') &&
    SUPABASE_ANON_KEY.length > 10
);

export const supabaseClient: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Synchronisation temps réel vers Supabase via @supabase/supabase-js
export async function syncWeaponToSupabase(weapon: WeaponItem): Promise<boolean> {
  if (!supabaseClient) return false;
  try {
    const { error } = await supabaseClient.from('weapons').upsert({
      id: weapon.id,
      title: weapon.title,
      tier: weapon.tier,
      tier_value: weapon.tierValue,
      emoji: weapon.emoji,
      image: weapon.image,
      condition_grade: weapon.conditionGrade || 'COMME_NEUF',
      condition_percent: weapon.conditionPercent ?? 88,
      created_at: weapon.createdAt || new Date().toISOString()
    });
    return !error;
  } catch {
    return false;
  }
}

export async function syncMarketItemToSupabase(item: MarketItem): Promise<boolean> {
  if (!supabaseClient) return false;
  try {
    const { error } = await supabaseClient.from('market_items').upsert({
      id: item.id,
      title: item.title,
      tier: item.tier,
      cash_price: item.cashPrice,
      distance: item.distance,
      distance_km: item.distanceKm,
      quartier: item.quartier,
      boosted: item.boosted,
      status: item.status,
      reserved_until: item.reservedUntil || null,
      owner: item.owner,
      phone: item.phone,
      image: item.image,
      condition_grade: item.conditionGrade || 'COMME_NEUF',
      condition_percent: item.conditionPercent ?? 88
    });
    return !error;
  } catch {
    return false;
  }
}

export async function syncMatchToSupabase(match: MatchRecord): Promise<boolean> {
  if (!supabaseClient) return false;
  try {
    const { error } = await supabaseClient.from('matches').upsert({
      id: match.id,
      type: match.type,
      partner_name: match.partnerName,
      partner_quartier: match.partnerQuartier,
      partner_phone: match.partnerPhone,
      their_item: match.theirItem,
      my_item: match.myItem,
      soulte: match.soulte,
      soulte_direction: match.soulteDirection,
      is_coupe_file: match.isCoupeFile,
      status: match.status,
      my_paid: match.myPaid,
      their_paid: match.theirPaid,
      pin_code: match.pinCode,
      pin_verified: Boolean(match.pinVerified),
      expires_at: match.expiresAt
    });
    return !error;
  } catch {
    return false;
  }
}

export async function syncHistoryItemToSupabase(entry: ActivityHistoryItem): Promise<boolean> {
  if (!supabaseClient) return false;
  try {
    const { error } = await supabaseClient.from('activity_history').upsert({
      id: entry.id,
      type: entry.type,
      title: entry.title,
      subtitle: entry.subtitle,
      amount_label: entry.amountLabel,
      badge_color: entry.badgeColor,
      pin_code: entry.pinCode || null,
      timestamp_label: entry.timestamp,
      created_at: entry.createdAt
    });
    return !error;
  } catch {
    return false;
  }
}

// Test en direct et synchronisation complète vers Supabase après exécution du script SQL
export async function testAndSyncAllToSupabase(
  weapons: WeaponItem[],
  market: MarketItem[],
  matches: MatchRecord[],
  history: ActivityHistoryItem[]
): Promise<{ ok: boolean; message: string }> {
  if (!supabaseClient) {
    return {
      ok: false,
      message: 'Clés SUPABASE_URL ou SUPABASE_ANON_KEY absentes des Secrets.'
    };
  }
  try {
    const { error: probeError } = await supabaseClient.from('market_items').select('id').limit(1);
    if (probeError) {
      return {
        ok: false,
        message: `Tables non trouvées (${probeError.message}). Collez d'abord le script SQL dans Supabase -> SQL Editor -> Run.`
      };
    }

    await Promise.all([
      ...weapons.map((w) => syncWeaponToSupabase(w)),
      ...market.map((m) => syncMarketItemToSupabase(m)),
      ...matches.map((m) => syncMatchToSupabase(m)),
      ...history.map((h) => syncHistoryItemToSupabase(h))
    ]);

    return {
      ok: true,
      message: `Synchronisation Supabase réussie (${market.length} annonces, ${weapons.length} armes, ${matches.length} matchs).`
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || 'Erreur lors du test de connexion Supabase.'
    };
  }
}

export async function fetchInitialFromSupabase(): Promise<{
  weapons?: WeaponItem[];
  market?: MarketItem[];
  matches?: MatchRecord[];
  history?: ActivityHistoryItem[];
} | null> {
  if (!supabaseClient) return null;
  try {
    const [weaponsRes, marketRes, matchesRes, historyRes] = await Promise.all([
      supabaseClient.from('weapons').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('market_items').select('*'),
      supabaseClient.from('matches').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('activity_history').select('*').order('created_at', { ascending: false })
    ]);

    const result: {
      weapons?: WeaponItem[];
      market?: MarketItem[];
      matches?: MatchRecord[];
      history?: ActivityHistoryItem[];
    } = {};

    if (!weaponsRes.error && Array.isArray(weaponsRes.data) && weaponsRes.data.length > 0) {
      result.weapons = weaponsRes.data.map((w: any) => ({
        id: String(w.id),
        title: String(w.title),
        tier: w.tier,
        tierValue: Number(w.tier_value || 25000),
        emoji: String(w.emoji || '📷'),
        image: String(w.image),
        conditionGrade: w.condition_grade || 'COMME_NEUF',
        conditionPercent: Number(w.condition_percent ?? 88),
        createdAt: w.created_at
      }));
    }

    if (!marketRes.error && Array.isArray(marketRes.data) && marketRes.data.length > 0) {
      result.market = marketRes.data.map((m: any) => ({
        id: String(m.id),
        title: String(m.title),
        tier: m.tier,
        cashPrice: Number(m.cash_price || 25000),
        distance: String(m.distance || '1,5 km'),
        distanceKm: Number(m.distance_km || 1.5),
        quartier: String(m.quartier || 'Libreville'),
        boosted: Boolean(m.boosted),
        status: m.status === 'RESERVED_12H' ? 'RESERVED_12H' : 'AVAILABLE',
        reservedUntil: m.reserved_until || undefined,
        owner: String(m.owner || 'Vendeur'),
        phone: String(m.phone || '241077000000'),
        image: String(m.image),
        conditionGrade: m.condition_grade || 'COMME_NEUF',
        conditionPercent: Number(m.condition_percent ?? 88)
      }));
    }

    if (!matchesRes.error && Array.isArray(matchesRes.data) && matchesRes.data.length > 0) {
      result.matches = matchesRes.data.map((m: any) => ({
        id: String(m.id),
        type: m.type === 'INCOMING' ? 'INCOMING' : 'MUTUAL',
        partnerName: String(m.partner_name),
        partnerQuartier: String(m.partner_quartier),
        partnerPhone: String(m.partner_phone),
        theirItem: {
          conditionGrade: 'COMME_NEUF',
          conditionPercent: 88,
          ...m.their_item
        },
        myItem: {
          conditionGrade: 'COMME_NEUF',
          conditionPercent: 88,
          ...m.my_item
        },
        soulte: Number(m.soulte || 0),
        soulteDirection: m.soulte_direction || 'NONE',
        isCoupeFile: Boolean(m.is_coupe_file),
        status: m.status,
        myPaid: Boolean(m.my_paid),
        theirPaid: Boolean(m.their_paid),
        pinCode: String(m.pin_code || '4829'),
        pinVerified: Boolean(m.pin_verified),
        timestamp: 'Synchronisé',
        expiresAt: Number(m.expires_at || Date.now() + 30 * 60 * 1000)
      }));
    }

    if (!historyRes.error && Array.isArray(historyRes.data) && historyRes.data.length > 0) {
      result.history = historyRes.data.map((h: any) => ({
        id: String(h.id),
        type: h.type,
        title: String(h.title),
        subtitle: String(h.subtitle),
        amountLabel: String(h.amount_label),
        badgeColor: h.badge_color || 'emerald',
        pinCode: h.pin_code || undefined,
        timestamp: String(h.timestamp_label || 'Récent'),
        createdAt: Number(h.created_at || Date.now())
      }));
    }

    return result;
  } catch {
    return null;
  }
}

// ============================================================================
// PROCESSEUR & RECADREUR D'IMAGE 1:1 CARRÉ HAUTE DÉFINITION (1080×1080)
// ============================================================================
export function renderSquare1to1Image(
  sourceDataUrl: string,
  zoom: number = 1,
  offsetXPercent: number = 0,
  offsetYPercent: number = 0,
  targetSize: number = 1080
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(sourceDataUrl);
        return;
      }

      ctx.fillStyle = '#0e1015';
      ctx.fillRect(0, 0, targetSize, targetSize);

      const minSide = Math.min(img.width, img.height);
      const cropSize = minSide / Math.max(1, zoom);
      const maxOffsetX = (img.width - cropSize) / 2;
      const maxOffsetY = (img.height - cropSize) / 2;

      const centerX = img.width / 2 - (offsetXPercent / 100) * maxOffsetX;
      const centerY = img.height / 2 - (offsetYPercent / 100) * maxOffsetY;

      const sx = Math.max(0, Math.min(img.width - cropSize, centerX - cropSize / 2));
      const sy = Math.max(0, Math.min(img.height - cropSize, centerY - cropSize / 2));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, targetSize, targetSize);

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(sourceDataUrl);
    img.src = sourceDataUrl;
  });
}

// Télécharger n'importe quelle image au format 1:1 carré PNG UHD (1080×1080)
export function downloadImage1to1Square(imageSrc: string, title: string): void {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const size = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0e1015';
    ctx.fillRect(0, 0, size, size);

    const minSide = Math.min(img.width || size, img.height || size);
    const sx = ((img.width || size) - minSide) / 2;
    const sy = ((img.height || size) - minSide) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeName = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    link.download = `fast-troc-1x1-${safeName || 'produit'}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  img.src = imageSrc;
}

export function loadWeapons(): WeaponItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEAPONS);
    if (!raw) return INITIAL_WEAPONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WEAPONS;
  } catch {
    return INITIAL_WEAPONS;
  }
}

export function saveWeapons(weapons: WeaponItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WEAPONS, JSON.stringify(weapons));
  } catch {
    // ignore
  }
}

export function loadMarketItems(): MarketItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MARKET);
    if (!raw) return INITIAL_MARKET;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MARKET;
  } catch {
    return INITIAL_MARKET;
  }
}

export function saveMarketItems(items: MarketItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MARKET, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function loadMatches(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (!raw) return INITIAL_MATCHES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MATCHES;
  } catch {
    return INITIAL_MATCHES;
  }
}

export function saveMatches(matches: MatchRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  } catch {
    // ignore
  }
}

export function loadWallet(): WalletMetrics {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WALLET);
    if (!raw) return INITIAL_WALLET;
    return { ...INITIAL_WALLET, ...JSON.parse(raw) };
  } catch {
    return INITIAL_WALLET;
  }
}

export function saveWallet(wallet: WalletMetrics): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
  } catch {
    // ignore
  }
}

export function loadSentOffers(): Record<string, SentOfferInfo> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SENT_OFFERS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveSentOffers(offers: Record<string, SentOfferInfo>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SENT_OFFERS, JSON.stringify(offers));
  } catch {
    // ignore
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return INITIAL_PROFILE;
    return { ...INITIAL_PROFILE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function loadActivityHistory(): ActivityHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return INITIAL_HISTORY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_HISTORY;
  } catch {
    return INITIAL_HISTORY;
  }
}

export function saveActivityHistory(history: ActivityHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function resetAllDemoData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
