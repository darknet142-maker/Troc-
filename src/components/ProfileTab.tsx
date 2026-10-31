import React from 'react';
import { Camera, Edit3, HelpCircle, History, Layers, Scale, Trash2 } from 'lucide-react';
import { GABON_CITIES, getConditionSpec } from '../data/initialData';
import {
  ActivityHistoryItem,
  formatCompactFcfa,
  GabonCity,
  LegalSectionId,
  ProfileSubTab,
  UserProfile,
  WalletMetrics,
  WeaponItem
} from '../types/troc';
import { BooFaqAccordion } from './BooFaqAccordion';
import { BooLegalCenter } from './BooLegalCenter';
import { MmediaUniverseHub } from './MmediaUniverseHub';
import { VybzPromoCard } from './VybzPromoCard';
import { BooFooterSignature } from './BooFooterSignature';

interface ProfileTabProps {
  userProfile: UserProfile;
  isEditingProfile: boolean;
  wallet: WalletMetrics;
  profileSubTab: ProfileSubTab;
  legalInitialSection: LegalSectionId;
  activityHistory: ActivityHistoryItem[];
  weapons: WeaponItem[];
  selectedWeaponIndex: number;
  onToggleEditProfile: () => void;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
  onSelectSubTab: (sub: ProfileSubTab) => void;
  onSelectDefaultWeapon: (idx: number) => void;
  onDeleteWeapon: (id: string) => void;
  onOpenPublish: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userProfile,
  isEditingProfile,
  wallet,
  profileSubTab,
  legalInitialSection,
  activityHistory,
  weapons,
  selectedWeaponIndex,
  onToggleEditProfile,
  onUpdateProfile,
  onSelectSubTab,
  onSelectDefaultWeapon,
  onDeleteWeapon,
  onOpenPublish
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-8 space-y-3.5 gpu-120fps">
      {/* Carte d'Identité Utilisateur */}
      <div className="uhd-card rounded-2xl p-3.5 border border-white/[0.1] space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#ff8c33] text-black font-black text-base flex items-center justify-center shadow-lg shrink-0">
              {userProfile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black text-white truncate">{userProfile.name}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-1.5 py-0.2 rounded">
                  {userProfile.trustScore}% FIABLE
                </span>
              </div>
              <p className="text-xs text-gray-300 truncate">
                {userProfile.city} • {userProfile.quartier}
              </p>
              <p className="text-[11px] text-gray-400 font-mono-tabular">
                WhatsApp : +{userProfile.phone}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleEditProfile}
            className="uhd-surface p-2 rounded-xl border border-white/10 text-gray-300 hover:text-white"
            title="Modifier mon profil"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {isEditingProfile && (
          <div className="bg-[#0b0d12] p-2.5 rounded-xl border border-white/10 space-y-2">
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => onUpdateProfile((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Votre nom"
              className="w-full bg-[#141720] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={userProfile.city}
                onChange={(e) =>
                  onUpdateProfile((prev) => ({
                    ...prev,
                    city: e.target.value as GabonCity
                  }))
                }
                className="bg-[#141720] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                {GABON_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={userProfile.quartier}
                onChange={(e) =>
                  onUpdateProfile((prev) => ({ ...prev, quartier: e.target.value }))
                }
                placeholder="Quartier"
                className="bg-[#141720] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <input
              type="text"
              value={userProfile.phone}
              onChange={(e) => onUpdateProfile((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Numéro WhatsApp (ex: 241077...)"
              className="w-full bg-[#141720] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-tabular"
            />
          </div>
        )}

        {/* 3 Compteurs Clés */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[#0b0d12] p-2 rounded-xl border border-white/[0.06] text-center">
            <span className="text-[10px] text-gray-400 block">Trocs conclus</span>
            <span className="text-sm font-black text-emerald-400 font-mono-tabular">
              {wallet.verifiedTrades}
            </span>
          </div>
          <div className="bg-[#0b0d12] p-2 rounded-xl border border-white/[0.06] text-center">
            <span className="text-[10px] text-gray-400 block">Valeur troquée</span>
            <span className="text-sm font-black text-white font-mono-tabular">
              {Math.round(userProfile.totalVolumeFcfa / 1000)}k F
            </span>
          </div>
          <div className="bg-[#0b0d12] p-2 rounded-xl border border-white/[0.06] text-center">
            <span className="text-[10px] text-gray-400 block">Jetons / Boosts</span>
            <span className="text-sm font-black text-purple-300 font-mono-tabular">
              {wallet.tokens}🪙 • {wallet.boostCredits}🚀
            </span>
          </div>
        </div>
      </div>

      {/* Sous-navigation Profil : 5 Onglets courts (Historique | Objets | Apps | FAQ | Légal) */}
      <div className="grid grid-cols-5 gap-1 bg-[#11141c] p-1 rounded-xl border border-white/[0.08]">
        <button
          type="button"
          onClick={() => onSelectSubTab('history')}
          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'history'
              ? 'bg-[#222632] text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <History className="w-3 h-3 text-[#ff6b00] shrink-0" />
          <span className="truncate">Historique</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSubTab('weapons')}
          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'weapons'
              ? 'bg-[#222632] text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span className="truncate">Objets ({weapons.length})</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSubTab('apps')}
          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'apps'
              ? 'bg-[#e11d48] text-white shadow'
              : 'text-[#fb7185] hover:text-white'
          }`}
        >
          <Layers className="w-3 h-3 shrink-0" />
          <span className="truncate">Apps</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSubTab('help')}
          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'help'
              ? 'bg-[#222632] text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3 h-3 text-[#ff6b00] shrink-0" />
          <span className="truncate">FAQ</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSubTab('legal')}
          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            profileSubTab === 'legal'
              ? 'bg-[#222632] text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Scale className="w-3 h-3 text-[#ff6b00] shrink-0" />
          <span className="truncate">Légal</span>
        </button>
      </div>

      {/* SOUS-ONGLET 1 : HISTORIQUE COMPLET */}
      {profileSubTab === 'history' && (
        <div className="space-y-2">
          {activityHistory.map((item) => (
            <div
              key={item.id}
              className="uhd-card rounded-2xl p-3 border border-white/[0.08] flex items-center justify-between gap-2.5"
            >
              <div className="min-w-0 space-y-0.5">
                <span className="text-xs font-extrabold text-white block truncate">
                  {item.title}
                </span>
                <p className="text-[11px] text-gray-400 line-clamp-1">{item.subtitle}</p>
                <span className="text-[10px] text-gray-500 block">{item.timestamp}</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black font-mono-tabular whitespace-nowrap shrink-0 border ${
                  item.badgeColor === 'emerald'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : item.badgeColor === 'purple' || item.badgeColor === 'amber'
                    ? 'bg-purple-500/15 border-purple-400/40 text-purple-300'
                    : item.badgeColor === 'sky'
                    ? 'bg-sky-400/15 border-sky-400/40 text-sky-300'
                    : item.badgeColor === 'red'
                    ? 'bg-red-500/15 border-red-500/40 text-red-300'
                    : 'bg-[#ff6b00]/15 border-[#ff6b00]/40 text-[#ff7b1c]'
                }`}
              >
                {item.amountLabel}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* SOUS-ONGLET 2 : MES OBJETS DISPONIBLES POUR LE TROC */}
      {profileSubTab === 'weapons' && (
        <div className="space-y-2">
          {weapons.map((w, idx) => {
            const isDefault = idx === selectedWeaponIndex;
            const cond = getConditionSpec(w.conditionGrade);
            return (
              <div
                key={w.id}
                className={`rounded-2xl p-2.5 border flex items-center justify-between gap-2.5 ${
                  isDefault
                    ? 'bg-[#ff6b00]/10 border-[#ff6b00]'
                    : 'uhd-card border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={w.image}
                    alt={w.title}
                    className="w-12 h-12 aspect-square rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-black text-white truncate">{w.title}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-extrabold text-[#ff7b1c] font-mono-tabular">
                        {formatCompactFcfa(w.tierValue, w.tier)}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border ${cond.badgeBg} ${cond.badgeBorder} ${cond.badgeText} flex items-center gap-1`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cond.hexColor }}
                        />
                        {w.conditionPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectDefaultWeapon(idx)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black ${
                      isDefault
                        ? 'uhd-orange-btn text-black'
                        : 'bg-[#1c202b] text-gray-200 border border-white/10'
                    }`}
                  >
                    {isDefault ? 'Actif ✓' : 'Choisir'}
                  </button>
                  {weapons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteWeapon(w.id)}
                      className="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={onOpenPublish}
            className="w-full uhd-orange-btn text-black font-black text-xs py-3 rounded-xl flex items-center justify-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Publier un objet</span>
          </button>
        </div>
      )}

      {/* SOUS-ONGLET 3 : ESPACE EXCLUSIF APPLICATIONS MMEDIA UNIVERSE */}
      {profileSubTab === 'apps' && <MmediaUniverseHub />}

      {/* SOUS-ONGLET 4 : FOIRE AUX QUESTIONS & GUIDE INTERACTIF BOO */}
      {profileSubTab === 'help' && <BooFaqAccordion />}

      {/* SOUS-ONGLET 5 : LÉGAL (CGU • CONFIDENTIALITÉ • À PROPOS — LOI GABONAISE) */}
      {profileSubTab === 'legal' && <BooLegalCenter initialSection={legalInitialSection} />}

      {/* Invitation intelligente vers VYBZ & l'espace Mmedia Universe */}
      {profileSubTab !== 'apps' && (
        <VybzPromoCard
          variant="banner"
          onOpenMmediaHub={() => onSelectSubTab('apps')}
        />
      )}

      {/* Signature officielle Boo */}
      <BooFooterSignature />
    </div>
  );
};
