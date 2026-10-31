export interface LegalArticle {
  id: string;
  articleNumber: string;
  title: string;
  summary: string;
  paragraphs: string[];
  bullets?: string[];
}

export const MMEDIA_UNIVERSE_INFO = {
  appName: 'Boo',
  parentGroup: 'Mmedia Universe',
  jurisdiction: 'République Gabonaise (Loi gabonaise exclusivement)',
  competentCourts: 'Tribunaux compétents de Libreville, République Gabonaise',
  dataProtectionLaw:
    'Loi n°001/2011 relative à la protection des données à caractère personnel en République Gabonaise (APDPVP)',
  headquarters: 'Libreville, Province de l’Estuaire, République Gabonaise',
  versionDate: 'Octobre 2026 • Version Officielle Gabon'
};

// ============================================================================
// 1. CONDITIONS GÉNÉRALES D'UTILISATION (CGU) & DÉCHARGE DE RESPONSABILITÉ
//    RÉGIES EXCLUSIVEMENT PAR LA LOI GABONAISE
// ============================================================================
export const CGU_ARTICLES: LegalArticle[] = [
  {
    id: 'cgu-1',
    articleNumber: 'ARTICLE 1',
    title: 'Objet, Éditeur & Statut d’Hébergeur Technique Neutre',
    summary: 'Boo est une application du groupe Mmedia Universe opérant au Gabon.',
    paragraphs: [
      'L’application mobile et web « Boo » est éditée et exploitée par le groupe Mmedia Universe. Boo met à la disposition des utilisateurs résidant en République Gabonaise une plateforme technique de publication d’annonces permettant le troc (échange de biens mobiliers avec ou sans rajout financier) et l’achat direct entre particuliers.',
      'Le groupe Mmedia Universe et l’application Boo agissent exclusivement en qualité d’intermédiaire technique neutre et d’hébergeur d’annonces au sens de la législation en vigueur en République Gabonaise. À aucun moment Boo ni Mmedia Universe ne deviennent propriétaires, vendeurs, acheteurs, mandataires, courtiers, transporteurs ou dépositaires des objets publiés par les utilisateurs.'
    ]
  },
  {
    id: 'cgu-2',
    articleNumber: 'ARTICLE 2',
    title: 'Clause de Non-Responsabilité Absolue & Décharge Complète',
    summary: 'Boo et Mmedia Universe déclinent toute responsabilité sur les biens et les rencontres.',
    paragraphs: [
      'En utilisant l’application Boo, en publiant un objet ou en proposant un troc/achat, chaque utilisateur reconnaît expressément et irrévocablement que toute transaction est conclue directement et sous la seule responsabilité des utilisateurs concernés.',
      'En conséquence, le groupe Mmedia Universe, ses dirigeants, ses équipes et l’application Boo ne pourront en aucun cas être poursuivis, recherchés ou accusés, tant sur le plan civil que pénal ou commercial, au titre de :'
    ],
    bullets: [
      'L’origine, la provenance, l’absence de titre de propriété, le vol ou le recel d’un bien publié par un utilisateur ;',
      'L’état réel, l’usure, la panne, le vice caché, la contrefaçon ou l’inexactitude du pourcentage d’état déclaré (100% Neuf à <40% Dégradé) par l’annonceur ;',
      'La solvabilité, l’identité réelle, la bonne foi ou le comportement d’un utilisateur lors des échanges sur WhatsApp ou lors de la remise en main propre ;',
      'Tout litige financier relatif au prix libre fixé en FCFA, au rajout cash convenu ou au refus d’échange sur place ;',
      'Tout incident, vol, agression, perte, dommage matériel ou corporel pouvant survenir avant, pendant ou après le rendez-vous physique entre les parties.'
    ]
  },
  {
    id: 'cgu-3',
    articleNumber: 'ARTICLE 3',
    title: 'Certification de Propriété Légitime & Objets Interdits au Gabon',
    summary: 'Interdiction stricte des biens illicites selon le Code Pénal gabonais.',
    paragraphs: [
      'En cochant la case d’acceptation obligatoire avant toute publication ou proposition, l’utilisateur déclare et garantit sur l’honneur être le propriétaire plein, entier et légitime de l’objet présenté, et que ce bien est libre de tout gage, saisie ou litige.',
      'Conformément aux lois de la République Gabonaise et au Code Pénal gabonais, il est strictement interdit de publier, proposer ou échanger sur Boo les éléments suivants :'
    ],
    bullets: [
      'Tout objet volé, détourné, recelé ou acquis de manière frauduleuse ;',
      'Les armes à feu, munitions, explosifs, armes blanches et matériels de guerre ou de sécurité réglementés ;',
      'Les stupéfiants, substances psychotropes, alcool prohibé, tabac et tous médicaments ou produits pharmaceutiques ;',
      'Les espèces animales protégées, trophées, ivoire, viandes de brousse protégées et ressources forestières ou minières réglementées par le Code Forestier et le Code de l’Environnement de la République Gabonaise ;',
      'Les documents officiels d’identité, passeports, cartes de séjour, diplômes, devises falsifiées et moyens de paiement ;',
      'Tout produit contrefait ou portant atteinte aux droits de propriété intellectuelle.'
    ]
  },
  {
    id: 'cgu-4',
    articleNumber: 'ARTICLE 4',
    title: 'Règles d’Inspection sur Place & Sécurité des Rencontres',
    summary: 'Obligation de vérification physique avant validation du Code PIN.',
    paragraphs: [
      'La grille des 5 niveaux d’état (Or 100%, Vert clair 85-90%, Bleu 65-75%, Orange 40-60%, Rouge <40%) constitue une déclaration indicative fournie par le propriétaire de l’objet. Elle ne remplace jamais l’inspection physique par le co-échangiste ou l’acheteur.',
      'Pour leur propre sécurité dans les 9 capitales provinciales du Gabon (Libreville, Port-Gentil, Franceville, Oyem, Lambaréné, Mouila, Koulamoutou, Tchibanga, Makokou), les utilisateurs s’engagent impérativement à :'
    ],
    bullets: [
      'Fixer leurs rendez-vous exclusivement de jour, dans des lieux publics fréquentés, éclairés et sécurisés ;',
      'Inspecter et tester intégralement l’objet sur place (allumage, fonctionnement, absence de fissures) avant toute remise d’objet ou d’espèces ;',
      'Ne valider ou communiquer le Code PIN à 4 chiffres du Ticket Officiel Boo qu’une fois l’objet vérifié et accepté sans réserve ;',
      'Ne jamais envoyer d’argent à l’avance par Mobile Money (Airtel Money / Moov Money) à un inconnu avant d’avoir l’objet entre les mains.'
    ]
  },
  {
    id: 'cgu-5',
    articleNumber: 'ARTICLE 5',
    title: 'Fonctionnement des Prix Libres, Jetons (300 FCFA) & Pass Coupe-File',
    summary: 'Publication gratuite, 1 Jeton par accord conclu et Garantie 30 minutes.',
    paragraphs: [
      'La création d’annonce photo 1:1 et l’envoi de propositions de troc sur Boo sont gratuits. L’utilisateur est libre de sélectionner un palier indicatif (10k, 25k, 50k, 100k+ FCFA) ou d’écrire son propre prix exact en Francs CFA (FCFA).',
      'Lorsqu’un accord est accepté entre deux utilisateurs, le déblocage des coordonnées WhatsApp et du Ticket Officiel d’Échange requiert un (1) Jeton de transaction d’une valeur unitaire de 300 FCFA (ou issu d’un pack de jetons). Si le partenaire ne confirme pas dans le délai de sécurité de trente (30) minutes, le Jeton engagé est automatiquement recrédité sur le portefeuille de l’utilisateur dans Boo.',
      'Les Jetons et Pass Prioritaires « Coupe-File » (500 FCFA) sont des crédits numériques de service consomptibles au sein de l’application Boo et ne constituent ni une monnaie électronique ni un dépôt bancaire.'
    ]
  },
  {
    id: 'cgu-6',
    articleNumber: 'ARTICLE 6',
    title: 'Droit Applicable & Juridiction Compétente (Loi Gabonaise Exclusivement)',
    summary: 'Application exclusive du droit positif de la République Gabonaise.',
    paragraphs: [
      'Les présentes Conditions Générales d’Utilisation, ainsi que l’ensemble des relations entre l’utilisateur, l’application Boo et le groupe Mmedia Universe, sont régis, interprétés et soumis exclusivement à la loi de la République Gabonaise.',
      'En cas de contestation ou de différend n’ayant pu trouver une issue amiable dans un délai de trente (30) jours, compétence expresse et exclusive est attribuée aux juridictions compétentes de Libreville (République Gabonaise), nonobstant pluralité de défendeurs ou appel en garantie.'
    ]
  }
];

