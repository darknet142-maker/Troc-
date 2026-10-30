import React, { useState, useMemo } from 'react';
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
  Smartphone, 
  ArrowLeftRight,
  Plus,
  Sparkles,
  Clock,
  QrCode,
  MessageCircle,
  Banknote,
  Lock,
  Upload
} from 'lucide-react';

// --- DONNÉES INITIALES : INVENTAIRE DE L'UTILISATEUR ("MES ARMES") ---
const INITIAL_WEAPONS = [
  {
    id: 'w1',
    title: 'Casque Audio Studio Pro',
    tier: '25k',
    tierValue: 25000,
    emoji: '🎧',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'w2',
    title: 'Sneakers Nike Air Max T.43',
    tier: '25k',
    tierValue: 25000,
    emoji: '👟',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'w3',
    title: 'Manette PS5 DualSense',
    tier: '50k',
    tierValue: 50000,
    emoji: '🎮',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'w4',
    title: 'iPhone 12 Pro 128Go',
    tier: '100k+',
    tierValue: 150000,
    emoji: '📱',
    image: 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=600&q=80'
  }
];

// --- DONNÉES INITIALES : CATALOGUE DU MARCHÉ AUTOUR DE LIBREVILLE ---
const INITIAL_MARKET = [
  {
    id: 'm1',
    title: 'Montre Connectée Series 6',
    tier: '25k',
    cashPrice: 27000,
    distance: '1,2 km',
    quartier: 'Louis',
    boosted: false,
    owner: 'Marc O.',
    phone: '241077123456',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm2',
    title: 'Enceinte Bluetooth JBL',
    tier: '25k',
    cashPrice: 25000,
    distance: '2,5 km',
    quartier: 'Glass',
    boosted: false,
    owner: 'Stevy N.',
    phone: '241066987654',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm3',
    title: 'Micro Sans Fil Cravate Pro',
    tier: '25k',
    cashPrice: 24000,
    distance: '0,8 km',
    quartier: 'Montagne Sainte',
    boosted: true,
    owner: 'Junior Film',
    phone: '241074556677',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm4',
    title: 'Four Micro-ondes Silver',
    tier: '25k',
    cashPrice: 28000,
    distance: '3,1 km',
    quartier: 'Nzeng-Ayong',
    boosted: false,
    owner: 'Amina K.',
    phone: '241062334455',
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm5',
    title: 'Sac à Dos Imperméable Tech',
    tier: '10k',
    cashPrice: 12000,
    distance: '1,5 km',
    quartier: 'Akébé',
    boosted: false,
    owner: 'Kevin B.',
    phone: '241077889900',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm6',
    title: 'Ring Light LED + Trépied 2m',
    tier: '10k',
    cashPrice: 11000,
    distance: '0,9 km',
    quartier: 'Centre-Ville',
    boosted: true,
    owner: 'Sarah M.',
    phone: '241065112233',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm7',
    title: 'Écran Moniteur 27" Full HD',
    tier: '50k',
    cashPrice: 55000,
    distance: '2,0 km',
    quartier: 'Charbonnages',
    boosted: false,
    owner: 'David T.',
    phone: '241074223344',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm8',
    title: 'PlayStation 4 Slim + 2 Jeux',
    tier: '100k+',
    cashPrice: 115000,
    distance: '4,2 km',
    quartier: 'Angondjé',
    boosted: true,
    owner: 'Yannick E.',
    phone: '241066445566',
    image: 'https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&w=600&q=80'
  }
];

// --- DONNÉES INITIALES : OFFRES REÇUES & MATCHS EN COURS ---
const INITIAL_MATCHES = [
  {
    id: 'match-1',
    type: 'INCOMING', // Quelqu'un attaque notre objet
    partnerName: 'Franck M.',
    partnerQuartier: 'Batterie IV (1,4 km)',
    partnerPhone: '241077998877',
    theirItem: {
      title: 'Tablette Graphique Wacom',
      tier: '25k',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    },
    myItem: INITIAL_WEAPONS[0],
    soulte: 2000, // Il nous rajoute +2 000 FCFA
    soulteDirection: 'TO_ME', // L'autre me donne la soulte
    status: 'PENDING_DECISION', // PENDING_DECISION | ACCEPTED_LOCKED | UNLOCKED
    myPaid: false,
    theirPaid: true, // Le partenaire a déjà validé ses 300 FCFA
    pinCode: '4829',
    timestamp: 'Il y a 2 min'
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
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80'
    },
    myItem: INITIAL_WEAPONS[1],
    soulte: 0,
    soulteDirection: 'NONE',
    status: 'ACCEPTED_LOCKED',
    myPaid: false,
    theirPaid: true,
    pinCode: '9104',
    timestamp: 'Il y a 8 min'
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
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
    },
    myItem: INITIAL_WEAPONS[0],
    soulte: 5000,
    soulteDirection: 'FROM_ME',
    status: 'UNLOCKED',
    myPaid: true,
    theirPaid: true,
    pinCode: '7351',
    timestamp: 'Il y a 25 min'
  }
];

