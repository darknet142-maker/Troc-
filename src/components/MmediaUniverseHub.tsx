import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Clock, Layers, X } from 'lucide-react';
import { MMEDIA_UPCOMING_APPS, VYBZ_APP_INFO } from '../data/legalData';
import { BooLogo } from './BooLogo';

export const MmediaUniverseHub: React.FC = () => {
  return (
    <div className="space-y-3.5">
      {/* En-tête Institutionnel de l'Espace Exclusif Mmedia Universe */}
      <div className="bg-gradient-to-br from-[#230b16] via-[#131622] to-[#0b0d12] border border-[#e11d48]/40 rounded-2xl p-3.5 space-y-1.5 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#fb7185] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#fb7185]" />
            <span>ÉCOSYSTÈME MMEDIA UNIVERSE</span>
          </span>
          <span className="bg-white/10 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
            Gabon 🇬🇦
          </span>
        </div>
        <h3 className="text-sm font-black text-white">
          Espace Officiel des Applications du Groupe
        </h3>
        <p className="text-[11px] text-gray-300 leading-relaxed">
          Retrouvez toutes les initiatives digitales signées{' '}
          <strong className="text-white">Mmedia Universe</strong> : nos applications déjà en ligne
          et les prochaines créations actuellement en développement.
        </p>
      </div>

      {/* SECTION 1 : EN VEDETTE — VYBZ */}
      <div className="rounded-2xl p-3.5 border border-[#e11d48]/55 bg-gradient-to-b from-[#250a15] via-[#150d18] to-[#0d1016] space-y-3 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={VYBZ_APP_INFO.logoUrl}
              alt="Logo officiel VYBZ"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-white/20 shadow-lg"
            />
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-black text-white tracking-tight">
                  {VYBZ_APP_INFO.name}
                </h4>
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-black px-1.5 py-0.5 rounded uppercase whitespace-nowrap">
                  En ligne
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#fb7185] block truncate">
                {VYBZ_APP_INFO.category}
              </span>
              <p className="text-[11px] text-gray-300 leading-snug">
                {VYBZ_APP_INFO.tagline}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-200 leading-relaxed bg-black/35 p-2.5 rounded-xl border border-white/[0.07]">
          {VYBZ_APP_INFO.description}
        </p>

        <a
          href={VYBZ_APP_INFO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl bg-[#e11d48] hover:bg-[#f43f5e] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] transition-all"
        >
          <span>{VYBZ_APP_INFO.ctaLabel}</span>
          <ArrowUpRight className="w-4 h-4 stroke-[2.8]" />
        </a>
      </div>

      {/* APPLICATION ACTIVE : BOO */}
      <div className="uhd-card rounded-2xl p-3 border border-[#ff6b00]/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 px-2.5 rounded-xl bg-[#161922] border border-[#ff6b00]/40 flex items-center justify-center shrink-0">
            <BooLogo className="h-5 w-auto" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-black text-white block truncate">
              Troc & Achat Instantané
            </span>
            <p className="text-[11px] text-gray-400 truncate">
              Une initiative du Groupe <strong className="text-white font-bold">Mmedia Universe</strong>
            </p>
          </div>
        </div>
        <span className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          <span>Ouvert</span>
        </span>
      </div>

      {/* SECTION 2 : PROCHAINES APPLICATIONS DU GROUPE EN DÉVELOPPEMENT */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-gray-200">
            Prochaines Applications du Groupe
          </h4>
          <span className="text-[10px] font-extrabold text-gray-400">
            {MMEDIA_UPCOMING_APPS.length} en préparation
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {MMEDIA_UPCOMING_APPS.map((app) => (
            <div
              key={app.id}
              className="uhd-card rounded-2xl p-3 border border-white/[0.08] flex flex-col justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-white truncate">{app.name}</span>
                </div>
                <span className="text-[10px] font-bold text-[#ff7b1c] block truncate">
                  {app.category}
                </span>
                <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">
                  {app.summary}
                </p>
              </div>

              <div
                className={`px-2 py-1 rounded-lg border text-[10px] font-extrabold flex items-center justify-center gap-1 ${app.accentClass}`}
              >
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">{app.statusLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MmediaUniverseModalProps {
  onClose: () => void;
}

export const MmediaUniverseModal: React.FC<MmediaUniverseModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col"
    >
      <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#0b0d13] shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#fb7185]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            Applications Mmedia Universe
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold text-gray-200 hover:text-white flex items-center gap-1"
        >
          <X className="w-3.5 h-3.5" />
          <span>Fermer</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5">
        <MmediaUniverseHub />
      </div>
    </motion.div>
  );
};