// ============================================================================
// 2. POLITIQUE DE CONFIDENTIALITÉ (LOI GABONAISE N°001/2011 — APDPVP)
// ============================================================================
export const PRIVACY_ARTICLES: LegalArticle[] = [
  {
    id: 'priv-1',
    articleNumber: 'CONFIDENTIALITÉ 1',
    title: 'Cadre Légal Gabonais (Loi n°001/2011 relative aux données personnelles)',
    summary: 'Protection stricte de la vie privée des utilisateurs au Gabon.',
    paragraphs: [
      'Le groupe Mmedia Universe traite les données personnelles des utilisateurs de l’application Boo dans le strict respect de la Loi n°001/2011 relative à la protection des données à caractère personnel en République Gabonaise et des directives de l’Autorité pour la Protection des Données Personnelles et de la Vie Privée (APDPVP) au Gabon.'
    ]
  },
  {
    id: 'priv-2',
    articleNumber: 'CONFIDENTIALITÉ 2',
    title: 'Données Collectées & Minimisation Stricte',
    summary: 'Seules les données indispensables au troc local sont utilisées.',
    paragraphs: [
      'Dans le cadre du fonctionnement de Boo, seules les informations strictement nécessaires à la mise en relation locale par ville sont collectées :'
    ],
    bullets: [
      'Votre nom ou pseudonyme d’utilisateur et votre ville parmi les 9 capitales provinciales du Gabon ;',
      'Votre numéro de téléphone WhatsApp (destiné exclusivement à la génération du Ticket d’Échange après accord) ;',
      'Les photographies au format 1:1 carré, titres, prix en FCFA et états d’usure des objets que vous publiez ;',
      'Votre historique de trocs, de validation de codes PIN et votre solde de Jetons / Pass Coupe-File.'
    ]
  },
  {
    id: 'priv-3',
    articleNumber: 'CONFIDENTIALITÉ 3',
    title: 'Protection de votre Numéro WhatsApp & Absence de Revente',
    summary: 'Votre numéro reste masqué tant qu’un match n’est pas débloqué.',
    paragraphs: [
      'Contrairement aux petites annonces classiques où votre téléphone est exposé publiquement au démarchage et aux spams, Boo protège votre numéro WhatsApp : il demeure confidentiel et masqué sur le Marché.',
      'Votre numéro WhatsApp n’est communiqué au co-échangiste qu’au moment où un accord mutuel est accepté et débloqué par 1 Jeton pour générer le Ticket Officiel d’Échange.',
      'Le groupe Mmedia Universe s’engage formellement à ne jamais vendre, louer ou céder vos données personnelles à des courtiers publicitaires ou à des tiers.'
    ]
  },
  {
    id: 'priv-4',
    articleNumber: 'CONFIDENTIALITÉ 4',
    title: 'Vos Droits d’Accès, de Modification et de Suppression',
    summary: 'Contrôle total depuis votre onglet Profil à tout moment.',
    paragraphs: [
      'Conformément à la Loi gabonaise n°001/2011, vous disposez à tout moment d’un droit d’accès, de rectification, de mise à jour et de suppression de vos informations personnelles et de vos objets publiés directement depuis l’onglet « Profil » de l’application Boo.'
    ]
  }
];

