import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Banknote,
  Camera,
  Check,
  ChevronRight,
  MapPin,
  Upload,
  X,
  Zap
} from 'lucide-react';
import {
  CONDITION_GRADES,
  GABON_CITIES,
  getConditionSpec,
  PRESET_PHOTOS
} from '../data/initialData';
import {
  ConditionGradeId,
  deriveTierFromPrice,
  GabonCity,
  ItemTier,
  LegalSectionId
} from '../types/troc';
import { LegalConsentCheckbox } from './LegalConsentCheckbox';

interface PublishModalProps {
  defaultCity: GabonCity;
  acceptedTerms: boolean;
  onChangeAcceptedTerms: (checked: boolean) => void;
  onOpenLegalSection: (section: LegalSectionId) => void;
  onClose: () => void;
  onPublishItem: (payload: {
    title: string;
    tier: ItemTier;
    customPriceFcfa: number;
    city: GabonCity;
    conditionGrade: ConditionGradeId;
    conditionPercent: number;
    rawImage: string | null;
    croppedSquareImage: string | null;
    presetIndex: number;
  }) => void;
  onCropFileToSquare: (dataUrl: string) => Promise<string>;
  onNeedTermsToast: () => void;
}

const SPRING_120FPS = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 36,
  mass: 0.6
};

const TIER_DEFAULT_PRICES: Record<ItemTier, number> = {
  '10k': 10000,
  '25k': 25000,
  '50k': 50000,
  '100k+': 100000
};

