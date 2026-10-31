import React from 'react';
import { TOKEN_PACKS } from '../data/initialData';
import { TokenPackOffer, WalletMetrics } from '../types/troc';
import { BooFooterSignature } from './BooFooterSignature';

interface ShopTabProps {
  wallet: WalletMetrics;
  selectedOperator: 'Airtel Money' | 'Moov Money';
  onSelectOperator: (op: 'Airtel Money' | 'Moov Money') => void;
  onBuyTokenPack: (pack: TokenPackOffer) => void;
  onBuyBoostPack: (boostCount: number, priceFcfa: number) => void;
}

export const ShopTab: React.FC<ShopTabProps> = ({
  wallet,
  selectedOperator,
  onSelectOperator,
  onBuyTokenPack,
  onBuyBoostPack
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-8 space-y-3.5 gpu-120fps">
      {/* Carte Solde Actuel */}
      <div className="bg-gradient-to-br from-[#1b112c] via-[#131720] to-[#0d1016] border border-purple-500/40 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 block">
              PUBLICATION 100% GRATUITE
            </span>
            <h2 className="text-base font-black text-white">Boutique de Jetons</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 block">Solde disponible</span>
            <span className="text-base font-black text-purple-300 font-mono-tabular">
              🪙 {wallet.tokens} Jeton{wallet.tokens > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed">
          Publiez et proposez vos objets gratuitement. Il faut{' '}
          <strong className="text-white">1 Jeton (300 FCFA) par transaction</strong> pour conclure
          un accord et débloquer le WhatsApp + Ticket PIN.
        </p>
      </div>

      {/* Sélecteur d'Opérateur Mobile Money */}
      <div className="bg-[#11141c] p-2 rounded-2xl border border-white/[0.08] flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-gray-300 pl-1.5">Payer via :</span>
        <div className="flex gap-1.5">
          {(['Airtel Money', 'Moov Money'] as const).map((op) => {
            const isActive = selectedOperator === op;
            return (
              <button
                type="button"
                key={op}
                onClick={() => onSelectOperator(op)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  isActive
                    ? op === 'Airtel Money'
                      ? 'bg-red-600 text-white border border-white/60 shadow'
                      : 'bg-sky-500 text-black border border-white/60 shadow'
                    : 'bg-[#1a1e29] text-gray-400 border border-white/10'
                }`}
              >
                {op}
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des Packs de Jetons */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-300 px-1">
          Packs de Jetons (1 Jeton = 1 Transaction)
        </h3>
        {TOKEN_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`rounded-2xl p-3 border transition-all flex items-center justify-between gap-3 ${
              pack.popular
                ? 'bg-gradient-to-r from-[#211235] to-[#131722] border-purple-500'
                : 'uhd-card border-white/[0.09]'
            }`}
          >
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{pack.title}</span>
                {pack.badge && (
                  <span className="bg-purple-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase whitespace-nowrap">
                    {pack.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">{pack.subtitle}</p>
            </div>

            <button
              type="button"
              onClick={() => onBuyTokenPack(pack)}
              className="uhd-orange-btn text-black font-black text-xs px-3.5 py-2.5 rounded-xl shrink-0 active:scale-95 transition-transform font-mono-tabular whitespace-nowrap"
            >
              {pack.priceFcfa.toLocaleString('fr-FR')} F
            </button>
          </div>
        ))}
      </div>

      {/* Section Pass Boosts Coupe-File (500 FCFA) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-purple-300">
            🚀 Pass Prioritaires « Coupe-File »
          </h3>
          <span className="text-[11px] font-bold text-gray-400">
            En stock : {wallet.boostCredits} Pass
          </span>
        </div>

        <div className="uhd-card rounded-2xl p-3 border border-white/[0.09] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-black text-white block">
              1 Pass Coupe-File Prioritaire
            </span>
            <span className="text-[11px] text-gray-400">
              Place votre offre tout en haut chez le vendeur
            </span>
          </div>
          <button
            type="button"
            onClick={() => onBuyBoostPack(1, 500)}
            className="bg-purple-500 hover:bg-purple-400 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shrink-0 active:scale-95 transition-transform font-mono-tabular"
          >
            500 F
          </button>
        </div>

        <div className="uhd-card rounded-2xl p-3 border border-purple-500/35 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-purple-300">Pack 3 Pass Coupe-File</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-1.5 py-0.5 rounded">
                -300 FCFA
              </span>
            </div>
            <span className="text-[11px] text-gray-400 block">
              Idéal pour passer en priorité sur les meilleures annonces
            </span>
          </div>
          <button
            type="button"
            onClick={() => onBuyBoostPack(3, 1200)}
            className="bg-purple-500 hover:bg-purple-400 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shrink-0 active:scale-95 transition-transform font-mono-tabular"
          >
            1 200 F
          </button>
        </div>
      </div>

      <BooFooterSignature />
    </div>
  );
};
