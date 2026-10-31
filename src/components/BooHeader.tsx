import React from 'react';
import { Bell } from 'lucide-react';
import { BooLogo } from './BooLogo';
import { MainTab } from '../types/troc';

interface BooHeaderProps {
  tokens: number;
  incomingPendingCount: number;
  activeMatchesCount: number;
  onSelectTab: (tab: MainTab) => void;
  onTriggerIncomingAlert: () => void;
}

export const BooHeader: React.FC<BooHeaderProps> = ({
  tokens,
  incomingPendingCount,
  activeMatchesCount,
  onSelectTab,
  onTriggerIncomingAlert
}) => {
  return (
    <header className="px-3.5 pt-3.5 pb-2.5 flex items-center justify-between bg-[#090b0f]/95 backdrop-blur-xl sticky top-0 z-30 border-b border-white/[0.08] shrink-0">
      {/* Logo officiel "Boo" en vecteur Ultra-HD */}
      <button
        type="button"
        onClick={() => onSelectTab('market')}
        title="Boo — Accueil"
        className="flex items-center gap-2 text-left group min-h-[38px] pr-1 active:scale-95 transition-transform duration-100"
      >
        <BooLogo className="h-8 w-auto drop-shadow-[0_2px_10px_rgba(255,140,0,0.28)]" />
      </button>

      <div className="flex items-center gap-2 shrink-0">
        {/* Compteur de Jetons UHD -> Ouvre la Boutique */}
        <button
          type="button"
          onClick={() => onSelectTab('shop')}
          className="uhd-surface hover:brightness-110 active:scale-95 transition-all duration-100 px-3 py-1.5 rounded-full border border-purple-500/35 flex items-center gap-1.5 min-h-[36px]"
        >
          <span className="w-4 h-4 rounded-full bg-gradient-to-b from-purple-400 via-purple-500 to-purple-700 text-white font-black text-[10px] flex items-center justify-center shadow-sm">
            {tokens}
          </span>
          <span className="text-xs font-extrabold tracking-wide text-purple-200 whitespace-nowrap">
            {tokens} JETON{tokens > 1 ? 'S' : ''}
          </span>
        </button>

        {/* Alerte d'offre (🔔) */}
        <button
          type="button"
          onClick={() => {
            if (incomingPendingCount > 0) {
              onTriggerIncomingAlert();
            } else {
              onSelectTab('matches');
            }
          }}
          title="Offres reçues et matchs"
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
  );
};
