import React from 'react';
import { motion } from 'motion/react';
import { Check, Plus, X, Zap } from 'lucide-react';
import { getConditionSpec } from '../data/initialData';
import {
  CashTopUpAmount,
  formatCompactFcfa,
  LegalSectionId,
  MarketItem,
  WeaponItem
} from '../types/troc';
import { LegalConsentCheckbox } from './LegalConsentCheckbox';

interface ProposeTradeModalProps {
  targetItem: MarketItem;
  weapons: WeaponItem[];
  selectedWeaponIndex: number;
  proposalCashTopUp: CashTopUpAmount;
  acceptedTerms: boolean;
  onChangeAcceptedTerms: (checked: boolean) => void;
  onOpenLegalSection: (section: LegalSectionId) => void;
  onSelectWeapon: (idx: number) => void;
  onSelectCashTopUp: (amount: CashTopUpAmount) => void;
  onOpenPublishNewWeapon: () => void;
  onConfirmProposal: () => void;
  onNeedTermsToast: () => void;
  onClose: () => void;
}

const SPRING_120FPS = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 36,
  mass: 0.6
};

export const ProposeTradeModal: React.FC<ProposeTradeModalProps> = ({
  targetItem,
  weapons,
  selectedWeaponIndex,
  proposalCashTopUp,
  acceptedTerms,
  onChangeAcceptedTerms,
  onOpenLegalSection,
  onSelectWeapon,
  onSelectCashTopUp,
  onOpenPublishNewWeapon,
  onConfirmProposal,
  onNeedTermsToast,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={SPRING_120FPS}
      className="absolute inset-0 z-50 bg-black/88 backdrop-blur-xl flex items-end justify-center p-3 gpu-120fps"
    >
      <div className="w-full bg-[#13161f] border border-white/15 rounded-3xl p-4 space-y-3 shadow-2xl max-h-[94%] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-[#ff6b00] block">
              PROPOSER UN TROC
            </span>
            <h3 className="text-sm font-black text-white truncate">{targetItem.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rappel de l'objet ciblé */}
        <div className="flex items-center gap-2.5 bg-[#0b0d12] p-2.5 rounded-2xl border border-white/10">
          <img
            src={targetItem.image}
            alt={targetItem.title}
            className="w-12 h-12 aspect-square rounded-xl object-cover shrink-0 border border-white/10"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-white truncate">{targetItem.title}</p>
            <p className="text-[11px] text-gray-400">
              {targetItem.owner} • {targetItem.city}
            </p>
          </div>
          <span className="text-xs font-black text-[#ff7b1c] shrink-0 font-mono-tabular">
            {formatCompactFcfa(targetItem.cashPrice, targetItem.tier)}
          </span>
        </div>

        {/* Choix court : "Mon objet :" */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-gray-300 uppercase">
              Mon objet :
            </span>
            <button
              type="button"
              onClick={onOpenPublishNewWeapon}
              className="text-[11px] font-extrabold text-[#ff7b1c] flex items-center gap-0.5 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {weapons.map((w, idx) => {
              const isSelected = idx === selectedWeaponIndex;
              const cond = getConditionSpec(w.conditionGrade);
              return (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => onSelectWeapon(idx)}
                  className={`w-full p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#ff6b00]/15 border-[#ff6b00] text-white'
                      : 'bg-[#0b0d12] border-white/10 text-gray-300 hover:bg-[#1b1f29]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={w.image}
                      alt={w.title}
                      className="w-11 h-11 aspect-square rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="text-left min-w-0">
                      <p className="text-xs font-extrabold text-white truncate">{w.title}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#ff7b1c] font-mono-tabular">
                          {formatCompactFcfa(w.tierValue, w.tier)}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cond.hexColor }}
                          />
                          {w.conditionPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-[#ff6b00] border-[#ff6b00] text-black'
                        : 'border-white/25'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rajout cash court : "Rajout cash :" */}
        <div className="bg-[#0b0d12] p-2.5 rounded-2xl border border-white/10 space-y-1.5">
          <span className="text-[11px] font-bold text-gray-300 block">Rajout cash :</span>
          <div className="grid grid-cols-4 gap-1.5">
            {([0, 2000, 5000, 10000] as CashTopUpAmount[]).map((amt) => {
              const isActive = proposalCashTopUp === amt;
              return (
                <button
                  type="button"
                  key={amt}
                  onClick={() => onSelectCashTopUp(amt)}
                  className={`py-2 rounded-xl text-xs font-black border transition-all ${
                    isActive
                      ? 'uhd-orange-btn text-black border-white'
                      : 'bg-[#171b24] text-gray-300 border-white/10'
                  }`}
                >
                  {amt === 0 ? 'Aucun' : `+${amt / 1000}k`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Case à cocher obligatoire CGU / Loi gabonaise */}
        <LegalConsentCheckbox
          checked={acceptedTerms}
          onChange={onChangeAcceptedTerms}
          onOpenLegalSection={onOpenLegalSection}
          compact
        />

        {/* Bouton court : ENVOYER */}
        <button
          type="button"
          onClick={() => {
            if (!acceptedTerms) {
              onNeedTermsToast();
              return;
            }
            onConfirmProposal();
          }}
          className={`w-full font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            acceptedTerms
              ? 'uhd-orange-btn text-black active:scale-95'
              : 'bg-[#222632] text-gray-400 border border-white/10'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>ENVOYER</span>
        </button>
      </div>
    </motion.div>
  );
};
