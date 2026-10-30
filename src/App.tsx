import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Bell,
  Zap,
  Camera,
  RefreshCw,
  Check,
  X,
  Flame,
  ShieldCheck,
  ArrowLeftRight,
  Clock,
  QrCode,
  MessageCircle,
  Banknote,
  Lock,
  Upload,
  Rocket,
  UserX,
  Database,
  Copy,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Award,
  TrendingUp,
  ZoomIn,
  Download,
  Maximize2,
  Move,
  SlidersHorizontal,
  User,
  ShoppingBag,
  History,
  CheckCircle2,
  Info,
  Trash2,
  Edit3
} from 'lucide-react';
import {
  CONDITION_GRADES,
  getConditionSpec,
  INCOMING_CHALLENGERS,
  INITIAL_HISTORY,
  INITIAL_MARKET,
  INITIAL_MATCHES,
  INITIAL_PROFILE,
  INITIAL_WALLET,
  INITIAL_WEAPONS,
  PRESET_PHOTOS,
  SUPABASE_SCHEMA_SQL,
  TOKEN_PACKS
} from './data/initialData';
import {
  downloadImage1to1Square,
  fetchInitialFromSupabase,
  isSupabaseConfigured,
  loadActivityHistory,
  loadMarketItems,
  loadMatches,
  loadSentOffers,
  loadUserProfile,
  loadWallet,
  loadWeapons,
  renderSquare1to1Image,
  resetAllDemoData,
  saveActivityHistory,
  saveMarketItems,
  saveMatches,
  saveSentOffers,
  saveUserProfile,
  saveWallet,
  saveWeapons,
  syncHistoryItemToSupabase,
  syncMarketItemToSupabase,
  syncMatchToSupabase,
  syncWeaponToSupabase,
  testAndSyncAllToSupabase
} from './lib/storage';
import {
  ActivityHistoryItem,
  ConditionGradeId,
  ItemTier,
  MarketItem,
  MatchRecord,
  SentOfferInfo,
  SoulteAmount,
  TokenPackOffer,
  UserProfile,
  ValueTier,
  WalletMetrics,
  WeaponItem
} from './types/troc';

type MainTab = 'market' | 'shop' | 'matches' | 'profile';

type ActiveModal =
  | 'none'
  | 'add_photo'
  | 'inspect_item'
  | 'condition_guide'
  | 'cash_buy'
  | 'ticket_view'
  | 'incoming_alert'
  | 'weapon_drawer'
  | 'gps_radar';

const SPRING_120FPS = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 36,
  mass: 0.6
};

