import React from 'react';
import { Bell, Flame } from 'lucide-react';
import { BooLogo } from './BooLogo';
import { MainTab } from '../types/troc';

interface BooHeaderProps {
  tokens: number;
  streakDay: number;
  streakClaimedToday: boolean;
  incomingPendingCount: number;
  activeMatchesCount: number;
  onSelectTab: (tab: MainTab) => void;
  onOpenDailyStreak: () => void;
  onTriggerIncomingAlert: () => void;
}

export const BooHeader: React.FC<BooHeaderProps> = ({
  tokens,
  streakDay,
  streakClaimedToday,
  incomingPendingCount,
  activeMatchesCount,
  onSelectTab,
  onOpenDailyStreak,
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

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Badge Parcours Assiduité 7 Jours (Jetons Gratuits) */}
        <button
          type="button"
          onClick={onOpenDailyStreak}
          title="Parcours Récompense Quotidienne (Jetons gratuits)"
          className={`uhd-surface hover:brightness-110 active:scale-95 transition-all duration-100 px-2.5 py-1.5 rounded-full border flex items-center gap-1 min-h-[36px] relative ${
            !streakClaimedToday
              ? 'border-[#ff6b00]/80 bg-[#ff6b00]/15 shadow-[0_0_12px_rgba(255,107,0,0.28)]'
              : 'border-emerald-500/35 bg-emerald-500/10'
          }`}
        >
          <Flame
            className={`w-3.5 h-3.5 shrink-0 ${
              !streakClaimedToday
                ? 'text-[#ff6b00] fill-[#ff6b00]'
                : 'text-emerald-400 fill-emerald-400'
            }`}
          />
          <span className="text-[11px] font-black text-white font-mono-tabular">
            J{streakDay}/7
          </span>
          {!streakClaimedToday && (
            <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-ping absolute -top-0.5 -right-0.5" />
          )}
        </button>

        {/* Compteur de Jetons UHD -> Ouvre la Boutique */}
        <button
          type="button"
          onClick={() => onSelectTab('shop')}
          className="uhd-surface hover:brightness-110 active:scale-95 transition-all duration-100 px-2.5 py-1.5 rounded-full border border-purple-500/35 flex items-center gap-1.5 min-h-[36px]"
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
