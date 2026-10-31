import React from 'react';
import {
  ArrowLeftRight,
  Check,
  Clock,
  Lock,
  MessageCircle,
  QrCode,
  ShieldCheck,
  UserX,
  Zap,
  ZoomIn
} from 'lucide-react';
import { getConditionSpec } from '../data/initialData';
import {
  ActiveModal,
  ConditionGradeId,
  ItemTier,
  MatchRecord,
  UserProfile
} from '../types/troc';
import { BooFooterSignature } from './BooFooterSignature';

interface MatchesTabProps {
  matches: MatchRecord[];
  userProfile: UserProfile;
  formatCountdown: (expiresAt: number) => string;
  getWhatsAppTicketUrl: (match: MatchRecord) => string;
  onBackToMarket: () => void;
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
  onIncomingDecision: (
    matchId: string,
    decision: 'ACCEPT' | 'REQUIRE_CASH' | 'REJECT',
    requiredCash?: number
  ) => void;
  onOpenFullScreenIncoming: (match: MatchRecord) => void;
  onUnlockMatch: (match: MatchRecord) => void;
  onSimulatePartnerDefault30Min: (match: MatchRecord) => void;
  onOpenTicketView: (match: MatchRecord) => void;
  onGhostCancel: (match: MatchRecord) => void;
}