export default function App() {
  // Navigation principale à 4 onglets : 'market' | 'shop' | 'matches' | 'profile'
  const [activeTab, setActiveTab] = useState<MainTab>('market');

  // Sous-onglet du Profil : 'history' | 'weapons' | 'supabase'
  const [profileSubTab, setProfileSubTab] = useState<'history' | 'weapons' | 'supabase'>('history');

  // Opérateur Mobile Money sélectionné dans le Mini-Market Jetons
  const [selectedOperator, setSelectedOperator] = useState<'Airtel Money' | 'Moov Money'>(
    'Airtel Money'
  );

  // Filtre de puissance : 'Tous' | '10k' | '25k' | '50k' | '100k+'
  const [selectedTier, setSelectedTier] = useState<ValueTier>('25k');

  // Rayon GPS à Libreville (en km)
  const [gpsRadiusKm, setGpsRadiusKm] = useState<number>(5);

  // Portefeuille de Jetons & Métriques (1 Jeton = 300 FCFA)
  const [wallet, setWallet] = useState<WalletMetrics>(() => loadWallet());

  // Profil Utilisateur & Historique d'activité
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>(() =>
    loadActivityHistory()
  );

  // Inventaire de l'utilisateur ("Mes Armes") et arme active
  const [weapons, setWeapons] = useState<WeaponItem[]>(() => loadWeapons());
  const [activeWeaponIndex, setActiveWeaponIndex] = useState<number>(0);
  const activeWeapon = weapons[activeWeaponIndex] || weapons[0];

  // Rajout cash actif (Soulte : 0, 2000, 5000, 10000)
  const [activeSoulte, setActiveSoulte] = useState<SoulteAmount>(0);

  // Catalogue du marché et offres envoyées en 1 clic
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => loadMarketItems());
  const [sentOffers, setSentOffers] = useState<Record<string, SentOfferInfo>>(() =>
    loadSentOffers()
  );

  // Liste des matchs & attaques
  const [matches, setMatches] = useState<MatchRecord[]>(() => loadMatches());

  // Modales actives & sélections
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [selectedMarketItem, setSelectedMarketItem] = useState<MarketItem | null>(null);
  const [inspectedItem, setInspectedItem] = useState<MarketItem | null>(null);
  const [selectedTicketMatch, setSelectedTicketMatch] = useState<MatchRecord | null>(null);
  const [incomingAlertMatch, setIncomingAlertMatch] = useState<MatchRecord | null>(null);
  const [challengerCursor, setChallengerCursor] = useState<number>(0);

  // État de l'Inspecteur UHD (Zoom 1x - 4x + Loupe interactive)
  const [inspectZoom, setInspectZoom] = useState<number>(1);
  const [inspectOrigin, setInspectOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Chronomètre temps réel (tick chaque seconde pour le compte à rebours de 30 min)
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  // Notification Toast ultra-rapide
  const [toast, setToast] = useState<{ msg: string; type: 'green' | 'orange' | 'dark' } | null>(
    null
  );

  // Studio d'Upload & Recadrage 1:1 Carré UHD + Grille d'État (5 niveaux)
  const [newItemTitle, setNewItemTitle] = useState<string>('');
  const [newItemTier, setNewItemTier] = useState<ItemTier>('25k');
  const [newItemConditionGrade, setNewItemConditionGrade] =
    useState<ConditionGradeId>('COMME_NEUF');
  const [newItemConditionPercent, setNewItemConditionPercent] = useState<number>(88);
  const [newItemPresetIndex, setNewItemPresetIndex] = useState<number>(0);
  const [rawUploadedImage, setRawUploadedImage] = useState<string | null>(null);
  const [croppedSquarePreview, setCroppedSquarePreview] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropOffsetX, setCropOffsetX] = useState<number>(0);
  const [cropOffsetY, setCropOffsetY] = useState<number>(0);
  const [publishToMarketAlso, setPublishToMarketAlso] = useState<boolean>(true);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // État copie SQL Supabase & test de connexion en direct
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [supabaseSynced, setSupabaseSynced] = useState<boolean>(isSupabaseConfigured);
  const [supabaseStatusMessage, setSupabaseStatusMessage] = useState<string>('');
  const [testingSupabase, setTestingSupabase] = useState<boolean>(false);

  // Ajouter une entrée dans l'historique utilisateur + sync Supabase
  const appendHistory = (
    entry: Omit<ActivityHistoryItem, 'id' | 'timestamp' | 'createdAt'>
  ) => {
    const newEntry: ActivityHistoryItem = {
      ...entry,
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: 'À l’instant',
      createdAt: Date.now()
    };
    setActivityHistory((prev) => [newEntry, ...prev]);
    syncHistoryItemToSupabase(newEntry);
  };

  // Chargement initial depuis Supabase si les clés SUPABASE_URL & SUPABASE_ANON_KEY sont actives
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let mounted = true;
    fetchInitialFromSupabase().then((remote) => {
      if (!mounted || !remote) return;
      if (remote.weapons && remote.weapons.length > 0) setWeapons(remote.weapons);
      if (remote.market && remote.market.length > 0) setMarketItems(remote.market);
      if (remote.matches && remote.matches.length > 0) setMatches(remote.matches);
      if (remote.history && remote.history.length > 0) setActivityHistory(remote.history);
      setSupabaseSynced(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Recadrage 1:1 temps réel dès que l'utilisateur ajuste le zoom ou le cadrage de son image
  useEffect(() => {
    if (!rawUploadedImage) {
      setCroppedSquarePreview(null);
      return;
    }
    let cancelled = false;
    renderSquare1to1Image(rawUploadedImage, cropZoom, cropOffsetX, cropOffsetY, 1080).then(
      (squareDataUrl) => {
        if (!cancelled) setCroppedSquarePreview(squareDataUrl);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [rawUploadedImage, cropZoom, cropOffsetX, cropOffsetY]);

  // Synchronisation automatique vers localStorage
  useEffect(() => {
    saveWallet(wallet);
  }, [wallet]);

  useEffect(() => {
    saveWeapons(weapons);
  }, [weapons]);

  useEffect(() => {
    saveMarketItems(marketItems);
  }, [marketItems]);

  useEffect(() => {
    saveMatches(matches);
  }, [matches]);

  useEffect(() => {
    saveSentOffers(sentOffers);
  }, [sentOffers]);

  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveActivityHistory(activityHistory);
  }, [activityHistory]);

  // Tick chaque seconde pour les comptes à rebours de 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Vibration haptique légère sur mobile
  const triggerHaptic = (pattern: number | number[] = 30) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore
    }
  };

  // Notification éclair
  const triggerToast = (msg: string, type: 'green' | 'orange' | 'dark' = 'orange') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast((prev) => (prev?.msg === msg ? null : prev));
    }, 2600);
  };

  // Formatage MM:SS pour le compte à rebours anti-blocage de 30 minutes
  const formatCountdown = (expiresAt: number) => {
    const diffSec = Math.max(0, Math.floor((expiresAt - nowMs) / 1000));
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Filtrage des articles du marché par palier et rayon GPS
  const filteredMarket = useMemo(() => {
    return marketItems
      .filter((item) => {
        const matchesTier = selectedTier === 'Tous' || item.tier === selectedTier;
        const matchesRadius = item.distanceKm <= gpsRadiusKm;
        return matchesTier && matchesRadius;
      })
      .sort((a, b) => Number(b.boosted) - Number(a.boosted));
  }, [marketItems, selectedTier, gpsRadiusKm]);

  // Changer d'arme active en 1 clic (Bouton 🔄)
  const cycleWeapon = () => {
    triggerHaptic(20);
    const nextIndex = (activeWeaponIndex + 1) % weapons.length;
    setActiveWeaponIndex(nextIndex);
    const nextW = weapons[nextIndex];
    const cond = getConditionSpec(nextW.conditionGrade);
    triggerToast(`Arme active : ${nextW.title} (${cond.label} ${nextW.conditionPercent}%)`, 'dark');
  };

  // Basculer la pastille de soulte (+2k, +5k, +10k)
  const toggleSoulte = (amount: SoulteAmount) => {
    triggerHaptic(18);
    setActiveSoulte((prev) => (prev === amount ? 0 : amount));
  };

  // Ouvrir l'Inspecteur UHD d'une annonce
  const openProductInspector = (item: MarketItem) => {
    triggerHaptic(20);
    setInspectedItem(item);
    setInspectZoom(1);
    setInspectOrigin({ x: 50, y: 50 });
    setActiveModal('inspect_item');
  };

  // Déplacement de la loupe tactile / souris dans l'Inspecteur UHD
  const handleInspectPointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inspectZoom <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setInspectOrigin({ x, y });
  };

  const handleInspectTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (inspectZoom <= 1 || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setInspectOrigin({ x, y });
  };

  // ============================================================================
  // ACTION PRINCIPALE : ⚡ TROQUER EN 1 CLIC (< 3 SECONDES)
  // ============================================================================
  const handleInstantTrade = (item: MarketItem) => {
    if (item.status === 'RESERVED_12H' && !sentOffers[item.id]) {
      triggerToast(`⏳ Cet objet est déjà réservé pour 12h.`, 'dark');
      return;
    }

    if (sentOffers[item.id]) {
      setActiveModal('none');
      setActiveTab('matches');
      triggerToast(`Consultez vos matchs pour débloquer ${item.owner}`, 'orange');
      return;
    }

    triggerHaptic([35, 45, 35]);

    const newMatchId = `match-${Date.now()}`;
    const offerData: SentOfferInfo = {
      weapon: activeWeapon,
      soulte: activeSoulte,
      isCoupeFile: false,
      matchId: newMatchId
    };

    setSentOffers((prev) => ({ ...prev, [item.id]: offerData }));

    const newMatch: MatchRecord = {
      id: newMatchId,
      type: 'MUTUAL',
      partnerName: item.owner,
      partnerQuartier: `${item.quartier} (${item.distance})`,
      partnerPhone: item.phone,
      marketItemId: item.id,
      theirItem: {
        title: item.title,
        tier: item.tier,
        image: item.image,
        conditionGrade: item.conditionGrade,
        conditionPercent: item.conditionPercent
      },
      myItem: activeWeapon,
      soulte: activeSoulte,
      soulteDirection: activeSoulte > 0 ? 'FROM_ME' : 'NONE',
      isCoupeFile: false,
      status: 'ACCEPTED_LOCKED',
      myPaid: false,
      theirPaid: true,
      pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
      pinVerified: false,
      timestamp: 'À l’instant',
      expiresAt: Date.now() + 30 * 60 * 1000
    };

    setMatches((prev) => [newMatch, ...prev]);
    syncMatchToSupabase(newMatch);

    const updatedItem: MarketItem = {
      ...item,
      status: 'RESERVED_12H',
      reservedUntil: '12h00'
    };
    setMarketItems((prev) => prev.map((m) => (m.id === item.id ? updatedItem : m)));
    syncMarketItemToSupabase(updatedItem);

    const soulteText = activeSoulte > 0 ? ` + ${activeSoulte / 1000}k FCFA` : '';
    appendHistory({
      type: 'OFFER_SENT',
      title: `Offre envoyée à ${item.owner}`,
      subtitle: `${activeWeapon.title} (${activeWeapon.conditionPercent}%) ↔ ${item.title} (${item.conditionPercent}%)`,
      amountLabel: activeSoulte > 0 ? `+${activeSoulte / 1000}k FCFA` : 'Échange net',
      badgeColor: 'orange'
    });

    triggerToast(`Offre envoyée ✓ (${activeWeapon.title}${soulteText})`, 'green');
  };

  // ============================================================================
  // OPTION PRIORITAIRE « COUPE-FILE » (500 FCFA)
  // ============================================================================
  const handleBoostCoupeFile = (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const sent = sentOffers[itemId];
    if (!sent || sent.isCoupeFile) return;

    triggerHaptic([40, 60, 40]);

    setSentOffers((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], isCoupeFile: true }
    }));

    setMatches((prev) => {
      const updated = prev.map((m) => {
        if (m.id === sent.matchId) {
          const boostedMatch = { ...m, isCoupeFile: true, timestamp: '🚀 Épinglé en tête' };
          syncMatchToSupabase(boostedMatch);
          return boostedMatch;
        }
        return m;
      });
      return updated.sort((a, b) => Number(b.isCoupeFile) - Number(a.isCoupeFile));
    });

    const usedPrepaidBoost = wallet.boostCredits > 0;
    setWallet((prev) => ({
      ...prev,
      boostCredits: usedPrepaidBoost ? prev.boostCredits - 1 : prev.boostCredits,
      platformRevenueFcfa: usedPrepaidBoost
        ? prev.platformRevenueFcfa
        : prev.platformRevenueFcfa + 500,
      coupeFileCount: prev.coupeFileCount + 1
    }));

    appendHistory({
      type: 'BOOST_COUPE_FILE',
      title: 'Offre Prioritaire Coupe-File activée',
      subtitle: `Proposition épinglée en tête avec sonnerie prioritaire`,
      amountLabel: usedPrepaidBoost ? '-1 Pass Boost' : '500 FCFA',
      badgeColor: 'amber'
    });

    triggerToast('🚀 Offre Coupe-File épinglée tout en haut chez le vendeur !', 'orange');
  };

  // ============================================================================
  // ALERTE PLEIN ÉCRAN D'ATTAQUE ENTRANTE (5 SECONDES)
  // ============================================================================
  const triggerIncomingAttackAlert = () => {
    triggerHaptic([60, 80, 60]);
    const existingPending = matches.find((m) => m.status === 'PENDING_DECISION');
    if (existingPending) {
      setIncomingAlertMatch(existingPending);
      setActiveModal('incoming_alert');
      return;
    }

    const template = INCOMING_CHALLENGERS[challengerCursor % INCOMING_CHALLENGERS.length];
    setChallengerCursor((prev) => prev + 1);

    const incomingMatch: MatchRecord = {
      id: `match-in-${Date.now()}`,
      type: 'INCOMING',
      partnerName: template.partnerName,
      partnerQuartier: template.partnerQuartier,
      partnerPhone: template.partnerPhone,
      theirItem: template.theirItem,
      myItem: activeWeapon,
      soulte: template.soulte,
      soulteDirection: template.soulte > 0 ? 'TO_ME' : 'NONE',
      isCoupeFile: template.isCoupeFile,
      status: 'PENDING_DECISION',
      myPaid: false,
      theirPaid: true,
      pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
      pinVerified: false,
      timestamp: 'À l’instant',
      expiresAt: Date.now() + 30 * 60 * 1000
    };

    setMatches((prev) => [incomingMatch, ...prev]);
    syncMatchToSupabase(incomingMatch);
    setIncomingAlertMatch(incomingMatch);
    setActiveModal('incoming_alert');
  };

  // Décision en 1 clic sur une attaque entrante
  const handleIncomingDecision = (
    matchId: string,
    decision: 'ACCEPT' | 'REQUIRE_SOULTE' | 'REJECT',
    requiredSoulte = 0
  ) => {
    triggerHaptic(40);

    if (decision === 'REJECT') {
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      setActiveModal('none');
      setIncomingAlertMatch(null);
      triggerToast('Offre refusée et écartée.', 'dark');
      return;
    }

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const updated: MatchRecord =
          decision === 'ACCEPT'
            ? {
                ...m,
                status: 'ACCEPTED_LOCKED',
                expiresAt: Date.now() + 30 * 60 * 1000
              }
            : {
                ...m,
                soulte: requiredSoulte,
                soulteDirection: 'TO_ME',
                status: 'ACCEPTED_LOCKED',
                expiresAt: Date.now() + 30 * 60 * 1000
              };
        syncMatchToSupabase(updated);
        return updated;
      })
    );

    setActiveModal('none');
    setIncomingAlertMatch(null);
    setActiveTab('matches');

    if (decision === 'ACCEPT') {
      triggerToast('Accord verrouillé ! Compte à rebours 30 min lancé (300 FCFA).', 'green');
    } else {
      triggerToast(
        `Contre-offre (+${requiredSoulte / 1000}k FCFA) acceptée et verrouillée !`,
        'orange'
      );
    }
  };

  // ============================================================================
  // DÉBLOCAGE BILATÉRAL (300 FCFA × 2 = 600 FCFA / MATCH) & PROTOCOLE JETON
  // ============================================================================
  const handleUnlockMatch = (match: MatchRecord) => {
    if (wallet.tokens <= 0) {
      setActiveTab('shop');
      triggerToast('🪙 Solde à 0 : Rechargez un Pack de Jetons dans la Boutique !', 'orange');
      return;
    }

    triggerHaptic([40, 60, 80]);

    setWallet((prev) => ({
      ...prev,
      tokens: prev.tokens - 1,
      platformRevenueFcfa: prev.platformRevenueFcfa + 600
    }));

    const updatedMatch: MatchRecord = {
      ...match,
      status: 'UNLOCKED',
      myPaid: true,
      theirPaid: true
    };

    setMatches((prev) => prev.map((m) => (m.id === match.id ? updatedMatch : m)));
    syncMatchToSupabase(updatedMatch);

    appendHistory({
      type: 'MATCH_UNLOCKED',
      title: `Match débloqué avec ${match.partnerName}`,
      subtitle: `${match.theirItem.title} (${match.theirItem.conditionPercent}%) ↔ ${match.myItem.title} (${match.myItem.conditionPercent}%)`,
      amountLabel: '-1 Jeton (300F)',
      badgeColor: 'emerald',
      pinCode: match.pinCode
    });

    setSelectedTicketMatch(updatedMatch);
    setActiveModal('ticket_view');
    triggerToast('🔓 Match débloqué (-1 Jeton). Ticket Officiel WhatsApp généré !', 'green');
  };

  // Sécurité Anti-Blocage : Si A paie ses 300 FCFA mais que B ne paie pas au bout de 30 min
  const handleSimulatePartnerDefault30Min = (match: MatchRecord) => {
    triggerHaptic([50, 40, 50]);

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== match.id) return m;
        const expired: MatchRecord = {
          ...m,
          status: 'EXPIRED_REFUNDED',
          myPaid: true,
          theirPaid: false,
          timestamp: 'Expiré (30 min)'
        };
        syncMatchToSupabase(expired);
        return expired;
      })
    );

    if (match.marketItemId) {
      setMarketItems((prev) =>
        prev.map((item) =>
          item.id === match.marketItemId ? { ...item, status: 'AVAILABLE' } : item
        )
      );
      setSentOffers((prev) => {
        const copy = { ...prev };
        delete copy[match.marketItemId!];
        return copy;
      });
    }

    setWallet((prev) => ({
      ...prev,
      tokens: prev.tokens + 1,
      platformRevenueFcfa: prev.platformRevenueFcfa + 300
    }));

    appendHistory({
      type: 'TOKEN_REFUND_30M',
      title: `Garantie Anti-Blocage (${match.partnerName})`,
      subtitle: `Délai de 30 min dépassé par le partenaire • +1 Jeton recrédité`,
      amountLabel: '+1 Jeton Gratuit',
      badgeColor: 'sky'
    });

    triggerToast(
      `🛡️ Désistement de ${match.partnerName} (30 min) : +1 Jeton de Troc crédité !`,
      'green'
    );
  };

  // Bouton d'annulation éclair (Si le partenaire ne répond pas dans l'heure sur WhatsApp)
  const handleGhostCancel = (match: MatchRecord) => {
    triggerHaptic(40);

    setMatches((prev) =>
      prev.map((m) => (m.id === match.id ? { ...m, status: 'CANCELLED_GHOST' } : m))
    );

    if (match.marketItemId) {
      setMarketItems((prev) =>
        prev.map((item) =>
          item.id === match.marketItemId ? { ...item, status: 'AVAILABLE' } : item
        )
      );
      setSentOffers((prev) => {
        const copy = { ...prev };
        delete copy[match.marketItemId!];
        return copy;
      });
    }

    setWallet((prev) => ({
      ...prev,
      blockedGhosts: prev.blockedGhosts.includes(match.partnerName)
        ? prev.blockedGhosts
        : [...prev.blockedGhosts, match.partnerName]
    }));

    appendHistory({
      type: 'GHOST_BLOCKED',
      title: `Annulation éclair • ${match.partnerName} bloqué`,
      subtitle: `Aucune réponse WhatsApp après 1h • ${match.myItem.title} remis en ligne`,
      amountLabel: 'Fantôme Bloqué',
      badgeColor: 'red'
    });

    if (activeModal === 'ticket_view') {
      setActiveModal('none');
    }

    triggerToast(
      `⚡ Annulation éclair : Objet remis en ligne et ${match.partnerName} bloqué.`,
      'orange'
    );
  };

  // Validation du Code PIN à 4 chiffres lors de la remise sur le terrain
  const handleVerifyPinCode = (match: MatchRecord) => {
    if (match.pinVerified) return;
    triggerHaptic([30, 50, 80]);

    const updated: MatchRecord = { ...match, pinVerified: true };
    setMatches((prev) => prev.map((m) => (m.id === match.id ? updated : m)));
    syncMatchToSupabase(updated);
    setSelectedTicketMatch(updated);

    setWallet((prev) => ({
      ...prev,
      verifiedTrades: prev.verifiedTrades + 1
    }));

    setUserProfile((prev) => ({
      ...prev,
      totalVolumeFcfa: prev.totalVolumeFcfa + (match.myItem.tierValue || 25000)
    }));

    appendHistory({
      type: 'TROC_PIN_VERIFIED',
      title: `Échange terrain validé avec ${match.partnerName}`,
      subtitle: `${match.theirItem.title} (${match.theirItem.conditionPercent}%) ↔ ${match.myItem.title} (${match.myItem.conditionPercent}%)`,
      amountLabel: `PIN ${match.pinCode} ✓`,
      badgeColor: 'emerald',
      pinCode: match.pinCode
    });

    triggerToast(`🤝 Code PIN ${match.pinCode} validé ! +1 Échange réussi sur votre profil.`, 'green');
  };

  // ============================================================================
  // UPLOAD D'IMAGE PERSONNELLE, FORMAT 1:1 CARRÉ & GRILLE D'ÉTAT (5 NIVEAUX)
  // ============================================================================
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        setRawUploadedImage(reader.result);
        setCropZoom(1);
        setCropOffsetX(0);
        setCropOffsetY(0);
        const square = await renderSquare1to1Image(reader.result, 1, 0, 0, 1080);
        setCroppedSquarePreview(square);
        if (!newItemTitle.trim()) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setNewItemTitle(
            cleanName.length > 2 && !cleanName.toLowerCase().startsWith('img')
              ? cleanName
              : 'Objet Photo 1:1'
          );
        }
        triggerToast('📸 Image convertie au format 1:1 carré UHD !', 'green');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectConditionGrade = (gradeId: ConditionGradeId) => {
    triggerHaptic(15);
    const spec = getConditionSpec(gradeId);
    setNewItemConditionGrade(gradeId);
    setNewItemConditionPercent(spec.defaultPercent);
  };

  const handleQuickPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(45);

    const chosenPreset = PRESET_PHOTOS[newItemPresetIndex];
    const finalTitle =
      newItemTitle.trim() || (croppedSquarePreview ? 'Objet Photo 1:1' : chosenPreset.defaultName);

    const finalSquareImage =
      croppedSquarePreview ||
      (rawUploadedImage
        ? await renderSquare1to1Image(rawUploadedImage, cropZoom, cropOffsetX, cropOffsetY, 1080)
        : chosenPreset.url);

    const tierNumericValue =
      newItemTier === '10k'
        ? 10000
        : newItemTier === '25k'
        ? 25000
        : newItemTier === '50k'
        ? 50000
        : 100000;

    const condSpec = getConditionSpec(newItemConditionGrade);

    const createdWeapon: WeaponItem = {
      id: `w-${Date.now()}`,
      title: finalTitle,
      tier: newItemTier,
      tierValue: tierNumericValue,
      emoji: croppedSquarePreview ? '📷' : chosenPreset.emoji,
      image: finalSquareImage,
      conditionGrade: newItemConditionGrade,
      conditionPercent: newItemConditionPercent,
      createdAt: new Date().toISOString()
    };

    const newWeaponsList = [createdWeapon, ...weapons];
    setWeapons(newWeaponsList);
    setActiveWeaponIndex(0);
    syncWeaponToSupabase(createdWeapon);

    if (publishToMarketAlso) {
      const createdMarketItem: MarketItem = {
        id: `m-${Date.now()}`,
        title: finalTitle,
        tier: newItemTier,
        cashPrice: tierNumericValue,
        distance: '0,4 km',
        distanceKm: 0.4,
        quartier: userProfile.quartier.split('(')[0].trim() || 'Libreville',
        boosted: true,
        status: 'AVAILABLE',
        owner: userProfile.name,
        phone: userProfile.phone,
        image: finalSquareImage,
        conditionGrade: newItemConditionGrade,
        conditionPercent: newItemConditionPercent
      };
      setMarketItems((prev) => [createdMarketItem, ...prev]);
      syncMarketItemToSupabase(createdMarketItem);
    }

    appendHistory({
      type: 'ITEM_PUBLISHED',
      title: `Objet publié en 1:1 : ${finalTitle}`,
      subtitle: `Calibre ${newItemTier} FCFA • État certifié : ${condSpec.label} (${newItemConditionPercent}%)`,
      amountLabel: `${condSpec.colorName} ${newItemConditionPercent}%`,
      badgeColor:
        newItemConditionGrade === 'NEUF'
          ? 'amber'
          : newItemConditionGrade === 'COMME_NEUF'
          ? 'emerald'
          : newItemConditionGrade === 'BON_ETAT'
          ? 'sky'
          : newItemConditionGrade === 'ETAT_CORRECT'
          ? 'orange'
          : 'red'
    });

    setSelectedTier(newItemTier);
    setNewItemTitle('');
    setRawUploadedImage(null);
    setCroppedSquarePreview(null);
    setActiveModal('none');

    triggerToast(
      `🚀 "${finalTitle}" (${condSpec.label} ${newItemConditionPercent}%) publié en 1:1 !`,
      'green'
    );
  };

  // ============================================================================
  // ACHAT DE PACKS DE JETONS & BOOSTS DANS LE MINI-MARKET
  // ============================================================================
  const handleBuyTokenPack = (pack: TokenPackOffer) => {
    triggerHaptic([35, 55, 35]);
    const totalTokens = pack.tokensCount + pack.bonusTokens;

    setWallet((prev) => ({
      ...prev,
      tokens: prev.tokens + totalTokens,
      platformRevenueFcfa: prev.platformRevenueFcfa + pack.priceFcfa
    }));

    appendHistory({
      type: 'TOKEN_PURCHASE',
      title: `Achat ${pack.title}`,
      subtitle: `Réglé via ${selectedOperator} (${pack.priceFcfa.toLocaleString('fr-FR')} FCFA)`,
      amountLabel: `+${totalTokens} Jeton${totalTokens > 1 ? 's' : ''}`,
      badgeColor: 'amber'
    });

    triggerToast(
      `✅ +${totalTokens} Jeton${totalTokens > 1 ? 's' : ''} crédités via ${selectedOperator} !`,
      'green'
    );
  };

  const handleBuyBoostPack = (boostCount: number, priceFcfa: number) => {
    triggerHaptic([35, 55, 35]);
    setWallet((prev) => ({
      ...prev,
      boostCredits: prev.boostCredits + boostCount,
      platformRevenueFcfa: prev.platformRevenueFcfa + priceFcfa
    }));

    appendHistory({
      type: 'BOOST_COUPE_FILE',
      title: `Achat ${boostCount} Pass Boost Coupe-File`,
      subtitle: `Réglé via ${selectedOperator} (${priceFcfa.toLocaleString('fr-FR')} FCFA)`,
      amountLabel: `+${boostCount} Boost${boostCount > 1 ? 's' : ''}`,
      badgeColor: 'orange'
    });

    triggerToast(
      `🚀 +${boostCount} Pass Coupe-File ajoutés via ${selectedOperator} !`,
      'orange'
    );
  };

  // Tester et synchroniser Supabase en direct
  const handleTestAndSyncSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseStatusMessage('Vérification des tables et synchronisation en cours...');
    const res = await testAndSyncAllToSupabase(weapons, marketItems, matches, activityHistory);
    setTestingSupabase(false);
    setSupabaseSynced(res.ok);
    setSupabaseStatusMessage(res.message);
    triggerToast(res.message, res.ok ? 'green' : 'orange');
  };

  // Générer l'URL WhatsApp officielle avec le Ticket d'Échange + État Certifié
  const getWhatsAppTicketUrl = (match: MatchRecord) => {
    const theirCond = getConditionSpec(match.theirItem.conditionGrade);
    const myCond = getConditionSpec(match.myItem.conditionGrade);
    const soulteLabel =
      match.soulte === 0
        ? 'Échange net : 0 FCFA à rajouter'
        : match.soulteDirection === 'FROM_ME'
        ? `Soulte convenue : +${match.soulte.toLocaleString('fr-FR')} FCFA à régler par moi`
        : `Soulte convenue : +${match.soulte.toLocaleString('fr-FR')} FCFA à régler par ${match.partnerName}`;

    const text = encodeURIComponent(
      `⚡ *TICKET D'ÉCHANGE OFFICIEL FAST-TROC* ⚡\n\n` +
        `🤝 Salut ${match.partnerName}, notre accord est verrouillé et débloqué !\n` +
        `📦 Ton objet : *${match.theirItem.title}* (${match.theirItem.tier} FCFA • État certifié : *${theirCond.label} ${match.theirItem.conditionPercent}%*)\n` +
        `🔄 Mon objet : *${match.myItem.title}* (${match.myItem.tier} FCFA • État certifié : *${myCond.label} ${match.myItem.conditionPercent}%*)\n` +
        `💵 *${soulteLabel}* (Verrouillé - Zéro renégociation)\n` +
        `📍 Quartier : *${match.partnerQuartier}*\n` +
        `🔐 Code PIN de remise : *${match.pinCode}*\n\n` +
        `On se retrouve à quel point de remise aujourd'hui ?`
    );
    return `https://wa.me/${match.partnerPhone}?text=${text}`;
  };

  // Réinitialiser la démo
  const handleResetDemo = () => {
    resetAllDemoData();
    setWeapons(INITIAL_WEAPONS);
    setActiveWeaponIndex(0);
    setMarketItems(INITIAL_MARKET);
    setMatches(INITIAL_MATCHES);
    setWallet(INITIAL_WALLET);
    setUserProfile(INITIAL_PROFILE);
    setActivityHistory(INITIAL_HISTORY);
    setSentOffers({});
    setSelectedTier('25k');
    setActiveSoulte(0);
    setActiveModal('none');
    triggerToast('🔄 Données de démonstration réinitialisées', 'dark');
  };

  const incomingPendingCount = matches.filter((m) => m.status === 'PENDING_DECISION').length;
  const activeMatchesCount = matches.filter(
    (m) =>
      m.status === 'PENDING_DECISION' ||
      m.status === 'ACCEPTED_LOCKED' ||
      m.status === 'UNLOCKED'
  ).length;

  const activeWeaponCond = getConditionSpec(activeWeapon.conditionGrade);
  const selectedPublishCond = getConditionSpec(newItemConditionGrade);

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-white flex flex-col lg:flex-row items-center lg:items-start justify-center lg:gap-7 sm:py-5 px-0 sm:px-4 select-none overflow-x-hidden">
      {/* =====================================================================
          CADRE APPLICATION MOBILE NATIVE UHD 120FPS (STYLE X / TIKTOK / IG)
      ===================================================================== */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] bg-[#090b0f] sm:rounded-[38px] sm:border-[1.5px] sm:border-white/[0.12] shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col relative overflow-hidden shrink-0 gpu-120fps">
        {/* TOAST NOTIFICATION ÉCLAIR 120FPS */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.96 }}
              transition={SPRING_120FPS}
              className="absolute top-16 left-3.5 right-3.5 z-50 pointer-events-none gpu-120fps"
            >
              <div
                className={`px-3.5 py-2.5 rounded-2xl shadow-2xl border flex items-center gap-2 text-xs font-extrabold backdrop-blur-xl ${
                  toast.type === 'green'
                    ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100'
                    : toast.type === 'orange'
                    ? 'bg-[#261405]/95 border-[#ff6b00] text-orange-100'
                    : 'bg-[#161922]/95 border-white/15 text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-[#ff6b00] shrink-0 fill-[#ff6b00]" />
                <span className="truncate">{toast.msg}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            ZONE 1 : LE RADAR D'ÉTAT (HEADER FIXE ULTRA-NET)
            📍 Libreville (5 km)   |   🪙 JETONS (Mini-Market)   |   🔔 3
        =================================================================== */}
        <header className="px-3.5 pt-3.5 pb-2.5 flex items-center justify-between bg-[#090b0f]/95 backdrop-blur-xl sticky top-0 z-30 border-b border-white/[0.08] shrink-0">
          {/* Périmètre GPS Automatique */}
          <button
            onClick={() => setActiveModal('gps_radar')}
            className="flex items-center gap-1.5 text-left group min-h-[38px] pr-1 active:scale-95 transition-transform duration-100"
          >
            <MapPin className="w-4 h-4 text-gray-300 group-hover:text-[#ff6b00] transition-colors shrink-0" />
            <span className="text-[15px] font-bold tracking-tight text-white whitespace-nowrap">
              Libreville{' '}
              <span className="text-gray-400 font-medium">({gpsRadiusKm} km)</span>
            </span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Bouton Grille d'État (5 niveaux Or -> Rouge) */}
            <button
              onClick={() => setActiveModal('condition_guide')}
              title="Grille stricte des 5 états (100% Or à <40% Rouge)"
              className="uhd-surface hover:brightness-110 active:scale-95 transition-all duration-100 px-2.5 py-1.5 rounded-full border border-white/[0.12] flex items-center gap-1 min-h-[36px]"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-1" />
              <span className="w-2 h-2 rounded-full bg-sky-400 -ml-1" />
              <span className="text-[11px] font-extrabold text-gray-200">États</span>
            </button>

            {/* Compteur de Jetons UHD -> Ouvre le Mini-Market Jetons */}
            <button
              onClick={() => setActiveTab('shop')}
              className="uhd-surface hover:brightness-110 active:scale-95 transition-all duration-100 px-2.5 py-1.5 rounded-full border border-white/[0.12] flex items-center gap-1.5 min-h-[36px]"
            >
              <span className="w-4 h-4 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-black font-black text-[10px] flex items-center justify-center shadow-sm">
                {wallet.tokens}
              </span>
              <span className="text-xs font-extrabold tracking-wide text-white whitespace-nowrap">
                {wallet.tokens} JETON{wallet.tokens > 1 ? 'S' : ''}
              </span>
            </button>

            {/* Alerte d'attaque (🔔) */}
            <button
              onClick={() => {
                if (incomingPendingCount > 0) {
                  triggerIncomingAttackAlert();
                } else {
                  setActiveTab('matches');
                }
              }}
              title="Alertes d'attaque et matchs"
              className={`uhd-surface active:scale-95 transition-all duration-100 px-2.5 py-1.5 rounded-xl border flex items-center gap-1 min-h-[36px] ${
                incomingPendingCount > 0
                  ? 'border-red-500/80 shadow-[0_0_14px_rgba(239,68,68,0.4)]'
                  : 'border-white/[0.12]'
              }`}
            >
              <Bell className="w-4 h-4 text-[#ff6b00] fill-[#ff6b00]" />
              <span
                className={`text-white text-[11px] font-black px-1.5 py-0.2 rounded-md font-mono-tabular ${
                  incomingPendingCount > 0 ? 'bg-red-600 animate-pulse' : 'bg-red-600'
                }`}
              >
                {activeMatchesCount}
              </span>
            </button>
          </div>
        </header>

        {/* ===================================================================
            CONTENU DES 4 ONGLETS : MARCHÉ | BOUTIQUE | MATCHS | PROFIL
        =================================================================== */}
        {activeTab === 'market' && (
          <>
            {/* ZONE 2 : LE SÉLECTEUR DE PUISSANCE (PILULES UHD) */}
            <div className="px-3.5 py-2.5 flex items-center justify-between gap-1.5 overflow-x-auto bg-[#090b0f] border-b border-white/[0.07] shrink-0">
              {(['Tous', '10k', '25k', '50k', '100k+'] as ValueTier[]).map((tier) => {
                const isSelected = selectedTier === tier;
                return (
                  <button
                    key={tier}
                    onClick={() => {
                      triggerHaptic(15);
                      setSelectedTier(tier);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-extrabold whitespace-nowrap transition-all duration-100 flex items-center justify-center gap-1 active:scale-95 min-h-[36px] ${
                      isSelected
                        ? 'bg-[#222631] text-white border-[1.5px] border-white/80 shadow-[0_2px_10px_rgba(255,255,255,0.08)]'
                        : 'bg-[#13161d] text-gray-300 border border-white/[0.08] hover:bg-[#1b1f29]'
                    }`}
                  >
                    {tier === 'Tous' && (
                      <Flame className="w-3.5 h-3.5 text-[#ff6b00] fill-[#ff6b00] shrink-0" />
                    )}
                    {isSelected && tier !== 'Tous' && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[2.8] shrink-0" />
                    )}
                    <span>{tier}</span>
                  </button>
                );
              })}
            </div>

            {/* Bandeau d'attaque entrante si une offre attend */}
            {incomingPendingCount > 0 && (
              <div className="px-3 pt-2 shrink-0">
                <button
                  onClick={triggerIncomingAttackAlert}
                  className="w-full bg-gradient-to-r from-red-950/90 via-[#2a1508] to-red-950/90 border border-red-500/60 rounded-xl px-3 py-2 flex items-center justify-between text-left shadow-lg active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">
                      ATTAQUE 5S
                    </span>
                    <span className="text-xs font-bold text-gray-100 truncate">
                      {matches.find((m) => m.status === 'PENDING_DECISION')?.partnerName} cible votre{' '}
                      {activeWeapon.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-[#ff7b1c] shrink-0 flex items-center gap-0.5">
                    Voir <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>
            )}

            {/* ZONE 3 : LA GRILLE D'ATTAQUE DIRECTE (2 COLONNES FORMAT 1:1 + BADGE D'ÉTAT) */}
            <div className="flex-1 overflow-y-auto px-3 pt-2.5 pb-44 gpu-120fps">
              <div className="grid grid-cols-2 gap-2.5">
                {filteredMarket.map((item) => {
                  const alreadySent = sentOffers[item.id];
                  const isReserved = item.status === 'RESERVED_12H';
                  const condSpec = getConditionSpec(item.conditionGrade);

                  return (
                    <motion.div
                      layout
                      transition={SPRING_120FPS}
                      key={item.id}
                      className="uhd-card rounded-2xl p-2.5 border border-white/[0.09] flex flex-col justify-between relative overflow-hidden group gpu-120fps"
                    >
                      {/* En-tête de la carte : Palier de prix à gauche + Distance GPS à droite */}
                      <div className="flex items-center justify-between gap-1 mb-1.5 z-10">
                        <span className="bg-[#0b0d12]/95 px-2 py-0.5 rounded-lg text-[11px] font-extrabold text-[#ff7b1c] flex items-center gap-1 border border-[#ff6b00]/30 whitespace-nowrap">
                          <span>🏷️ {item.tier} FCFA</span>
                          {item.boosted && <span title="Prioritaire">🚀</span>}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-300 font-mono-tabular whitespace-nowrap">
                          {item.distance}
                        </span>
                      </div>

                      {/* Photo carrée 1:1 cliquable pour ouvrir l'Inspecteur UHD */}
                      <div
                        onClick={() => openProductInspector(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') openProductInspector(item);
                        }}
                        title="Cliquer pour inspecter l'image en UHD et voir l'état détaillé"
                        className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#0e1015] mb-1.5 cursor-zoom-in border border-white/[0.05]"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200 ease-out"
                        />

                        {/* Badge d'État Strict (Or 100%, Vert clair 88%, Bleu 72%, Orange 55%, Rouge 35%) */}
                        {!alreadySent && (
                          <div className="absolute bottom-1.5 left-1.5 right-8 flex items-center">
                            <span
                              className={`bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-md border ${condSpec.badgeBorder} ${condSpec.badgeText} text-[10px] font-extrabold flex items-center gap-1 truncate shadow-md`}
                            >
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: condSpec.hexColor }}
                              />
                              <span className="truncate">{condSpec.label}</span>
                              <span className="font-mono-tabular">{item.conditionPercent}%</span>
                            </span>
                          </div>
                        )}

                        {/* Indicateur discret Loupe UHD en bas à droite */}
                        {!alreadySent && !isReserved && (
                          <span className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-md text-white/90 p-1 rounded-md border border-white/15">
                            <ZoomIn className="w-3.5 h-3.5" />
                          </span>
                        )}

                        {/* Statut Réservé 12h */}
                        {isReserved && !alreadySent && (
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
                            <Clock className="w-6 h-6 text-amber-400 mb-1" />
                            <span className="text-[11px] font-black text-amber-300 uppercase">
                              Réservé 12h
                            </span>
                            <span className="text-[10px] text-gray-300">Cliquer pour inspecter</span>
                          </div>
                        )}

                        {/* Feedback immédiat : Offre envoyée ✓ + Option Coupe-File 500 FCFA */}
                        {alreadySent && (
                          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
                            <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center mb-1 shadow-lg">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                            <span className="text-[11px] font-black text-emerald-200 uppercase tracking-tight">
                              Offre envoyée ✓
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-300/90 line-clamp-1 mt-0.5">
                              {alreadySent.weapon.title}
                              {alreadySent.soulte > 0 ? ` +${alreadySent.soulte / 1000}k` : ''}
                            </span>

                            {!alreadySent.isCoupeFile ? (
                              <button
                                type="button"
                                onClick={(e) => handleBoostCoupeFile(item.id, e)}
                                className="mt-1.5 bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow active:scale-95 transition-transform whitespace-nowrap"
                              >
                                <Rocket className="w-3 h-3" />
                                <span>
                                  {wallet.boostCredits > 0
                                    ? `Boost (${wallet.boostCredits} dispo)`
                                    : 'Coupe-File (500F)'}
                                </span>
                              </button>
                            ) : (
                              <span className="mt-1.5 bg-amber-400/20 border border-amber-400/50 text-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                🚀 Coupe-File Actif
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Titre de l'objet cliquable pour inspecter */}
                      <button
                        type="button"
                        onClick={() => openProductInspector(item)}
                        className="text-[13px] font-extrabold text-center text-white hover:text-[#ff7b1c] truncate mb-2 px-0.5 transition-colors w-full"
                      >
                        {item.title}
                      </button>

                      {/* Boutons d'Action UHD : [ ⚡ TROQUER ] et [💵] */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleInstantTrade(item)}
                          className={`flex-1 py-2.5 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-transform duration-100 active:scale-[0.96] min-h-[40px] whitespace-nowrap ${
                            alreadySent
                              ? 'uhd-emerald-btn text-black'
                              : 'uhd-orange-btn text-black'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 shrink-0 fill-black" />
                          <span>{alreadySent ? 'Offre envoyée ✓' : 'TROQUER'}</span>
                        </button>

                        <button
                          onClick={() => {
                            triggerHaptic(20);
                            setSelectedMarketItem(item);
                            setActiveModal('cash_buy');
                          }}
                          title={`Achat Cash Immédiat (${item.cashPrice.toLocaleString('fr-FR')} FCFA)`}
                          className="uhd-surface hover:brightness-125 active:scale-[0.95] transition-all duration-100 px-2.5 py-2 rounded-xl border border-white/[0.12] text-sm min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                        >
                          💵
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ===================================================================
            ONGLET 2 : MINI-MARKET DE JETONS & BOOSTS (BOUTIQUE)
        =================================================================== */}
        {activeTab === 'shop' && (
          <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-44 space-y-3.5 gpu-120fps">
            {/* Carte Solde Actuel */}
            <div className="bg-gradient-to-br from-[#23160a] via-[#131720] to-[#0d1016] border border-[#ff6b00]/40 rounded-2xl p-3.5 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                    MINI-MARKET FAST-TROC
                  </span>
                  <h2 className="text-base font-black text-white">
                    Boutique de Jetons & Boosts
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">Solde disponible</span>
                  <span className="text-base font-black text-amber-300 font-mono-tabular">
                    🪙 {wallet.tokens} Jeton{wallet.tokens > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                1 Jeton (<strong className="text-white">300 FCFA</strong>) débloque le numéro WhatsApp et le Ticket Officiel d'un match validé. Si votre partenaire fait défaut après 30 min, votre Jeton vous est intégralement recrédité.
              </p>
            </div>

            {/* Sélecteur d'Opérateur Mobile Money */}
            <div className="bg-[#11141c] p-2 rounded-2xl border border-white/[0.08] flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-300 pl-1.5">
                Payer en 1 clic via :
              </span>
              <div className="flex gap-1.5">
                {(['Airtel Money', 'Moov Money'] as const).map((op) => {
                  const isActive = selectedOperator === op;
                  return (
                    <button
                      key={op}
                      onClick={() => {
                        triggerHaptic(15);
                        setSelectedOperator(op);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        isActive
                          ? op === 'Airtel Money'
                            ? 'bg-red-600 text-white border border-white/60 shadow'
                            : 'bg-sky-500 text-black border border-white/60 shadow'
                          : 'bg-[#1a1e29] text-gray-400 border border-white/10'
                      }`}
                    >
                      {op}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Liste des Packs de Jetons */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-300 px-1">
                Packs de Jetons de Déblocage (300 FCFA / unité)
              </h3>
              {TOKEN_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className={`rounded-2xl p-3 border transition-all flex items-center justify-between gap-3 ${
                    pack.popular
                      ? 'bg-gradient-to-r from-[#26170b] to-[#131722] border-[#ff6b00]'
                      : 'uhd-card border-white/[0.09]'
                  }`}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">{pack.title}</span>
                      {pack.badge && (
                        <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase whitespace-nowrap">
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">{pack.subtitle}</p>
                  </div>

                  <button
                    onClick={() => handleBuyTokenPack(pack)}
                    className="uhd-orange-btn text-black font-black text-xs px-3.5 py-2.5 rounded-xl shrink-0 active:scale-95 transition-transform font-mono-tabular whitespace-nowrap"
                  >
                    {pack.priceFcfa.toLocaleString('fr-FR')} F
                  </button>
                </div>
              ))}
            </div>

            {/* Section Pass Boosts Coupe-File (500 FCFA) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
                  🚀 Pass Prioritaires « Coupe-File »
                </h3>
                <span className="text-[11px] font-bold text-gray-400">
                  En stock : {wallet.boostCredits} Pass
                </span>
              </div>

              <div className="uhd-card rounded-2xl p-3 border border-white/[0.09] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-black text-white block">
                    1 Pass Coupe-File Prioritaire
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Épingle votre proposition tout en haut de l'écran du vendeur
                  </span>
                </div>
                <button
                  onClick={() => handleBuyBoostPack(1, 500)}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-black text-xs px-3.5 py-2.5 rounded-xl shrink-0 active:scale-95 transition-transform font-mono-tabular"
                >
                  500 F
                </button>
              </div>

              <div className="uhd-card rounded-2xl p-3 border border-amber-400/30 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-300">
                      Pack 3 Pass Coupe-File
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-1.5 py-0.5 rounded">
                      -300 FCFA
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 block">
                    Idéal pour passer devant tout le monde sur les iPhones & consoles
                  </span>
                </div>
                <button
                  onClick={() => handleBuyBoostPack(3, 1200)}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-black text-xs px-3.5 py-2.5 rounded-xl shrink-0 active:scale-95 transition-transform font-mono-tabular"
                >
                  1 200 F
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 3 : CENTRE DE RÉACTION RAPIDE (MATCHS, 30 MIN & WHATSAPP)
        =================================================================== */}
        {activeTab === 'matches' && (
          <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-44 space-y-3 gpu-120fps">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 uppercase">
                  <Zap className="w-4 h-4 text-[#ff6b00] fill-[#ff6b00]" />
                  Protocole Action-Réaction ({matches.length})
                </h2>
                <p className="text-[11px] text-gray-400">
                  Double engagement : 300 FCFA × 2 • Garantie Jeton en 30 min
                </p>
              </div>
              <button
                onClick={() => setActiveTab('market')}
                className="text-xs font-extrabold text-[#ff6b00] bg-[#ff6b00]/10 px-2.5 py-1.5 rounded-lg border border-[#ff6b00]/30 whitespace-nowrap active:scale-95 transition-transform"
              >
                ← Marché
              </button>
            </div>

            {matches.map((match) => {
              const countdownText = formatCountdown(match.expiresAt);
              const theirCond = getConditionSpec(match.theirItem.conditionGrade);
              const myCond = getConditionSpec(match.myItem.conditionGrade);

              return (
                <div
                  key={match.id}
                  className={`rounded-2xl p-3 border transition-all ${
                    match.status === 'PENDING_DECISION'
                      ? 'bg-gradient-to-b from-[#261710] to-[#12151c] border-[#ff6b00]'
                      : match.status === 'UNLOCKED'
                      ? 'bg-[#101d17] border-emerald-500/50'
                      : match.status === 'EXPIRED_REFUNDED' || match.status === 'CANCELLED_GHOST'
                      ? 'bg-[#12141a] border-white/10 opacity-75'
                      : 'uhd-card border-white/15'
                  }`}
                >
                  {/* En-tête du Match */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase whitespace-nowrap ${
                          match.status === 'PENDING_DECISION'
                            ? 'bg-[#ff6b00] text-black'
                            : match.status === 'UNLOCKED'
                            ? 'bg-emerald-500 text-black'
                            : match.status === 'EXPIRED_REFUNDED'
                            ? 'bg-amber-400 text-black'
                            : match.status === 'CANCELLED_GHOST'
                            ? 'bg-red-500/30 text-red-200'
                            : 'bg-amber-400 text-black'
                        }`}
                      >
                        {match.status === 'PENDING_DECISION'
                          ? '🔔 Attaque Entrante'
                          : match.status === 'UNLOCKED'
                          ? '🔓 WhatsApp Débloqué'
                          : match.status === 'EXPIRED_REFUNDED'
                          ? '🪙 +1 Jeton Crédité'
                          : match.status === 'CANCELLED_GHOST'
                          ? '🚫 Fantôme Bloqué'
                          : '⏳ En attente déblocage'}
                      </span>
                      {match.isCoupeFile && (
                        <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black px-1.5 py-0.5 rounded whitespace-nowrap">
                          🚀 Coupe-File
                        </span>
                      )}
                      <span className="text-xs font-bold text-gray-200 truncate">
                        {match.partnerName}
                      </span>
                    </div>

                    {match.status === 'ACCEPTED_LOCKED' ? (
                      <span className="text-[11px] font-mono-tabular font-extrabold text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30 shrink-0">
                        <Clock className="w-3 h-3" /> {countdownText}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 shrink-0">{match.timestamp}</span>
                    )}
                  </div>

                  {/* Comparaison Visuelle Côte à Côte 1:1 avec État Certifié */}
                  <div className="grid grid-cols-11 gap-1.5 items-center bg-[#0b0d12] p-2 rounded-xl border border-white/[0.06] mb-2">
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <img
                        src={match.theirItem.image}
                        alt={match.theirItem.title}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 aspect-square rounded-lg object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-[#ff7b1c] font-extrabold block truncate">
                          EN FACE ({match.theirItem.tier})
                        </span>
                        <p className="text-xs font-bold text-white truncate">
                          {match.theirItem.title}
                        </p>
                        <span className={`text-[10px] font-bold ${theirCond.badgeText} block`}>
                          {theirCond.label} {match.theirItem.conditionPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ff6b00]/20 border border-[#ff6b00] flex items-center justify-center">
                        <ArrowLeftRight className="w-3 h-3 text-[#ff6b00]" />
                      </div>
                    </div>

                    <div className="col-span-5 flex items-center gap-2 justify-end text-right min-w-0">
                      <div className="min-w-0">
                        <span className="text-[10px] text-emerald-400 font-extrabold block truncate">
                          VOTRE ARME ({match.myItem.tier})
                        </span>
                        <p className="text-xs font-bold text-white truncate">
                          {match.myItem.title}
                        </p>
                        <span className={`text-[10px] font-bold ${myCond.badgeText} block`}>
                          {myCond.label} {match.myItem.conditionPercent}%
                        </span>
                      </div>
                      <img
                        src={match.myItem.image}
                        alt={match.myItem.title}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 aspect-square rounded-lg object-cover shrink-0 border border-white/10"
                      />
                    </div>
                  </div>

                  {/* Bandeau de Soulte Verrouillée */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-xs mb-2.5">
                    <span className="text-gray-300 font-medium">Soulte convenue :</span>
                    {match.soulte === 0 ? (
                      <span className="font-bold text-gray-200">Échange net : 0 FCFA</span>
                    ) : match.soulteDirection === 'TO_ME' ? (
                      <span className="font-black text-emerald-400">
                        +{match.soulte.toLocaleString('fr-FR')} FCFA pour vous
                      </span>
                    ) : (
                      <span className="font-black text-[#ff7b1c]">
                        Vous rajoutez +{match.soulte.toLocaleString('fr-FR')} FCFA
                      </span>
                    )}
                  </div>

                  {/* Actions selon statut */}
                  {match.status === 'PENDING_DECISION' && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleIncomingDecision(match.id, 'ACCEPT')}
                          className="flex-1 uhd-emerald-btn text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-transform"
                        >
                          <Check className="w-4 h-4 stroke-[3]" /> ACCEPTER
                        </button>
                        <button
                          onClick={() => {
                            setIncomingAlertMatch(match);
                            setActiveModal('incoming_alert');
                          }}
                          className="bg-[#ff6b00]/20 hover:bg-[#ff6b00]/30 text-[#ff7b1c] font-extrabold text-xs px-3 py-2.5 rounded-xl border border-[#ff6b00]/40"
                        >
                          Plein écran
                        </button>
                        <button
                          onClick={() => handleIncomingDecision(match.id, 'REJECT')}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs px-3 py-2.5 rounded-xl border border-red-500/30 active:scale-95"
                        >
                          Refuser
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-1 pt-1">
                        <span className="text-[11px] text-gray-400">Exiger un rajout :</span>
                        <div className="flex gap-1">
                          {[2000, 5000, 10000].map((amt) => (
                            <button
                              key={amt}
                              onClick={() =>
                                handleIncomingDecision(match.id, 'REQUIRE_SOULTE', amt)
                              }
                              className="bg-[#232834] hover:bg-[#ff6b00] hover:text-black text-gray-200 text-[11px] font-extrabold px-2 py-1 rounded-lg border border-white/10 transition-colors"
                            >
                              +{amt / 1000}k FCFA
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {match.status === 'ACCEPTED_LOCKED' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <span className="text-emerald-400 font-bold">
                          ✓ {match.partnerName} : 300F validé
                        </span>
                        <span className="text-amber-300 font-bold">
                          Vous : 1 Jeton (300 FCFA) requis
                        </span>
                      </div>

                      <button
                        onClick={() => handleUnlockMatch(match)}
                        className="w-full uhd-orange-btn text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>DÉBLOQUER WHATSAPP & TICKET (1 JETON / 300F)</span>
                      </button>

                      <button
                        onClick={() => handleSimulatePartnerDefault30Min(match)}
                        className="w-full bg-[#1f2430] hover:bg-[#282e3d] text-gray-300 text-[11px] font-bold py-1.5 px-2.5 rounded-lg border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          Simuler désistement 30 min (Créditer +1 Jeton de garantie)
                        </span>
                      </button>
                    </div>
                  )}

                  {match.status === 'UNLOCKED' && (
                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        <a
                          href={getWhatsAppTicketUrl(match)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 uhd-emerald-btn text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                        >
                          <MessageCircle className="w-4 h-4 fill-black" />
                          <span>OUVRIR WHATSAPP</span>
                        </a>
                        <button
                          onClick={() => {
                            setSelectedTicketMatch(match);
                            setActiveModal('ticket_view');
                          }}
                          className="uhd-surface text-white font-bold text-xs px-3 py-2.5 rounded-xl border border-white/15 flex items-center gap-1 active:scale-95"
                        >
                          <QrCode className="w-4 h-4 text-[#ff6b00]" />
                          <span>Ticket PIN ({match.pinCode})</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px] text-gray-400">
                          {match.pinVerified
                            ? '✅ Remise validée par Code PIN'
                            : '⏳ Réservé 12h • Sans réponse après 1h ?'}
                        </span>
                        {!match.pinVerified && (
                          <button
                            onClick={() => handleGhostCancel(match)}
                            className="text-[11px] font-extrabold text-red-400 hover:text-red-300 flex items-center gap-1"
                          >
                            <UserX className="w-3 h-3" /> Annulation éclair
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {match.status === 'EXPIRED_REFUNDED' && (
                    <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1.5 font-semibold">
                      Garantie Anti-Blocage activée : +1 Jeton de Troc crédité sur votre portefeuille pour débloquer gratuitement votre prochain match.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================================
            ONGLET 4 : PROFIL UTILISATEUR, HISTORIQUE & ASSISTANT SUPABASE
        =================================================================== */}
        {activeTab === 'profile' && (
          <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-44 space-y-3.5 gpu-120fps">
            {/* Carte d'Identité Troqueur Certifié */}
            <div className="uhd-card rounded-2xl p-3.5 border border-white/[0.1] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-amber-600 text-black font-black text-lg flex items-center justify-center shadow-lg shrink-0">
                    {userProfile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm font-black text-white truncate">
                        {userProfile.name}
                      </h2>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-1.5 py-0.2 rounded">
                        {userProfile.trustScore}% FIABLE
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{userProfile.quartier}</p>
                    <p className="text-[11px] text-gray-400 font-mono-tabular">
                      WhatsApp : +{userProfile.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingProfile((prev) => !prev)}
                  className="uhd-surface p-2 rounded-xl border border-white/10 text-gray-300 hover:text-white"
                  title="Modifier mon profil"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {isEditingProfile && (
                <div className="bg-[#0b0d12] p-2.5 rounded-xl border border-white/10 space-y-2">
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) =>
                      setUserProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Votre nom"
                    className="w-full bg-[#141720] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={userProfile.quartier}
                    onChange={(e) =>
                      setUserProfile((prev) => ({ ...prev, quartier: e.target.value }))
                    }
                    placeholder="Votre quartier à Libreville"
                    className="w-full bg-[#141720] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={userProfile.phone}
                    onChange={(e) =>
                      setUserProfile((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="Numéro WhatsApp (ex: 241077...)"
                    className="w-full bg-[#141720] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-tabular"
                  />
                </div>
              )}

              {/* 3 Compteurs Clés */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="bg-[#0b0d12] p-2 rounded-xl border border-white/[0.06] text-center">
                  <span className="text-[10px] text-gray-400 block">Trocs PIN ✓</span>
                  <span className="text-sm font-black text-emerald-400 font-mono-tabular">
                    {wallet.verifiedTrades}
                  </span>
                </div>
                <div className="bg-[#0b0d12] p-2 rounded-xl border border-white/[0.06] text-center">
                  <span className="text-[10px] text-gray-400 block">Volume Troqué</span>
                  <span className="text-sm font-black text-white font-mono-tabular">
                    {Math.round(userProfile.totalVolumeFcfa / 1000)}k F
                  </span>
                </div>
                <div className="bg-[#0b0d12] p-2 rounded-xl border border-white/[0.06] text-center">
                  <span className="text-[10px] text-gray-400 block">Jetons / Boosts</span>
                  <span className="text-sm font-black text-amber-300 font-mono-tabular">
                    {wallet.tokens}🪙 • {wallet.boostCredits}🚀
                  </span>
                </div>
              </div>
            </div>

            {/* Sous-navigation Profil : Historique | Mes Armes | Paramétrer Supabase */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#11141c] p-1 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => setProfileSubTab('history')}
                className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 transition-all ${
                  profileSubTab === 'history'
                    ? 'bg-[#222632] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Historique ({activityHistory.length})</span>
              </button>
              <button
                onClick={() => setProfileSubTab('weapons')}
                className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 transition-all ${
                  profileSubTab === 'weapons'
                    ? 'bg-[#222632] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>🎯 Armes ({weapons.length})</span>
              </button>
              <button
                onClick={() => setProfileSubTab('supabase')}
                className={`py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 transition-all ${
                  profileSubTab === 'supabase'
                    ? 'bg-[#222632] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase</span>
              </button>
            </div>

            {/* SOUS-ONGLET 1 : HISTORIQUE COMPLET */}
            {profileSubTab === 'history' && (
              <div className="space-y-2">
                {activityHistory.map((item) => (
                  <div
                    key={item.id}
                    className="uhd-card rounded-2xl p-3 border border-white/[0.08] flex items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-white truncate">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{item.subtitle}</p>
                      <span className="text-[10px] text-gray-500 block">{item.timestamp}</span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black font-mono-tabular whitespace-nowrap shrink-0 border ${
                        item.badgeColor === 'emerald'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : item.badgeColor === 'amber'
                          ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                          : item.badgeColor === 'sky'
                          ? 'bg-sky-400/15 border-sky-400/40 text-sky-300'
                          : item.badgeColor === 'red'
                          ? 'bg-red-500/15 border-red-500/40 text-red-300'
                          : 'bg-[#ff6b00]/15 border-[#ff6b00]/40 text-[#ff7b1c]'
                      }`}
                    >
                      {item.amountLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* SOUS-ONGLET 2 : MES ARMES AVEC JAUGE D'ÉTAT */}
            {profileSubTab === 'weapons' && (
              <div className="space-y-2">
                {weapons.map((w, idx) => {
                  const isCurrent = idx === activeWeaponIndex;
                  const cond = getConditionSpec(w.conditionGrade);
                  return (
                    <div
                      key={w.id}
                      className={`rounded-2xl p-2.5 border flex items-center justify-between gap-2.5 ${
                        isCurrent
                          ? 'bg-[#ff6b00]/10 border-[#ff6b00]'
                          : 'uhd-card border-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={w.image}
                          alt={w.title}
                          className="w-12 h-12 aspect-square rounded-xl object-cover shrink-0 border border-white/10"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs font-black text-white truncate">
                            {w.emoji} {w.title}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-extrabold text-[#ff7b1c]">
                              {w.tier} FCFA
                            </span>
                            <span className="text-gray-600">•</span>
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border ${cond.badgeBg} ${cond.badgeBorder} ${cond.badgeText}`}
                            >
                              {cond.label} ({w.conditionPercent}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setActiveWeaponIndex(idx);
                            triggerToast(`🎯 ${w.title} équipé comme Arme Active`, 'orange');
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black ${
                            isCurrent
                              ? 'uhd-orange-btn text-black'
                              : 'bg-[#1c202b] text-gray-200 border border-white/10'
                          }`}
                        >
                          {isCurrent ? 'Arme Active ✓' : 'Équiper'}
                        </button>
                        {weapons.length > 1 && (
                          <button
                            onClick={() => {
                              const filtered = weapons.filter((item) => item.id !== w.id);
                              setWeapons(filtered);
                              setActiveWeaponIndex(0);
                              triggerToast('Objet retiré de vos armes.', 'dark');
                            }}
                            className="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => setActiveModal('add_photo')}
                  className="w-full uhd-orange-btn text-black font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Publier une nouvelle arme au format 1:1</span>
                </button>
              </div>
            )}

            {/* SOUS-ONGLET 3 : ASSISTANT DE PARAMÉTRAGE SUPABASE (SCRIPT SQL & GUIDE) */}
            {profileSubTab === 'supabase' && (
              <div className="uhd-card rounded-2xl p-3.5 border border-white/[0.1] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                    <Database className="w-4 h-4" /> Assistant SQL Supabase
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {isSupabaseConfigured ? 'Clés détectées ✓' : 'Mode local actif'}
                  </span>
                </div>

                {/* Guide en 3 étapes très clair */}
                <div className="bg-[#0b0d12] p-3 rounded-xl border border-white/[0.08] space-y-1.5 text-xs text-gray-300">
                  <p className="font-extrabold text-white">
                    Où coller le script dans votre projet Supabase :
                  </p>
                  <p>
                    <strong className="text-[#ff7b1c]">1.</strong> Ouvrez votre projet sur{' '}
                    <strong className="text-white">supabase.com/dashboard</strong>
                  </p>
                  <p>
                    <strong className="text-[#ff7b1c]">2.</strong> Dans la barre de gauche, cliquez sur{' '}
                    <strong className="text-white">SQL Editor</strong> puis sur{' '}
                    <strong className="text-white">+ New query</strong>
                  </p>
                  <p>
                    <strong className="text-[#ff7b1c]">3.</strong> Cliquez sur le bouton{' '}
                    <strong className="text-emerald-400">Copier le Script SQL</strong> ci-dessous, collez-le dans l'éditeur Supabase et cliquez sur{' '}
                    <strong className="text-emerald-400">Run</strong>.
                  </p>
                </div>

                {/* Boutons Copier SQL & Tester/Synchroniser en direct */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(SUPABASE_SCHEMA_SQL);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 3000);
                      triggerToast('📋 Script SQL complet copié ! Collez-le dans Supabase SQL Editor.', 'green');
                    }}
                    className="w-full uhd-orange-btn text-black font-black text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Copy className="w-4 h-4" />
                    <span>
                      {copiedSql
                        ? '✓ SCRIPT SQL COPIÉ DANS LE PRESSE-PAPIERS !'
                        : '1. COPIER LE SCRIPT SQL SUPABASE COMPLET'}
                    </span>
                  </button>

                  <button
                    onClick={handleTestAndSyncSupabase}
                    disabled={testingSupabase}
                    className="w-full uhd-emerald-btn text-black font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {testingSupabase
                        ? 'Test et synchronisation en cours...'
                        : '2. TESTER & SYNCHRONISER MES DONNÉES VERS SUPABASE'}
                    </span>
                  </button>
                </div>

                {supabaseStatusMessage && (
                  <div className="bg-[#0b0d12] border border-white/15 rounded-xl p-2.5 text-[11px] text-gray-200 font-medium">
                    {supabaseStatusMessage}
                  </div>
                )}

                {/* Aperçu du Script SQL directement sélectionnable */}
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                    Aperçu du script SQL à coller dans Supabase SQL Editor :
                  </span>
                  <pre className="bg-[#06070a] border border-white/10 rounded-xl p-2.5 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-40 select-all">
                    {SUPABASE_SCHEMA_SQL}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            ZONE 4 : LE DOCK « MON ARME ACTIVE » (TOUJOURS SOUS LE POUCE)
        =================================================================== */}
        <div className="absolute bottom-[62px] left-2.5 right-2.5 z-30 pointer-events-auto gpu-120fps">
          <div className="bg-[#11141c]/95 backdrop-blur-xl border-[1.5px] border-[#ff6b00] rounded-2xl px-3 py-2 shadow-[0_12px_34px_rgba(0,0,0,0.9)]">
            {/* Ligne 1 : Arme active prête au tir + Badge État + Switch rapide 🔄 */}
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <button
                type="button"
                onClick={() => setActiveModal('weapon_drawer')}
                className="flex items-center gap-1.5 min-w-0 text-left group active:scale-[0.98] transition-transform"
              >
                <span className="text-sm shrink-0">🎯</span>
                <span className="text-[11px] font-black tracking-tight text-[#ff6b00] uppercase shrink-0">
                  ARME :
                </span>
                <span className="text-[12px] font-extrabold text-white truncate group-hover:text-[#ff7b1c] transition-colors">
                  [{activeWeapon.emoji} {activeWeapon.title}]
                </span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded border ${activeWeaponCond.badgeBg} ${activeWeaponCond.badgeBorder} ${activeWeaponCond.badgeText} shrink-0 font-mono-tabular`}
                >
                  {activeWeapon.conditionPercent}%
                </span>
              </button>

              <button
                type="button"
                onClick={cycleWeapon}
                title="Changer d'objet à la volée"
                className="uhd-surface active:scale-90 transition-all duration-100 p-1.5 rounded-lg border border-white/15 text-white shrink-0 flex items-center justify-center"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ligne 2 : Pastilles de soulte instantanées (+2k, +5k, +10k) */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] text-gray-200 font-medium whitespace-nowrap">
                Rajout cash actif :
              </span>
              <div className="flex items-center gap-1.5">
                {([2000, 5000, 10000] as SoulteAmount[]).map((amount) => {
                  const isActive = activeSoulte === amount;
                  return (
                    <button
                      type="button"
                      key={amount}
                      onClick={() => toggleSoulte(amount)}
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all duration-100 active:scale-95 whitespace-nowrap ${
                        isActive
                          ? 'uhd-orange-btn text-black border border-white'
                          : 'bg-[#1d212b] text-gray-200 border border-white/10 hover:bg-[#272c3a]'
                      }`}
                    >
                      +{amount / 1000}k
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            BARRE DE NAVIGATION INFÉRIEURE FIXE À 4 ONGLETS + CAMÉRA CENTRALE
            Marché | Boutique | [ 📷 ] | Matchs | Profil
        =================================================================== */}
        <nav className="h-[60px] bg-[#06070a]/98 backdrop-blur-xl border-t border-white/[0.09] px-3 flex items-center justify-between relative z-30 mt-auto shrink-0">
          {/* 1. Marché */}
          <button
            onClick={() => {
              triggerHaptic(15);
              setActiveTab('market');
            }}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] active:scale-95 transition-colors ${
              activeTab === 'market' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-sm leading-none">🏠</span>
            <span className="text-[11px] font-extrabold mt-1">Marché</span>
          </button>

          {/* 2. Boutique (Mini-Market Jetons) */}
          <button
            onClick={() => {
              triggerHaptic(15);
              setActiveTab('shop');
            }}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] active:scale-95 transition-colors ${
              activeTab === 'shop' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[11px] font-extrabold mt-1">Boutique</span>
          </button>

          {/* Bouton Central Caméra Vectoriel Pur (Sans texte) */}
          <div className="relative -top-3.5 px-1">
            <button
              onClick={() => {
                triggerHaptic(30);
                setActiveModal('add_photo');
              }}
              aria-label="Publier une photo 1:1"
              title="Publier une photo au format 1:1 carré"
              className="w-14 h-14 rounded-full uhd-orange-btn text-black shadow-[0_0_28px_rgba(255,107,0,0.65)] border-[3.5px] border-[#090b0f] flex items-center justify-center active:scale-90 transition-transform duration-100"
            >
              <Camera className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* 3. Matchs */}
          <button
            onClick={() => {
              triggerHaptic(15);
              setActiveTab('matches');
            }}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] active:scale-95 transition-colors relative ${
              activeTab === 'matches' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[11px] font-extrabold mt-1">
              Matchs ({activeMatchesCount})
            </span>
          </button>

          {/* 4. Profil & Historique */}
          <button
            onClick={() => {
              triggerHaptic(15);
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] active:scale-95 transition-colors ${
              activeTab === 'profile' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[11px] font-extrabold mt-1">Profil</span>
          </button>
        </nav>

        {/* ===================================================================
            MODALE UHD 1 : INSPECTEUR D'IMAGE PRODUIT 1:1 + JAUGE D'ÉTAT STRICTE
        =================================================================== */}
        <AnimatePresence>
          {activeModal === 'inspect_item' && inspectedItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={SPRING_120FPS}
              className="absolute inset-0 z-50 bg-[#050609]/96 backdrop-blur-2xl flex flex-col justify-between p-4 overflow-y-auto gpu-120fps"
            >
              {(() => {
                const cond = getConditionSpec(inspectedItem.conditionGrade);
                return (
                  <>
                    {/* Barre supérieure de l'Inspecteur UHD */}
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 shrink-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-[#ff6b00] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            INSPECTEUR UHD 1:1
                          </span>
                          <span className="text-xs font-extrabold text-[#ff7b1c]">
                            🏷️ {inspectedItem.tier} FCFA
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-white truncate mt-1">
                          {inspectedItem.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            downloadImage1to1Square(inspectedItem.image, inspectedItem.title);
                            triggerToast(
                              '📥 Image 1:1 carrée téléchargée en UHD (1080×1080)',
                              'green'
                            );
                          }}
                          title="Télécharger l'image 1:1 carrée"
                          className="uhd-surface p-2 rounded-xl border border-white/15 text-gray-200 hover:text-white active:scale-95"
                        >
                          <Download className="w-4 h-4 text-[#ff6b00]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveModal('none')}
                          className="uhd-surface p-2 rounded-xl border border-white/15 text-gray-300 hover:text-white active:scale-95"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Zone Centrale : Cadre 1:1 Carré + Jauge d'État Terrain */}
                    <div className="my-auto space-y-2.5 py-2">
                      <div
                        onMouseMove={handleInspectPointerMove}
                        onTouchMove={handleInspectTouchMove}
                        onClick={() => setInspectZoom((z) => (z === 1 ? 2 : z === 2 ? 3 : 1))}
                        className="relative w-full aspect-square max-h-[300px] mx-auto rounded-2xl overflow-hidden bg-[#0e1015] border border-white/15 shadow-2xl cursor-zoom-in select-none"
                      >
                        <img
                          src={inspectedItem.image}
                          alt={inspectedItem.title}
                          referrerPolicy="no-referrer"
                          style={{
                            transform: `scale(${inspectZoom})`,
                            transformOrigin: `${inspectOrigin.x}% ${inspectOrigin.y}%`
                          }}
                          className="w-full h-full object-cover transition-transform duration-150 ease-out"
                        />

                        <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-[11px] font-bold text-gray-200 flex items-center gap-1.5 pointer-events-none">
                          <Maximize2 className="w-3 h-3 text-[#ff6b00]" />
                          <span>Format 1:1 • Zoom {inspectZoom}x</span>
                        </div>
                      </div>

                      {/* Contrôles de facteur de Zoom UHD */}
                      <div className="flex items-center justify-between bg-[#11141c] p-2 rounded-xl border border-white/[0.08]">
                        <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 pl-1">
                          <ZoomIn className="w-4 h-4 text-[#ff6b00]" /> Loupe UHD :
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4].map((z) => (
                            <button
                              key={z}
                              type="button"
                              onClick={() => setInspectZoom(z)}
                              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                                inspectZoom === z
                                  ? 'uhd-orange-btn text-black'
                                  : 'bg-[#1c202b] text-gray-300 border border-white/10'
                              }`}
                            >
                              {z}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* DIAGNOSTIC D'ÉTAT STRICT (5 NIVEAUX TERRAIN) */}
                      <div
                        className={`p-3 rounded-2xl border ${cond.badgeBg} ${cond.badgeBorder} space-y-1.5`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: cond.hexColor }}
                            />
                            <span className={`text-xs font-black uppercase ${cond.badgeText}`}>
                              {cond.rank}. {cond.label} ({cond.colorName})
                            </span>
                          </div>
                          <span
                            className={`text-xs font-black font-mono-tabular ${cond.badgeText}`}
                          >
                            {inspectedItem.conditionPercent}% ({cond.rangeLabel})
                          </span>
                        </div>

                        {/* Barre de jauge visuelle */}
                        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${cond.barColor} rounded-full transition-all`}
                            style={{ width: `${inspectedItem.conditionPercent}%` }}
                          />
                        </div>

                        <p className="text-[11px] text-gray-200 leading-snug">
                          <strong>Réalité terrain :</strong> {cond.realityDescription}
                        </p>
                      </div>

                      {/* Métadonnées Vendeur & Quartier */}
                      <div className="flex items-center justify-between text-xs bg-[#11141c] px-3 py-2 rounded-xl border border-white/[0.08]">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">
                            Propriétaire & Quartier
                          </span>
                          <span className="font-extrabold text-white">
                            {inspectedItem.owner} • {inspectedItem.quartier} (
                            {inspectedItem.distance})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">
                            Achat Direct Cash
                          </span>
                          <span className="font-mono-tabular font-black text-emerald-400">
                            {inspectedItem.cashPrice.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions immédiates depuis l'Inspecteur */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08] shrink-0">
                      <button
                        onClick={() => {
                          handleInstantTrade(inspectedItem);
                          setActiveModal('none');
                        }}
                        className="flex-1 uhd-orange-btn text-black font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                      >
                        <Zap className="w-4 h-4 fill-black" />
                        <span>
                          TROQUER CONTRE {activeWeapon.title.toUpperCase()}
                          {activeSoulte > 0 ? ` (+${activeSoulte / 1000}k)` : ''}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMarketItem(inspectedItem);
                          setActiveModal('cash_buy');
                        }}
                        className="uhd-surface px-4 py-3.5 rounded-xl border border-white/15 text-xs font-black text-emerald-400 active:scale-95"
                      >
                        💵 Cash
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            MODALE UHD 2 : GRILLE RÉALISTE DES 5 NIVEAUX D'ÉTAT (RÉFÉRENTIEL)
        =================================================================== */}
        <AnimatePresence>
          {activeModal === 'condition_guide' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={SPRING_120FPS}
              className="absolute inset-0 z-50 bg-black/92 backdrop-blur-2xl flex items-end justify-center p-3 gpu-120fps"
            >
              <div className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3 max-h-[90%] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#ff6b00] block">
                      ZÉRO MAUVAISE SURPRISE SUR LE TERRAIN
                    </span>
                    <h3 className="text-sm font-black text-white uppercase">
                      Grille d'État Stricte & Sévère (5 Niveaux)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveModal('none')}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {CONDITION_GRADES.map((g) => (
                    <div
                      key={g.id}
                      className={`p-3 rounded-2xl border ${g.badgeBg} ${g.badgeBorder} space-y-1`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: g.hexColor }}
                          />
                          <span className={`text-xs font-black uppercase ${g.badgeText}`}>
                            {g.rank}. {g.label} ➡️ {g.colorName}
                          </span>
                        </div>
                        <span className={`text-xs font-black font-mono-tabular ${g.badgeText}`}>
                          {g.rangeLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-200 leading-relaxed">
                        {g.realityDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            MODALE UHD 3 : STUDIO D'UPLOAD 1:1 CARRÉ + SÉLECTEUR DES 5 ÉTATS
        =================================================================== */}
        <AnimatePresence>
          {activeModal === 'add_photo' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={SPRING_120FPS}
              className="absolute inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-end justify-center p-3 gpu-120fps"
            >
              <form
                onSubmit={handleQuickPublish}
                className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3 shadow-2xl max-h-[94%] overflow-y-auto"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="uhd-orange-btn text-black font-black text-[11px] px-2.5 py-0.5 rounded-md">
                      1:1 CARRÉ UHD
                    </span>
                    <h3 className="text-sm font-black text-white uppercase">
                      Publier un objet 1:1
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal('none')}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Inputs fichiers cachés pour Caméra directe & Galerie */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />

                {/* Boutons d'import d'image personnelle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="bg-[#ff6b00]/15 hover:bg-[#ff6b00]/25 border border-[#ff6b00] text-white rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-extrabold active:scale-95 transition-all"
                  >
                    <Upload className="w-4 h-4 text-[#ff6b00]" />
                    <span>Importer une image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="uhd-surface border border-white/15 text-gray-100 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4 text-[#ff6b00]" />
                    <span>Prendre photo</span>
                  </button>
                </div>

                {/* Aperçu & Recadreur 1:1 Carré Interactif */}
                {croppedSquarePreview ? (
                  <div className="space-y-2 bg-[#0b0d12] p-2.5 rounded-2xl border border-emerald-500/40">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black text-emerald-400 uppercase">
                        ✓ Cadrage 1:1 Carré (1080×1080)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setRawUploadedImage(null);
                          setCroppedSquarePreview(null);
                        }}
                        className="text-gray-400 hover:text-white underline"
                      >
                        Réinitialiser
                      </button>
                    </div>

                    <div className="relative w-36 h-36 mx-auto aspect-square rounded-xl overflow-hidden border-2 border-[#ff6b00] shadow-lg">
                      <img
                        src={croppedSquarePreview}
                        alt="Aperçu 1:1"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1 pt-1 text-[11px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 flex items-center gap-1 w-20">
                          <SlidersHorizontal className="w-3 h-3 text-[#ff6b00]" /> Zoom 1:1
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.05"
                          value={cropZoom}
                          onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                          className="flex-1 accent-[#ff6b00]"
                        />
                        <span className="font-mono-tabular text-white w-9 text-right">
                          {cropZoom.toFixed(1)}x
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 flex items-center gap-1 w-20">
                          <Move className="w-3 h-3 text-[#ff6b00]" /> Axe X / Y
                        </span>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="5"
                          value={cropOffsetX}
                          onChange={(e) => setCropOffsetX(parseInt(e.target.value, 10))}
                          className="flex-1 accent-[#ff6b00]"
                        />
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          step="5"
                          value={cropOffsetY}
                          onChange={(e) => setCropOffsetY(parseInt(e.target.value, 10))}
                          className="flex-1 accent-[#ff6b00]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESET_PHOTOS.map((preset, idx) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          setNewItemPresetIndex(idx);
                          if (!newItemTitle) setNewItemTitle(preset.defaultName);
                        }}
                        className={`flex items-center gap-2 p-1.5 rounded-xl border text-left text-xs font-bold transition-all ${
                          newItemPresetIndex === idx
                            ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-white'
                            : 'bg-[#0b0d12] border-white/10 text-gray-400'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-8 h-8 aspect-square rounded-lg object-cover shrink-0"
                        />
                        <span className="truncate">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* GRILLE D'ÉTAT STRICTE & SÉVÈRE (5 NIVEAUX : OR -> ROUGE) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-300 uppercase">
                      État strict de l'objet (Grille Terrain) :
                    </label>
                    <span
                      className={`text-[11px] font-black font-mono-tabular ${selectedPublishCond.badgeText}`}
                    >
                      {selectedPublishCond.colorName} • {newItemConditionPercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {CONDITION_GRADES.map((g) => {
                      const isSelected = newItemConditionGrade === g.id;
                      return (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() => handleSelectConditionGrade(g.id)}
                          className={`p-1.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                            isSelected
                              ? `${g.badgeBg} ${g.badgeBorder} scale-[1.02] shadow-md`
                              : 'bg-[#0b0d12] border-white/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full mb-1"
                            style={{ backgroundColor: g.hexColor }}
                          />
                          <span className="text-[10px] font-black text-white leading-tight line-clamp-1">
                            {g.label.split(' ')[0]}
                          </span>
                          <span
                            className={`text-[9px] font-mono-tabular font-bold ${g.badgeText}`}
                          >
                            {g.rangeLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Définition réaliste du palier sélectionné + Curseur de précision % */}
                  <div
                    className={`p-2.5 rounded-xl border ${selectedPublishCond.badgeBg} ${selectedPublishCond.badgeBorder} space-y-1.5`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-black ${selectedPublishCond.badgeText}`}>
                        {selectedPublishCond.rank}. {selectedPublishCond.label} (
                        {selectedPublishCond.colorName})
                      </span>
                      {selectedPublishCond.minPercent < selectedPublishCond.maxPercent && (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="range"
                            min={selectedPublishCond.minPercent}
                            max={selectedPublishCond.maxPercent}
                            value={newItemConditionPercent}
                            onChange={(e) =>
                              setNewItemConditionPercent(parseInt(e.target.value, 10))
                            }
                            className="w-20 accent-[#ff6b00]"
                          />
                          <span className="font-mono-tabular font-black text-white">
                            {newItemConditionPercent}%
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-200 leading-snug">
                      {selectedPublishCond.realityDescription}
                    </p>
                  </div>
                </div>

                {/* Sélecteur de palier de valeur */}
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">
                    Calibre de valeur (FCFA) :
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['10k', '25k', '50k', '100k+'] as ItemTier[]).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setNewItemTier(t)}
                        className={`py-2 rounded-xl font-black text-xs border transition-all ${
                          newItemTier === t
                            ? 'uhd-orange-btn text-black border-white'
                            : 'bg-[#0b0d12] text-gray-300 border-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nom court & Option d'affichage direct dans la grille du marché */}
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder={`Titre de l'objet (ex: ${PRESET_PHOTOS[newItemPresetIndex].defaultName})`}
                    className="w-full bg-[#0b0d12] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                  />

                  <label className="flex items-center justify-between bg-[#0b0d12] px-3 py-1.5 rounded-xl border border-white/10 cursor-pointer">
                    <span className="text-[11px] font-semibold text-gray-200">
                      Afficher aussi dans la grille du Marché (1:1)
                    </span>
                    <input
                      type="checkbox"
                      checked={publishToMarketAlso}
                      onChange={(e) => setPublishToMarketAlso(e.target.checked)}
                      className="accent-[#ff6b00] w-4 h-4"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full uhd-orange-btn text-black font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>
                    PUBLIER EN 1:1 ({selectedPublishCond.label.toUpperCase()}{' '}
                    {newItemConditionPercent}%)
                  </span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            MODALE 4 : ALERTE PLEIN ÉCRAN D'ATTAQUE ENTRANTE (5 SECONDES)
        =================================================================== */}
        <AnimatePresence>
          {activeModal === 'incoming_alert' && incomingAlertMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={SPRING_120FPS}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 gpu-120fps"
            >
              {(() => {
                const theirCond = getConditionSpec(incomingAlertMatch.theirItem.conditionGrade);
                const myCond = getConditionSpec(incomingAlertMatch.myItem.conditionGrade);
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase animate-pulse">
                          🔔 ATTAQUE DIRECTE
                        </span>
                        {incomingAlertMatch.isCoupeFile && (
                          <span className="bg-amber-400 text-black text-xs font-black px-2 py-1 rounded-lg">
                            🚀 COUPE-FILE 500F
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveModal('none')}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-white/5"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="my-auto space-y-4">
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#ff7b1c] uppercase tracking-wider">
                          {incomingAlertMatch.partnerName} • {incomingAlertMatch.partnerQuartier}
                        </p>
                        <h3 className="text-lg font-black text-white mt-0.5">
                          Proposition d'échange immédiat
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="uhd-card border-2 border-[#ff6b00] rounded-2xl p-3 text-center">
                          <span className="text-[10px] font-black uppercase bg-[#ff6b00] text-black px-2 py-0.5 rounded-md inline-block mb-2">
                            IL PROPOSE ({incomingAlertMatch.theirItem.tier})
                          </span>
                          <img
                            src={incomingAlertMatch.theirItem.image}
                            alt={incomingAlertMatch.theirItem.title}
                            className="w-24 h-24 aspect-square mx-auto rounded-xl object-cover mb-2 bg-[#0e1015]"
                          />
                          <p className="text-xs font-extrabold text-white line-clamp-1">
                            {incomingAlertMatch.theirItem.title}
                          </p>
                          <span
                            className={`text-[10px] font-black ${theirCond.badgeText} block mt-0.5`}
                          >
                            {theirCond.label} ({incomingAlertMatch.theirItem.conditionPercent}%)
                          </span>
                        </div>

                        <div className="uhd-card border border-white/15 rounded-2xl p-3 text-center">
                          <span className="text-[10px] font-black uppercase bg-emerald-500 text-black px-2 py-0.5 rounded-md inline-block mb-2">
                            VOTRE OBJET ({incomingAlertMatch.myItem.tier})
                          </span>
                          <img
                            src={incomingAlertMatch.myItem.image}
                            alt={incomingAlertMatch.myItem.title}
                            className="w-24 h-24 aspect-square mx-auto rounded-xl object-cover mb-2 bg-[#0e1015]"
                          />
                          <p className="text-xs font-extrabold text-white line-clamp-1">
                            {incomingAlertMatch.myItem.title}
                          </p>
                          <span
                            className={`text-[10px] font-black ${myCond.badgeText} block mt-0.5`}
                          >
                            {myCond.label} ({incomingAlertMatch.myItem.conditionPercent}%)
                          </span>
                        </div>
                      </div>

                      <div className="uhd-card border border-white/10 rounded-2xl p-3 text-center">
                        <span className="text-xs text-gray-400 block mb-0.5">
                          Complément Cash (Soulte) inclus dans l'offre :
                        </span>
                        <span className="text-base font-black text-emerald-400">
                          {incomingAlertMatch.soulte > 0
                            ? `+ ${incomingAlertMatch.soulte.toLocaleString('fr-FR')} FCFA en cash pour vous`
                            : 'Échange Net (0 FCFA de rajout)'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleIncomingDecision(incomingAlertMatch.id, 'ACCEPT')}
                        className="w-full uhd-emerald-btn text-black font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>ACCEPTER & VERROUILLER L'ACCORD</span>
                      </button>

                      <div className="uhd-card p-2.5 rounded-2xl border border-white/10">
                        <span className="text-[11px] font-bold text-gray-300 block text-center mb-2">
                          Ou exiger un rajout cash avant d'accepter :
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {[2000, 5000, 10000].map((amt) => (
                            <button
                              key={amt}
                              onClick={() =>
                                handleIncomingDecision(
                                  incomingAlertMatch.id,
                                  'REQUIRE_SOULTE',
                                  amt
                                )
                              }
                              className="bg-[#252a36] hover:bg-[#ff6b00] hover:text-black text-white font-black text-xs py-2 rounded-xl border border-white/15 transition-colors"
                            >
                              Exiger +{amt / 1000}k
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleIncomingDecision(incomingAlertMatch.id, 'REJECT')}
                        className="w-full bg-red-500/15 hover:bg-red-500/25 text-red-300 font-bold text-xs py-2.5 rounded-xl border border-red-500/30"
                      >
                        Refuser l'offre
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            MODALE 5 : TIROIR DE SÉLECTION « MES ARMES »
        =================================================================== */}
        <AnimatePresence>
          {activeModal === 'weapon_drawer' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={SPRING_120FPS}
              className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end justify-center p-3 gpu-120fps"
            >
              <div className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>🎯</span>
                    <h3 className="text-sm font-black text-white uppercase">
                      Choisir mon Arme Active ({weapons.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveModal('none')}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {weapons.map((w, idx) => {
                    const isCurrent = idx === activeWeaponIndex;
                    const cond = getConditionSpec(w.conditionGrade);
                    return (
                      <button
                        key={w.id}
                        onClick={() => {
                          setActiveWeaponIndex(idx);
                          setActiveModal('none');
                          triggerToast(
                            `🎯 Arme équipée : ${w.title} (${cond.label} ${w.conditionPercent}%)`,
                            'orange'
                          );
                        }}
                        className={`w-full p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-[#ff6b00]/15 border-[#ff6b00] text-white'
                            : 'bg-[#0b0d12] border-white/10 text-gray-300 hover:bg-[#1b1f29]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={w.image}
                            alt={w.title}
                            className="w-11 h-11 aspect-square rounded-xl object-cover shrink-0 border border-white/10"
                          />
                          <div className="text-left min-w-0">
                            <p className="text-xs font-extrabold text-white truncate">
                              {w.emoji} {w.title}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-[#ff7b1c]">
                                {w.tier} FCFA
                              </span>
                              <span className="text-gray-600">•</span>
                              <span className={`text-[10px] font-extrabold ${cond.badgeText}`}>
                                {cond.label} {w.conditionPercent}%
                              </span>
                            </div>
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="uhd-orange-btn text-black text-[10px] font-black px-2 py-0.5 rounded-md">
                            PRÊT AU TIR
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveModal('add_photo')}
                  className="w-full uhd-surface text-white font-extrabold text-xs py-2.5 rounded-xl border border-white/15 flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-[#ff6b00]" />
                  <span>Importer / Photographier un nouvel objet 1:1</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            MODALE 6 : ACHAT CASH IMMÉDIAT (BOUTON 💵 - COMMISSION 5%)
        =================================================================== */}
        <AnimatePresence>
          {activeModal === 'cash_buy' && selectedMarketItem && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={SPRING_120FPS}
              className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end justify-center p-3 gpu-120fps"
            >
              <div className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-500 text-black font-black text-xs px-2.5 py-0.5 rounded-md">
                    💵 ACHAT CASH IMMÉDIAT
                  </span>
                  <button
                    onClick={() => setActiveModal('none')}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-[#0b0d12] p-2.5 rounded-2xl border border-white/10">
                  <img
                    src={selectedMarketItem.image}
                    alt={selectedMarketItem.title}
                    className="w-16 h-16 aspect-square rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-white truncate">
                      {selectedMarketItem.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {selectedMarketItem.owner} • {selectedMarketItem.quartier} (
                      {selectedMarketItem.distance})
                    </p>
                    <p className="text-sm font-black text-emerald-400 mt-1 font-mono-tabular">
                      {selectedMarketItem.cashPrice.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </div>

                <div className="bg-[#0b0d12] px-3 py-2 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Commission plateforme (5 %) :</span>
                  <span className="font-bold text-gray-200 font-mono-tabular">
                    {Math.round(selectedMarketItem.cashPrice * 0.05).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <button
                  onClick={() => {
                    const commission = Math.round(selectedMarketItem.cashPrice * 0.05);
                    setWallet((prev) => ({
                      ...prev,
                      platformRevenueFcfa: prev.platformRevenueFcfa + commission,
                      cashCommissionFcfa: prev.cashCommissionFcfa + commission
                    }));
                    setMarketItems((prev) =>
                      prev.map((m) =>
                        m.id === selectedMarketItem.id ? { ...m, status: 'RESERVED_12H' } : m
                      )
                    );
                    appendHistory({
                      type: 'CASH_PURCHASE',
                      title: `Achat Cash : ${selectedMarketItem.title}`,
                      subtitle: `Vendeur : ${selectedMarketItem.owner} (${selectedMarketItem.quartier})`,
                      amountLabel: `${selectedMarketItem.cashPrice.toLocaleString('fr-FR')} F`,
                      badgeColor: 'emerald'
                    });
                    setActiveModal('none');
                    triggerToast(
                      `💵 Achat Cash (${selectedMarketItem.cashPrice.toLocaleString('fr-FR')} FCFA) envoyé à ${selectedMarketItem.owner} !`,
                      'green'
                    );
                  }}
                  className="w-full uhd-emerald-btn text-black font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Banknote className="w-4 h-4" />
                  <span>
                    PAYER PAR MOBILE MONEY ({selectedMarketItem.cashPrice.toLocaleString('fr-FR')}{' '}
                    FCFA)
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            MODALE 7 : TICKET D'ÉCHANGE OFFICIEL, ÉTAT CERTIFIÉ & CODE PIN
        =================================================================== */}
        <AnimatePresence>
          {activeModal === 'ticket_view' && selectedTicketMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={SPRING_120FPS}
              className="absolute inset-0 z-50 bg-black/92 backdrop-blur-2xl flex items-center justify-center p-3.5 gpu-120fps"
            >
              {(() => {
                const theirCond = getConditionSpec(selectedTicketMatch.theirItem.conditionGrade);
                const myCond = getConditionSpec(selectedTicketMatch.myItem.conditionGrade);
                return (
                  <div className="w-full bg-[#12151e] border-2 border-emerald-500 rounded-3xl p-4 space-y-3 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-black tracking-wider uppercase text-emerald-400">
                          TICKET D'ÉCHANGE OFFICIEL
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveModal('none')}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#0b0d12] p-2.5 rounded-2xl border border-white/10">
                      <div className="text-center">
                        <img
                          src={selectedTicketMatch.theirItem.image}
                          alt={selectedTicketMatch.theirItem.title}
                          className="w-20 h-20 aspect-square mx-auto rounded-xl object-cover mb-1 border border-white/10"
                        />
                        <span className="text-[10px] font-bold text-gray-400 block truncate">
                          {selectedTicketMatch.partnerName.toUpperCase()} (
                          {selectedTicketMatch.theirItem.tier})
                        </span>
                        <p className="text-xs font-extrabold text-white truncate">
                          {selectedTicketMatch.theirItem.title}
                        </p>
                        <span
                          className={`text-[10px] font-black ${theirCond.badgeText} block mt-0.5`}
                        >
                          État : {theirCond.label} {selectedTicketMatch.theirItem.conditionPercent}%
                        </span>
                      </div>

                      <div className="text-center">
                        <img
                          src={selectedTicketMatch.myItem.image}
                          alt={selectedTicketMatch.myItem.title}
                          className="w-20 h-20 aspect-square mx-auto rounded-xl object-cover mb-1 border border-white/10"
                        />
                        <span className="text-[10px] font-bold text-gray-400 block">
                          VOTRE OBJET ({selectedTicketMatch.myItem.tier})
                        </span>
                        <p className="text-xs font-extrabold text-white truncate">
                          {selectedTicketMatch.myItem.title}
                        </p>
                        <span
                          className={`text-[10px] font-black ${myCond.badgeText} block mt-0.5`}
                        >
                          État : {myCond.label} {selectedTicketMatch.myItem.conditionPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#0b0d12] p-3 rounded-2xl border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Soulte verrouillée :</span>
                        <span className="font-black text-[#ff7b1c]">
                          {selectedTicketMatch.soulte === 0
                            ? 'Échange net : 0 FCFA'
                            : selectedTicketMatch.soulteDirection === 'FROM_ME'
                            ? `+${selectedTicketMatch.soulte.toLocaleString('fr-FR')} FCFA (par vous)`
                            : `+${selectedTicketMatch.soulte.toLocaleString('fr-FR')} FCFA (par ${selectedTicketMatch.partnerName})`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Point de remise :</span>
                        <span className="font-bold text-white">
                          {selectedTicketMatch.partnerQuartier}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t border-white/10">
                        <span className="text-gray-400">Code PIN de remise :</span>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono-tabular font-black text-base px-3 py-0.5 rounded-lg tracking-widest">
                          {selectedTicketMatch.pinCode}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifyPinCode(selectedTicketMatch)}
                        disabled={selectedTicketMatch.pinVerified}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 border transition-all ${
                          selectedTicketMatch.pinVerified
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                            : 'uhd-surface border-white/15 text-white'
                        }`}
                      >
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>
                          {selectedTicketMatch.pinVerified
                            ? `Remise Validée (${wallet.verifiedTrades} trocs)`
                            : 'Valider PIN à la remise'}
                        </span>
                      </button>
                    </div>

                    <a
                      href={getWhatsAppTicketUrl(selectedTicketMatch)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full uhd-emerald-btn text-black font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                      <MessageCircle className="w-4 h-4 fill-black" />
                      <span>ENVOYER CE TICKET SUR WHATSAPP</span>
                    </a>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================================
            MODALE 8 : SÉLECTEUR DE PÉRIMÈTRE GPS LIBREVILLE
        =================================================================== */}
        <AnimatePresence>
          {activeModal === 'gps_radar' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={SPRING_120FPS}
              className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end justify-center p-3 gpu-120fps"
            >
              <div className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#ff6b00]" />
                    <h3 className="text-sm font-black text-white uppercase">
                      Périmètre GPS Libreville
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveModal('none')}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Filtrez les objets les plus proches pour conclure l'échange en main propre aujourd'hui :
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 5, 10].map((km) => (
                    <button
                      key={km}
                      onClick={() => {
                        setGpsRadiusKm(km);
                        setActiveModal('none');
                        triggerToast(
                          `📍 Radar GPS calibré sur ${km} km autour de Libreville`,
                          'dark'
                        );
                      }}
                      className={`py-2.5 rounded-xl font-black text-xs border ${
                        gpsRadiusKm === km
                          ? 'uhd-orange-btn text-black border-white'
                          : 'bg-[#0b0d12] text-gray-300 border-white/10'
                      }`}
                    >
                      Rayon {km} km
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================================================
          PANNEAU TACTIQUE DE SIMULATION, ÉTATS & SUPABASE (COMPAGNON DESKTOP)
      ===================================================================== */}
      <aside className="hidden lg:block w-full max-w-[385px] space-y-4 shrink-0">
        {/* Carte 1 : Grille d'État Stricte & Simulateur 15s */}
        <div className="uhd-card border border-white/[0.09] rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#ff6b00] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Contrôle Tactique & États
            </span>
            <span className="text-[11px] text-gray-400 font-mono-tabular">
              🏆 {wallet.verifiedTrades} échanges validés
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={triggerIncomingAttackAlert}
              className="w-full uhd-orange-btn text-black font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-between active:scale-98 transition-transform"
            >
              <span>🔔 Recevoir une Attaque Plein Écran (5s)</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => setActiveModal('condition_guide')}
              className="w-full uhd-surface text-gray-100 font-bold text-xs py-2.5 px-3 rounded-xl border border-white/10 flex items-center justify-between transition-colors"
            >
              <span>📊 Afficher la Grille Stricte des 5 États</span>
              <span className="text-[10px] font-black text-amber-300">100% → &lt;40%</span>
            </button>

            <button
              onClick={handleResetDemo}
              className="w-full bg-[#0e1016] hover:bg-[#171b24] text-gray-400 hover:text-white font-semibold text-xs py-2 px-3 rounded-xl border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser la démonstration</span>
            </button>
          </div>
        </div>

        {/* Carte 2 : Assistant Paramétrage Supabase (Script SQL & Test Direct) */}
        <div className="uhd-card border border-white/[0.09] rounded-3xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Database className="w-4 h-4" /> Paramétrage Supabase
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {supabaseSynced ? 'Clés Actives ✓' : 'Prêt'}
            </span>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed">
            <strong>1.</strong> Copiez le script SQL ci-dessous.<br />
            <strong>2.</strong> Dans Supabase : <strong>SQL Editor → + New query → Coller → Run</strong>.<br />
            <strong>3.</strong> Cliquez sur <strong>Tester & Synchroniser</strong> :
          </p>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(SUPABASE_SCHEMA_SQL);
              setCopiedSql(true);
              setTimeout(() => setCopiedSql(false), 2500);
              triggerToast('📋 Script SQL Supabase copié dans le presse-papiers !', 'green');
            }}
            className="w-full uhd-orange-btn text-black font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>
              {copiedSql ? '✓ Script SQL Copié !' : '1. Copier le Script SQL Supabase'}
            </span>
          </button>

          <button
            onClick={handleTestAndSyncSupabase}
            disabled={testingSupabase}
            className="w-full uhd-surface text-emerald-300 font-bold text-xs py-2.5 px-3 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2 transition-colors hover:bg-emerald-500/10"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {testingSupabase
                ? 'Synchronisation...'
                : '2. Tester & Synchroniser Supabase'}
            </span>
          </button>

          {supabaseStatusMessage && (
            <p className="text-[11px] text-gray-300 bg-[#090b0f] p-2 rounded-xl border border-white/10">
              {supabaseStatusMessage}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
