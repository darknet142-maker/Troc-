import React from 'react';
import { Check, Scale } from 'lucide-react';
import { LegalSectionId } from '../types/troc';

interface LegalConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onOpenLegalSection: (section: LegalSectionId) => void;
  compact?: boolean;
}

export const LegalConsentCheckbox: React.FC<LegalConsentCheckboxProps> = ({
  checked,
  onChange,
  onOpenLegalSection,
  compact = false
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all ${
        checked
          ? 'bg-emerald-500/10 border-emerald-500/40'
          : 'bg-[#0b0d12] border-amber-400/40'
      } ${compact ? 'p-2.5' : 'p-3'}`}
    >
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
            checked
              ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
              : 'bg-[#141822] border-white/30 text-transparent hover:border-[#ff6b00]'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3.2]" />
        </button>

        <div className="text-[11px] leading-snug text-gray-200 flex-1">
          <span
            onClick={() => onChange(!checked)}
            className="cursor-pointer select-none font-semibold"
          >
            Je certifie être propriétaire légitime de l’objet, j’accepte les{' '}
          </span>
          <button
            type="button"
            onClick={() => onOpenLegalSection('cgu')}
            className="font-black text-[#ff7b1c] underline hover:text-amber-300"
          >
            CGU
          </button>
          <span>, la </span>
          <button
            type="button"
            onClick={() => onOpenLegalSection('privacy')}
            className="font-black text-[#ff7b1c] underline hover:text-amber-300"
          >
            Politique de Confidentialité
          </button>
          <span
            onClick={() => onChange(!checked)}
            className="cursor-pointer select-none font-semibold"
          >
            {' '}
            (Loi gabonaise exclusivement) et décharge{' '}
          </span>
          <button
            type="button"
            onClick={() => onOpenLegalSection('about')}
            className="font-black text-amber-300 underline hover:text-white"
          >
            Boo (Mmedia Universe)
          </button>
          <span
            onClick={() => onChange(!checked)}
            className="cursor-pointer select-none font-semibold"
          >
            {' '}
            de toute responsabilité.
          </span>
        </div>
      </div>

      {!checked && (
        <div className="mt-1.5 pl-7 flex items-center gap-1 text-[10px] font-bold text-amber-300">
          <Scale className="w-3 h-3 shrink-0" />
          <span>Cochez cette case obligatoire pour continuer</span>
        </div>
      )}
    </div>
  );
};
