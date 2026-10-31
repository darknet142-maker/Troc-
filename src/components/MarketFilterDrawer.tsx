import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, RotateCcw, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { CONDITION_GRADES } from '../data/initialData';
import { detectMatchedFamilies, WORD_FAMILY_CLUSTERS } from '../lib/smartSearch';
import {
  ConditionGradeId,
  MARKET_CATEGORIES,
  MarketCategoryFilter
} from '../types/troc';

interface MarketFilterDrawerProps {
  selectedCategory: MarketCategoryFilter;
  selectedCondition: ConditionGradeId | 'ALL';
  searchQuery: string;
  resultsCount: number;
  onSelectCategory: (cat: MarketCategoryFilter) => void;
  onSelectCondition: (cond: ConditionGradeId | 'ALL') => void;
  onChangeSearchQuery: (q: string) => void;
  onResetFilters: () => void;
  onClose: () => void;
}

const SPRING_120FPS = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 36,
  mass: 0.6
};

export const MarketFilterDrawer: React.FC<MarketFilterDrawerProps> = ({
  selectedCategory,
  selectedCondition,
  searchQuery,
  resultsCount,
  onSelectCategory,
  onSelectCondition,
  onChangeSearchQuery,
  onResetFilters,
  onClose
}) => {
  const recognizedFamilies = useMemo(
    () => detectMatchedFamilies(searchQuery),
    [searchQuery]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end p-3"
    >
      <motion.div
        initial={{ y: 40, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.96 }}
        transition={SPRING_120FPS}
        className="bg-[#12151e] border border-white/15 rounded-3xl p-4 space-y-3.5 shadow-2xl max-h-[88%] flex flex-col"
      >
        {/* En-tête du tiroir Filtre */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#ff6b00]" />
            <h3 className="text-sm font-black uppercase tracking-tight text-white">
              Filtre Intelligent
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3.5 pr-0.5">
          {/* 1. Recherche sémantique tolérante aux fautes & synonymes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-gray-300">
                Recherche intelligente (fautes & synonymes compris) :
              </span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onChangeSearchQuery(e.target.value)}
                placeholder="Ex: télé, écran, pouce, baffle, ps4, basket..."
                className="w-full bg-[#0b0d12] border border-white/15 focus:border-[#ff6b00] rounded-xl pl-8 pr-8 py-2.5 text-xs text-white placeholder-gray-500 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onChangeSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Indicateur de famille de mots détectée automatiquement */}
            {recognizedFamilies.length > 0 ? (
              <div className="bg-[#ff6b00]/10 border border-[#ff6b00]/35 rounded-xl px-2.5 py-2 space-y-1">
                {recognizedFamilies.map((fam) => (
                  <div key={fam.id} className="text-[11px]">
                    <span className="font-black text-[#ff7b1c] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 shrink-0" />
                      <span>Famille comprise : {fam.label}</span>
                    </span>
                    <span className="text-[10px] text-gray-300 block">
                      Inclut aussi : {fam.sampleTerms.join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 overflow-x-auto pt-0.5">
                {WORD_FAMILY_CLUSTERS.slice(0, 5).map((fam) => (
                  <button
                    type="button"
                    key={fam.id}
                    onClick={() => onChangeSearchQuery(fam.sampleTerms[0])}
                    className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-[10px] font-bold text-gray-300 whitespace-nowrap shrink-0"
                  >
                    {fam.sampleTerms[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Catégories en 1 clic */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-gray-300 block">Catégorie :</span>
            <div className="flex flex-wrap gap-1.5">
              {MARKET_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'uhd-orange-btn text-black font-black shadow'
                        : 'bg-[#0b0d12] text-gray-300 border border-white/10 hover:border-white/25'
                    }`}
                  >
                    {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. État de l'objet (respect strict des 5 couleurs officielles) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-gray-300 block">État :</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onSelectCondition('ALL')}
                className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border text-left flex items-center justify-between ${
                  selectedCondition === 'ALL'
                    ? 'bg-[#222632] text-white border-white/80'
                    : 'bg-[#0b0d12] text-gray-300 border-white/10'
                }`}
              >
                <span>Tous les états</span>
                {selectedCondition === 'ALL' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {CONDITION_GRADES.map((g) => {
                const isActive = selectedCondition === g.id;
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => onSelectCondition(g.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border text-left flex items-center justify-between gap-1.5 transition-all ${
                      isActive
                        ? `${g.badgeBg} ${g.badgeBorder} text-white`
                        : 'bg-[#0b0d12] text-gray-300 border-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: g.hexColor }}
                      />
                      <span className="truncate">{g.label}</span>
                    </span>
                    <span className="text-[10px] font-mono-tabular text-gray-400 shrink-0">
                      {g.rangeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions bas du tiroir */}
        <div className="flex items-center gap-2 pt-1 shrink-0">
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3.5 py-3 rounded-2xl bg-[#1a1e29] hover:bg-[#232836] text-gray-300 font-extrabold text-xs flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-transform"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tout effacer</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 uhd-orange-btn text-black font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-lg"
          >
            <span>VOIR ({resultsCount})</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