export const MatchesTab: React.FC<MatchesTabProps> = ({
  matches,
  userProfile,
  formatCountdown,
  getWhatsAppTicketUrl,
  onBackToMarket,
  onInspectMatchItem,
  onIncomingDecision,
  onOpenFullScreenIncoming,
  onUnlockMatch,
  onSimulatePartnerDefault30Min,
  onOpenTicketView,
  onGhostCancel
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-8 space-y-3 gpu-120fps">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 uppercase">
            <Zap className="w-4 h-4 text-[#ff6b00] fill-[#ff6b00]" />
            Mes Matchs ({matches.length})
          </h2>
          <p className="text-[11px] text-gray-400">
            Cliquez sur un produit pour zoomer • 1 Jeton pour conclure
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToMarket}
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
                      ? 'bg-purple-500 text-white'
                      : match.status === 'CANCELLED_GHOST'
                      ? 'bg-red-500/30 text-red-200'
                      : 'bg-[#ff6b00]/20 text-[#ff7b1c] border border-[#ff6b00]/40'
                  }`}
                >
                  {match.status === 'PENDING_DECISION'
                    ? '🔔 Offre reçue'
                    : match.status === 'UNLOCKED'
                    ? '🔓 Débloqué'
                    : match.status === 'EXPIRED_REFUNDED'
                    ? '🪙 +1 Jeton rendu'
                    : match.status === 'CANCELLED_GHOST'
                    ? '🚫 Annulé'
                    : '⏳ Accord prêt'}
                </span>
                {match.isCoupeFile && (
                  <span className="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black px-1.5 py-0.5 rounded whitespace-nowrap">
                    🚀 Coupe-File
                  </span>
                )}
                <span className="text-xs font-bold text-gray-200 truncate">
                  {match.partnerName}
                </span>
              </div>

              {match.status === 'ACCEPTED_LOCKED' ? (
                <span className="text-[11px] font-mono-tabular font-extrabold text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30 shrink-0">
                  <Clock className="w-3 h-3" /> {countdownText}
                </span>
              ) : (
                <span className="text-[11px] text-gray-400 shrink-0">{match.timestamp}</span>
              )}
            </div>

            {/* Comparaison Côte à Côte 1:1 — CLIQUABLE POUR ZOOMER */}
            <div className="grid grid-cols-11 gap-1.5 items-center bg-[#0b0d12] p-2 rounded-xl border border-white/[0.06] mb-2">
              <button
                type="button"
                onClick={() =>
                  onInspectMatchItem(
                    match.theirItem,
                    match.partnerName,
                    match.partnerQuartier,
                    'none'
                  )
                }
                title="Cliquer pour inspecter et zoomer sur ce produit"
                className="col-span-5 flex items-center gap-2 min-w-0 text-left group cursor-zoom-in"
              >
                <div className="relative w-12 h-12 shrink-0">
                  <img
                    src={match.theirItem.image}
                    alt={match.theirItem.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 aspect-square rounded-lg object-cover border border-white/15 group-hover:border-[#ff6b00] transition-colors"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-black/90 text-[#ff6b00] p-0.5 rounded border border-white/15">
                    <ZoomIn className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-[#ff7b1c] font-extrabold block truncate">
                    SON OBJET ({match.theirItem.tier})
                  </span>
                  <p className="text-xs font-bold text-white group-hover:text-[#ff7b1c] truncate">
                    {match.theirItem.title}
                  </p>
                  <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: theirCond.hexColor }}
                    />
                    {match.theirItem.conditionPercent}%
                  </span>
                </div>
              </button>

              <div className="col-span-1 flex justify-center">
                <div className="w-6 h-6 rounded-full bg-[#ff6b00]/20 border border-[#ff6b00] flex items-center justify-center">
                  <ArrowLeftRight className="w-3 h-3 text-[#ff6b00]" />
                </div>
              </div>

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
                    'none'
                  )
                }
                className="col-span-5 flex items-center gap-2 justify-end text-right min-w-0 group cursor-zoom-in"
              >
                <div className="min-w-0">
                  <span className="text-[10px] text-emerald-400 font-extrabold block truncate">
                    MON OBJET ({match.myItem.tier})
                  </span>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                    {match.myItem.title}
                  </p>
                  <span className="text-[10px] font-bold text-gray-300 flex items-center justify-end gap-1">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: myCond.hexColor }}
                    />
                    {match.myItem.conditionPercent}%
                  </span>
                </div>
                <img
                  src={match.myItem.image}
                  alt={match.myItem.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 aspect-square rounded-lg object-cover shrink-0 border border-white/15"
                />
              </button>
            </div>

            {/* Bandeau Rajout Cash */}
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-xs mb-2.5">
              <span className="text-gray-300 font-medium">Rajout cash :</span>
              {match.soulte === 0 ? (
                <span className="font-bold text-gray-200">Aucun rajout (0 FCFA)</span>
              ) : match.soulteDirection === 'TO_ME' ? (
                <span className="font-black text-emerald-400">
                  +{match.soulte.toLocaleString('fr-FR')} FCFA pour vous
                </span>
              ) : (
                <span className="font-black text-[#ff7b1c]">
                  +{match.soulte.toLocaleString('fr-FR')} FCFA par vous
                </span>
              )}
            </div>

            {/* Actions selon statut */}
            {match.status === 'PENDING_DECISION' && (
              <div className="space-y-1.5">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onIncomingDecision(match.id, 'ACCEPT')}
                    className="flex-1 uhd-emerald-btn text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-transform"
                  >
                    <Check className="w-4 h-4 stroke-[3]" /> ACCEPTER L'OFFRE
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenFullScreenIncoming(match)}
                    className="bg-[#ff6b00]/20 hover:bg-[#ff6b00]/30 text-[#ff7b1c] font-extrabold text-xs px-3 py-2.5 rounded-xl border border-[#ff6b00]/40"
                  >
                    Plein écran
                  </button>
                  <button
                    type="button"
                    onClick={() => onIncomingDecision(match.id, 'REJECT')}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs px-3 py-2.5 rounded-xl border border-red-500/30 active:scale-95"
                  >
                    Refuser
                  </button>
                </div>
                <div className="flex items-center justify-between gap-1 pt-1">
                  <span className="text-[11px] text-gray-400">Demander un rajout :</span>
                  <div className="flex gap-1">
                    {[2000, 5000, 10000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => onIncomingDecision(match.id, 'REQUIRE_CASH', amt)}
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
                    ✓ {match.partnerName} est prêt
                  </span>
                  <span className="text-purple-300 font-bold">1 Jeton requis pour conclure</span>
                </div>

                <button
                  type="button"
                  onClick={() => onUnlockMatch(match)}
                  className="w-full uhd-orange-btn text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>DÉBLOQUER LE MATCH (1 JETON)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSimulatePartnerDefault30Min(match)}
                  className="w-full bg-[#1f2430] hover:bg-[#282e3d] text-gray-300 text-[11px] font-bold py-1.5 px-2.5 rounded-lg border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Simuler non-réponse 30 min (+1 Jeton remboursé)</span>
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
                    <span>WHATSAPP</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onOpenTicketView(match)}
                    className="uhd-surface text-white font-bold text-xs px-3 py-2.5 rounded-xl border border-white/15 flex items-center gap-1 active:scale-95"
                  >
                    <QrCode className="w-4 h-4 text-[#ff6b00]" />
                    <span>Ticket PIN ({match.pinCode})</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[11px] text-gray-400">
                    {match.pinVerified
                      ? '✅ Échange validé par Code PIN'
                      : '⏳ Réservé 12h • Sans réponse ?'}
                  </span>
                  {!match.pinVerified && (
                    <button
                      type="button"
                      onClick={() => onGhostCancel(match)}
                      className="text-[11px] font-extrabold text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <UserX className="w-3 h-3" /> Annuler
                    </button>
                  )}
                </div>
              </div>
            )}

            {match.status === 'EXPIRED_REFUNDED' && (
              <div className="text-[11px] text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-lg px-2.5 py-1.5 font-semibold">
                Garantie activée : +1 Jeton recrédité sur votre compte.
              </div>
            )}
          </div>
        );
      })}

      <BooFooterSignature />
    </div>
  );
};
