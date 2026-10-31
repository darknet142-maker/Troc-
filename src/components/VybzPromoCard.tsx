import React from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { VYBZ_APP_INFO } from '../data/legalData';

interface VybzPromoCardProps {
  variant?: 'grid' | 'banner';
  onOpenMmediaHub?: () => void;
}

export const VybzPromoCard: React.FC<VybzPromoCardProps> = ({
  variant = 'grid',
  onOpenMmediaHub
}) => {
  if (variant === 'banner') {
    return (
      <div className="rounded-2xl p-3.5 border border-[#e11d48]/45 bg-gradient-to-r from-[#240a14] via-[#150d18] to-[#0d1016] shadow-lg space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={VYBZ_APP_INFO.logoUrl}
              alt="Logo VYBZ"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/15 shadow-md"
            />
            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#fb7185] block">
                MMEDIA UNIVERSE
              </span>
              <h4 className="text-xs font-black text-white">
                {VYBZ_APP_INFO.ctaLabel}
              </h4>
              <p className="text-[11px] text-gray-300 line-clamp-1">
                {VYBZ_APP_INFO.tagline}
              </p>
            </div>
          </div>

          <a
            href={VYBZ_APP_INFO.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#e11d48] hover:bg-[#f43f5e] text-white font-black text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1 shrink-0 transition-colors shadow"
          >
            <span>{VYBZ_APP_INFO.ctaLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.8]" />
          </a>
        </div>

        {onOpenMmediaHub && (
          <button
            type="button"
            onClick={onOpenMmediaHub}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-[11px] font-extrabold text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#fb7185] shrink-0" />
            <span>Voir toutes les applications Mmedia Universe</span>
          </button>
        )}
      </div>
    );
  }

  // Mode "grid" : Occupe toute une rangée seule (col-span-2) sur le Marché pour que tout se voie parfaitement
  return (
    <div className="col-span-2 uhd-card rounded-2xl p-3.5 border border-[#e11d48]/50 bg-gradient-to-br from-[#230914] via-[#140d18] to-[#0c0f15] flex flex-col gap-3 relative overflow-hidden group gpu-120fps hover:border-[#f43f5e] transition-colors shadow-xl">
      {/* En-tête pleine largeur sans aucune coupure */}
      <div className="flex items-center justify-between gap-2">
        <span className="bg-[#0b0d12]/95 px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-[#fb7185] border border-[#e11d48]/40 whitespace-nowrap">
          Groupe Mmedia Universe
        </span>
        {onOpenMmediaHub && (
          <button
            type="button"
            onClick={onOpenMmediaHub}
            className="px-2.5 py-1 rounded-lg bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 text-[11px] font-extrabold text-white flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-[#fb7185] shrink-0" />
            <span>Nos Applications</span>
          </button>
        )}
      </div>

      {/* Corps de la carte : Logo VYBZ 1:1 + Présentation lisible */}
      <div className="flex items-center gap-3.5">
        <a
          href={VYBZ_APP_INFO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-20 h-20 aspect-square rounded-2xl overflow-hidden bg-[#e11d48] border border-white/15 shrink-0 shadow-lg block"
        >
          <img
            src={VYBZ_APP_INFO.logoUrl}
            alt="Logo officiel VYBZ"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200 ease-out"
          />
        </a>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white tracking-tight">
              {VYBZ_APP_INFO.name}
            </h3>
            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md whitespace-nowrap">
              En ligne
            </span>
          </div>
          <p className="text-xs font-bold text-[#fb7185]">
            {VYBZ_APP_INFO.category}
          </p>
          <p className="text-xs text-gray-300 leading-snug">
            {VYBZ_APP_INFO.tagline}
          </p>
        </div>
      </div>

      {/* Barre d'actions pleine largeur : rien n'est tronqué */}
      <div className="flex items-center gap-2">
        <a
          href={VYBZ_APP_INFO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all duration-100 active:scale-[0.98] min-h-[42px] whitespace-nowrap shadow-lg"
        >
          <span>{VYBZ_APP_INFO.ctaLabel}</span>
          <ArrowUpRight className="w-4 h-4 shrink-0 stroke-[2.8]" />
        </a>

        {onOpenMmediaHub && (
          <button
            type="button"
            onClick={onOpenMmediaHub}
            className="uhd-surface hover:brightness-125 active:scale-[0.98] transition-all duration-100 px-3.5 py-2.5 rounded-xl border border-white/15 text-xs font-extrabold text-gray-100 min-h-[42px] flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-[#fb7185] shrink-0" />
            <span>Espace Mmedia</span>
          </button>
        )}
      </div>
    </div>
  );
};
