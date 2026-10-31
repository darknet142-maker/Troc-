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
      <div className="rounded-2xl p-3 border border-[#e11d48]/45 bg-gradient-to-r from-[#240a14] via-[#150d18] to-[#0d1016] shadow-lg space-y-2.5">
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
                INITIATIVE MMEDIA UNIVERSE
              </span>
              <h4 className="text-xs font-black text-white truncate">
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
            className="bg-[#e11d48] hover:bg-[#f43f5e] text-white font-black text-[11px] px-3 py-2 rounded-xl flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>{VYBZ_APP_INFO.ctaLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.8]" />
          </a>
        </div>

        {onOpenMmediaHub && (
          <button
            type="button"
            onClick={onOpenMmediaHub}
            className="w-full py-1.5 px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-[11px] font-extrabold text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#fb7185]" />
            <span>Voir l’espace exclusif des applications Mmedia Universe</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="uhd-card rounded-2xl p-2.5 border border-[#e11d48]/45 bg-gradient-to-b from-[#1f0a13] to-[#0d1016] flex flex-col justify-between relative overflow-hidden group gpu-120fps hover:border-[#f43f5e] transition-colors">
      {/* En-tête aligné sur le rythme des cartes du Marché */}
      <div className="flex items-center justify-between gap-1 mb-1.5 z-10">
        <span className="bg-[#0b0d12]/95 px-2 py-0.5 rounded-lg text-[10px] font-extrabold text-[#fb7185] border border-[#e11d48]/40 whitespace-nowrap">
          Mmedia Universe
        </span>
        {onOpenMmediaHub ? (
          <button
            type="button"
            onClick={onOpenMmediaHub}
            className="text-[10px] font-extrabold text-gray-200 hover:text-white underline truncate"
          >
            Nos Apps
          </button>
        ) : (
          <span className="text-[10px] font-bold text-gray-300 truncate">VYBZ</span>
        )}
      </div>

      {/* Visuel Carré 1:1 Officiel VYBZ cliquable */}
      <a
        href={VYBZ_APP_INFO.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#e11d48] mb-1.5 border border-white/10 block"
      >
        <img
          src={VYBZ_APP_INFO.logoUrl}
          alt="VYBZ — Mmedia Universe"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-200 ease-out"
        />
      </a>

      {/* Titre concis : "Découvrez VYBZ" */}
      <button
        type="button"
        onClick={onOpenMmediaHub}
        className="text-[13px] font-extrabold text-center text-white hover:text-[#fb7185] truncate mb-2 px-0.5 transition-colors w-full"
      >
        {VYBZ_APP_INFO.ctaLabel}
      </button>

      {/* Bouton d'action directe "Découvrez VYBZ" + bouton Espace Apps */}
      <div className="flex items-center gap-1.5">
        <a
          href={VYBZ_APP_INFO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-2 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] text-white font-black text-xs flex items-center justify-center gap-1 transition-all duration-100 active:scale-[0.96] min-h-[40px] whitespace-nowrap shadow"
        >
          <span>{VYBZ_APP_INFO.ctaLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0 stroke-[2.8]" />
        </a>

        {onOpenMmediaHub && (
          <button
            type="button"
            onClick={onOpenMmediaHub}
            title="Espace Applications Mmedia Universe"
            className="uhd-surface hover:brightness-125 active:scale-[0.95] transition-all duration-100 px-2.5 py-2 rounded-xl border border-white/[0.15] text-xs font-black text-[#fb7185] min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
