import React from 'react';
import { MapPin, Flame, Check, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import {
  CityFilter,
  ConditionGradeId,
  MarketCategoryFilter,
  ValueTier
} from '../types/troc';
import { getConditionSpec } from '../data/initialData';

interface MarketFilterBarProps {
  selectedCity: CityFilter;
  selectedTier: ValueTier;
  selectedCategory: MarketCategoryFilter;
  selectedCondition: ConditionGradeId | 'ALL';
  searchQuery: string;
  incomingPendingPartnerName?: string;
  onOpenCitySelector: () => void;
  onOpenFilterDrawer: () => void;
  onSelectTier: (tier: ValueTier) => void;
  onClearCategory: () => void;
  onClearCondition: () => void;
  onClearSearch: () => void;
  onTriggerIncomingAlert: () => void;
}

export const MarketFilterBar: React.FC<MarketFilterBarProps> = ({
  selectedCity,
  selectedTier,
  selectedCategory,
  selectedCondition,
  searchQuery,
  incomingPendingPartnerName,
  onOpenCitySelector,
  onOpenFilterDrawer,
  onSelectTier,
  onClearCategory,
  onClearCondition,
  onClearSearch,
  onTriggerIncomingAlert
}) => {
  const activeAdvancedCount =
    (selectedCategory !== 'Toutes' ? 1 : 0) +
    (selectedCondition !== 'ALL' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <>
      <div className="px-3 py-2.5 flex items-center gap-1.5 overflow-x-auto bg-[#090b0f] border-b border-white/[0.07] shrink-0">
        {/* Bouton Filtre (Catégories + État + Mot-clé) */}
        <button
          type="button"
          onClick={onOpenFilterDrawer}
          className={`px-3 py-1.5 rounded-full text-[12px] font-extrabold whitespace-nowrap transition-all duration-100 flex items-center justify-center gap-1.5 active:scale-95 min-h-[36px] shrink-0 ${
            activeAdvancedCount > 0
              ? 'uhd-orange-btn text-black border border-white'
              : 'bg-[#171b24] text-white border border-white/15 hover:bg-[#202634]'
          }`}
        >
          <SlidersHorizontal
            className={`w-3.5 h-3.5 shrink-0 ${
              activeAdvancedCount > 0 ? 'text-black' : 'text-[#ff6b00]'
            }`}
          />
          <span>
            Filtre{activeAdvancedCount > 0 ? ` (${activeAdvancedCount})` : ''}
          </span>
        </button>

        {/* Bouton Ville sur la ligne des filtres */}
        <button
          type="button"
          onClick={onOpenCitySelector}
          className={`px-3 py-1.5 rounded-full text-[12px] font-extrabold whitespace-nowrap transition-all duration-100 flex items-center justify-center gap-1 active:scale-95 min-h-[36px] shrink-0 ${
            selectedCity !== 'Toutes les villes'
              ? 'uhd-orange-btn text-black border border-white'
              : 'bg-[#171b24] text-white border border-[#ff6b00]/50 hover:bg-[#202634]'
          }`}
        >
          <MapPin
            className={`w-3.5 h-3.5 shrink-0 ${
              selectedCity !== 'Toutes les villes' ? 'text-black' : 'text-[#ff6b00]'
            }`}
          />
          <span>{selectedCity === 'Toutes les villes' ? 'Villes' : selectedCity}</span>
        </button>

        {(['Tous', '10k', '25k', '50k', '100k+'] as ValueTier[]).map((tier) => {
          const isSelected = selectedTier === tier;
          return (
            <button
              type="button"
              key={tier}
              onClick={() => onSelectTier(tier)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-extrabold whitespace-nowrap transition-all duration-100 flex items-center justify-center gap-1 active:scale-95 min-h-[36px] shrink-0 ${
                isSelected
                  ? 'bg-[#222631] text-white border-[1.5px] border-white/80 shadow-[0_2px_10px_rgba(255,255,255,0.08)]'
                  : 'bg-[#13161d] text-gray-300 border border-white/[0.08] hover:bg-[#1b1f29]'
              }`}
            >
              {tier === 'Tous' && (
                <Flame className="w-3.5 h-3.5 text-[#ff6b00] fill-[#ff6b00] shrink-0" />
              )}
              {isSelected && tier !== 'Tous' && (
                <Check className="w-3.5 h-3.5 text-white stroke-[2.8] shrink-0" />
              )}
              <span>{tier}</span>
            </button>
          );
        })}
      </div>

      {/* Rappels rapides des filtres actifs (Catégorie / État / Mot-clé) */}
      {activeAdvancedCount > 0 && (
        <div className="px-3 pt-2 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {selectedCategory !== 'Toutes' && (
            <button
              type="button"
              onClick={onClearCategory}
              className="px-2.5 py-1 rounded-lg bg-[#ff6b00]/15 border border-[#ff6b00]/40 text-[#ff7b1c] text-[11px] font-extrabold flex items-center gap-1 shrink-0"
            >
              <span>{selectedCategory}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {selectedCondition !== 'ALL' && (
            <button
              type="button"
              onClick={onClearCondition}
              className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-white text-[11px] font-extrabold flex items-center gap-1.5 shrink-0"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getConditionSpec(selectedCondition).hexColor }}
              />
              <span>{getConditionSpec(selectedCondition).label}</span>
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={onClearSearch}
              className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-gray-200 text-[11px] font-extrabold flex items-center gap-1 shrink-0"
            >
              <span>« {searchQuery.trim()} »</span>
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
      )}

      {incomingPendingPartnerName && (
        <div className="px-3 pt-2 shrink-0">
          <button
            type="button"
            onClick={onTriggerIncomingAlert}
            className="w-full bg-gradient-to-r from-red-950/90 via-[#2a1508] to-red-950/90 border border-red-500/60 rounded-xl px-3 py-2 flex items-center justify-between text-left shadow-lg active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">
                NOUVELLE OFFRE
              </span>
              <span className="text-xs font-bold text-gray-100 truncate">
                {incomingPendingPartnerName} propose un échange
              </span>
            </div>
            <span className="text-[11px] font-black text-[#ff7b1c] shrink-0 flex items-center gap-0.5">
              Voir <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      )}
    </>
  );
};
