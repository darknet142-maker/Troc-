import React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Banknote,
  Check,
  Copy,
  MapPin,
  MessageCircle,
  Scale,
  Share2,
  ShieldCheck,
  X,
  ZoomIn
} from 'lucide-react';
import { GABON_CITIES, getConditionSpec } from '../data/initialData';
import {
  ActiveModal,
  CityFilter,
  ConditionGradeId,
  formatCompactFcfa,
  ItemTier,
  LegalSectionId,
  MarketItem,
  MatchRecord,
  UserProfile
} from '../types/troc';
import { BooLegalCenter } from './BooLegalCenter';
import { LegalConsentCheckbox } from './LegalConsentCheckbox';

const SPRING_120FPS = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 36,
  mass: 0.6
};

// ============================================================================
// 1. MODALE PARTAGER L'ANNONCE (WHATSAPP, X, TIKTOK, INSTAGRAM)
// ============================================================================
interface ShareModalProps {
  item: MarketItem;
  shareText: string;
  onBackToInspect: () => void;
  onNativeShare: (item: MarketItem) => void;
  onCopySuccess: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  item,
  shareText,
  onBackToInspect,
  onNativeShare,
  onCopySuccess
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 24 }}
    transition={SPRING_120FPS}
    className="absolute inset-0 z-50 bg-black/88 backdrop-blur-xl flex items-end justify-center p-3 gpu-120fps"
  >
    <div className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase text-[#ff6b00] block">
            PARTAGER SUR BOO
          </span>
          <h3 className="text-sm font-black text-white truncate">
            {item.title} ({item.city})
          </h3>
        </div>
        <button
          type="button"
          onClick={onBackToInspect}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 bg-[#0b0d12] p-2.5 rounded-2xl border border-white/10">
        <img
          src={item.image}
          alt={item.title}
          className="w-14 h-14 aspect-square rounded-xl object-cover shrink-0 border border-white/10"
        />
        <div className="min-w-0">
          <p className="text-xs font-black text-white truncate">{item.title}</p>
          <p className="text-[11px] text-[#ff7b1c] font-bold font-mono-tabular">
            {formatCompactFcfa(item.cashPrice, item.tier)} • {item.conditionPercent}%
          </p>
          <p className="text-[11px] text-gray-400">
            {item.city} ({item.quartier})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="uhd-emerald-btn text-black font-black text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-black" />
          <span>WhatsApp</span>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black font-black text-xs py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>Partager sur X</span>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(shareText);
            onCopySuccess();
          }}
          className="uhd-surface border border-white/15 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Copy className="w-3.5 h-3.5 text-[#ff6b00]" />
          <span>Copier le lien</span>
        </button>

        <button
          type="button"
          onClick={() => onNativeShare(item)}
          className="uhd-orange-btn text-black font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Autres réseaux</span>
        </button>
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// 2. MODALE ACHAT CASH IMMÉDIAT (AVEC CASE À COCHER CGU OBLIGATOIRE)
// ============================================================================
interface CashBuyModalProps {
  item: MarketItem;
  acceptedTerms: boolean;
  onChangeAcceptedTerms: (checked: boolean) => void;
  onOpenLegalSection: (section: LegalSectionId) => void;
  onNeedTermsToast: () => void;
  onConfirmCashBuy: (item: MarketItem) => void;
  onClose: () => void;
}

export const CashBuyModal: React.FC<CashBuyModalProps> = ({
  item,
  acceptedTerms,
  onChangeAcceptedTerms,
  onOpenLegalSection,
  onNeedTermsToast,
  onConfirmCashBuy,
  onClose
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 24 }}
    transition={SPRING_120FPS}
    className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end justify-center p-3 gpu-120fps"
  >
    <div className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="bg-emerald-500 text-black font-black text-xs px-2.5 py-0.5 rounded-md">
          💵 ACHAT CASH DIRECT
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 bg-[#0b0d12] p-2.5 rounded-2xl border border-white/10">
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 aspect-square rounded-xl object-cover shrink-0"
        />
        <div className="min-w-0">
          <h4 className="text-sm font-black text-white truncate">{item.title}</h4>
          <p className="text-xs text-gray-400">
            {item.owner} • {item.city} ({item.quartier})
          </p>
          <p className="text-sm font-black text-emerald-400 mt-1 font-mono-tabular">
            {item.cashPrice.toLocaleString('fr-FR')} FCFA
          </p>
        </div>
      </div>

      <LegalConsentCheckbox
        checked={acceptedTerms}
        onChange={onChangeAcceptedTerms}
        onOpenLegalSection={onOpenLegalSection}
        compact
      />

      <button
        type="button"
        onClick={() => {
          if (!acceptedTerms) {
            onNeedTermsToast();
            return;
          }
          onConfirmCashBuy(item);
        }}
        className={`w-full font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
          acceptedTerms
            ? 'uhd-emerald-btn text-black active:scale-95'
            : 'bg-[#222632] text-gray-400 border border-white/10'
        }`}
      >
        <Banknote className="w-4 h-4" />
        <span>ACHETER ({item.cashPrice.toLocaleString('fr-FR')} FCFA)</span>
      </button>
    </div>
  </motion.div>
);

// ============================================================================
// 3. MODALE PLEIN ÉCRAN D'UNE OFFRE REÇUE (AVEC ZOOM PRODUIT)
// ============================================================================
interface IncomingOfferModalProps {
  match: MatchRecord;
  userProfile: UserProfile;
  onClose: () => void;
  onInspectMatchItem: (
    itemData: {
      title: string;
      tier: ItemTier;
      image: string;
      conditionGrade: ConditionGradeId;
      conditionPercent: number;
    },
    ownerName: string,
    locationLabel: string,
    returnToModal: ActiveModal
  ) => void;
  onDecision: (
    matchId: string,
    decision: 'ACCEPT' | 'REQUIRE_CASH' | 'REJECT',
    requiredCash?: number
  ) => void;
}

export const IncomingOfferModal: React.FC<IncomingOfferModalProps> = ({
  match,
  userProfile,
  onClose,
  onInspectMatchItem,
  onDecision
}) => {
  const theirCond = getConditionSpec(match.theirItem.conditionGrade);
  const myCond = getConditionSpec(match.myItem.conditionGrade);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={SPRING_120FPS}
      className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 gpu-120fps"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase">
            🔔 OFFRE DE TROC
          </span>
          {match.isCoupeFile && (
            <span className="bg-amber-400 text-black text-xs font-black px-2 py-1 rounded-lg">
              🚀 PRIORITAIRE
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="my-auto space-y-4">
        <div className="text-center">
          <p className="text-xs font-bold text-[#ff7b1c] uppercase tracking-wider">
            {match.partnerName} • {match.partnerQuartier}
          </p>
          <h3 className="text-base font-black text-white mt-0.5">
            Cliquez sur un produit pour zoomer
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              onInspectMatchItem(
                match.theirItem,
                match.partnerName,
                match.partnerQuartier,
                'incoming_alert'
              )
            }
            className="uhd-card border-2 border-[#ff6b00] rounded-2xl p-3 text-center relative group cursor-zoom-in active:scale-[0.98] transition-transform"
          >
            <span className="text-[10px] font-black uppercase bg-[#ff6b00] text-black px-2 py-0.5 rounded-md inline-block mb-2">
              IL PROPOSE ({match.theirItem.tier})
            </span>
            <div className="relative w-24 h-24 mx-auto mb-2">
              <img
                src={match.theirItem.image}
                alt={match.theirItem.title}
                className="w-24 h-24 aspect-square rounded-xl object-cover bg-[#0e1015]"
              />
              <span className="absolute bottom-1 right-1 bg-black/85 text-white p-1 rounded-md border border-white/20">
                <ZoomIn className="w-3.5 h-3.5 text-[#ff6b00]" />
              </span>
            </div>
            <p className="text-xs font-extrabold text-white line-clamp-1">
              {match.theirItem.title}
            </p>
            <span className="text-[11px] font-black text-gray-200 flex items-center justify-center gap-1 mt-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theirCond.hexColor }}
              />
              {match.theirItem.conditionPercent}%
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onInspectMatchItem(
                {
                  title: match.myItem.title,
                  tier: match.myItem.tier,
                  image: match.myItem.image,
                  conditionGrade: match.myItem.conditionGrade,
                  conditionPercent: match.myItem.conditionPercent
                },
                userProfile.name,
                `${userProfile.city} • ${userProfile.quartier}`,
                'incoming_alert'
              )
            }
            className="uhd-card border border-white/15 rounded-2xl p-3 text-center relative group cursor-zoom-in active:scale-[0.98] transition-transform"
          >
            <span className="text-[10px] font-black uppercase bg-emerald-500 text-black px-2 py-0.5 rounded-md inline-block mb-2">
              VOTRE OBJET ({match.myItem.tier})
            </span>
            <div className="relative w-24 h-24 mx-auto mb-2">
              <img
                src={match.myItem.image}
                alt={match.myItem.title}
                className="w-24 h-24 aspect-square rounded-xl object-cover bg-[#0e1015]"
              />
              <span className="absolute bottom-1 right-1 bg-black/85 text-white p-1 rounded-md border border-white/20">
                <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </div>
            <p className="text-xs font-extrabold text-white line-clamp-1">
              {match.myItem.title}
            </p>
            <span className="text-[11px] font-black text-gray-200 flex items-center justify-center gap-1 mt-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: myCond.hexColor }}
              />
              {match.myItem.conditionPercent}%
            </span>
          </button>
        </div>

        <div className="uhd-card border border-white/10 rounded-2xl p-3 text-center">
          <span className="text-xs text-gray-400 block mb-0.5">Rajout cash proposé :</span>
          <span className="text-base font-black text-emerald-400">
            {match.soulte > 0
              ? `+ ${match.soulte.toLocaleString('fr-FR')} FCFA pour vous`
              : 'Aucun rajout (0 FCFA)'}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => onDecision(match.id, 'ACCEPT')}
          className="w-full uhd-emerald-btn text-black font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>ACCEPTER L'OFFRE</span>
        </button>

        <div className="uhd-card p-2.5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-bold text-gray-300 block text-center mb-2">
            Ou demander un rajout cash :
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[2000, 5000, 10000].map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => onDecision(match.id, 'REQUIRE_CASH', amt)}
                className="bg-[#252a36] hover:bg-[#ff6b00] hover:text-black text-white font-black text-xs py-2 rounded-xl border border-white/15 transition-colors"
              >
                +{amt / 1000}k FCFA
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDecision(match.id, 'REJECT')}
          className="w-full bg-red-500/15 hover:bg-red-500/25 text-red-300 font-bold text-xs py-2.5 rounded-xl border border-red-500/30"
        >
          Refuser
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 4. MODALE TICKET D'ÉCHANGE OFFICIEL BOO & CODE PIN
// ============================================================================
interface TicketModalProps {
  match: MatchRecord;
  userProfile: UserProfile;
  whatsAppTicketUrl: string;
  onClose: () => void;
  onInspectMatchItem: (
    itemData: {
      title: string;
      tier: ItemTier;
      image: string;
      conditionGrade: ConditionGradeId;
      conditionPercent: number;
    },
    ownerName: string,
    locationLabel: string,
    returnToModal: ActiveModal
  ) => void;
  onVerifyPinCode: (match: MatchRecord) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  match,
  userProfile,
  whatsAppTicketUrl,
  onClose,
  onInspectMatchItem,
  onVerifyPinCode
}) => {
  const theirCond = getConditionSpec(match.theirItem.conditionGrade);
  const myCond = getConditionSpec(match.myItem.conditionGrade);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={SPRING_120FPS}
      className="absolute inset-0 z-50 bg-black/92 backdrop-blur-2xl flex items-center justify-center p-3.5 gpu-120fps"
    >
      <div className="w-full bg-[#12151e] border-2 border-emerald-500 rounded-3xl p-4 space-y-3 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black tracking-wider uppercase text-emerald-400">
              TICKET D'ÉCHANGE OFFICIEL BOO
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-[#0b0d12] p-2.5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() =>
              onInspectMatchItem(
                match.theirItem,
                match.partnerName,
                match.partnerQuartier,
                'ticket_view'
              )
            }
            className="text-center group cursor-zoom-in"
          >
            <img
              src={match.theirItem.image}
              alt={match.theirItem.title}
              className="w-20 h-20 aspect-square mx-auto rounded-xl object-cover mb-1 border border-white/10 group-hover:border-[#ff6b00]"
            />
            <span className="text-[10px] font-bold text-gray-400 block truncate">
              {match.partnerName.toUpperCase()}
            </span>
            <p className="text-xs font-extrabold text-white truncate">
              {match.theirItem.title}
            </p>
            <span className="text-[10px] font-black text-gray-200 flex items-center justify-center gap-1 mt-0.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theirCond.hexColor }}
              />
              {match.theirItem.conditionPercent}%
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onInspectMatchItem(
                {
                  title: match.myItem.title,
                  tier: match.myItem.tier,
                  image: match.myItem.image,
                  conditionGrade: match.myItem.conditionGrade,
                  conditionPercent: match.myItem.conditionPercent
                },
                userProfile.name,
                `${userProfile.city} • ${userProfile.quartier}`,
                'ticket_view'
              )
            }
            className="text-center group cursor-zoom-in"
          >
            <img
              src={match.myItem.image}
              alt={match.myItem.title}
              className="w-20 h-20 aspect-square mx-auto rounded-xl object-cover mb-1 border border-white/10 group-hover:border-emerald-400"
            />
            <span className="text-[10px] font-bold text-gray-400 block">VOTRE OBJET</span>
            <p className="text-xs font-extrabold text-white truncate">{match.myItem.title}</p>
            <span className="text-[10px] font-black text-gray-200 flex items-center justify-center gap-1 mt-0.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: myCond.hexColor }}
              />
              {match.myItem.conditionPercent}%
            </span>
          </button>
        </div>

        <div className="bg-[#0b0d12] p-3 rounded-2xl border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Rajout cash :</span>
            <span className="font-black text-[#ff7b1c]">
              {match.soulte === 0
                ? 'Aucun rajout (0 FCFA)'
                : match.soulteDirection === 'FROM_ME'
                ? `+${match.soulte.toLocaleString('fr-FR')} FCFA (par vous)`
                : `+${match.soulte.toLocaleString('fr-FR')} FCFA (par ${match.partnerName})`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Ville & Quartier :</span>
            <span className="font-bold text-white">{match.partnerQuartier}</span>
          </div>
          <div className="flex justify-between items-center pt-1.5 border-t border-white/10">
            <span className="text-gray-400">Code PIN de remise :</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono-tabular font-black text-base px-3 py-0.5 rounded-lg tracking-widest">
              {match.pinCode}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onVerifyPinCode(match)}
          disabled={match.pinVerified}
          className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 border transition-all ${
            match.pinVerified
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'uhd-surface border-white/15 text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>
            {match.pinVerified
              ? 'Remise Validée ✓'
              : 'Valider le Code PIN à la remise'}
          </span>
        </button>

        <a
          href={whatsAppTicketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full uhd-emerald-btn text-black font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-black" />
          <span>ENVOYER SUR WHATSAPP</span>
        </a>
      </div>
    </motion.div>
  );
};