export const PublishModal: React.FC<PublishModalProps> = ({
  defaultCity,
  acceptedTerms,
  onChangeAcceptedTerms,
  onOpenLegalSection,
  onClose,
  onPublishItem,
  onCropFileToSquare,
  onNeedTermsToast
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState<string>('');
  const [presetIndex, setPresetIndex] = useState<number>(0);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedSquare, setCroppedSquare] = useState<string | null>(null);
  const [conditionGrade, setConditionGrade] = useState<ConditionGradeId>('COMME_NEUF');
  const [conditionPercent, setConditionPercent] = useState<number>(88);
  const [tier, setTier] = useState<ItemTier>('25k');
  const [customPriceInput, setCustomPriceInput] = useState<string>('25000');
  const [city, setCity] = useState<GabonCity>(defaultCity);
  const [isChangingCity, setIsChangingCity] = useState<boolean>(false);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const selectedCond = getConditionSpec(conditionGrade);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        setRawImage(reader.result);
        const square = await onCropFileToSquare(reader.result);
        setCroppedSquare(square);
        if (!title.trim()) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          if (cleanName.length > 2 && !cleanName.toLowerCase().startsWith('img')) {
            setTitle(cleanName);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectTierButton = (selectedTier: ItemTier) => {
    setTier(selectedTier);
    setCustomPriceInput(String(TIER_DEFAULT_PRICES[selectedTier]));
  };

  const handleCustomPriceChange = (rawVal: string) => {
    const digitsOnly = rawVal.replace(/[^0-9]/g, '');
    setCustomPriceInput(digitsOnly);
    const numeric = parseInt(digitsOnly, 10);
    if (!isNaN(numeric) && numeric > 0) {
      setTier(deriveTierFromPrice(numeric));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      onNeedTermsToast();
      return;
    }
    const parsedPrice = parseInt(customPriceInput, 10);
    const finalPriceFcfa =
      !isNaN(parsedPrice) && parsedPrice >= 500 ? parsedPrice : TIER_DEFAULT_PRICES[tier];
    const finalTier = deriveTierFromPrice(finalPriceFcfa);

    onPublishItem({
      title,
      tier: finalTier,
      customPriceFcfa: finalPriceFcfa,
      city,
      conditionGrade,
      conditionPercent,
      rawImage,
      croppedSquareImage: croppedSquare,
      presetIndex
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 26 }}
      transition={SPRING_120FPS}
      className="absolute inset-0 z-50 bg-black/92 backdrop-blur-2xl flex items-end justify-center p-3 gpu-120fps"
    >
      <div className="w-full bg-[#12151e] border border-white/15 rounded-3xl p-4 space-y-3 shadow-2xl max-h-[95%] overflow-y-auto">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* En-tête minimaliste avec indicateur des 3 étapes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev === 3 ? 2 : 1))}
                className="px-2.5 py-1 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-xs font-extrabold text-gray-200"
              >
                ← Retour
              </button>
            )}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ff6b00] block">
                ÉTAPE {step} SUR 3 • GRATUIT
              </span>
              <h3 className="text-sm font-black text-white">
                {step === 1
                  ? '1. Photo & Nom de l’objet'
                  : step === 2
                  ? '2. Choisissez l’état en 1 clic'
                  : '3. Prix (Libre ou Palier) & Publication'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de progression 3 segments */}
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s as 1 | 2 | 3)}
              className={`h-1.5 rounded-full transition-all ${
                step >= s ? 'bg-[#ff6b00]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* =========================================================
            ÉTAPE 1 / 3 : PHOTO CARRÉE AUTOMATIQUE & NOM
        ========================================================= */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-[#0b0d12] p-3 rounded-2xl border border-white/10">
              <div className="relative w-20 h-20 aspect-square rounded-2xl overflow-hidden border-2 border-[#ff6b00] shrink-0 bg-[#141822]">
                <img
                  src={croppedSquare || PRESET_PHOTOS[presetIndex].url}
                  alt="Aperçu 1:1"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="uhd-orange-btn text-black rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-black active:scale-95 transition-transform"
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                  <span>Prendre une photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="uhd-surface border border-white/15 text-white rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-bold active:scale-95 transition-transform"
                >
                  <Upload className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>Choisir dans la galerie</span>
                </button>
              </div>
            </div>

            {!croppedSquare && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">
                  Ou testez avec un modèle rapide :
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => {
                        setPresetIndex(idx);
                        setTitle(preset.defaultName);
                      }}
                      className={`p-1.5 rounded-xl border text-center transition-all ${
                        presetIndex === idx
                          ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-white'
                          : 'bg-[#0b0d12] border-white/10 text-gray-400'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-10 h-10 aspect-square mx-auto rounded-lg object-cover mb-1"
                      />
                      <span className="text-[10px] font-extrabold block truncate">
                        {preset.defaultName.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">
                Nom de votre objet :
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Ex : ${PRESET_PHOTOS[presetIndex].defaultName}`}
                className="w-full bg-[#0b0d12] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#ff6b00]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!title.trim()) {
                  setTitle(PRESET_PHOTOS[presetIndex].defaultName);
                }
                setStep(2);
              }}
              className="w-full uhd-orange-btn text-black font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>SUIVANT : CHOISIR L'ÉTAT</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* =========================================================
            ÉTAPE 2 / 3 : ÉTAT EN 1 SEUL CLIC (AVANCE AUTOMATIQUEMENT)
        ========================================================= */}
        {step === 2 && (
          <div className="space-y-2">
            <p className="text-[11px] text-gray-300">
              Touchez l’état réel de votre objet : vous passez directement à l’étape du prix.
            </p>

            <div className="space-y-1.5">
              {CONDITION_GRADES.map((g) => {
                const isSelected = conditionGrade === g.id;
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => {
                      setConditionGrade(g.id);
                      setConditionPercent(g.defaultPercent);
                      setStep(3);
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${
                      isSelected
                        ? `${g.badgeBg} ${g.badgeBorder} shadow-md`
                        : 'bg-[#0b0d12] border-white/10 hover:bg-[#171b24]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow"
                        style={{ backgroundColor: g.hexColor }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white block">{g.label}</span>
                        <span className="text-[10px] text-gray-400 block truncate">
                          {g.realityDescription}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono-tabular shrink-0 border ${g.badgeBg} ${g.badgeBorder} ${g.badgeText}`}
                    >
                      {g.defaultPercent}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            ÉTAPE 3 / 3 : PRIX (PALIER OU PRIX LIBRE ÉCRIT) + CGU & PUBLIER
        ========================================================= */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Résumé compact de l'objet */}
            <div className="flex items-center justify-between gap-2.5 bg-[#0b0d12] p-2.5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={croppedSquare || PRESET_PHOTOS[presetIndex].url}
                  alt="Objet"
                  className="w-11 h-11 aspect-square rounded-xl object-cover shrink-0 border border-white/15"
                />
                <div className="min-w-0">
                  <p className="text-xs font-black text-white truncate">
                    {title.trim() || PRESET_PHOTOS[presetIndex].defaultName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedCond.hexColor }}
                    />
                    <span className="text-[11px] font-bold text-gray-300">
                      {selectedCond.label} ({conditionPercent}%)
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[11px] font-bold text-[#ff7b1c] underline shrink-0"
              >
                Modifier
              </button>
            </div>

            {/* 1. Paliers rapides en 1 clic */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-gray-300 uppercase block">
                Choisir un palier rapide :
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['10k', '25k', '50k', '100k+'] as ItemTier[]).map((t) => {
                  const isSelected =
                    tier === t && customPriceInput === String(TIER_DEFAULT_PRICES[t]);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleSelectTierButton(t)}
                      className={`py-2 px-2 rounded-xl font-black text-xs border transition-all flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'uhd-orange-btn text-black border-white shadow'
                          : 'bg-[#0b0d12] text-gray-200 border-white/10 hover:bg-[#171b24]'
                      }`}
                    >
                      <span>{t}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Saisir son propre prix libre en FCFA */}
            <div className="bg-[#0b0d12] p-2.5 rounded-2xl border border-[#ff6b00]/40 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-[#ff7b1c] flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Ou écrivez votre propre prix (FCFA) :</span>
                </label>
                <span className="text-[10px] font-bold text-gray-400">
                  Catégorie auto : <strong className="text-white">{tier}</strong>
                </span>
              </div>

              <div className="relative flex items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  value={customPriceInput}
                  onChange={(e) => handleCustomPriceChange(e.target.value)}
                  placeholder="Ex: 18500, 35000, 120000..."
                  className="w-full bg-[#141822] border border-white/20 rounded-xl pl-3 pr-14 py-2 text-sm font-black text-white font-mono-tabular focus:outline-none focus:border-[#ff6b00]"
                />
                <span className="absolute right-3 text-xs font-black text-amber-300 pointer-events-none">
                  FCFA
                </span>
              </div>
            </div>

            {/* Ville automatique depuis le profil (modifiable en 1 clic) */}
            <div className="bg-[#0b0d12] px-3 py-2 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>
                    Ville : <strong className="text-white">{city}</strong>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsChangingCity((prev) => !prev)}
                  className="text-[11px] font-extrabold text-[#ff7b1c] hover:underline"
                >
                  {isChangingCity ? 'Fermer' : 'Changer de ville'}
                </button>
              </div>

              {isChangingCity && (
                <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-white/10">
                  {GABON_CITIES.map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => {
                        setCity(c.name);
                        setIsChangingCity(false);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold truncate ${
                        city === c.name
                          ? 'uhd-orange-btn text-black font-black'
                          : 'bg-[#161a24] text-gray-300'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Case à cocher obligatoire : CGU, Confidentialité & Décharge (Loi Gabonaise) */}
            <LegalConsentCheckbox
              checked={acceptedTerms}
              onChange={onChangeAcceptedTerms}
              onOpenLegalSection={onOpenLegalSection}
              compact
            />

            <button
              type="submit"
              className={`w-full font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                acceptedTerms
                  ? 'uhd-orange-btn text-black active:scale-95'
                  : 'bg-[#222632] text-gray-400 border border-white/10'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                PUBLIER GRATUITEMENT (
                {parseInt(customPriceInput, 10) > 0
                  ? `${parseInt(customPriceInput, 10).toLocaleString('fr-FR')} FCFA`
                  : `${tier} FCFA`}
                )
              </span>
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};
