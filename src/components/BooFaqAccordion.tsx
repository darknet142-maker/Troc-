import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Zap,
  Camera,
  ZoomIn,
  ShieldCheck,
  Rocket,
  MessageCircle,
  Sparkles,
  Search,
  X,
  Scale,
  Banknote,
  MapPin,
  Lock
} from 'lucide-react';
import { CONDITION_GRADES } from '../data/initialData';

type FaqCategoryId = 'all' | 'basics' | 'states' | 'trade' | 'tokens';

interface FaqItem {
  id: string;
  category: Exclude<FaqCategoryId, 'all'>;
  badge: string;
  question: string;
  summary: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const FAQ_CATEGORIES: { id: FaqCategoryId; label: string }[] = [
  { id: 'all', label: 'Tout (16)' },
  { id: 'basics', label: 'Bases (3)' },
  { id: 'states', label: '5 États (4)' },
  { id: 'trade', label: 'Troc & Prix (4)' },
  { id: 'tokens', label: 'Jetons & Sécurité (5)' }
];

export const BooFaqAccordion: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-4']);
  const [selectedCategory, setSelectedCategory] = useState<FaqCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const faqItems: FaqItem[] = useMemo(
    () => [
      // ==================== CATÉGORIE 1 : BASES (3) ====================
      {
        id: 'faq-1',
        category: 'basics',
        badge: '01 • PRINCIPE BOO',
        question: 'Qu’est-ce que Boo et comment ça marche en 3 secondes ?',
        summary: 'La bourse mobile de troc et d’achat direct au Gabon (Mmedia Universe).',
        icon: <Zap className="w-4 h-4 text-[#ff6b00]" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              <strong className="text-white">Boo</strong> (éditée par le groupe{' '}
              <strong className="text-[#ff7b1c]">Mmedia Universe</strong>) est l’application de
              troc et d’achat direct conçue pour échanger vos objets au Gabon sans perdre de temps
              dans d’interminables négociations.
            </p>
            <div className="bg-[#0b0d12] p-2.5 rounded-xl border border-white/10 space-y-1">
              <p>
                • <strong className="text-white">Publication gratuite :</strong> Vous publiez vos
                objets en 3 clics au format photo carré 1:1.
              </p>
              <p>
                • <strong className="text-white">Proposition directe :</strong> Vous cliquez sur{' '}
                <strong className="text-[#ff7b1c]">Troquer</strong> sur un article qui vous plaît,
                vous sélectionnez votre objet et ajoutez éventuellement un rajout cash.
              </p>
              <p>
                • <strong className="text-white">Conclusion :</strong> Dès que l’accord est mutuel,{' '}
                <strong className="text-purple-300">1 Jeton (300 FCFA)</strong> débloque le numéro
                WhatsApp et le Ticket Officiel avec Code PIN.
              </p>
            </div>
          </div>
        )
      },
      {
        id: 'faq-2',
        category: 'basics',
        badge: '02 • 9 VILLES DU GABON',
        question: 'Comment filtrer les annonces parmi les 9 villes du Gabon ?',
        summary: 'Zéro calcul de kilomètres : filtrage direct par capitale provinciale.',
        icon: <MapPin className="w-4 h-4 text-[#ff6b00]" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Sur <strong className="text-white">Boo</strong>, il n’y a pas de calcul de distance
              en kilomètres inutile. Toutes les annonces sont classées par{' '}
              <strong className="text-white">Ville</strong> et par{' '}
              <strong className="text-white">Quartier</strong>.
            </p>
            <p>
              Cliquez sur le bouton <strong className="text-[#ff7b1c]">📍 Villes</strong> situé sur
              la ligne des filtres en haut du Marché pour choisir l’une des 9 capitales
              provinciales :{' '}
              <em className="text-white">
                Libreville, Port-Gentil, Franceville, Oyem, Lambaréné, Mouila, Koulamoutou,
                Tchibanga ou Makokou
              </em>
              .
            </p>
          </div>
        )
      },
      {
        id: 'faq-3',
        category: 'basics',
        badge: '03 • MES ANNONCES',
        question: 'Pourquoi je ne peux pas cliquer sur « Troquer » sur ma propre annonce ?',
        summary: 'Vos publications affichent « Mon annonce » et le bouton « Retirer ».',
        icon: <Lock className="w-4 h-4 text-[#ff6b00]" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Il est logiquement impossible de troquer ou d’acheter son propre produit. Lorsque
              vous publiez une annonce sur <strong className="text-white">Boo</strong>, elle est
              automatiquement identifiée comme la vôtre.
            </p>
            <p>
              Sur le fil du Marché comme dans l’Inspecteur UHD, les boutons{' '}
              <strong className="text-white">Troquer</strong> et{' '}
              <strong className="text-white">Cash</strong> sont remplacés par le badge{' '}
              <strong className="text-white">Mon annonce</strong> et le bouton{' '}
              <strong className="text-red-400">Retirer</strong>, vous permettant de supprimer votre
              publication en un clic dès qu’elle n’est plus disponible.
            </p>
          </div>
        )
      },

      // ==================== CATÉGORIE 2 : 5 ÉTATS & COULEURS (4) ====================
      {
        id: 'faq-4',
        category: 'states',
        badge: '04 • CODES COULEURS OFFICIELS',
        question: 'Que signifient exactement les 5 pastilles de couleur et leurs pourcentages ?',
        summary: 'Or 100%, Vert clair 85-90%, Bleu 65-75%, Orange 40-60%, Rouge <40%.',
        icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        content: (
          <div className="space-y-2.5 text-xs text-gray-200 leading-relaxed">
            <p>
              Pour éviter toute mauvaise surprise lors de la rencontre,{' '}
              <strong className="text-white">Boo</strong> impose une grille d’état stricte à 5
              couleurs uniques. Chaque couleur est réservée exclusivement à un niveau d’état :
            </p>
            <div className="space-y-2">
              {CONDITION_GRADES.map((g) => (
                <div
                  key={g.id}
                  className={`p-2.5 rounded-xl border ${g.badgeBg} ${g.badgeBorder} space-y-1`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow"
                        style={{ backgroundColor: g.hexColor }}
                      />
                      <span className={`text-xs font-black uppercase ${g.badgeText}`}>
                        {g.rank}. {g.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-black font-mono-tabular px-2 py-0.5 rounded-md bg-black/40 ${g.badgeText}`}
                    >
                      {g.rangeLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-100 leading-relaxed">
                    {g.realityDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: 'faq-5',
        category: 'states',
        badge: '05 • LECTURE VISUELLE',
        question: 'Pourquoi n’y a-t-il aucun texte à côté du pourcentage sur le Marché ?',
        summary: 'Pastille colorée + % uniquement pour ne jamais saturer les photos 1:1.',
        icon: <Sparkles className="w-4 h-4 text-[#ff6b00]" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Sur la grille du Marché, l’objectif est de laisser respirer les photos carrées 1:1.
              La couleur de la pastille et le pourcentage (ex.{' '}
              <strong className="text-white">🟢 88%</strong>) suffisent à connaître l’état en un
              coup d’œil.
            </p>
            <p>
              Dès que vous cliquez sur la carte pour ouvrir l’
              <strong className="text-white">Inspecteur UHD</strong>, vous retrouvez l’intitulé
              complet, la jauge visuelle et la description détaillée de l’état.
            </p>
          </div>
        )
      },
      {
        id: 'faq-6',
        category: 'states',
        badge: '06 • LOUPE UHD 4X',
        question: 'Comment inspecter les défauts d’un objet avec le Zoom UHD 4x ?',
        summary: 'Fonctionne sur le Marché ET sur le produit de l’autre dans les Matchs.',
        icon: <ZoomIn className="w-4 h-4 text-[#ff6b00]" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Touchez n’importe quelle photo du Marché — ou touchez la photo du produit adverse
              dans l’onglet <strong className="text-white">Matchs</strong> /{' '}
              <strong className="text-white">Plein écran</strong> — pour ouvrir l’Inspecteur UHD.
            </p>
            <p>
              Utilisez les boutons <strong className="text-white">1x, 2x, 3x, 4x</strong> et
              glissez votre doigt sur l’image pour inspecter les coins, l’écran ou les coutures
              avant d’accepter l’offre.
            </p>
          </div>
        )
      },
      {
        id: 'faq-7',
        category: 'states',
        badge: '07 • VÉRIFICATION SUR PLACE',
        question: 'Que faire si l’état réel sur place ne correspond pas au pourcentage annoncé ?',
        summary: 'Ne validez jamais le Code PIN si l’objet ne correspond pas.',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Le Ticket Officiel WhatsApp généré par <strong className="text-white">Boo</strong>{' '}
              rappelle noir sur blanc le pourcentage d’état déclaré par chaque partie.
            </p>
            <p>
              Lors de la rencontre physique, inspectez et testez l’objet. S’il présente un défaut
              caché non conforme à son état annoncé,{' '}
              <strong className="text-white">ne validez pas le Code PIN à 4 chiffres</strong> et
              refusez la remise sur place.
            </p>
          </div>
        )
      },

      // ==================== CATÉGORIE 3 : TROC & PRIX (4) ====================
      {
        id: 'faq-8',
        category: 'trade',
        badge: '08 • PUBLICATION 3 CLICS',
        question: 'Comment publier un objet gratuitement en 3 clics ?',
        summary: 'Étape 1 : Photo & Nom → Étape 2 : État → Étape 3 : Prix & Publier.',
        icon: <Camera className="w-4 h-4 text-[#ff6b00]" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Appuyez sur le bouton central <strong className="text-[#ff7b1c]">📷 Caméra</strong> en
              bas de l’écran :
            </p>
            <div className="bg-[#0b0d12] p-2.5 rounded-xl border border-white/10 space-y-1">
              <p>
                <strong className="text-[#ff7b1c]">1. Photo & Nom :</strong> Prenez ou importez une
                photo (cadrée automatiquement en carré 1:1) et tapez le nom de l’objet.
              </p>
              <p>
                <strong className="text-[#ff7b1c]">2. État en 1 clic :</strong> Touchez l’un des 5
                états (vous passez automatiquement à l’étape 3).
              </p>
              <p>
                <strong className="text-[#ff7b1c]">3. Prix & Publication :</strong> Choisissez un
                palier ou écrivez votre prix exact en FCFA, cochez la case CGU et publiez !
              </p>
            </div>
          </div>
        )
      },
      {
        id: 'faq-9',
        category: 'trade',
        badge: '09 • PRIX LIBRE EN FCFA',
        question: 'Puis-je écrire mon propre prix en FCFA au lieu d’un palier (10k, 25k, 50k, 100k+) ?',
        summary: 'Oui : saisissez votre prix exact en FCFA à l’étape 3 de publication.',
        icon: <Banknote className="w-4 h-4 text-emerald-400" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Absolument ! À l’étape 3 de publication, vous avez deux possibilités :
            </p>
            <p>
              • Cliquer sur un palier rapide (<strong className="text-white">10k, 25k, 50k, 100k+</strong>),
              <br />• Ou <strong className="text-white">écrire votre propre prix exact en FCFA</strong>{' '}
              dans le champ prévu (ex. <code className="text-emerald-300">18 500 FCFA</code>,{' '}
              <code className="text-emerald-300">37 000 FCFA</code>,{' '}
              <code className="text-emerald-300">145 000 FCFA</code>).
            </p>
            <p>
              <strong className="text-white">Boo</strong> affiche alors votre prix exact sur la
              carte du Marché tout en rattachant automatiquement votre annonce au filtre de palier
              correspondant.
            </p>
          </div>
        )
      },
      {
        id: 'faq-10',
        category: 'trade',
        badge: '10 • PROPOSER UN TROC',
        question: 'Comment proposer un de mes objets en troc et ajouter un rajout cash ?',
        summary: 'Sélectionnez « Mon objet » et ajoutez +2k, +5k ou +10k FCFA si besoin.',
        icon: <Zap className="w-4 h-4 text-[#ff6b00]" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Sur n’importe quelle annonce d’un autre utilisateur, appuyez sur{' '}
              <strong className="text-[#ff7b1c]">Troquer</strong>. Un tiroir rapide s’ouvre :
            </p>
            <p>
              1. Sous <strong className="text-white">Mon objet</strong>, touchez l’objet de votre
              inventaire que vous souhaitez proposer (ou cliquez sur{' '}
              <strong className="text-[#ff7b1c]">+ Ajouter</strong> pour en publier un nouveau).
              <br />
              2. Sous <strong className="text-white">Rajout cash</strong>, choisissez{' '}
              <strong className="text-white">Aucun</strong> ou ajoutez{' '}
              <strong className="text-white">+2k, +5k ou +10k FCFA</strong> pour équilibrer
              l’échange.
              <br />
              3. Appuyez sur <strong className="text-[#ff7b1c]">Envoyer</strong>.
            </p>
          </div>
        )
      },
      {
        id: 'faq-11',
        category: 'trade',
        badge: '11 • ACHAT CASH & PARTAGE',
        question: 'Comment fonctionnent l’achat direct en Cash (💵) et le bouton Partager ?',
        summary: 'Achetez sans troquer ou partagez une annonce sur WhatsApp, X, TikTok.',
        icon: <Banknote className="w-4 h-4 text-emerald-400" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              • <strong className="text-emerald-400">Bouton 💵 (Achat Cash) :</strong> Si vous n’avez
              rien à troquer mais voulez acheter l’article au prix affiché en FCFA, cliquez sur{' '}
              <strong className="text-white">💵</strong> pour réserver l’objet pendant 12h auprès du
              vendeur.
            </p>
            <p>
              • <strong className="text-[#ff7b1c]">Bouton Partager :</strong> Dans l’Inspecteur UHD,
              le bouton <strong className="text-white">Partager</strong> permet d’envoyer l’annonce
              sur WhatsApp, X (Twitter), Instagram ou TikTok en un clic.
            </p>
          </div>
        )
      },

      // ==================== CATÉGORIE 4 : JETONS & SÉCURITÉ (5) ====================
      {
        id: 'faq-12',
        category: 'tokens',
        badge: '12 • 1 JETON = 1 ACCORD',
        question: 'Pourquoi la publication est gratuite mais la conclusion demande 1 Jeton (300 FCFA) ?',
        summary: 'Vous ne consommez 1 Jeton que lorsqu’un accord réel est prêt à être conclu.',
        icon: <Lock className="w-4 h-4 text-purple-400" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Sur <strong className="text-white">Boo</strong>, publier vos objets et envoyer des
              propositions est <strong className="text-emerald-400">100 % gratuit</strong>.
            </p>
            <p>
              Un <strong className="text-purple-300">Jeton (300 FCFA)</strong> n’est requis dans
              l’onglet <strong className="text-white">Matchs</strong> que lorsqu’un accord est
              accepté et que vous souhaitez débloquer le numéro WhatsApp du partenaire ainsi que le
              Ticket Officiel d’Échange. Vous pouvez recharger vos Jetons à l’unité ou en pack via{' '}
              <strong className="text-white">Airtel Money</strong> et{' '}
              <strong className="text-white">Moov Money</strong> dans l’onglet{' '}
              <strong className="text-white">Boutique</strong>.
            </p>
          </div>
        )
      },
      {
        id: 'faq-13',
        category: 'tokens',
        badge: '13 • GARANTIE 30 MINUTES',
        question: 'Comment fonctionne la Garantie Anti-Blocage de 30 minutes ?',
        summary: 'Si le partenaire ne valide pas sous 30 min, votre Jeton est recrédité.',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Votre Jeton ne peut jamais être perdu à cause d’un partenaire fantôme :
            </p>
            <p>
              Dès qu’un match est accepté, un compte à rebours de{' '}
              <strong className="text-white">30 minutes</strong> démarre. Si l’autre personne ne
              finalise pas dans les 30 minutes, la transaction expire automatiquement, votre objet
              est remis en ligne sur le Marché et{' '}
              <strong className="text-emerald-400">
                +1 Jeton est immédiatement recrédité sur votre solde
              </strong>
              .
            </p>
          </div>
        )
      },
      {
        id: 'faq-14',
        category: 'tokens',
        badge: '14 • PASS COUPE-FILE (500F)',
        question: 'À quoi sert le Pass Prioritaire « Coupe-File » (500 FCFA) ?',
        summary: 'Épingle votre proposition tout en haut de la liste du vendeur.',
        icon: <Rocket className="w-4 h-4 text-purple-400" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Les meilleures annonces reçoivent souvent plusieurs propositions en même temps.
            </p>
            <p>
              Après avoir envoyé votre offre, appuyez sur le bouton{' '}
              <strong className="text-purple-300">🚀 Coupe-File (500 FCFA)</strong> : votre
              proposition passe devant toutes les autres avec la mention{' '}
              <strong className="text-white">🚀 PRIORITAIRE</strong> chez le vendeur.
            </p>
          </div>
        )
      },
      {
        id: 'faq-15',
        category: 'tokens',
        badge: '15 • TICKET WHATSAPP & CODE PIN',
        question: 'Comment fonctionnent le Ticket Officiel WhatsApp et le Code PIN à 4 chiffres ?',
        summary: 'Contrat récapitulatif WhatsApp + validation PIN à la remise en main propre.',
        icon: <MessageCircle className="w-4 h-4 text-emerald-400" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              Une fois le match débloqué, <strong className="text-white">Boo</strong> génère le{' '}
              <strong className="text-emerald-400">Ticket Officiel d’Échange</strong> contenant :
              les 2 objets, leurs états certifiés en %, le rajout cash éventuel, la ville/quartier
              et un <strong className="text-white">Code PIN unique à 4 chiffres</strong>.
            </p>
            <p>
              Lors de la rencontre, après avoir vérifié l’objet, validez le Code PIN dans le Ticket
              pour enregistrer l’échange réussi et augmenter votre score de fiabilité.
            </p>
          </div>
        )
      },
      {
        id: 'faq-16',
        category: 'tokens',
        badge: '16 • SÉCURITÉ & LOI GABONAISE',
        question: 'Quelles sont les règles de sécurité et le cadre légal (Mmedia Universe) ?',
        summary: 'Rencontres en lieu public de jour et application exclusive de la loi gabonaise.',
        icon: <Scale className="w-4 h-4 text-emerald-400" />,
        content: (
          <div className="space-y-2 text-xs text-gray-200 leading-relaxed">
            <p>
              <strong className="text-white">Boo</strong> est une application du groupe{' '}
              <strong className="text-[#ff7b1c]">Mmedia Universe</strong>, soumise{' '}
              <strong className="text-white">exclusivement à la loi gabonaise</strong>.
            </p>
            <div className="bg-[#0b0d12] p-2.5 rounded-xl border border-white/10 space-y-1">
              <p>• Effectuez toujours vos remises de jour dans un lieu public fréquenté.</p>
              <p>
                • N’envoyez jamais d’argent par Airtel Money ou Moov Money à un vendeur avant
                d’avoir vu et testé l’objet en personne.
              </p>
              <p>
                • Consultez l’onglet <strong className="text-white">Profil → Légal</strong> pour
                lire l’intégralité des CGU, de la Politique de Confidentialité (Loi n°001/2011) et
                de la section À Propos.
              </p>
            </div>
          </div>
        )
      }
    ],
    []
  );

  const filteredFaqItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q)
      );
    });
  }, [faqItems, selectedCategory, searchQuery]);

  const allExpanded =
    filteredFaqItems.length > 0 &&
    filteredFaqItems.every((item) => openIds.includes(item.id));

  const toggleAll = () => {
    if (allExpanded) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredFaqItems.map((i) => i.id));
    }
  };

  return (
    <div className="space-y-3">
      {/* En-tête de la Foire Aux Questions (16 questions) */}
      <div className="bg-gradient-to-br from-[#231509] via-[#121620] to-[#0b0d12] border border-[#ff6b00]/40 rounded-2xl p-3.5 space-y-2.5 shadow-xl">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ff6b00] block">
              GUIDE COMPLET & TUTORIEL BOO (16 RUBRIQUES)
            </span>
            <h3 className="text-sm font-black text-white">
              Foire Aux Questions Interactive
            </h3>
          </div>
          <button
            type="button"
            onClick={toggleAll}
            className="uhd-surface px-2.5 py-1.5 rounded-xl border border-white/15 text-[11px] font-extrabold text-[#ff7b1c] hover:text-white active:scale-95 transition-all shrink-0"
          >
            {allExpanded ? 'Tout replier' : 'Tout déplier'}
          </button>
        </div>

        {/* Barre de recherche rapide dans la FAQ */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher : couleur, jeton, prix, PIN, ville..."
            className="w-full bg-[#0b0d12] border border-white/15 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ff6b00]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtres par catégorie */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'uhd-orange-btn text-black font-black'
                    : 'bg-[#0b0d12] text-gray-300 border border-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Liste des questions pliables et dépliables */}
      {filteredFaqItems.length === 0 ? (
        <div className="uhd-card rounded-2xl p-6 text-center space-y-2 border border-white/10">
          <p className="text-xs font-bold text-gray-300">
            Aucune question ne correspond à « {searchQuery} ».
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="uhd-orange-btn text-black font-black text-xs px-3 py-1.5 rounded-xl"
          >
            Afficher les 16 questions
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFaqItems.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-[#121620] border-[#ff6b00]/60 shadow-lg'
                    : 'uhd-card border-white/[0.08] hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7b1c] block">
                        {item.badge}
                      </span>
                      <h4 className="text-xs font-black text-white leading-snug">
                        {item.question}
                      </h4>
                      {!isOpen && (
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          {item.summary}
                        </p>
                      )}
                    </div>
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
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-white/[0.07]">
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
