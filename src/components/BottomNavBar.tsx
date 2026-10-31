import React from 'react';
import { Camera, ShoppingBag, User, Zap } from 'lucide-react';
import { MainTab } from '../types/troc';

interface BottomNavBarProps {
  activeTab: MainTab;
  activeMatchesCount: number;
  onSelectTab: (tab: MainTab) => void;
  onOpenPublish: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  activeMatchesCount,
  onSelectTab,
  onOpenPublish
}) => {
  return (
    <nav className="h-[60px] bg-[#06070a]/98 backdrop-blur-xl border-t border-white/[0.09] px-3 flex items-center justify-between relative z-30 mt-auto shrink-0">
      {/* 1. Marché */}
      <button
        type="button"
        onClick={() => onSelectTab('market')}
        className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] active:scale-95 transition-colors ${
          activeTab === 'market' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="text-sm leading-none">🏠</span>
        <span className="text-[11px] font-extrabold mt-1">Marché</span>
      </button>

      {/* 2. Boutique */}
      <button
        type="button"
        onClick={() => onSelectTab('shop')}
        className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] active:scale-95 transition-colors ${
          activeTab === 'shop' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <ShoppingBag className="w-4 h-4" />
        <span className="text-[11px] font-extrabold mt-1">Boutique</span>
      </button>

      {/* Bouton Central Caméra Vectoriel Pur (Publication Express 3 clics) */}
      <div className="relative -top-3.5 px-1">
        <button
          type="button"
          onClick={onOpenPublish}
          aria-label="Publier gratuitement une photo 1:1"
          title="Publier gratuitement en 3 clics"
          className="w-14 h-14 rounded-full uhd-orange-btn text-black shadow-[0_0_28px_rgba(255,107,0,0.65)] border-[3.5px] border-[#090b0f] flex items-center justify-center active:scale-90 transition-transform duration-100"
        >
          <Camera className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* 3. Matchs */}
      <button
        type="button"
        onClick={() => onSelectTab('matches')}
        className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] active:scale-95 transition-colors relative ${
          activeTab === 'matches' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Zap className="w-4 h-4 fill-current" />
        <span className="text-[11px] font-extrabold mt-1">
          Matchs ({activeMatchesCount})
        </span>
      </button>

      {/* 4. Profil */}
      <button
        type="button"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] active:scale-95 transition-colors ${
          activeTab === 'profile' ? 'text-[#ff6b00]' : 'text-gray-400 hover:text-white'
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-[11px] font-extrabold mt-1">Profil</span>
      </button>
    </nav>
  );
};