// ============================================================================
// 3. À PROPOS DE BOO & DU GROUPE MMEDIA UNIVERSE
// ============================================================================
export const OFFICIAL_BOO_SIGNATURE =
  '© 2026 Boo · Une initiative du Groupe Mmedia Universe. Tous droits réservés.';

export const VYBZ_APP_INFO = {
  name: 'VYBZ',
  ctaLabel: 'Découvrez VYBZ',
  category: 'Culture · Événements · Tendances',
  tagline: 'L’expérience urbaine, culturelle et événementielle au Gabon.',
  description:
    'Plongez dans l’univers VYBZ : sorties, événements, musique, lifestyle et tendances au Gabon. Une initiative signée Mmedia Universe.',
  url: 'https://vybz-app-eight.vercel.app/',
  logoUrl: '/assets/aistudio/logo_ccbb1197.jpg'
};

export interface MmediaUpcomingApp {
  id: string;
  name: string;
  category: string;
  summary: string;
  statusLabel: string;
  accentClass: string;
}

export const MMEDIA_UPCOMING_APPS: MmediaUpcomingApp[] = [
  {
    id: 'mmedia-studio',
    name: 'Mmedia Studio',
    category: 'Création & Médias',
    summary: 'Outils créatifs et diffusion de contenus digitaux nouvelle génération.',
    statusLabel: 'En développement',
    accentClass: 'text-sky-300 border-sky-400/30 bg-sky-500/10'
  },
  {
    id: 'mmedia-live',
    name: 'Mmedia Live',
    category: 'Streaming & Direct',
    summary: 'Rencontres interactives, émissions et événements en direct au Gabon.',
    statusLabel: 'En développement',
    accentClass: 'text-purple-300 border-purple-400/30 bg-purple-500/10'
  },
  {
    id: 'mmedia-move',
    name: 'Mmedia Move',
    category: 'Mobilité & Services',
    summary: 'Solutions pratiques de déplacement et de logistique urbaine rapide.',
    statusLabel: 'En développement',
    accentClass: 'text-emerald-300 border-emerald-400/30 bg-emerald-500/10'
  },
  {
    id: 'mmedia-campus',
    name: 'Mmedia Campus',
    category: 'Talents & Savoir',
    summary: 'Communauté d’apprentissage, d’opportunités et d’innovation digitale.',
    statusLabel: 'En développement',
    accentClass: 'text-orange-300 border-orange-400/30 bg-orange-500/10'
  }
];

