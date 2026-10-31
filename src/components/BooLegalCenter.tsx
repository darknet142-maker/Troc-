import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scale,
  ShieldCheck,
  Building2,
  ChevronDown,
  AlertTriangle,
  Lock,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import {
  ABOUT_SECTIONS,
  CGU_ARTICLES,
  LegalArticle,
  MMEDIA_UNIVERSE_INFO,
  PRIVACY_ARTICLES
} from '../data/legalData';
import { LegalSectionId } from '../types/troc';
import { BooLogo } from './BooLogo';
import { MmediaUniverseHub } from './MmediaUniverseHub';

interface BooLegalCenterProps {
  initialSection?: LegalSectionId;
}

export const BooLegalCenter: React.FC<BooLegalCenterProps> = ({
  initialSection = 'cgu'
}) => {
  const [activeSection, setActiveSection] = useState<LegalSectionId>(initialSection);
  const [openArticleId, setOpenArticleId] = useState<string>('cgu-2');

  const renderArticleList = (articles: LegalArticle[]) => (
    <div className="space-y-2">
      {articles.map((art) => {
        const isOpen = openArticleId === art.id;
        return (
          <div
            key={art.id}
            className={`rounded-2xl border transition-all overflow-hidden ${
              isOpen
                ? 'bg-[#121621] border-[#ff6b00]/60 shadow-lg'
                : 'uhd-card border-white/[0.08] hover:border-white/20'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenArticleId(isOpen ? '' : art.id)}
              className="w-full p-3 text-left flex items-center justify-between gap-2.5"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7b1c] block">
                  {art.articleNumber}
                </span>
                <h4 className="text-xs font-black text-white leading-snug">{art.title}</h4>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">{art.summary}</p>
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen
                    ? 'bg-[#ff6b00] text-black rotate-180'
                    : 'bg-white/[0.06] text-gray-300'
                }`}
              >
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3.5 pt-2 border-t border-white/[0.07] space-y-2 text-xs text-gray-200 leading-relaxed">
                    {art.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    {art.bullets && (
                      <ul className="space-y-1.5 bg-[#0b0d12] p-2.5 rounded-xl border border-white/10 text-[11px] text-gray-200">
                        {art.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#ff6b00] font-black mt-0.5">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Bandeau Officiel Mmedia Universe & Loi Gabonaise */}
      <div className="bg-gradient-to-br from-[#261507] via-[#121620] to-[#0b0d12] border border-[#ff6b00]/45 rounded-2xl p-3.5 space-y-2 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
              GROUPE {MMEDIA_UNIVERSE_INFO.parentGroup.toUpperCase()}
            </span>
            <h3 className="text-sm font-black text-white">
              Centre Juridique & À Propos de Boo
            </h3>
          </div>
          <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md whitespace-nowrap">
            🇬🇦 LOI GABONAISE
          </span>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed">
          Application officielle du groupe <strong className="text-white">Mmedia Universe</strong>,
          régie exclusivement par le droit positif de la{' '}
          <strong className="text-white">République Gabonaise</strong>.
        </p>
      </div>

      {/* Sélecteur des 3 sections : CGU | Confidentialité | À Propos */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#11141c] p-1 rounded-xl border border-white/[0.08]">
        <button
          type="button"
          onClick={() => {
            setActiveSection('cgu');
            setOpenArticleId('cgu-2');
          }}
          className={`py-2 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeSection === 'cgu'
              ? 'uhd-orange-btn text-black shadow font-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5 shrink-0" />
          <span>CGU</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSection('privacy');
            setOpenArticleId('priv-1');
          }}
          className={`py-2 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeSection === 'privacy'
              ? 'uhd-orange-btn text-black shadow font-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Confidentialité</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('about')}
          className={`py-2 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all ${
            activeSection === 'about'
              ? 'uhd-orange-btn text-black shadow font-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span>À Propos</span>
        </button>
      </div>

      {/* SECTION 1 : CGU & DÉCHARGE TOTALE DE RESPONSABILITÉ */}
      {activeSection === 'cgu' && (
        <div className="space-y-2.5">
          <div className="bg-amber-500/10 border border-amber-400/40 rounded-2xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-[11px] text-gray-200 leading-snug">
              <strong className="text-amber-300 block uppercase text-[10px] font-black mb-0.5">
                AVERTISSEMENT & DÉCHARGE DE RESPONSABILITÉ
              </strong>
              Boo (Groupe Mmedia Universe) est un simple outil technique de mise en relation. Chaque
              utilisateur est seul responsable de ses objets, de leur légalité au Gabon et de la
              vérification sur place avant d’échanger.
            </div>
          </div>

          {renderArticleList(CGU_ARTICLES)}
        </div>
      )}

      {/* SECTION 2 : POLITIQUE DE CONFIDENTIALITÉ (LOI GABONAISE N°001/2011) */}
      {activeSection === 'privacy' && (
        <div className="space-y-2.5">
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-gray-200 leading-snug">
              <strong className="text-emerald-300 block uppercase text-[10px] font-black mb-0.5">
                CONFORMITÉ LOI N°001/2011 (RÉPUBLIQUE GABONAISE)
              </strong>
              Vos données et votre numéro WhatsApp sont protégés conformément à la législation
              gabonaise sur les données personnelles (APDPVP).
            </div>
          </div>

          {renderArticleList(PRIVACY_ARTICLES)}
        </div>
      )}

      {/* SECTION 3 : À PROPOS DE BOO & DU GROUPE MMEDIA UNIVERSE */}
      {activeSection === 'about' && (
        <div className="space-y-3">
          <div className="uhd-card rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <BooLogo className="h-9 w-auto" />
              <span className="bg-[#ff6b00]/20 border border-[#ff6b00]/40 text-[#ff7b1c] text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                Mmedia Universe
              </span>
            </div>

            <h4 className="text-xs font-black text-white uppercase">
              {ABOUT_SECTIONS.headline}
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">{ABOUT_SECTIONS.mission}</p>

            <div className="space-y-2 pt-1">
              {ABOUT_SECTIONS.pillars.map((pillar, index) => (
                <div
                  key={index}
                  className="bg-[#0b0d12] p-3 rounded-xl border border-white/10 space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#ff7b1c]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{pillar.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#0b0d12] p-3 rounded-xl border border-white/10 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Application :</span>
                <span className="font-black text-white">{MMEDIA_UNIVERSE_INFO.appName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Groupe Éditeur :</span>
                <span className="font-black text-[#ff7b1c]">
                  {MMEDIA_UNIVERSE_INFO.parentGroup}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Siège & Ancrage :</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#ff6b00]" /> Libreville, Gabon
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Droit Applicable :</span>
                <span className="font-bold text-emerald-400">Loi Gabonaise exclusivement</span>
              </div>
            </div>
          </div>

          {/* Espace Exclusif Applications du Groupe Mmedia Universe */}
          <MmediaUniverseHub />
        </div>
      )}
    </div>
  );
};
