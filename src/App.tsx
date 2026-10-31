import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RotateCcw, Scale, Sparkles, Zap } from 'lucide-react';
import {
  getConditionSpec,
  INCOMING_CHALLENGERS,
  INITIAL_HISTORY,
  INITIAL_MARKET,
  INITIAL_MATCHES,
  INITIAL_PROFILE,
  INITIAL_WALLET,
  INITIAL_WEAPONS,
  PRESET_PHOTOS
} from './data/initialData';
import {
  fetchInitialFromSupabase,
  getTodayDateKey,
  INITIAL_DAILY_STREAK,
  isSupabaseConfigured,
  loadActivityHistory,
  loadDailyStreak,
  loadMarketItems,
  loadMatches,
  loadSentOffers,
  loadUserProfile,
  loadWallet,
  loadWeapons,
  renderSquare1to1Image,
  resetAllDemoData,
  saveActivityHistory,
  saveDailyStreak,
  saveMarketItems,
  saveMatches,
  saveSentOffers,
  saveUserProfile,
  saveWallet,
  saveWeapons,
  syncHistoryItemToSupabase,
  syncMarketItemToSupabase,
  syncMatchToSupabase,
  syncWeaponToSupabase
} from './lib/storage';
import {
  ActiveModal,
  ActivityHistoryItem,
  CashTopUpAmount,
  CityFilter,
  ConditionGradeId,
  DailyStreakState,
  formatCompactFcfa,
  GabonCity,
  inferItemCategory,
  ItemTier,
  LegalSectionId,
  MainTab,
  MarketCategoryFilter,
  MarketItem,
  MatchRecord,
  ProfileSubTab,
  SentOfferInfo,
  TokenPackOffer,
  UserProfile,
  ValueTier,
  WalletMetrics,
  WeaponItem
} from './types/troc';
import { BooHeader } from './components/BooHeader';
import { MarketFilterBar } from './components/MarketFilterBar';
import { MarketFilterDrawer } from './components/MarketFilterDrawer';
import { MarketCard } from './components/MarketCard';
import { VybzPromoCard } from './components/VybzPromoCard';
import { MmediaUniverseModal } from './components/MmediaUniverseHub';
import { DAILY_REWARD_STEPS, DailyStreakModal } from './components/DailyStreakModal';
import { BooFooterSignature } from './components/BooFooterSignature';
import { BottomNavBar } from './components/BottomNavBar';
import { ShopTab } from './components/ShopTab';
import { MatchesTab } from './components/MatchesTab';
import { ProfileTab } from './components/ProfileTab';
import { PublishModal } from './components/PublishModal';
import { InspectModal } from './components/InspectModal';
import { ProposeTradeModal } from './components/ProposeTradeModal';
import {
  CashBuyModal,
  CitySelectorModal,
  IncomingOfferModal,
  LegalModal,
  ShareModal,
  TicketModal
} from './components/ActionModals';
import { matchesSmartSearch } from './lib/smartSearch';

const SPRING_120FPS = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 36,
  mass: 0.6
};