export const ABOUT_SECTIONS = {
  headline: 'Boo — Une initiative du Groupe Mmedia Universe',
  mission:
    'Conçue spécifiquement pour les réalités du terrain en République Gabonaise, Boo est la première bourse mobile de troc et d’achat instantané pilotable à un seul pouce, alliant simplicité absolue en 3 clics et transparence totale sur l’état des objets.',
  pillars: [
    {
      title: 'Une initiative du Groupe Mmedia Universe',
      description:
        'Boo est développée et éditée par Mmedia Universe, groupe technologique et média engagé dans la création d’applications mobiles ultra-rapides, intuitives et adaptées aux usages quotidiens au Gabon.'
    },
    {
      title: 'Couverture Nationale (9 Provinces du Gabon)',
      description:
        'Boo connecte les utilisateurs ville par ville à Libreville, Port-Gentil, Franceville, Oyem, Lambaréné, Mouila, Koulamoutou, Tchibanga et Makokou, sans calcul de distance complexe.'
    },
    {
      title: 'Transparence Terrain & Économie Circulaire',
      description:
        'Grâce à la grille stricte des 5 pastilles de couleur (100% Or à <40% Rouge), au zoom UHD 4x et au prix libre ou par palier en FCFA, chacun sait exactement ce qu’il échange avant même de se déplacer.'
    }
  ]
};