// ============================================================================
// 5. MODALE SÉLECTEUR DE VILLE (9 CAPITALES PROVINCIALES DU GABON)
// ============================================================================
interface CitySelectorModalProps {
  selectedCity: CityFilter;
  onSelectCity: (city: CityFilter) => void;
  onClose: () => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  selectedCity,
  onSelectCity,
  onClose
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 24 }}
    transition={SPRING_120FPS}
    className="absolute inset-0 z-50 bg-black/88 backdrop-blur-xl flex items-end justify-center p-3 gpu-120fps"
  >
    <div className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3 max-h-[88%] overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#ff6b00]" />
          <h3 className="text-sm font-black text-white uppercase">
            Choisir une ville au Gabon
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSelectCity('Toutes les villes')}
        className={`w-full py-2.5 px-3 rounded-xl font-black text-xs border flex items-center justify-between ${
          selectedCity === 'Toutes les villes'
            ? 'uhd-orange-btn text-black border-white'
            : 'bg-[#0b0d12] text-gray-200 border-white/10'
        }`}
      >
        <span>🇬🇦 Toutes les villes du Gabon</span>
        {selectedCity === 'Toutes les villes' && <Check className="w-4 h-4 stroke-[3]" />}
      </button>

      <div className="grid grid-cols-2 gap-2">
        {GABON_CITIES.map((city) => {
          const isSelected = selectedCity === city.name;
          return (
            <button
              type="button"
              key={city.name}
              onClick={() => onSelectCity(city.name)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'uhd-orange-btn text-black border-white'
                  : 'bg-[#0b0d12] text-gray-200 border-white/10 hover:bg-[#191d28]'
              }`}
            >
              <span className="text-xs font-black block">{city.name}</span>
              <span
                className={`text-[10px] ${
                  isSelected ? 'text-black/80 font-bold' : 'text-gray-400'
                }`}
              >
                {city.province}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// 6. MODALE CONSULTATION JURIDIQUE DIRECTE (CGU • CONFIDENTIALITÉ • À PROPOS)
// ============================================================================
interface LegalModalProps {
  initialSection: LegalSectionId;
  onAcceptAndClose: () => void;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  initialSection,
  onAcceptAndClose,
  onClose
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 24 }}
    transition={SPRING_120FPS}
    className="absolute inset-0 z-50 bg-black/94 backdrop-blur-2xl flex flex-col justify-between p-3.5 gpu-120fps"
  >
    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 shrink-0">
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-[#ff6b00]" />
        <span className="text-xs font-black uppercase text-white">
          CGU, Confidentialité & À Propos (Loi Gabonaise)
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 text-gray-400 hover:text-white rounded-xl bg-white/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    <div className="flex-1 overflow-y-auto py-3">
      <BooLegalCenter initialSection={initialSection} />
    </div>

    <div className="pt-2.5 border-t border-white/10 shrink-0">
      <button
        type="button"
        onClick={onAcceptAndClose}
        className="w-full uhd-emerald-btn text-black font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
      >
        <Check className="w-4 h-4 stroke-[3]" />
        <span>J'AI LU ET J'ACCEPTE LES CONDITIONS (LOI GABONAISE)</span>
      </button>
    </div>
  </motion.div>
);
