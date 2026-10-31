import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Trash2, X, Zap, ZoomIn } from 'lucide-react';
import { getConditionSpec } from '../data/initialData';
import { formatCompactFcfa, MarketItem, SentOfferInfo } from '../types/troc';

interface InspectModalProps {
  item: MarketItem;
  isOwnListing: boolean;
  alreadySent?: SentOfferInfo;
  fromMatchOnly: boolean;
  onClose: () => void;
  onShare: (item: MarketItem) => void;
  onProposeTrade: (item: MarketItem) => void;
  onCashBuy: (item: MarketItem) => void;
  onRemoveOwnItem: (item: MarketItem) => void;
}

const SPRING_120FPS = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 36,
  mass: 0.6
};

export const InspectModal: React.FC<InspectModalProps> = ({
  item,
  isOwnListing,
  alreadySent,
  fromMatchOnly,
  onClose,
  onShare,
  onProposeTrade,
  onCashBuy,
  onRemoveOwnItem
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const cond = getConditionSpec(item.conditionGrade);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (zoom <= 1 || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={SPRING_120FPS}
      className="absolute inset-0 z-50 bg-[#050609]/96 backdrop-blur-2xl flex flex-col justify-between p-4 overflow-y-auto gpu-120fps"
    >
      {/* Barre supérieure : Titre + Bouton Partager + Fermer */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-[#ff7b1c] font-mono-tabular">
              🏷️ {formatCompactFcfa(item.cashPrice, item.tier)}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-xs font-bold text-gray-300">{item.city}</span>
          </div>
          <h3 className="text-sm font-black text-white truncate mt-0.5">{item.title}</h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onShare(item)}
            title="Partager la publication sur WhatsApp et les réseaux"
            className="uhd-surface px-2.5 py-2 rounded-xl border border-white/15 text-gray-100 hover:text-white active:scale-95 flex items-center gap-1 text-xs font-bold"
          >
            <Share2 className="w-4 h-4 text-[#ff6b00]" />
            <span>Partager</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="uhd-surface p-2 rounded-xl border border-white/15 text-gray-300 hover:text-white active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone Centrale : Image 1:1 Carrée Zoomable */}
      <div className="my-auto space-y-2.5 py-2">
        <div
          onMouseMove={handlePointerMove}
          onTouchMove={handleTouchMove}
          onClick={() => setZoom((z) => (z === 1 ? 2 : z === 2 ? 3 : 1))}
          className="relative w-full aspect-square max-h-[300px] mx-auto rounded-2xl overflow-hidden bg-[#0e1015] border border-white/15 shadow-2xl cursor-zoom-in select-none"
        >
          <img
            src={item.image}
            alt={item.title}
            referrerPolicy="no-referrer"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: `${origin.x}% ${origin.y}%`
            }}
            className="w-full h-full object-cover transition-transform duration-150 ease-out"
          />
        </div>

        {/* Contrôles de Zoom UHD */}
        <div className="flex items-center justify-between bg-[#11141c] p-2 rounded-xl border border-white/[0.08]">
          <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5 pl-1">
            <ZoomIn className="w-4 h-4 text-[#ff6b00]" /> Zoom tactile :
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoom(z)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  zoom === z
                    ? 'uhd-orange-btn text-black'
                    : 'bg-[#1c202b] text-gray-300 border border-white/10'
                }`}
              >
                {z}x
              </button>
            ))}
          </div>
        </div>

        {/* ÉTAT DÉTAILLÉ (SANS RÉPÉTER LE NOM DE LA COULEUR) */}
        <div
          className={`p-3 rounded-2xl border ${cond.badgeBg} ${cond.badgeBorder} space-y-1.5`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cond.hexColor }}
              />
              <span className={`text-xs font-black uppercase ${cond.badgeText}`}>
                {cond.label}
              </span>
            </div>
            <span className={`text-xs font-black font-mono-tabular ${cond.badgeText}`}>
              {item.conditionPercent}%
            </span>
          </div>

          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${cond.barColor} rounded-full transition-all`}
              style={{ width: `${item.conditionPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-gray-200 leading-snug">{cond.realityDescription}</p>
        </div>

        {/* Métadonnées Vendeur & Prix */}
        <div className="flex items-center justify-between text-xs bg-[#11141c] px-3 py-2 rounded-xl border border-white/[0.08]">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold">
              {isOwnListing ? 'Mon annonce' : 'Vendeur & Ville'}
            </span>
            <span className="font-extrabold text-white">
              {item.owner} • {item.city} ({item.quartier})
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">
              Prix / Valeur
            </span>
            <span className="font-mono-tabular font-black text-emerald-400">
              {item.cashPrice.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Actions en bas de l'Inspecteur : Libellés courts et blocage sur sa propre annonce */}
      {fromMatchOnly ? (
        <button
          type="button"
          onClick={onClose}
          className="w-full uhd-orange-btn text-black font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform shrink-0"
        >
          <span>← RETOUR AU MATCH</span>
        </button>
      ) : isOwnListing ? (
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08] shrink-0">
          <span className="flex-1 py-3.5 px-3 rounded-xl bg-white/[0.06] border border-white/15 text-xs font-black text-gray-200 text-center">
            Mon annonce publiée
          </span>
          <button
            type="button"
            onClick={() => onRemoveOwnItem(item)}
            className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 px-4 py-3.5 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Retirer</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08] shrink-0">
          <button
            type="button"
            onClick={() => onProposeTrade(item)}
            className={`flex-1 font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform ${
              alreadySent ? 'uhd-emerald-btn text-black' : 'uhd-orange-btn text-black'
            }`}
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>{alreadySent ? 'ENVOYÉE ✓' : 'TROQUER'}</span>
          </button>
          <button
            type="button"
            onClick={() => onCashBuy(item)}
            className="uhd-surface px-4 py-3.5 rounded-xl border border-white/15 text-xs font-black text-emerald-400 active:scale-95"
          >
            💵 Cash
          </button>
        </div>
      )}
    </motion.div>
  );
};