export default function App() {
  // Navigation principale fixe en bas : 'market' | 'shop' | 'matches' | 'profile'
  const [activeTab, setActiveTab] = useState<MainTab>('market');
  const [profileSubTab, setProfileSubTab] = useState<ProfileSubTab>('history');
  const [legalSection, setLegalSection] = useState<LegalSectionId>('cgu');

  // Case à cocher obligatoire d'acceptation des CGU & Décharge (Mmedia Universe • Loi Gabonaise)
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);

  // Opérateur Mobile Money dans la Boutique
  const [selectedOperator, setSelectedOperator] = useState<'Airtel Money' | 'Moov Money'>(
    'Airtel Money'
  );

  // Filtres Marché : Palier, Ville, Catégorie, État & Recherche
  const [selectedTier, setSelectedTier] = useState<ValueTier>('Tous');
  const [selectedCity, setSelectedCity] = useState<CityFilter>('Toutes les villes');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategoryFilter>('Toutes');
  const [selectedCondition, setSelectedCondition] = useState<ConditionGradeId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Portefeuille, Assiduité, Profil, Historique, Objets, Marché & Matchs
  const [wallet, setWallet] = useState<WalletMetrics>(() => loadWallet());
  const [dailyStreak, setDailyStreak] = useState<DailyStreakState>(() => loadDailyStreak());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>(() =>
    loadActivityHistory()
  );
  const [weapons, setWeapons] = useState<WeaponItem[]>(() => loadWeapons());
  const [selectedWeaponIndex, setSelectedWeaponIndex] = useState<number>(0);
  const selectedWeapon = weapons[selectedWeaponIndex] || weapons[0];
  const [proposalCashTopUp, setProposalCashTopUp] = useState<CashTopUpAmount>(0);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => loadMarketItems());
  const [sentOffers, setSentOffers] = useState<Record<string, SentOfferInfo>>(() =>
    loadSentOffers()
  );
  const [matches, setMatches] = useState<MatchRecord[]>(() => loadMatches());

  // Modales actives & navigation retour entre modales
  const [activeModal, setActiveModal] = useState<ActiveModal>(() => {
    const initialStreak = loadDailyStreak();
    return initialStreak.claimedToday ? 'none' : 'daily_streak';
  });
  const [returnModalAfterInspect, setReturnModalAfterInspect] = useState<ActiveModal>('none');
  const [returnModalAfterLegal, setReturnModalAfterLegal] = useState<ActiveModal>('none');
  const [selectedMarketItem, setSelectedMarketItem] = useState<MarketItem | null>(null);
  const [inspectedItem, setInspectedItem] = useState<MarketItem | null>(null);
  const [inspectedFromMatchOnly, setInspectedFromMatchOnly] = useState<boolean>(false);
  const [tradeTargetItem, setTradeTargetItem] = useState<MarketItem | null>(null);
  const [sharedItem, setSharedItem] = useState<MarketItem | null>(null);
  const [selectedTicketMatch, setSelectedTicketMatch] = useState<MatchRecord | null>(null);
  const [incomingAlertMatch, setIncomingAlertMatch] = useState<MatchRecord | null>(null);
  const [challengerCursor, setChallengerCursor] = useState<number>(0);

  // Horloge temps réel (compte à rebours 30 min) & Toast
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [toast, setToast] = useState<{ msg: string; type: 'green' | 'orange' | 'dark' } | null>(
    null
  );

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

  // Chargement initial transparent depuis Supabase si configuré
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let mounted = true;
    fetchInitialFromSupabase().then((remote) => {
      if (!mounted || !remote) return;
      if (remote.weapons?.length) setWeapons(remote.weapons);
      if (remote.market?.length) setMarketItems(remote.market);
      if (remote.matches?.length) setMatches(remote.matches);
      if (remote.history?.length) setActivityHistory(remote.history);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Persistance localStorage
  useEffect(() => saveWallet(wallet), [wallet]);
  useEffect(() => saveDailyStreak(dailyStreak), [dailyStreak]);
  useEffect(() => saveWeapons(weapons), [weapons]);
  useEffect(() => saveMarketItems(marketItems), [marketItems]);
  useEffect(() => saveMatches(matches), [matches]);
  useEffect(() => saveSentOffers(sentOffers), [sentOffers]);
  useEffect(() => saveUserProfile(userProfile), [userProfile]);
  useEffect(() => saveActivityHistory(activityHistory), [activityHistory]);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerHaptic = (pattern: number | number[] = 25) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore
    }
  };

  const triggerToast = (msg: string, type: 'green' | 'orange' | 'dark' = 'orange') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast((prev) => (prev?.msg === msg ? null : prev));
    }, 2600);
  };

  const formatCountdown = (expiresAt: number) => {
    const diffSec = Math.max(0, Math.floor((expiresAt - nowMs) / 1000));
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Filtrage des articles du marché par Palier, Ville, Catégorie, État et Recherche Sémantique Ultra-Intelligente
  const filteredMarket = useMemo(() => {
    return marketItems
      .filter((item) => {
        const matchesTier = selectedTier === 'Tous' || item.tier === selectedTier;
        const matchesCity =
          selectedCity === 'Toutes les villes' || item.city === selectedCity;
        const itemCategory = inferItemCategory(item.title, item.category);
        const matchesCategory =
          selectedCategory === 'Toutes' || itemCategory === selectedCategory;
        const matchesCondition =
          selectedCondition === 'ALL' || item.conditionGrade === selectedCondition;
        const matchesSearch = matchesSmartSearch(item, searchQuery);
        return (
          matchesTier &&
          matchesCity &&
          matchesCategory &&
          matchesCondition &&
          matchesSearch
        );
      })
      .sort((a, b) => Number(b.boosted) - Number(a.boosted));
  }, [
    marketItems,
    selectedTier,
    selectedCity,
    selectedCategory,
    selectedCondition,
    searchQuery
  ]);

  // Ouverture de la modale juridique depuis n'importe quelle case à cocher
  const handleOpenLegalModalFromCheckbox = (section: LegalSectionId) => {
    triggerHaptic(15);
    setLegalSection(section);
    setReturnModalAfterLegal(activeModal);
    setActiveModal('legal_viewer');
  };

  // Ouvrir l'Inspecteur UHD d'une annonce du Marché
  const openProductInspector = (item: MarketItem) => {
    triggerHaptic(20);
    setInspectedItem(item);
    setInspectedFromMatchOnly(false);
    setReturnModalAfterInspect('none');
    setActiveModal('inspect_item');
  };

  // Ouvrir l'Inspecteur UHD depuis un Match / Plein écran
  const openMatchItemInspector = (
    itemData: {
      title: string;
      tier: ItemTier;
      image: string;
      conditionGrade: ConditionGradeId;
      conditionPercent: number;
    },
    ownerName: string,
    locationLabel: string,
    returnToModal: ActiveModal = 'none'
  ) => {
    triggerHaptic(20);
    const tierNumericValue =
      itemData.tier === '10k'
        ? 10000
        : itemData.tier === '25k'
        ? 25000
        : itemData.tier === '50k'
        ? 50000
        : 100000;

    const cityPart = (locationLabel.split('•')[0]?.trim() || 'Libreville') as GabonCity;
    const quartierPart = locationLabel.split('•')[1]?.trim() || locationLabel;

    setInspectedItem({
      id: `match-inspect-${Date.now()}`,
      title: itemData.title,
      tier: itemData.tier,
      cashPrice: tierNumericValue,
      city: cityPart,
      quartier: quartierPart,
      boosted: false,
      status: 'AVAILABLE',
      owner: ownerName,
      phone: '',
      image: itemData.image,
      conditionGrade: itemData.conditionGrade,
      conditionPercent: itemData.conditionPercent
    });
    setInspectedFromMatchOnly(true);
    setReturnModalAfterInspect(returnToModal);
    setActiveModal('inspect_item');
  };

  // Vérifie si une annonce appartient à l'utilisateur connecté
  const isItemOwnedByCurrentUser = (item: MarketItem) =>
    Boolean(item.isOwnListing) ||
    item.owner.trim().toLowerCase() === userProfile.name.trim().toLowerCase();

  // Retirer sa propre annonce du Marché
  const handleRemoveOwnMarketItem = (item: MarketItem) => {
    triggerHaptic(30);
    setMarketItems((prev) => prev.filter((m) => m.id !== item.id));
    if (activeModal === 'inspect_item') {
      setActiveModal('none');
      setInspectedItem(null);
    }
    triggerToast(`🗑️ Annonce "${item.title}" retirée du Marché`, 'dark');
  };

  // Ouvrir le tiroir « Proposer un troc » (interdit sur sa propre publication)
  const openTradeProposalDrawer = (item: MarketItem) => {
    if (isItemOwnedByCurrentUser(item)) {
      triggerToast('📌 Ceci est votre propre annonce.', 'dark');
      return;
    }
    if (item.status === 'RESERVED_12H' && !sentOffers[item.id]) {
      triggerToast('⏳ Cet objet est déjà réservé pour 12h.', 'dark');
      return;
    }
    if (sentOffers[item.id]) {
      setActiveModal('none');
      setActiveTab('matches');
      triggerToast(`Consultez vos matchs avec ${item.owner}`, 'orange');
      return;
    }
    triggerHaptic(25);
    setTradeTargetItem(item);
    setProposalCashTopUp(0);
    setActiveModal('propose_trade');
  };

  // Confirmer la proposition de troc
  const handleConfirmTradeProposal = () => {
    if (!tradeTargetItem) return;
    const item = tradeTargetItem;
    const chosenWeapon = selectedWeapon;
    triggerHaptic([35, 45, 35]);

    const newMatchId = `match-${Date.now()}`;
    const offerData: SentOfferInfo = {
      weapon: chosenWeapon,
      soulte: proposalCashTopUp,
      isCoupeFile: false,
      matchId: newMatchId
    };
    setSentOffers((prev) => ({ ...prev, [item.id]: offerData }));

    const newMatch: MatchRecord = {
      id: newMatchId,
      type: 'MUTUAL',
      partnerName: item.owner,
      partnerQuartier: `${item.city} • ${item.quartier}`,
      partnerPhone: item.phone,
      marketItemId: item.id,
      theirItem: {
        title: item.title,
        tier: item.tier,
        image: item.image,
        conditionGrade: item.conditionGrade,
        conditionPercent: item.conditionPercent
      },
      myItem: chosenWeapon,
      soulte: proposalCashTopUp,
      soulteDirection: proposalCashTopUp > 0 ? 'FROM_ME' : 'NONE',
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

    const cashLabel = proposalCashTopUp > 0 ? ` + ${proposalCashTopUp / 1000}k FCFA` : '';
    appendHistory({
      type: 'OFFER_SENT',
      title: `Proposition envoyée à ${item.owner}`,
      subtitle: `${chosenWeapon.title} (${chosenWeapon.conditionPercent}%) ↔ ${item.title} (${item.conditionPercent}%)`,
      amountLabel: proposalCashTopUp > 0 ? `+${proposalCashTopUp / 1000}k FCFA` : 'Échange direct',
      badgeColor: 'orange'
    });

    setActiveModal('none');
    setTradeTargetItem(null);
    triggerToast(`Envoyée ✓ (${chosenWeapon.title}${cashLabel})`, 'green');
  };

  // Partage de la publication sur WhatsApp & réseaux sociaux
  const getShareTextForItem = (item: MarketItem) => {
    const cond = getConditionSpec(item.conditionGrade);
    return (
      `🔥 *${item.title}* sur Boo (${item.city})\n` +
      `🏷️ Prix : ${item.cashPrice.toLocaleString('fr-FR')} FCFA (Palier ${item.tier})\n` +
      `✨ État : ${cond.label} (${item.conditionPercent}%)\n` +
      `👉 Propose ton objet en échange sur Boo : ${window.location.origin}`
    );
  };

  const handleNativeSystemShare = async (item: MarketItem) => {
    const shareText = getShareTextForItem(item);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Boo : ${item.title} (${item.city})`,
          text: shareText,
          url: window.location.origin
        });
        triggerToast('Publication partagée ✓', 'green');
        return;
      } catch {
        // Fallback copie
      }
    }
    navigator.clipboard?.writeText(shareText);
    triggerToast('Lien et résumé copiés pour vos réseaux ✓', 'green');
  };

  // Boost Coupe-File (500 FCFA)
  const handleBoostCoupeFile = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
      title: 'Offre Coupe-File activée',
      subtitle: 'Proposition épinglée en tête chez le vendeur',
      amountLabel: usedPrepaidBoost ? '-1 Pass Boost' : '500 FCFA',
      badgeColor: 'purple'
    });

    triggerToast('🚀 Offre Coupe-File épinglée en haut !', 'orange');
  };

  // Alerte d'offre entrante
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
      myItem: selectedWeapon,
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

  const handleIncomingDecision = (
    matchId: string,
    decision: 'ACCEPT' | 'REQUIRE_CASH' | 'REJECT',
    requiredCash = 0
  ) => {
    triggerHaptic(40);
    if (decision === 'REJECT') {
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      setActiveModal('none');
      setIncomingAlertMatch(null);
      triggerToast('Offre refusée.', 'dark');
      return;
    }

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const updated: MatchRecord =
          decision === 'ACCEPT'
            ? { ...m, status: 'ACCEPTED_LOCKED', expiresAt: Date.now() + 30 * 60 * 1000 }
            : {
                ...m,
                soulte: requiredCash,
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
    triggerToast(
      decision === 'ACCEPT'
        ? 'Offre acceptée ! Débloquez le match avec 1 Jeton.'
        : `Contre-offre (+${requiredCash / 1000}k FCFA) acceptée !`,
      decision === 'ACCEPT' ? 'green' : 'orange'
    );
  };

  // Conclusion d'une transaction (1 Jeton)
  const handleUnlockMatch = (match: MatchRecord) => {
    if (wallet.tokens <= 0) {
      setActiveTab('shop');
      triggerToast('🪙 1 Jeton requis pour conclure : rechargez dans la Boutique !', 'orange');
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
      title: `Transaction débloquée avec ${match.partnerName}`,
      subtitle: `${match.theirItem.title} (${match.theirItem.conditionPercent}%) ↔ ${match.myItem.title} (${match.myItem.conditionPercent}%)`,
      amountLabel: '-1 Jeton',
      badgeColor: 'emerald',
      pinCode: match.pinCode
    });

    setSelectedTicketMatch(updatedMatch);
    setActiveModal('ticket_view');
    triggerToast('🔓 Match débloqué (-1 Jeton). Ticket WhatsApp prêt !', 'green');
  };

  // Garantie Anti-Blocage 30 minutes (+1 Jeton recrédité)
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
      subtitle: 'Délai de 30 min dépassé par le partenaire • +1 Jeton recrédité',
      amountLabel: '+1 Jeton',
      badgeColor: 'sky'
    });

    triggerToast(`🛡️ Désistement de ${match.partnerName} : +1 Jeton recrédité !`, 'green');
  };

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
      subtitle: `Aucune réponse WhatsApp • ${match.myItem.title} remis en ligne`,
      amountLabel: 'Bloqué',
      badgeColor: 'red'
    });

    if (activeModal === 'ticket_view') setActiveModal('none');
    triggerToast(`⚡ Objet remis en ligne et ${match.partnerName} bloqué.`, 'orange');
  };

  const handleVerifyPinCode = (match: MatchRecord) => {
    if (match.pinVerified) return;
    triggerHaptic([30, 50, 80]);

    const updated: MatchRecord = { ...match, pinVerified: true };
    setMatches((prev) => prev.map((m) => (m.id === match.id ? updated : m)));
    syncMatchToSupabase(updated);
    setSelectedTicketMatch(updated);

    setWallet((prev) => ({ ...prev, verifiedTrades: prev.verifiedTrades + 1 }));
    setUserProfile((prev) => ({
      ...prev,
      totalVolumeFcfa: prev.totalVolumeFcfa + (match.myItem.tierValue || 25000)
    }));

    appendHistory({
      type: 'TROC_PIN_VERIFIED',
      title: `Échange validé avec ${match.partnerName}`,
      subtitle: `${match.theirItem.title} (${match.theirItem.conditionPercent}%) ↔ ${match.myItem.title} (${match.myItem.conditionPercent}%)`,
      amountLabel: `PIN ${match.pinCode} ✓`,
      badgeColor: 'emerald',
      pinCode: match.pinCode
    });

    triggerToast(`🤝 Code PIN ${match.pinCode} validé !`, 'green');
  };

  // Publication Express en 3 étapes avec Prix Libre ou Palier
  const handlePublishItem = async (payload: {
    title: string;
    tier: ItemTier;
    customPriceFcfa: number;
    city: GabonCity;
    conditionGrade: ConditionGradeId;
    conditionPercent: number;
    rawImage: string | null;
    croppedSquareImage: string | null;
    presetIndex: number;
  }) => {
    triggerHaptic(45);
    const chosenPreset = PRESET_PHOTOS[payload.presetIndex];
    const finalTitle =
      payload.title.trim() ||
      (payload.croppedSquareImage ? 'Objet à troquer' : chosenPreset.defaultName);

    const finalSquareImage =
      payload.croppedSquareImage ||
      (payload.rawImage
        ? await renderSquare1to1Image(payload.rawImage, 1, 0, 0, 1080)
        : chosenPreset.url);

    const condSpec = getConditionSpec(payload.conditionGrade);
    const finalCity = payload.city || userProfile.city;

    const createdWeapon: WeaponItem = {
      id: `w-${Date.now()}`,
      title: finalTitle,
      tier: payload.tier,
      tierValue: payload.customPriceFcfa,
      emoji: payload.croppedSquareImage ? '📷' : chosenPreset.emoji,
      image: finalSquareImage,
      conditionGrade: payload.conditionGrade,
      conditionPercent: payload.conditionPercent,
      createdAt: new Date().toISOString()
    };

    setWeapons((prev) => [createdWeapon, ...prev]);
    setSelectedWeaponIndex(0);
    syncWeaponToSupabase(createdWeapon);

    const createdMarketItem: MarketItem = {
      id: `m-${Date.now()}`,
      title: finalTitle,
      tier: payload.tier,
      cashPrice: payload.customPriceFcfa,
      city: finalCity,
      quartier: userProfile.quartier || 'Centre',
      boosted: true,
      status: 'AVAILABLE',
      owner: userProfile.name,
      phone: userProfile.phone,
      image: finalSquareImage,
      conditionGrade: payload.conditionGrade,
      conditionPercent: payload.conditionPercent,
      isOwnListing: true
    };
    setMarketItems((prev) => [createdMarketItem, ...prev]);
    syncMarketItemToSupabase(createdMarketItem);

    appendHistory({
      type: 'ITEM_PUBLISHED',
      title: `Publié : ${finalTitle}`,
      subtitle: `${finalCity} • ${formatCompactFcfa(payload.customPriceFcfa, payload.tier)} • ${condSpec.label} (${payload.conditionPercent}%)`,
      amountLabel: 'Gratuit',
      badgeColor: 'emerald'
    });

    setActiveModal('none');
    triggerToast(
      `🚀 "${finalTitle}" publié à ${payload.customPriceFcfa.toLocaleString('fr-FR')} FCFA !`,
      'green'
    );
  };

  // Achats dans la Boutique de Jetons
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
      badgeColor: 'purple'
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
      title: `Achat ${boostCount} Pass Coupe-File`,
      subtitle: `Réglé via ${selectedOperator} (${priceFcfa.toLocaleString('fr-FR')} FCFA)`,
      amountLabel: `+${boostCount} Boost${boostCount > 1 ? 's' : ''}`,
      badgeColor: 'purple'
    });

    triggerToast(
      `🚀 +${boostCount} Pass Coupe-File ajoutés via ${selectedOperator} !`,
      'orange'
    );
  };

  const getWhatsAppTicketUrl = (match: MatchRecord) => {
    const theirCond = getConditionSpec(match.theirItem.conditionGrade);
    const myCond = getConditionSpec(match.myItem.conditionGrade);
    const cashTopUpLabel =
      match.soulte === 0
        ? 'Aucun rajout cash (0 FCFA)'
        : match.soulteDirection === 'FROM_ME'
        ? `Rajout cash convenu : +${match.soulte.toLocaleString('fr-FR')} FCFA à régler par moi`
        : `Rajout cash convenu : +${match.soulte.toLocaleString('fr-FR')} FCFA à régler par ${match.partnerName}`;

    const text = encodeURIComponent(
      `⚡ *TICKET D'ÉCHANGE OFFICIEL BOO* ⚡\n\n` +
        `🤝 Salut ${match.partnerName}, notre échange est validé et débloqué !\n` +
        `📦 Ton objet : *${match.theirItem.title}* (${match.theirItem.tier} FCFA • État : *${theirCond.label} ${match.theirItem.conditionPercent}%*)\n` +
        `🔄 Mon objet : *${match.myItem.title}* (${match.myItem.tier} FCFA • État : *${myCond.label} ${match.myItem.conditionPercent}%*)\n` +
        `💵 *${cashTopUpLabel}*\n` +
        `📍 Lieu : *${match.partnerQuartier}*\n` +
        `🔐 Code PIN de remise : *${match.pinCode}*\n\n` +
        `On se retrouve où aujourd'hui pour l'échange ?`
    );
    return `https://wa.me/${match.partnerPhone}?text=${text}`;
  };

  // Validation de la connexion quotidienne & obtention des cadeaux d'assiduité (J3, J5, J7)
  const handleClaimDailyStreak = () => {
    if (dailyStreak.claimedToday) return;
    triggerHaptic([40, 60, 40]);

    const step =
      DAILY_REWARD_STEPS.find((s) => s.day === dailyStreak.currentDay) || DAILY_REWARD_STEPS[0];

    if (step.tokensGranted > 0 || step.boostsGranted > 0) {
      setWallet((prev) => ({
        ...prev,
        tokens: prev.tokens + step.tokensGranted,
        boostCredits: prev.boostCredits + step.boostsGranted
      }));
    }

    const updatedStreak: DailyStreakState = {
      ...dailyStreak,
      claimedToday: true,
      lastClaimDate: getTodayDateKey(),
      totalCheckIns: dailyStreak.totalCheckIns + 1,
      cyclesCompleted:
        dailyStreak.currentDay === 7
          ? dailyStreak.cyclesCompleted + 1
          : dailyStreak.cyclesCompleted
    };
    setDailyStreak(updatedStreak);

    appendHistory({
      type: 'DAILY_REWARD_CLAIMED',
      title: step.isMilestone
        ? `Cadeau Assiduité Jour ${step.day} débloqué`
        : `Connexion quotidienne validée (Jour ${step.day}/7)`,
      subtitle: step.isMilestone
        ? `Récompense fidélité : ${step.rewardBadge} offert gratuitement`
        : `Parcours d'assiduité Boo • ${updatedStreak.totalCheckIns} connexion(s) cumulée(s)`,
      amountLabel: step.rewardBadge,
      badgeColor: step.isMilestone ? 'purple' : 'emerald'
    });

    if (step.tokensGranted > 0) {
      triggerToast(
        `🎁 Jour ${step.day} validé : +${step.tokensGranted} Jeton${step.tokensGranted > 1 ? 's' : ''} Gratuit${step.tokensGranted > 1 ? 's' : ''} crédité${step.tokensGranted > 1 ? 's' : ''} !`,
        'green'
      );
    } else if (step.boostsGranted > 0) {
      triggerToast(
        `🚀 Jour ${step.day} validé : +${step.boostsGranted} Pass Coupe-File Gratuit crédité !`,
        'orange'
      );
    } else {
      triggerToast(`🔥 Connexion du Jour ${step.day}/7 validée !`, 'green');
    }
  };

  // Simulation du jour suivant (+24h) pour tester immédiatement les 7 jours et les cadeaux
  const handleSimulateNextDayStreak = () => {
    triggerHaptic(25);
    setDailyStreak((prev) => {
      const nextDay = prev.currentDay >= 7 ? 1 : prev.currentDay + 1;
      return {
        ...prev,
        currentDay: nextDay,
        claimedToday: false
      };
    });
    triggerToast('⏩ Jour suivant simulé : vous pouvez valider la nouvelle connexion !', 'orange');
  };

  const handleResetDemo = () => {
    resetAllDemoData();
    setWeapons(INITIAL_WEAPONS);
    setSelectedWeaponIndex(0);
    setMarketItems(INITIAL_MARKET);
    setMatches(INITIAL_MATCHES);
    setWallet(INITIAL_WALLET);
    setDailyStreak(INITIAL_DAILY_STREAK);
    setUserProfile(INITIAL_PROFILE);
    setActivityHistory(INITIAL_HISTORY);
    setSentOffers({});
    setSelectedTier('Tous');
    setSelectedCity('Toutes les villes');
    setSelectedCategory('Toutes');
    setSelectedCondition('ALL');
    setSearchQuery('');
    setProposalCashTopUp(0);
    setAcceptedTerms(false);
    setActiveModal('daily_streak');
    triggerToast('🔄 Démonstration réinitialisée', 'dark');
  };

  const incomingPendingCount = matches.filter((m) => m.status === 'PENDING_DECISION').length;
  const activeMatchesCount = matches.filter(
    (m) =>
      m.status === 'PENDING_DECISION' ||
      m.status === 'ACCEPTED_LOCKED' ||
      m.status === 'UNLOCKED'
  ).length;

  return (
    <div className="min-h-[100dvh] bg-[#000000] text-white flex flex-col lg:flex-row items-center lg:items-start justify-center lg:gap-7 sm:py-5 px-0 sm:px-4 select-none overflow-x-hidden">
      {/* =====================================================================
          CADRE APPLICATION MOBILE NATIVE BOO UHD 120FPS
      ===================================================================== */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] bg-[#090b0f] sm:rounded-[38px] sm:border-[1.5px] sm:border-white/[0.12] shadow-[0_25px_90px_rgba(0,0,0,0.95)] flex flex-col relative overflow-hidden shrink-0 gpu-120fps">
        {/* TOAST NOTIFICATION ÉCLAIR */}
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

        {/* EN-TÊTE BOO VECTORIEL UHD */}
        <BooHeader
          tokens={wallet.tokens}
          streakDay={dailyStreak.currentDay}
          streakClaimedToday={dailyStreak.claimedToday}
          incomingPendingCount={incomingPendingCount}
          activeMatchesCount={activeMatchesCount}
          onSelectTab={(tab) => {
            triggerHaptic(15);
            setActiveTab(tab);
          }}
          onOpenDailyStreak={() => {
            triggerHaptic(20);
            setActiveModal('daily_streak');
          }}
          onTriggerIncomingAlert={triggerIncomingAttackAlert}
        />

        {/* ONGLET 1 : MARCHÉ */}
        {activeTab === 'market' && (
          <>
            <MarketFilterBar
              selectedCity={selectedCity}
              selectedTier={selectedTier}
              selectedCategory={selectedCategory}
              selectedCondition={selectedCondition}
              searchQuery={searchQuery}
              incomingPendingPartnerName={
                matches.find((m) => m.status === 'PENDING_DECISION')?.partnerName
              }
              onOpenCitySelector={() => {
                triggerHaptic(15);
                setActiveModal('city_selector');
              }}
              onOpenFilterDrawer={() => {
                triggerHaptic(15);
                setActiveModal('market_filter');
              }}
              onSelectTier={(tier) => {
                triggerHaptic(15);
                setSelectedTier(tier);
              }}
              onClearCategory={() => setSelectedCategory('Toutes')}
              onClearCondition={() => setSelectedCondition('ALL')}
              onClearSearch={() => setSearchQuery('')}
              onTriggerIncomingAlert={triggerIncomingAttackAlert}
            />

            <div className="flex-1 overflow-y-auto px-3 pt-2.5 pb-6 gpu-120fps">
              {filteredMarket.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-2">
                  <p className="text-sm font-bold text-gray-300">
                    Aucune annonce correspondante.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity('Toutes les villes');
                      setSelectedTier('Tous');
                      setSelectedCategory('Toutes');
                      setSelectedCondition('ALL');
                      setSearchQuery('');
                    }}
                    className="uhd-orange-btn text-black font-black text-xs px-4 py-2 rounded-xl"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredMarket.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      <MarketCard
                        item={item}
                        isOwnListing={isItemOwnedByCurrentUser(item)}
                        alreadySent={sentOffers[item.id]}
                        boostCredits={wallet.boostCredits}
                        onInspect={openProductInspector}
                        onProposeTrade={openTradeProposalDrawer}
                        onCashBuy={(target) => {
                          if (isItemOwnedByCurrentUser(target)) return;
                          triggerHaptic(20);
                          setSelectedMarketItem(target);
                          setActiveModal('cash_buy');
                        }}
                        onBoostCoupeFile={handleBoostCoupeFile}
                        onRemoveOwnItem={handleRemoveOwnMarketItem}
                      />
                      {/* Carte découverte VYBZ + accès Espace Exclusif Mmedia Universe */}
                      {idx === 1 && (
                        <VybzPromoCard
                          variant="grid"
                          onOpenMmediaHub={() => {
                            triggerHaptic(20);
                            setActiveModal('mmedia_hub');
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                  {filteredMarket.length < 2 && (
                    <VybzPromoCard
                      variant="grid"
                      onOpenMmediaHub={() => {
                        triggerHaptic(20);
                        setActiveModal('mmedia_hub');
                      }}
                    />
                  )}
                </div>
              )}

              {/* Signature officielle de bas de page */}
              <BooFooterSignature />
            </div>
          </>
        )}

        {/* ONGLET 2 : BOUTIQUE DE JETONS */}
        {activeTab === 'shop' && (
          <ShopTab
            wallet={wallet}
            dailyStreak={dailyStreak}
            selectedOperator={selectedOperator}
            onSelectOperator={(op) => {
              triggerHaptic(15);
              setSelectedOperator(op);
            }}
            onBuyTokenPack={handleBuyTokenPack}
            onBuyBoostPack={handleBuyBoostPack}
            onOpenDailyStreak={() => {
              triggerHaptic(20);
              setActiveModal('daily_streak');
            }}
          />
        )}

        {/* ONGLET 3 : MATCHS */}
        {activeTab === 'matches' && (
          <MatchesTab
            matches={matches}
            userProfile={userProfile}
            formatCountdown={formatCountdown}
            getWhatsAppTicketUrl={getWhatsAppTicketUrl}
            onBackToMarket={() => setActiveTab('market')}
            onInspectMatchItem={openMatchItemInspector}
            onIncomingDecision={handleIncomingDecision}
            onOpenFullScreenIncoming={(match) => {
              setIncomingAlertMatch(match);
              setActiveModal('incoming_alert');
            }}
            onUnlockMatch={handleUnlockMatch}
            onSimulatePartnerDefault30Min={handleSimulatePartnerDefault30Min}
            onOpenTicketView={(match) => {
              setSelectedTicketMatch(match);
              setActiveModal('ticket_view');
            }}
            onGhostCancel={handleGhostCancel}
          />
        )}

        {/* ONGLET 4 : PROFIL UTILISATEUR (HISTORIQUE | OBJETS | FAQ | LÉGAL + ESPACE DÉDIÉ MMEDIA UNIVERSE) */}
        {activeTab === 'profile' && (
          <ProfileTab
            userProfile={userProfile}
            isEditingProfile={isEditingProfile}
            wallet={wallet}
            dailyStreak={dailyStreak}
            profileSubTab={profileSubTab}
            legalInitialSection={legalSection}
            activityHistory={activityHistory}
            weapons={weapons}
            selectedWeaponIndex={selectedWeaponIndex}
            onToggleEditProfile={() => setIsEditingProfile((prev) => !prev)}
            onUpdateProfile={setUserProfile}
            onSelectSubTab={setProfileSubTab}
            onSelectDefaultWeapon={(idx) => {
              setSelectedWeaponIndex(idx);
              triggerToast(`${weapons[idx].title} sélectionné par défaut`, 'orange');
            }}
            onDeleteWeapon={(id) => {
              setWeapons((prev) => prev.filter((item) => item.id !== id));
              setSelectedWeaponIndex(0);
              triggerToast('Objet retiré.', 'dark');
            }}
            onOpenPublish={() => {
              triggerHaptic(25);
              setActiveModal('add_photo');
            }}
            onOpenMmediaHub={() => {
              triggerHaptic(20);
              setActiveModal('mmedia_hub');
            }}
            onOpenDailyStreak={() => {
              triggerHaptic(20);
              setActiveModal('daily_streak');
            }}
          />
        )}

        {/* BARRE DE NAVIGATION INFÉRIEURE FIXE */}
        <BottomNavBar
          activeTab={activeTab}
          activeMatchesCount={activeMatchesCount}
          onSelectTab={(tab) => {
            triggerHaptic(15);
            setActiveTab(tab);
          }}
          onOpenPublish={() => {
            triggerHaptic(25);
            setActiveModal('add_photo');
          }}
        />

        {/* MODALES MODULAIRES */}
        <AnimatePresence>
          {activeModal === 'inspect_item' && inspectedItem && (
            <InspectModal
              item={inspectedItem}
              isOwnListing={isItemOwnedByCurrentUser(inspectedItem)}
              alreadySent={sentOffers[inspectedItem.id]}
              fromMatchOnly={inspectedFromMatchOnly}
              onClose={() => {
                if (returnModalAfterInspect !== 'none') {
                  setActiveModal(returnModalAfterInspect);
                  setReturnModalAfterInspect('none');
                } else {
                  setActiveModal('none');
                }
              }}
              onShare={(item) => {
                triggerHaptic(20);
                setSharedItem(item);
                setActiveModal('share_item');
              }}
              onProposeTrade={openTradeProposalDrawer}
              onCashBuy={(item) => {
                if (isItemOwnedByCurrentUser(item)) return;
                setSelectedMarketItem(item);
                setActiveModal('cash_buy');
              }}
              onRemoveOwnItem={handleRemoveOwnMarketItem}
            />
          )}

          {activeModal === 'propose_trade' && tradeTargetItem && (
            <ProposeTradeModal
              targetItem={tradeTargetItem}
              weapons={weapons}
              selectedWeaponIndex={selectedWeaponIndex}
              proposalCashTopUp={proposalCashTopUp}
              acceptedTerms={acceptedTerms}
              onChangeAcceptedTerms={setAcceptedTerms}
              onOpenLegalSection={handleOpenLegalModalFromCheckbox}
              onSelectWeapon={(idx) => {
                triggerHaptic(15);
                setSelectedWeaponIndex(idx);
              }}
              onSelectCashTopUp={(amt) => {
                triggerHaptic(15);
                setProposalCashTopUp(amt);
              }}
              onOpenPublishNewWeapon={() => setActiveModal('add_photo')}
              onConfirmProposal={handleConfirmTradeProposal}
              onNeedTermsToast={() =>
                triggerToast(
                  '⚖️ Veuillez cocher la case d’acceptation des CGU (Loi gabonaise)',
                  'orange'
                )
              }
              onClose={() => setActiveModal('none')}
            />
          )}

          {activeModal === 'share_item' && sharedItem && (
            <ShareModal
              item={sharedItem}
              shareText={getShareTextForItem(sharedItem)}
              onBackToInspect={() => setActiveModal('inspect_item')}
              onNativeShare={handleNativeSystemShare}
              onCopySuccess={() =>
                triggerToast('Texte & lien copiés pour Instagram / TikTok ✓', 'green')
              }
            />
          )}

          {activeModal === 'add_photo' && (
            <PublishModal
              defaultCity={userProfile.city}
              acceptedTerms={acceptedTerms}
              onChangeAcceptedTerms={setAcceptedTerms}
              onOpenLegalSection={handleOpenLegalModalFromCheckbox}
              onClose={() => setActiveModal('none')}
              onPublishItem={handlePublishItem}
              onCropFileToSquare={(dataUrl) => renderSquare1to1Image(dataUrl, 1, 0, 0, 1080)}
              onNeedTermsToast={() =>
                triggerToast(
                  '⚖️ Cochez la case obligatoire des CGU (Loi gabonaise) pour publier',
                  'orange'
                )
              }
            />
          )}

          {activeModal === 'incoming_alert' && incomingAlertMatch && (
            <IncomingOfferModal
              match={incomingAlertMatch}
              userProfile={userProfile}
              onClose={() => setActiveModal('none')}
              onInspectMatchItem={openMatchItemInspector}
              onDecision={handleIncomingDecision}
            />
          )}

          {activeModal === 'cash_buy' && selectedMarketItem && (
            <CashBuyModal
              item={selectedMarketItem}
              acceptedTerms={acceptedTerms}
              onChangeAcceptedTerms={setAcceptedTerms}
              onOpenLegalSection={handleOpenLegalModalFromCheckbox}
              onNeedTermsToast={() =>
                triggerToast(
                  '⚖️ Cochez la case obligatoire des CGU (Loi gabonaise) pour continuer',
                  'orange'
                )
              }
              onConfirmCashBuy={(item) => {
                const commission = Math.round(item.cashPrice * 0.05);
                setWallet((prev) => ({
                  ...prev,
                  platformRevenueFcfa: prev.platformRevenueFcfa + commission,
                  cashCommissionFcfa: prev.cashCommissionFcfa + commission
                }));
                setMarketItems((prev) =>
                  prev.map((m) => (m.id === item.id ? { ...m, status: 'RESERVED_12H' } : m))
                );
                appendHistory({
                  type: 'CASH_PURCHASE',
                  title: `Achat Cash : ${item.title}`,
                  subtitle: `Vendeur : ${item.owner} (${item.city})`,
                  amountLabel: `${item.cashPrice.toLocaleString('fr-FR')} F`,
                  badgeColor: 'emerald'
                });
                setActiveModal('none');
                triggerToast(`💵 Offre d'achat cash envoyée à ${item.owner} !`, 'green');
              }}
              onClose={() => setActiveModal('none')}
            />
          )}

          {activeModal === 'ticket_view' && selectedTicketMatch && (
            <TicketModal
              match={selectedTicketMatch}
              userProfile={userProfile}
              whatsAppTicketUrl={getWhatsAppTicketUrl(selectedTicketMatch)}
              onClose={() => setActiveModal('none')}
              onInspectMatchItem={openMatchItemInspector}
              onVerifyPinCode={handleVerifyPinCode}
            />
          )}

          {activeModal === 'city_selector' && (
            <CitySelectorModal
              selectedCity={selectedCity}
              onSelectCity={(city) => {
                setSelectedCity(city);
                setActiveModal('none');
                triggerToast(
                  city === 'Toutes les villes'
                    ? '📍 Affichage de toutes les villes du Gabon'
                    : `📍 Ville sélectionnée : ${city}`,
                  'dark'
                );
              }}
              onClose={() => setActiveModal('none')}
            />
          )}

          {activeModal === 'market_filter' && (
            <MarketFilterDrawer
              selectedCategory={selectedCategory}
              selectedCondition={selectedCondition}
              searchQuery={searchQuery}
              resultsCount={filteredMarket.length}
              onSelectCategory={(cat) => {
                triggerHaptic(15);
                setSelectedCategory(cat);
              }}
              onSelectCondition={(cond) => {
                triggerHaptic(15);
                setSelectedCondition(cond);
              }}
              onChangeSearchQuery={setSearchQuery}
              onResetFilters={() => {
                triggerHaptic(20);
                setSelectedCategory('Toutes');
                setSelectedCondition('ALL');
                setSearchQuery('');
              }}
              onClose={() => setActiveModal('none')}
            />
          )}

          {activeModal === 'mmedia_hub' && (
            <MmediaUniverseModal onClose={() => setActiveModal('none')} />
          )}

          {activeModal === 'daily_streak' && (
            <DailyStreakModal
              streak={dailyStreak}
              onClaimToday={handleClaimDailyStreak}
              onSimulateNextDay={handleSimulateNextDayStreak}
              onClose={() => setActiveModal('none')}
            />
          )}

          {activeModal === 'legal_viewer' && (
            <LegalModal
              initialSection={legalSection}
              onAcceptAndClose={() => {
                setAcceptedTerms(true);
                setActiveModal(returnModalAfterLegal);
                setReturnModalAfterLegal('none');
                triggerToast('✓ Conditions acceptées (Loi gabonaise)', 'green');
              }}
              onClose={() => {
                setActiveModal(returnModalAfterLegal);
                setReturnModalAfterLegal('none');
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* PANNEAU COMPAGNON DESKTOP */}
      <aside className="hidden lg:block w-full max-w-[360px] space-y-4 shrink-0">
        <div className="uhd-card border border-white/[0.09] rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#ff6b00] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Aperçu Rapide Boo
            </span>
            <span className="text-[11px] text-gray-400 font-mono-tabular">
              🏆 {wallet.verifiedTrades} trocs conclus
            </span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={triggerIncomingAttackAlert}
              className="w-full uhd-orange-btn text-black font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-between active:scale-98 transition-transform"
            >
              <span>🔔 Simuler une offre reçue</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('daily_streak')}
              className="w-full uhd-surface text-gray-100 font-bold text-xs py-2.5 px-3 rounded-xl border border-purple-500/40 flex items-center justify-between transition-colors"
            >
              <span>🔥 Parcours Assiduité (J{dailyStreak.currentDay}/7)</span>
              <span className="text-[10px] font-black text-purple-300">Jetons Gratuits</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('mmedia_hub')}
              className="w-full uhd-surface text-gray-100 font-bold text-xs py-2.5 px-3 rounded-xl border border-[#e11d48]/40 flex items-center justify-between transition-colors"
            >
              <span>🚀 Espace Apps Mmedia Universe</span>
              <span className="text-[10px] font-black text-[#fb7185]">Découvrez VYBZ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('profile');
                setProfileSubTab('help');
              }}
              className="w-full uhd-surface text-gray-100 font-bold text-xs py-2.5 px-3 rounded-xl border border-white/10 flex items-center justify-between transition-colors"
            >
              <span>📖 Voir FAQ (16 Questions)</span>
              <span className="text-[10px] font-black text-[#ff7b1c]">Profil → FAQ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('profile');
                setProfileSubTab('legal');
              }}
              className="w-full uhd-surface text-gray-100 font-bold text-xs py-2.5 px-3 rounded-xl border border-white/10 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Légal (CGU, Privé, À Propos)</span>
              </span>
              <span className="text-[10px] font-black text-emerald-400">Profil → Légal</span>
            </button>

            <button
              type="button"
              onClick={handleResetDemo}
              className="w-full bg-[#0e1016] hover:bg-[#171b24] text-gray-400 hover:text-white font-semibold text-xs py-2 px-3 rounded-xl border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser la démonstration</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
