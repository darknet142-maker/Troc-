import React from 'react';
import { motion } from 'motion/react';
import { Check, FastForward, Flame, Gift, Rocket, Sparkles, Trophy, X } from 'lucide-react';
import { DailyStreakState } from '../types/troc';

export interface DailyStepDefinition {
  day: number;
  shortLabel: string;
  title: string;
  rewardType: 'CHECKIN' | 'TOKEN_1' | 'BOOST_1' | 'COFFRE_2_TOKENS';
  rewardBadge: string;
  tokensGranted: number;
  boostsGranted: number;
  isMilestone: boolean;
}

export const DAILY_REWARD_STEPS: DailyStepDefinition[] = [
  {
    day: 1,
    shortLabel: 'J1',
    title: 'Connexion Jour 1',
    rewardType: 'CHECKIN',
    rewardBadge: 'Présence ✓',
    tokensGranted: 0,
    boostsGranted: 0,
    isMilestone: false
  },
  {
    day: 2,
    shortLabel: 'J2',
    title: 'Connexion Jour 2',
    rewardType: 'CHECKIN',
    rewardBadge: 'Présence ✓',
    tokensGranted: 0,
    boostsGranted: 0,
    isMilestone: false
  },
  {
    day: 3,
    shortLabel: 'J3',
    title: 'Palier Fidélité J3',
    rewardType: 'TOKEN_1',
    rewardBadge: '+1 Jeton 🪙',
    tokensGranted: 1,
    boostsGranted: 0,
    isMilestone: true
  },
  {
    day: 4,
    shortLabel: 'J4',
    title: 'Connexion Jour 4',
    rewardType: 'CHECKIN',
    rewardBadge: 'Présence ✓',
    tokensGranted: 0,
    boostsGranted: 0,
    isMilestone: false
  },
  {
    day: 5,
    shortLabel: 'J5',
    title: 'Palier Vitesse J5',
    rewardType: 'BOOST_1',
    rewardBadge: '+1 Pass Boost 🚀',
    tokensGranted: 0,
    boostsGranted: 1,
    isMilestone: true
  },
  {
    day: 6,
    shortLabel: 'J6',
    title: 'Connexion Jour 6',
    rewardType: 'CHECKIN',
    rewardBadge: 'Présence ✓',
    tokensGranted: 0,
    boostsGranted: 0,
    isMilestone: false
  },
  {
    day: 7,
    shortLabel: 'J7',
    title: 'Super Coffre Assiduité',
    rewardType: 'COFFRE_2_TOKENS',
    rewardBadge: 'Coffre +2 Jetons 🏆',
    tokensGranted: 2,
    boostsGranted: 0,
    isMilestone: true
  }
];

interface DailyStreakBannerProps {
  streak: DailyStreakState;
  onOpenModal: () => void;
}