export default function App() {
  // Navigation principale : 'market' | 'matches'
  const [activeTab, setActiveTab] = useState('market');
  
  // Filtre de puissance : 'Tous' | '10k' | '25k' | '50k' | '100k+'
  const [selectedTier, setSelectedTier] = useState('25k');
  
  // Solde de Jetons (1 Jeton = 300 FCFA)
  const [tokens, setTokens] = useState(2);
  
  // Inventaire de l'utilisateur et arme active
  const [weapons, setWeapons] = useState(INITIAL_WEAPONS);
  const [activeWeaponIndex, setActiveWeaponIndex] = useState(0);
  const activeWeapon = weapons[activeWeaponIndex];
  
  // Rajout cash actif (Soulte : 0, 2000, 5000, 10000)
  const [activeSoulte, setActiveSoulte] = useState(0);
  
  // Catalogue et état des offres envoyées en 1 clic
  const [marketItems, setMarketItems] = useState(INITIAL_MARKET);
  const [sentOffers, setSentOffers] = useState({}); // { [itemId]: { weaponTitle, soulte } }
  
  // Liste des matchs
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  
  // Modales : 'none' | 'add_3s' | 'buy_tokens' | 'cash_buy' | 'ticket_view' | 'incoming_alert'
  const [activeModal, setActiveModal] = useState('none');
  const [selectedMarketItem, setSelectedMarketItem] = useState(null);
  const [selectedTicketMatch, setSelectedTicketMatch] = useState(null);
  
  // Notification Toast ultra-rapide
  const [toast, setToast] = useState(null);

  // Formulaire "+3s" (Ajout express d'objet)
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTier, setNewItemTier] = useState('25k');
  const [newItemPresetIndex, setNewItemPresetIndex] = useState(0);

  const PRESET_PHOTOS = [
    { label: ' Montre / Bijou', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', defaultName: 'Montre Homme Acier' },
    { label: '📱 Smartphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', defaultName: 'Smartphone Samsung 128Go' },
    { label: '🎒 Mode / Sac', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80', defaultName: 'Sac Cuir Vintage' },
    { label: '🔌 Électroménager', url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80', defaultName: 'Blender Mixeur Pro' }
  ];

  // Fonction utilitaire pour afficher un message éclair
  const triggerToast = (msg, type = 'orange') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 2600);
  };

  // Filtrage des articles du marché par palier
  const filteredMarket = useMemo(() => {
    if (selectedTier === 'Tous') return marketItems;
    return marketItems.filter(item => item.tier === selectedTier);
  }, [marketItems, selectedTier]);

  // Changer d'arme active en 1 clic
  const cycleWeapon = () => {
    const nextIndex = (activeWeaponIndex + 1) % weapons.length;
    setActiveWeaponIndex(nextIndex);
    triggerToast(`Arme active : ${weapons[nextIndex].title}`, 'dark');
  };

  // Basculer la soulte (+2k, +5k, +10k)
  const toggleSoulte = (amount) => {
    if (activeSoulte === amount) {
      setActiveSoulte(0);
    } else {
      setActiveSoulte(amount);
    }
  };

  // ACTION PRINCIPALE : TROQUER EN 1 CLIC (3 secondes)
  const handleInstantTrade = (item) => {
    if (sentOffers[item.id]) {
      // Permet de simuler une acceptation immédiate du vendeur en face pour tester le flux
      setActiveTab('matches');
      triggerToast(`Consultez vos matchs pour débloquer ${item.owner}`, 'orange');
      return;
    }

    const offerData = {
      weapon: activeWeapon,
      soulte: activeSoulte
    };

    setSentOffers(prev => ({ ...prev, [item.id]: offerData }));

    // Création automatique d'un match accepté par le vendeur pour démontrer la réactivité
    const newMatch = {
      id: `match-${Date.now()}`,
      type: 'MUTUAL',
      partnerName: item.owner,
      partnerQuartier: `${item.quartier} (${item.distance})`,
      partnerPhone: item.phone,
      theirItem: {
        title: item.title,
        tier: item.tier,
        image: item.image
      },
      myItem: activeWeapon,
      soulte: activeSoulte,
      soulteDirection: activeSoulte > 0 ? 'FROM_ME' : 'NONE',
      status: 'ACCEPTED_LOCKED',
      myPaid: false,
      theirPaid: true,
      pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
      timestamp: 'À l’instant'
    };

    setMatches(prev => [newMatch, ...prev]);

    const soulteText = activeSoulte > 0 ? ` + ${activeSoulte / 1000}k FCFA` : '';
    triggerToast(`⚡ Offre envoyée : ${activeWeapon.title}${soulteText} !`, 'green');
  };

  // Accepter ou Contre-proposer sur une offre entrante
  const handleIncomingDecision = (matchId, decision, requiredSoulte = 0) => {
    if (decision === 'REJECT') {
      setMatches(prev => prev.filter(m => m.id !== matchId));
      triggerToast('Offre refusée et retirée.', 'dark');
      return;
    }

    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      if (decision === 'ACCEPT') {
        return { ...m, status: 'ACCEPTED_LOCKED' };
      }
      if (decision === 'REQUIRE_SOULTE') {
        return {
          ...m,
          soulte: requiredSoulte,
          soulteDirection: 'TO_ME',
          status: 'ACCEPTED_LOCKED'
        };
      }
      return m;
    }));

    if (decision === 'ACCEPT') {
      triggerToast('Accord validé ! Débloquez le contact (1 Jeton / 300 FCFA).', 'green');
    } else {
      triggerToast(`Contre-offre (+${requiredSoulte / 1000}k FCFA) acceptée !`, 'orange');
    }
  };

  // Débloquer un Match avec 1 Jeton (300 FCFA)
  const handleUnlockMatch = (match) => {
    if (tokens <= 0) {
      setActiveModal('buy_tokens');
      return;
    }

    setTokens(prev => prev - 1);
    const updatedMatch = { ...match, status: 'UNLOCKED', myPaid: true };
    
    setMatches(prev => prev.map(m => m.id === match.id ? updatedMatch : m));
    setSelectedTicketMatch(updatedMatch);
    setActiveModal('ticket_view');
    triggerToast('🔓 Match débloqué (-1 Jeton). Ticket Officiel généré !', 'green');
  };

  // Publier un nouvel objet en 3 secondes
  const handleQuickPublish = (e) => {
    e.preventDefault();
    const chosenPreset = PRESET_PHOTOS[newItemPresetIndex];
    const finalTitle = newItemTitle.trim() || chosenPreset.defaultName;

    const createdWeapon = {
      id: `w-${Date.now()}`,
      title: finalTitle,
      tier: newItemTier,
      tierValue: newItemTier === '10k' ? 10000 : newItemTier === '25k' ? 25000 : newItemTier === '50k' ? 50000 : 100000,
      emoji: '📸',
      image: chosenPreset.url
    };

    const newWeaponsList = [createdWeapon, ...weapons];
    setWeapons(newWeaponsList);
    setActiveWeaponIndex(0);
    setSelectedTier(newItemTier);
    setNewItemTitle('');
    setActiveModal('none');
    triggerToast(`🚀 "${finalTitle}" équipé comme Arme Active !`, 'green');
  };

  // Acheter des jetons via Airtel Money / Moov Money
  const handleRechargeTokens = (packCount, priceFcfa) => {
    setTokens(prev => prev + packCount);
    setActiveModal('none');
    triggerToast(`✅ +${packCount} Jetons crédités (${priceFcfa} FCFA via Mobile Money)`, 'green');
  };

  // Ouvrir WhatsApp avec le message pré-rempli du Ticket Officiel
  const openWhatsApp = (match) => {
    const soulteLabel = match.soulte === 0
      ? 'Échange net (0 FCFA de rajout)'
      : match.soulteDirection === 'FROM_ME'
      ? `Je rajoute +${match.soulte.toLocaleString('fr-FR')} FCFA`
      : `Tu rajoutes +${match.soulte.toLocaleString('fr-FR')} FCFA`;

    const text = encodeURIComponent(
      `⚡ *TICKET D'ÉCHANGE OFFICIEL FAST-TROC* ⚡\n\n` +
      `🤝 Salut ${match.partnerName}, notre troc est validé et débloqué !\n` +
      `📦 Ton objet : *${match.theirItem.title}* (${match.theirItem.tier})\n` +
      `🔄 Mon objet : *${match.myItem.title}* (${match.myItem.tier})\n` +
      `💵 Soulte verrouillée : *${soulteLabel}*\n` +
      `🔐 Code PIN de remise : *${match.pinCode}*\n\n` +
      `📍 On se retrouve à quel Point Relais aujourd'hui ?`
    );
    window.open(`https://wa.me/${match.partnerPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const pendingMatchesCount = matches.filter(m => m.status !== 'UNLOCKED').length;

  return (
    <div className="min-h-screen bg-[#07080a] text-white flex justify-center items-start sm:py-6 font-sans select-none">
      {/* Conteneur Smartphone Plein Écran */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[860px] sm:max-h-[900px] bg-[#0f1115] sm:rounded-[38px] sm:border-[6px] sm:border-[#232730] shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* TOAST NOTIFICATION ÉCLAIR */}
        {toast && (
          <div className="absolute top-16 left-4 right-4 z-50 animate-bounce">
            <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-sm font-bold ${
              toast.type === 'green' 
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200' 
                : toast.type === 'orange'
                ? 'bg-[#2a1708]/95 border-[#ff6b00] text-orange-200'
                : 'bg-[#1c2029]/95 border-gray-600 text-white'
            }`}>
              <Zap className="w-4 h-4 text-[#ff6b00] shrink-0 fill-[#ff6b00]" />
              <span className="truncate">{toast.msg}</span>
            </div>
          </div>
        )}

        {/* 1. RADAR D'ÉTAT (HEADER FIXE) */}
        <header className="px-4 pt-4 pb-2.5 flex items-center justify-between bg-[#0f1115]/95 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
          <button 
            onClick={() => triggerToast('📍 Radar GPS actif : Libreville (Rayon 5 km)', 'dark')}
            className="flex items-center gap-1.5 text-left group"
          >
            <MapPin className="w-4 h-4 text-gray-300 group-hover:text-[#ff6b00] transition-colors" />
            <span className="text-[15px] font-semibold tracking-tight text-gray-100">
              Libreville <span className="text-gray-400 font-normal">(5 km)</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            {/* Compteur de Jetons (300 FCFA/jeton) */}
            <button
              onClick={() => setActiveModal('buy_tokens')}
              className="flex items-center gap-1.5 bg-[#1b1f27] hover:bg-[#252a35] active:scale-95 transition-all px-3 py-1.5 rounded-full border border-white/10"
            >
              <span className="w-4 h-4 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center shadow">
                🪙
              </span>
              <span className="text-xs font-extrabold tracking-wide text-white">
                {tokens} JETON{tokens > 1 ? 'S' : ''}
              </span>
              <Plus className="w-3.5 h-3.5 text-[#ff6b00]" />
            </button>

            {/* Cloche d'alerte d'attaque */}
            <button
              onClick={() => setActiveTab('matches')}
              className="relative bg-[#1b1f27] hover:bg-[#252a35] active:scale-95 transition-all px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-1"
            >
              <Bell className="w-4 h-4 text-[#ff6b00] fill-[#ff6b00]" />
              <span className="bg-red-600 text-white text-[11px] font-black px-1.5 py-0.2 rounded-md">
                { matches.length }
              </span>
            </button>
          </div>
        </header>

        {/* CONTENU PRINCIPAL : SOIT MARCHÉ, SOIT MATCHS */}
        {activeTab === 'market' ? (
          <>
            {/* 2. SÉLECTEUR DE PUISSANCE (PILULES DE VALEUR) */}
            <div className="px-3.5 py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#0f1115] border-b border-white/5">
              {['Tous', '10k', '25k', '50k', '100k+'].map((tier) => {
                const isSelected = selectedTier === tier;
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-[#252932] text-white border-2 border-gray-300 shadow-md'
                        : 'bg-[#171a21] text-gray-300 border border-white/10 hover:bg-[#1f232c]'
                    }`}
                  >
                    {tier === 'Tous' && <Flame className="w-3.5 h-3.5 text-[#ff6b00] fill-[#ff6b00]" />}
                    {isSelected && tier !== 'Tous' && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    <span>{tier}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. GRILLE D'ATTAQUE DIRECTE (2 COLONNES) */}
            <div className="flex-1 overflow-y-auto px-3 pt-2 pb-44">
              <div className="grid grid-cols-2 gap-2.5">
                {filteredMarket.map((item) => {
                  const alreadySent = sentOffers[item.id];
                  return (
                    <div
                      key={item.id}
                      className="bg-[#181b22] rounded-2xl p-2.5 border border-white/10 flex flex-col justify-between shadow-lg relative overflow-hidden group"
                    >
                      {/* En-tête de la carte : Prix Palier + Distance */}
                      <div className="flex items-center justify-between gap-1 mb-1.5 z-10">
                        <span className="bg-[#101217]/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] font-extrabold text-[#ff7b1c] flex items-center gap-1 border border-[#ff6b00]/30">
                          🏷️ {item.tier} FCFA
                        </span>
                        <span className="text-[11px] font-medium text-gray-400">
                          {item.distance}
                        </span>
                      </div>

                      {/* Image carrée du produit */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#101217] mb-2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/400x400/181b22/ff6b00?text=Objet+Troc';
                          }}
                        />
                        {item.boosted && (
                          <span className="absolute bottom-1.5 left-1.5 bg-black/80 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-300 border border-amber-400/40 flex items-center gap-1">
                            🚀 Prioritaire
                          </span>
                        )}
                        {alreadySent && (
                          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center mb-1 shadow-lg">
                              <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                            <span className="text-[11px] font-black text-emerald-200 uppercase">
                              Offre Envoyée
                            </span>
                            <span className="text-[10px] text-emerald-300/90 line-clamp-1 mt-0.5">
                              {alreadySent.weapon.title}
                              {alreadySent.soulte > 0 ? ` +${alreadySent.soulte / 1000}k` : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Titre de l'objet */}
                      <h3 className="text-[13px] font-bold text-center text-gray-100 line-clamp-1 mb-2 px-0.5">
                        {item.title}
                      </h3>

                      {/* Boutons d'Action : ⚡ TROQUER + 💵 ACHAT CASH */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleInstantTrade(item)}
                          className={`flex-1 py-2 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-md ${
                            alreadySent
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-[#ff6b00] hover:bg-[#ff7b1c] text-black'
                          }`}
                        >
                          <Zap className={`w-3.5 h-3.5 ${alreadySent ? 'fill-white' : 'fill-black'}`} />
                          <span>{alreadySent ? 'VOIR MATCH' : 'TROQUER'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedMarketItem(item);
                            setActiveModal('cash_buy');
                          }}
                          title="Achat Cash Immédiat"
                          className="bg-[#101217] hover:bg-[#232834] active:scale-95 transition-all p-2 rounded-xl border border-white/10 text-sm"
                        >
                          💵
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* VUE 2 : CENTRE DE RÉACTION RAPIDE (MATCHS & OFFRES REÇUES) */
          <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-36 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#ff6b00] fill-[#ff6b00]" />
                  ACTION - RÉACTION ({matches.length})
                </h2>
                <p className="text-xs text-gray-400">
                  Débloquez le WhatsApp pour 1 Jeton (300 FCFA) dès que l'accord est scellé.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('market')}
                className="text-xs font-bold text-[#ff6b00] bg-[#ff6b00]/10 px-2.5 py-1.5 rounded-lg border border-[#ff6b00]/30"
              >
                ← Catalogue
              </button>
            </div>

            {matches.map((match) => (
              <div
                key={match.id}
                className={`rounded-2xl p-3 border transition-all ${
                  match.status === 'PENDING_DECISION'
                    ? 'bg-gradient-to-b from-[#231912] to-[#181b22] border-[#ff6b00]'
                    : match.status === 'UNLOCKED'
                    ? 'bg-[#14201b] border-emerald-500/50'
                    : 'bg-[#181b22] border-white/15'
                }`}
              >
                {/* En-tête du Match */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      match.status === 'PENDING_DECISION'
                        ? 'bg-[#ff6b00] text-black'
                        : match.status === 'UNLOCKED'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-amber-400 text-black'
                    }`}>
                      {match.status === 'PENDING_DECISION'
                        ? '🔔 Attaque Entrante'
                        : match.status === 'UNLOCKED'
                        ? '🔓 Débloqué • Prêt'
                        : '⏳ Accord Scellé (Verrouillé)'}
                    </span>
                    <span className="text-xs font-bold text-gray-200">
                      {match.partnerName}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {match.timestamp}
                  </span>
                </div>

                {/* Comparaison Visuelle Côte à Côte */}
                <div className="grid grid-cols-11 gap-1.5 items-center bg-[#101217] p-2 rounded-xl border border-white/5 mb-2.5">
                  {/* Objet du partenaire */}
                  <div className="col-span-5 flex items-center gap-2">
                    <img
                      src={match.theirItem.image}
                      alt={match.theirItem.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#ff7b1c] font-extrabold block">
                        IL PROPOSE ({match.theirItem.tier})
                      </span>
                      <p className="text-xs font-bold text-white truncate">
                        {match.theirItem.title}
                      </p>
                    </div>
                  </div>

                  {/* Icône centrale d'échange */}
                  <div className="col-span-1 flex justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#ff6b00]/20 border border-[#ff6b00] flex items-center justify-center">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#ff6b00]" />
                    </div>
                  </div>

                  {/* Mon objet */}
                  <div className="col-span-5 flex items-center gap-2 justify-end text-right">
                    <div className="min-w-0">
                      <span className="text-[10px] text-emerald-400 font-extrabold block">
                        VOTRE OBJET ({match.myItem.tier})
                      </span>
                      <p className="text-xs font-bold text-white truncate">
                        {match.myItem.title}
                      </p>
                    </div>
                    <img
                      src={match.myItem.image}
                      alt={match.myItem.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10"
                    />
                  </div>
                </div>

                {/* Bandeau de Soulte (Rajout Cash) */}
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/5 text-xs mb-2.5">
                  <span className="text-gray-300 font-medium">Complément Cash (Soulte) :</span>
                  {match.soulte === 0 ? (
                    <span className="font-bold text-gray-200">Échange Net (0 FCFA)</span>
                  ) : match.soulteDirection === 'TO_ME' ? (
                    <span className="font-black text-emerald-400">
                      +{match.soulte.toLocaleString('fr-FR')} FCFA pour vous
                    </span>
                  ) : (
                    <span className="font-black text-[#ff7b1c]">
                      Vous ajoutez +{match.soulte.toLocaleString('fr-FR')} FCFA
                    </span>
                  )}
                </div>

                {/* Boutons d'Action selon le statut */}
                {match.status === 'PENDING_DECISION' && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleIncomingDecision(match.id, 'ACCEPT')}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> ACCEPTER DIRECT
                      </button>
                      <button
                        onClick={() => handleIncomingDecision(match.id, 'REJECT')}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs px-3 py-2.5 rounded-xl border border-red-500/30 active:scale-95"
                      >
                        Refuser
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-1 pt-1">
                      <span className="text-[11px] text-gray-400">Ou exiger un rajout :</span>
                      <div className="flex gap-1">
                        {[2000, 5000, 10000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => handleIncomingDecision(match.id, 'REQUIRE_SOULTE', amt)}
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
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        ✅ {match.partnerName} a payé ses 300 FCFA
                      </span>
                      <span className="text-amber-300 font-bold">
                        ⏳ Attente de votre Jeton
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnlockMatch(match)}
                      className="w-full bg-[#ff6b00] hover:bg-[#ff7b1c] text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>DÉBLOQUER WHATSAPP & TICKET (1 JETON / 300F)</span>
                    </button>
                  </div>
                )}

                {match.status === 'UNLOCKED' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openWhatsApp(match)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-black" />
                      <span>OUVRIR WHATSAPP</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTicketMatch(match);
                        setActiveModal('ticket_view');
                      }}
                      className="bg-[#232834] hover:bg-[#2e3442] text-white font-bold text-xs px-3 py-2.5 rounded-xl border border-white/15 flex items-center gap-1"
                    >
                      <QrCode className="w-4 h-4 text-[#ff6b00]" />
                      <span>Ticket PIN</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 4. LE DOCK FLOTTANT : "MON ARME ACTIVE" (TOUJOURS SOUS LE POUCE) */}
        <div className="absolute bottom-[68px] left-2.5 right-2.5 z-30">
          <div className="bg-[#14171f]/95 backdrop-blur-md border-2 border-[#ff6b00] rounded-2xl px-3 py-2 shadow-2xl">
            {/* Ligne 1 : Arme sélectionnée + Bouton Switch */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm shrink-0">🎯</span>
                <span className="text-[11px] font-black tracking-wider text-[#ff6b00] uppercase shrink-0">
                  MON ARME ACTIVE
                </span>
                <span className="text-xs font-extrabold text-white truncate bg-white/10 px-2 py-0.5 rounded-md">
                  [{activeWeapon.emoji} {activeWeapon.title}]
                </span>
              </div>

              <button
                onClick={cycleWeapon}
                title="Changer d'objet à troquer"
                className="bg-[#232834] hover:bg-[#2d3342] active:rotate-180 transition-all p-1.5 rounded-lg border border-white/15 text-gray-200 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ligne 2 : Pastilles de soulte instantanées (+2k, +5k, +10k) */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-300 font-medium">
                Rajout cash actif :
              </span>
              <div className="flex items-center gap-1.5">
                {[2000, 5000, 10000].map((amount) => {
                  const isActive = activeSoulte === amount;
                  return (
                    <button
                      key={amount}
                      onClick={() => toggleSoulte(amount)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold transition-all active:scale-95 ${
                        isActive
                          ? 'bg-[#ff6b00] text-black border border-white shadow'
                          : 'bg-[#1f242f] text-gray-200 border border-white/15 hover:bg-[#2a303d]'
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

        {/* 5. BARRE DE NAVIGATION INFÉRIEURE AVEC BOUTON CENTRAL [+3s] */}
        <nav className="h-[64px] bg-[#0b0d11] border-t border-white/10 px-6 flex items-center justify-between relative z-30 mt-auto">
          {/* Onglet Marché */}
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 font-extrabold text-sm transition-colors ${
              activeTab === 'market' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="text-base">🏠</span>
            <span>Marché</span>
          </button>

          {/* Bouton Central Caméra [+3s] */}
          <div className="relative -top-4">
            <button
              onClick={() => setActiveModal('add_3s')}
              className="w-16 h-16 rounded-full bg-gradient-to-b from-[#ff7b1c] to-[#e65c00] text-black shadow-[0_0_25px_rgba(255,107,0,0.6)] border-4 border-[#0f1115] flex flex-col items-center justify-center active:scale-95 transition-transform"
            >
              <Camera className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[11px] font-black leading-none mt-0.5">
                [+3s]
              </span>
            </button>
          </div>

          {/* Onglet Matchs */}
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-1.5 font-extrabold text-sm transition-colors relative ${
              activeTab === 'matches' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Matchs ({matches.length})</span>
            {pendingMatchesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-1 -right-2" />
            )}
          </button>
        </nav>

        {/* =====================================================================
            MODALE 1 : AJOUT EXPRESS D'UN OBJET EN 3 SECONDES ([+3s])
        ===================================================================== */}
        {activeModal === 'add_3s' && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end justify-center p-3">
            <form
              onSubmit={handleQuickPublish}
              className="w-full bg-[#181b22] border border-white/15 rounded-3xl p-4 space-y-3.5 animate-in slide-in-from-bottom"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#ff6b00] text-black font-black text-xs px-2 py-0.5 rounded-md">
                    ⚡ 3 SECONDES
                  </span>
                  <h3 className="text-sm font-black text-white uppercase">
                    Mise en vitrine immédiate
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

              {/* Étape 1 : Choix d'image instantané */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1.5">
                  1. Prendre une photo rapide (ou choisir un modèle démo) :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => {
                        setNewItemPresetIndex(idx);
                        if (!newItemTitle) setNewItemTitle(preset.defaultName);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-bold transition-all ${
                        newItemPresetIndex === idx
                          ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-white'
                          : 'bg-[#101217] border-white/10 text-gray-400'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <span className="truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Étape 2 : Calibrage du palier en 1 doigt */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1.5">
                  2. Touchez le palier de valeur (Zéro prix à négocier) :
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['10k', '25k', '50k', '100k+'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewItemTier(t)}
                      className={`py-2 rounded-xl font-black text-xs border transition-all ${
                        newItemTier === t
                          ? 'bg-[#ff6b00] text-black border-white shadow'
                          : 'bg-[#101217] text-gray-300 border-white/10'
                      }`}
                    >
                      {t} FCFA
                    </button>
                  ))}
                </div>
              </div>

              {/* Étape 3 : Nom court optionnel */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
                  3. Nom de l'objet (Optionnel) :
                </label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder={PRESET_PHOTOS[newItemPresetIndex].defaultName}
                  className="w-full bg-[#101217] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff6b00]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff6b00] hover:bg-[#ff7b1c] text-black font-black text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>ÉQUIPER COMME ARME ACTIVE & PUBLIER</span>
              </button>
            </form>
          </div>
        )}

        {/* =====================================================================
            MODALE 2 : RECHARGE DE JETONS (300 FCFA / JETON VIA MOBILE MONEY)
        ===================================================================== */}
        {activeModal === 'buy_tokens' && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end justify-center p-3">
            <div className="w-full bg-[#181b22] border border-white/15 rounded-3xl p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🪙</span>
                  <h3 className="text-sm font-black text-white uppercase">
                    Recharger mes Jetons de Troc
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Chaque déblocage de match coûte <strong className="text-[#ff6b00]">1 Jeton (300 FCFA)</strong> à chacune des deux parties. Si votre partenaire ne valide pas dans les 30 min, votre Jeton vous est intégralement recrédité.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => handleRechargeTokens(1, 300)}
                  className="w-full bg-[#101217] hover:bg-[#1f242f] border border-white/15 rounded-2xl p-3 flex items-center justify-between transition-all"
                >
                  <div className="text-left">
                    <span className="text-xs font-black text-white block">1 Jeton Déblocage Direct</span>
                    <span className="text-[11px] text-gray-400">Idéal pour conclure un match immédiat</span>
                  </div>
                  <span className="bg-[#ff6b00] text-black font-black text-xs px-3 py-1.5 rounded-xl">
                    300 FCFA
                  </span>
                </button>

                <button
                  onClick={() => handleRechargeTokens(5, 1500)}
                  className="w-full bg-gradient-to-r from-[#26180d] to-[#1a1d26] hover:border-[#ff6b00] border border-[#ff6b00]/50 rounded-2xl p-3 flex items-center justify-between transition-all"
                >
                  <div className="text-left">
                    <span className="text-xs font-black text-amber-300 block">⚡ Pack 5 Jetons (Populaire)</span>
                    <span className="text-[11px] text-gray-300">Zéro attente sur vos 5 prochains trocs</span>
                  </div>
                  <span className="bg-[#ff6b00] text-black font-black text-xs px-3 py-1.5 rounded-xl">
                    1 500 FCFA
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-gray-400">
                <span>Paiement instantané :</span>
                <span className="font-bold text-red-400">Airtel Money</span>
                <span>•</span>
                <span className="font-bold text-blue-400">Moov Money</span>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODALE 3 : ACHAT CASH IMMÉDIAT (BOUTON 💵)
        ===================================================================== */}
        {activeModal === 'cash_buy' && selectedMarketItem && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end justify-center p-3">
            <div className="w-full bg-[#181b22] border border-white/15 rounded-3xl p-4 space-y-3.5">
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

              <div className="flex items-center gap-3 bg-[#101217] p-2.5 rounded-2xl border border-white/10">
                <img
                  src={selectedMarketItem.image}
                  alt={selectedMarketItem.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-sm font-black text-white">{selectedMarketItem.title}</h4>
                  <p className="text-xs text-gray-400">
                    Vendeur : {selectedMarketItem.owner} ({selectedMarketItem.quartier})
                  </p>
                  <p className="text-sm font-black text-emerald-400 mt-1">
                    Prix Cash : {selectedMarketItem.cashPrice.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-300">
                Pas envie de troquer votre <strong className="text-white">{activeWeapon.title}</strong> ? Achetez cet article directement en cash (Commission plateforme 5% incluse).
              </p>

              <button
                onClick={() => {
                  setActiveModal('none');
                  triggerToast(`💵 Offre d'achat Cash (${selectedMarketItem.cashPrice.toLocaleString('fr-FR')} FCFA) transmise à ${selectedMarketItem.owner} !`, 'green');
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Banknote className="w-4 h-4" />
                <span>ACHETER CASH ({selectedMarketItem.cashPrice.toLocaleString('fr-FR')} FCFA)</span>
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            MODALE 4 : TICKET D'ÉCHANGE OFFICIEL & CODE PIN DE REMISE
        ===================================================================== */}
        {activeModal === 'ticket_view' && selectedTicketMatch && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full bg-[#151821] border-2 border-emerald-500 rounded-3xl p-4 space-y-3 shadow-2xl">
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

              <div className="grid grid-cols-2 gap-2 bg-[#0d0f14] p-2.5 rounded-2xl border border-white/10">
                <div className="text-center">
                  <img
                    src={selectedTicketMatch.theirItem.image}
                    alt=""
                    className="w-20 h-20 mx-auto rounded-xl object-cover mb-1 border border-white/10"
                  />
                  <span className="text-[10px] font-bold text-gray-400 block">OBJET DE {selectedTicketMatch.partnerName.toUpperCase()}</span>
                  <p className="text-xs font-extrabold text-white truncate">{selectedTicketMatch.theirItem.title}</p>
                </div>

                <div className="text-center">
                  <img
                    src={selectedTicketMatch.myItem.image}
                    alt=""
                    className="w-20 h-20 mx-auto rounded-xl object-cover mb-1 border border-white/10"
                  />
                  <span className="text-[10px] font-bold text-gray-400 block">VOTRE OBJET ENGAGÉ</span>
                  <p className="text-xs font-extrabold text-white truncate">{selectedTicketMatch.myItem.title}</p>
                </div>
              </div>

              <div className="bg-[#0d0f14] p-3 rounded-2xl border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Soulte verrouillée :</span>
                  <span className="font-black text-[#ff7b1c]">
                    {selectedTicketMatch.soulte === 0
                      ? '0 FCFA (Échange Net)'
                      : `${selectedTicketMatch.soulte.toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lieu Point Relais :</span>
                  <span className="font-bold text-white">{selectedTicketMatch.partnerQuartier}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/10">
                  <span className="text-gray-400">Code PIN de remise :</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-black text-sm px-2.5 py-0.5 rounded-lg tracking-widest">
                    {selectedTicketMatch.pinCode}
                  </span>
                </div>
              </div>

              <button
                onClick={() => openWhatsApp(selectedTicketMatch)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>ENVOYER CE TICKET SUR WHATSAPP</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}