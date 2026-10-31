import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock, Rocket, Trash2, Zap, ZoomIn } from 'lucide-react';
import { getConditionSpec } from '../data/initialData';
import { formatCompactFcfa, MarketItem, SentOfferInfo } from '../types/troc';

interface MarketCardProps {
  item: MarketItem;
  isOwnListing: boolean;
  alreadySent?: SentOfferInfo;
  boostCredits: number;
  onInspect: (item: MarketItem) => void;
  onProposeTrade: (item: MarketItem) => void;
  onCashBuy: (item: MarketItem) => void;
  onBoostCoupeFile: (itemId: string, e: React.MouseEvent) => void;
  onRemoveOwnItem: (item: MarketItem) => void;
}

const SPRING_120FPS = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 36,
  mass: 0.6
};

export const MarketCard: React.FC<MarketCardProps> = ({
  item,
  isOwnListing,
  alreadySent,
  boostCredits,
  onInspect,
  onProposeTrade,
  onCashBuy,
  onBoostCoupeFile,
  onRemoveOwnItem
}) => {
  const isReserved = item.status === 'RESERVED_12H';
  const condSpec = getConditionSpec(item.conditionGrade);
  const displayPriceLabel = formatCompactFcfa(item.cashPrice, item.tier);

  return (
    <motion.div
      layout
      transition={SPRING_120FPS}
      className="uhd-card rounded-2xl p-2.5 border border-white/[0.09] flex flex-col justify-between relative overflow-hidden group gpu-120fps"
    >
      {/* En-tête de la carte : Prix pur en FCFA à gauche + Ville à droite */}
      <div className="flex items-center justify-between gap-1 mb-1.5 z-10">
        <span className="bg-[#0b0d12]/95 px-2 py-0.5 rounded-lg text-[11px] font-extrabold text-[#ff7b1c] border border-[#ff6b00]/30 whitespace-nowrap font-mono-tabular">
          {displayPriceLabel}
        </span>
        <span className="text-[11px] font-bold text-gray-300 truncate max-w-[85px]">
          {item.city}
        </span>
      </div>

      {/* Photo carrée 1:1 cliquable pour ouvrir l'Inspecteur UHD */}
      <div
        onClick={() => onInspect(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onInspect(item);
        }}
        title="Cliquer pour zoomer et inspecter le produit"
        className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#0e1015] mb-1.5 cursor-zoom-in border border-white/[0.05]"
      >
        <img
          src={item.image}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200 ease-out"
        />

        {/* Pastille d'état épurée : JUSTE LA PASTILLE COLORÉE + LE POURCENTAGE */}
        {!alreadySent && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center">
            <span
              className={`bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-full border ${condSpec.badgeBorder} text-white text-[11px] font-black flex items-center gap-1.5 shadow-md`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: condSpec.hexColor }}
              />
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
            <Clock className="w-6 h-6 text-[#ff7b1c] mb-1" />
            <span className="text-[11px] font-black text-[#ff7b1c] uppercase">Réservé 12h</span>
          </div>
        )}

        {/* Feedback court : Envoyée ✓ + Option Coupe-File (Violet Royal #A855F7 exclusif aux Jetons/Boosts) */}
        {alreadySent && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center mb-1 shadow-lg">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-black text-emerald-200 uppercase tracking-tight">
              Envoyée ✓
            </span>
            <span className="text-[10px] font-semibold text-emerald-300/90 line-clamp-1 mt-0.5">
              {alreadySent.weapon.title}
              {alreadySent.soulte > 0 ? ` +${alreadySent.soulte / 1000}k` : ''}
            </span>

            {!alreadySent.isCoupeFile ? (
              <button
                type="button"
                onClick={(e) => onBoostCoupeFile(item.id, e)}
                className="mt-1.5 bg-purple-500 hover:bg-purple-400 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow active:scale-95 transition-transform whitespace-nowrap"
              >
                <Rocket className="w-3 h-3" />
                <span>
                  {boostCredits > 0 ? `Boost (${boostCredits})` : 'Coupe-File 500F'}
                </span>
              </button>
            ) : (
              <span className="mt-1.5 bg-purple-500/25 border border-purple-400/50 text-purple-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                🚀 Coupe-File
              </span>
            )}
          </div>
        )}
      </div>

      {/* Titre de l'objet cliquable pour inspecter */}
      <button
        type="button"
        onClick={() => onInspect(item)}
        className="text-[13px] font-extrabold text-center text-white hover:text-[#ff7b1c] truncate mb-2 px-0.5 transition-colors w-full"
      >
        {item.title}
      </button>

      {/* Si c'est l'annonce de l'utilisateur : uniquement le bouton Retirer en pleine largeur */}
      {isOwnListing ? (
        <button
          type="button"
          onClick={() => onRemoveOwnItem(item)}
          title="Retirer mon annonce"
          className="w-full bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/35 px-3 py-2.5 rounded-xl text-xs font-black min-h-[40px] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5 shrink-0" />
          <span>Retirer</span>
        </button>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onProposeTrade(item)}
            className={`flex-1 py-2.5 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-transform duration-100 active:scale-[0.96] min-h-[40px] whitespace-nowrap ${
              alreadySent ? 'uhd-emerald-btn text-black' : 'uhd-orange-btn text-black'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0 fill-black" />
            <span>{alreadySent ? 'Envoyée ✓' : 'TROQUER'}</span>
          </button>

          <button
            type="button"
            onClick={() => onCashBuy(item)}
            title={`Achat Cash (${item.cashPrice.toLocaleString('fr-FR')} FCFA)`}
            className="uhd-surface hover:brightness-125 active:scale-[0.95] transition-all duration-100 px-2.5 py-2 rounded-xl border border-white/[0.12] text-sm min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
          >
            💵
          </button>
        </div>
      )}
    </motion.div>
  );
};