export const DailyStreakBanner: React.FC<DailyStreakBannerProps> = ({
  streak,
  onOpenModal
}) => {
  const currentStep =
    DAILY_REWARD_STEPS.find((s) => s.day === streak.currentDay) || DAILY_REWARD_STEPS[0];

  const completedDaysCount = streak.claimedToday
    ? streak.currentDay
    : Math.max(0, streak.currentDay - 1);

  return (
    <button
      type="button"
      onClick={onOpenModal}
      className="w-full text-left rounded-2xl p-3 border border-purple-500/40 bg-gradient-to-r from-[#1c102b] via-[#131622] to-[#0e1118] hover:border-purple-400/70 transition-all shadow-lg space-y-2 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff6b00] to-purple-600 flex items-center justify-center text-white shrink-0 shadow">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">
                Parcours d’Assiduité 7 Jours
              </span>
              <span className="bg-purple-500/25 border border-purple-400/40 text-purple-200 text-[10px] font-black px-1.5 py-0.2 rounded font-mono-tabular">
                Jour {streak.currentDay}/7
              </span>
            </div>
            <p className="text-[11px] text-gray-300 truncate">
              J3 : +1 Jeton • J5 : +1 Pass Boost • J7 : Coffre +2 Jetons
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black whitespace-nowrap shrink-0 ${
            !streak.claimedToday
              ? 'uhd-orange-btn text-black animate-pulse'
              : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
          }`}
        >
          {!streak.claimedToday
            ? currentStep.isMilestone
              ? 'Cadeau prêt 🎁'
              : 'Valider J' + streak.currentDay
            : 'Validé ✓'}
        </span>
      </div>

      {/* Mini barre de progression 7 jours */}
      <div className="grid grid-cols-7 gap-1 pt-0.5">
        {DAILY_REWARD_STEPS.map((step) => {
          const isDone =
            step.day < streak.currentDay ||
            (step.day === streak.currentDay && streak.claimedToday);
          const isToday = step.day === streak.currentDay && !streak.claimedToday;

          return (
            <div
              key={step.day}
              className={`h-6 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all ${
                isDone
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : isToday
                  ? 'bg-[#ff6b00]/25 border-[#ff6b00] text-white'
                  : step.isMilestone
                  ? 'bg-purple-500/15 border-purple-500/35 text-purple-200'
                  : 'bg-[#0b0d12] border-white/[0.07] text-gray-500'
              }`}
            >
              {isDone ? '✓' : step.isMilestone ? '🎁' : step.shortLabel}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span> Progression du cycle : {completedDaysCount}/7 jours validés</span>
        <span className="text-purple-300 font-bold">Voir le parcours →</span>
      </div>
    </button>
  );
};

interface DailyStreakModalProps {
  streak: DailyStreakState;
  onClaimToday: () => void;
  onSimulateNextDay: () => void;
  onClose: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  streak,
  onClaimToday,
  onSimulateNextDay,
  onClose
}) => {
  const currentStep =
    DAILY_REWARD_STEPS.find((s) => s.day === streak.currentDay) || DAILY_REWARD_STEPS[0];

  const nextMilestone =
    DAILY_REWARD_STEPS.find(
      (s) =>
        s.isMilestone &&
        (s.day > streak.currentDay || (s.day === streak.currentDay && !streak.claimedToday))
    ) || DAILY_REWARD_STEPS[2];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col justify-end p-3"
    >
      <motion.div
        initial={{ y: 40, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.96 }}
        className="bg-[#10131b] border border-purple-500/40 rounded-3xl p-4 space-y-3.5 shadow-2xl max-h-[92%] overflow-y-auto"
      >
        {/* En-tête du Parcours */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6b00] via-[#e11d48] to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">
                  RÉCOMPENSE D’ASSIDUITÉ BOO
                </span>
                {streak.cyclesCompleted > 0 && (
                  <span className="bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[9px] font-black px-1.5 py-0.2 rounded">
                    Cycle #{streak.cyclesCompleted + 1}
                  </span>
                )}
              </div>
              <h3 className="text-base font-black text-white">
                Parcours Connexion 7 Jours
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.07] text-gray-300 hover:text-white"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explication claire & directe */}
        <p className="text-xs text-gray-300 leading-relaxed">
          Connectez-vous chaque jour sur <strong className="text-white">Boo</strong> pour avancer sur le parcours et débloquer des{' '}
          <strong className="text-purple-300">Jetons</strong> et{' '}
          <strong className="text-purple-300">Pass Coupe-File gratuits</strong>.
        </p>

        {/* Grille du parcours J1 à J6 + Carte Coffre J7 pleine largeur */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {DAILY_REWARD_STEPS.slice(0, 6).map((step) => {
              const isCompleted =
                step.day < streak.currentDay ||
                (step.day === streak.currentDay && streak.claimedToday);
              const isCurrent = step.day === streak.currentDay && !streak.claimedToday;

              return (
                <div
                  key={step.day}
                  className={`rounded-2xl p-2.5 border flex flex-col justify-between min-h-[84px] transition-all relative overflow-hidden ${
                    isCompleted
                      ? 'bg-emerald-950/35 border-emerald-500/60'
                      : isCurrent
                      ? 'bg-gradient-to-br from-[#2a1505] to-[#171226] border-[#ff6b00] shadow-[0_0_18px_rgba(255,107,0,0.28)]'
                      : step.isMilestone
                      ? 'bg-gradient-to-br from-[#1f1131] to-[#12151f] border-purple-500/45'
                      : 'bg-[#0b0d13] border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded font-mono-tabular ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isCurrent
                          ? 'bg-[#ff6b00] text-black'
                          : step.isMilestone
                          ? 'bg-purple-500/25 text-purple-200'
                          : 'bg-white/[0.06] text-gray-400'
                      }`}
                    >
                      Jour {step.day}
                    </span>

                    {isCompleted ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : step.rewardType === 'TOKEN_1' ? (
                      <Gift className="w-4 h-4 text-purple-300" />
                    ) : step.rewardType === 'BOOST_1' ? (
                      <Rocket className="w-4 h-4 text-purple-300" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </div>

                  <div className="mt-2">
                    <span
                      className={`text-xs font-black block leading-tight ${
                        isCompleted
                          ? 'text-emerald-200'
                          : step.isMilestone
                          ? 'text-purple-200'
                          : 'text-white'
                      }`}
                    >
                      {step.rewardBadge}
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      {isCompleted
                        ? 'Validé ✓'
                        : isCurrent
                        ? 'Disponible'
                        : step.isMilestone
                        ? 'Cadeau'
                        : 'Étape'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* JOUR 7 : SUPER COFFRE ASSIDUITÉ (+2 JETONS GRATUITS) */}
          {(() => {
            const step7 = DAILY_REWARD_STEPS[6];
            const isCompleted =
              step7.day < streak.currentDay ||
              (step7.day === streak.currentDay && streak.claimedToday);
            const isCurrent = step7.day === streak.currentDay && !streak.claimedToday;

            return (
              <div
                className={`rounded-2xl p-3.5 border flex items-center justify-between gap-3 transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/70'
                    : isCurrent
                    ? 'bg-gradient-to-r from-[#2c1404] via-[#261138] to-[#151824] border-[#ff6b00] shadow-[0_0_24px_rgba(168,85,247,0.35)]'
                    : 'bg-gradient-to-r from-[#221134] via-[#151324] to-[#0d1017] border-purple-500/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-[#ff6b00] text-white flex items-center justify-center shrink-0 shadow-md">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        Jour 7 • Grand Coffre
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-black text-emerald-300">
                          Récupéré ✓
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-black text-white mt-0.5">
                      🎁 +2 Jetons Gratuits (Valeur 600 FCFA)
                    </h4>
                    <p className="text-[11px] text-gray-300">
                      Récompense finale pour 7 connexions régulières
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black text-purple-200 bg-purple-500/20 border border-purple-400/40 px-2.5 py-1.5 rounded-xl whitespace-nowrap font-mono-tabular shrink-0">
                  +2 🪙
                </span>
              </div>
            );
          })()}
        </div>

        {/* Résumé de l'étape actuelle */}
        <div className="bg-[#0b0d13] rounded-2xl p-3 border border-white/[0.07] flex items-center justify-between gap-2">
          <div className="text-xs text-gray-300">
            {streak.claimedToday ? (
              <span>
                ✅ Connexion du <strong className="text-white">Jour {streak.currentDay}</strong> validée. Prochain cadeau :{' '}
                <strong className="text-purple-300">
                  Jour {nextMilestone.day} ({nextMilestone.rewardBadge})
                </strong>
              </span>
            ) : currentStep.isMilestone ? (
              <span>
                🎉 Aujourd’hui c’est le <strong className="text-white">Jour {streak.currentDay}</strong> ! Récupérez votre cadeau :{' '}
                <strong className="text-purple-300">{currentStep.rewardBadge}</strong>
              </span>
            ) : (
              <span>
                🔥 Validez votre <strong className="text-white">Jour {streak.currentDay}/7</strong> pour approcher du cadeau{' '}
                <strong className="text-purple-300">
                  Jour {nextMilestone.day} ({nextMilestone.rewardBadge})
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* Bouton principal de validation du jour */}
        <div className="space-y-2 pt-0.5">
          {!streak.claimedToday ? (
            <button
              type="button"
              onClick={onClaimToday}
              className="w-full py-3.5 rounded-2xl uhd-orange-btn text-black font-black text-xs tracking-wide flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-transform"
            >
              <Gift className="w-4 h-4 stroke-[2.6]" />
              <span>
                {currentStep.isMilestone
                  ? `RÉCUPÉRER MON CADEAU (${currentStep.rewardBadge.toUpperCase()})`
                  : `VALIDER MA CONNEXION DU JOUR ${streak.currentDay}`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 font-black text-xs flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.8]" />
              <span>CONNEXION DU JOUR {streak.currentDay} VALIDÉE — CONTINUER</span>
            </button>
          )}

          {/* Bouton de test interactif (+24h) pour tester immédiatement les cadeaux J3, J5 et J7 */}
          <button
            type="button"
            onClick={onSimulateNextDay}
            className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-bold text-gray-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <FastForward className="w-3.5 h-3.5 text-purple-300" />
            <span>
              Simuler le jour suivant (+24h) pour tester le parcours 7 jours
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
