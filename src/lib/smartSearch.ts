import { inferItemCategory, ItemCategory, MarketItem } from '../types/troc';

export interface WordFamilyCluster {
  id: string;
  label: string;
  category: ItemCategory;
  sampleTerms: string[];
  terms: string[];
}

// ============================================================================
// DICTIONNAIRE SÉMANTIQUE PROFOND : FAMILLES DE MOTS & SYNONYMES (GABON)
// ============================================================================
export const WORD_FAMILY_CLUSTERS: WordFamilyCluster[] = [
  {
    id: 'screens_tv_monitors',
    label: 'Écrans, Moniteurs & Télévisions',
    category: 'Tech & Audio',
    sampleTerms: ['Écran', 'Moniteur', 'TV', 'Télévision', 'Pouces'],
    terms: [
      'ecran',
      'ecrans',
      'moniteur',
      'moniteurs',
      'pouce',
      'pouces',
      'tv',
      'television',
      'televisions',
      'tele',
      'teles',
      'televiseur',
      'televiseurs',
      'dalle',
      'display',
      'full hd',
      'fullhd',
      'uhd',
      '4k',
      'hdmi',
      'plasma',
      'lcd',
      'oled',
      'qled',
      '24 pouces',
      '27 pouces',
      '32 pouces',
      '55 pouces',
      '27"'
    ]
  },
  {
    id: 'phones_tablets',
    label: 'Téléphones, Smartphones & Tablettes',
    category: 'Téléphones',
    sampleTerms: ['Téléphone', 'Smartphone', 'iPhone', 'Samsung', 'Tablette'],
    terms: [
      'telephone',
      'telephones',
      'tel',
      'portable',
      'portables',
      'smartphone',
      'smartphones',
      'cellulaire',
      'gsm',
      'mobile',
      'iphone',
      'iphones',
      'apple',
      'ios',
      'pro max',
      'samsung',
      'galaxy',
      'android',
      'tecno',
      'infinix',
      'itel',
      'xiaomi',
      'redmi',
      'huawei',
      'oppo',
      'realme',
      'tablette',
      'tablettes',
      'ipad',
      'wacom',
      'graphique',
      'stylet',
      '128go',
      '256go'
    ]
  },
  {
    id: 'audio_sound_mics',
    label: 'Audio, Enceintes, Baffles, Casques & Micros',
    category: 'Tech & Audio',
    sampleTerms: ['Enceinte', 'Baffle', 'Casque', 'Micro', 'Bluetooth'],
    terms: [
      'audio',
      'son',
      'sono',
      'enceinte',
      'enceintes',
      'baffle',
      'baffles',
      'haut parleur',
      'hautparleur',
      'speaker',
      'speakers',
      'jbl',
      'flip',
      'bose',
      'bluetooth',
      'sans fil',
      'casque',
      'casques',
      'ecouteur',
      'ecouteurs',
      'airpods',
      'airpod',
      'oreillette',
      'oreillettes',
      'micro',
      'micros',
      'microphone',
      'cravate',
      'studio',
      'musique',
      'mp3'
    ]
  },
  {
    id: 'gaming_consoles',
    label: 'Gaming, Consoles, PlayStation & Manettes',
    category: 'Gaming',
    sampleTerms: ['PS4', 'PS5', 'PlayStation', 'Console', 'Manette', 'Jeux'],
    terms: [
      'gaming',
      'gamer',
      'jeu',
      'jeux',
      'video',
      'console',
      'consoles',
      'playstation',
      'ps4',
      'ps5',
      'ps3',
      'ps',
      'slim',
      'sony',
      'manette',
      'manettes',
      'dualsense',
      'dualshock',
      'pad',
      'joystick',
      'xbox',
      'nintendo',
      'switch',
      'fifa',
      'fc24',
      'fc25',
      'pes',
      'gta',
      'call of duty'
    ]
  },
  {
    id: 'home_appliances',
    label: 'Maison, Cuisine & Électroménager',
    category: 'Maison',
    sampleTerms: ['Micro-ondes', 'Four', 'Blender', 'Machine à café', 'Frigo'],
    terms: [
      'maison',
      'cuisine',
      'electromenager',
      'electro',
      'four',
      'fours',
      'micro onde',
      'micro ondes',
      'microonde',
      'microondes',
      'chauffe',
      'blender',
      'mixeur',
      'robot',
      'mixeurs',
      'machine',
      'cafe',
      'expresso',
      'cafetiere',
      'nespresso',
      'frigo',
      'refrigerateur',
      'congelateur',
      'clim',
      'climatiseur',
      'split',
      'ventilateur',
      'brasseur',
      'fer a repasser',
      'gaziniere',
      'cuisiniere',
      'bouilloire'
    ]
  },
  {
    id: 'fashion_shoes_watches_bags',
    label: 'Mode, Chaussures, Sacs & Montres',
    category: 'Mode',
    sampleTerms: ['Sneakers', 'Chaussures', 'Montre', 'Sac à dos', 'Nike'],
    terms: [
      'mode',
      'chaussure',
      'chaussures',
      'basket',
      'baskets',
      'sneaker',
      'sneakers',
      'tennis',
      'soulier',
      'nike',
      'air max',
      'airmax',
      'jordan',
      'adidas',
      'puma',
      'pointure',
      'taille',
      't43',
      'sac',
      'sacs',
      'sac a dos',
      'sacoche',
      'bagage',
      'valise',
      'impermeable',
      'montre',
      'montres',
      'smartwatch',
      'connectee',
      'chronographe',
      'bracelet',
      'bijou',
      'bijoux',
      'acier',
      'vetement',
      'habit',
      'veste',
      'chemise'
    ]
  },
  {
    id: 'photo_video_lighting',
    label: 'Photo, Vidéo, Ring Light & Créateurs',
    category: 'Tech & Audio',
    sampleTerms: ['Ring Light', 'Trépied', 'LED', 'Caméra', 'Appareil Photo'],
    terms: [
      'photo',
      'photos',
      'camera',
      'cameras',
      'appareil',
      'objectif',
      'canon',
      'nikon',
      'ring light',
      'ringlight',
      'lumiere',
      'eclairage',
      'lampe',
      'led',
      'trepied',
      'pied',
      'support',
      'stabilisateur',
      'gimbal',
      'tiktok',
      'youtube',
      'vlog',
      'film',
      'tournage'
    ]
  },
  {
    id: 'computers_peripherals',
    label: 'Informatique, Ordinateurs & Claviers',
    category: 'Tech & Audio',
    sampleTerms: ['Clavier', 'Ordinateur', 'PC', 'MacBook', 'Souris'],
    terms: [
      'informatique',
      'pc',
      'ordinateur',
      'ordinateurs',
      'laptop',
      'macbook',
      'hp',
      'dell',
      'lenovo',
      'asus',
      'clavier',
      'claviers',
      'mecanique',
      'rgb',
      'souris',
      'bureautique',
      'disque',
      'ssd',
      'cle usb',
      'routeur',
      'wifi'
    ]
  }
];

// ============================================================================
// COUCHE 1 : NORMALISATION LINGUISTIQUE & SUPPRESSION DES ACCENTS
// ============================================================================
export function normalizeText(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime tous les accents (é, è, ê, à, ô...)
    .replace(/(\d+)\s*["”″]/g, '$1 pouce ') // Convertit 27" en 27 pouce
    .replace(/[-_/'’.,;:!?()[\]]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// COUCHE 2 : RACINISATION SINGULIER / PLURIEL & SQUELETTE PHONÉTIQUE
// ============================================================================
export function stemWord(word: string): string {
  const clean = normalizeText(word);
  if (clean.length <= 2) return clean;

  // Réduit les lettres triplées ou doublées par erreur de frappe (ex: telle -> tele, ecraan -> ecran)
  let deduped = clean.replace(/([a-z])\1{2,}/g, '$1');

  // Pluriels français courants (s, x, aux -> al)
  if (deduped.endsWith('aux') && deduped.length > 4) {
    deduped = deduped.slice(0, -3) + 'al';
  } else if (
    (deduped.endsWith('s') || deduped.endsWith('x')) &&
    !['ps', 'ios', 'airpods'].includes(deduped)
  ) {
    deduped = deduped.slice(0, -1);
  }

  return deduped;
}

export function phoneticKey(word: string): string {
  const s = stemWord(word);
  return s
    .replace(/ph/g, 'f')
    .replace(/qu/g, 'k')
    .replace(/c([aou])/g, 'k$1')
    .replace(/c([ei])/g, 's$1')
    .replace(/k/g, 'c')
    .replace(/y/g, 'i')
    .replace(/w/g, 'v')
    .replace(/([a-z])\1+/g, '$1');
}

// ============================================================================
// COUCHE 3 : DISTANCE DE LEVENSHTEIN (TOLÉRANCE AUX FAUTES DE FRAPPE)
// ============================================================================
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Insertion
        matrix[i][j - 1] + 1, // Suppression
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

export function isFuzzyWordMatch(queryToken: string, targetToken: string): boolean {
  const q = stemWord(queryToken);
  const t = stemWord(targetToken);
  if (!q || !t) return false;
  if (q === t) return true;

  // Correspondance par préfixe ou sous-chaîne directe (ex: "tele" dans "television", "monit" dans "moniteur")
  if (q.length >= 2 && (t.startsWith(q) || q.startsWith(t))) {
    if (Math.abs(q.length - t.length) <= 4 || q.length >= 3) return true;
  }
  if (q.length >= 3 && t.includes(q)) return true;

  // Correspondance phonétique (ex: "ifone" == "iphone", "ekran" == "ecran", "bafle" == "baffle")
  const pq = phoneticKey(q);
  const pt = phoneticKey(t);
  if (pq.length >= 3 && (pq === pt || pt.startsWith(pq))) return true;

  // Tolérance aux fautes de frappe par distance d'édition
  if (q.length >= 4 && t.length >= 4) {
    const maxDist = q.length >= 7 ? 2 : 1;
    if (levenshteinDistance(q, t) <= maxDist) return true;
    if (levenshteinDistance(pq, pt) <= 1) return true;
  }

  return false;
}

// ============================================================================
// COUCHE 4 : DÉTECTION DES FAMILLES DE MOTS & EXPANSION SÉMANTIQUE
// ============================================================================
export function detectMatchedFamilies(rawQuery: string): WordFamilyCluster[] {
  const norm = normalizeText(rawQuery);
  if (!norm) return [];

  const queryTokens = norm.split(' ').filter((tok) => tok.length >= 2);
  if (queryTokens.length === 0) return [];

  const matchedClusters: WordFamilyCluster[] = [];

  for (const cluster of WORD_FAMILY_CLUSTERS) {
    let clusterMatched = false;

    for (const term of cluster.terms) {
      const normTerm = normalizeText(term);
      // Correspondance d'expression multi-mots (ex: "ring light", "micro onde", "air max")
      if (normTerm.includes(' ') && (norm.includes(normTerm) || normTerm.includes(norm))) {
        clusterMatched = true;
        break;
      }

      const termTokens = normTerm.split(' ');
      for (const qTok of queryTokens) {
        for (const tTok of termTokens) {
          if (isFuzzyWordMatch(qTok, tTok)) {
            clusterMatched = true;
            break;
          }
        }
        if (clusterMatched) break;
      }
      if (clusterMatched) break;
    }

    if (clusterMatched) {
      matchedClusters.push(cluster);
    }
  }

  return matchedClusters;
}

// ============================================================================
// ÉVALUATION INTELLIGENTE D'UNE ANNONCE PAR RAPPORT À LA RECHERCHE
// ============================================================================
export function matchesSmartSearch(item: MarketItem, rawQuery: string): boolean {
  const normQuery = normalizeText(rawQuery);
  if (!normQuery) return true;

  const itemCategory = inferItemCategory(item.title, item.category);
  // Texte complet indexé de l'annonce (incluant conversion implicite 27" -> 27 pouce)
  const itemSearchableText = normalizeText(
    `${item.title} ${item.city} ${item.quartier} ${itemCategory} ${item.tier}`
  );
  const itemTokens = itemSearchableText.split(' ').filter(Boolean);

  // 1. Correspondance directe ou floue sur les mots de l'annonce
  const queryTokens = normQuery.split(' ').filter(Boolean);
  const directMatch = queryTokens.every((qTok) =>
    itemTokens.some((iTok) => isFuzzyWordMatch(qTok, iTok))
  );
  if (directMatch) return true;

  // 2. Correspondance par Familles de Mots & Synonymes
  // Exemple : l'utilisateur tape "télé", "télévision", "tv", "pouce", "ecrans", "moniteurs"
  // -> Reconnaît la famille "screens_tv_monitors" et trouve "Écran Moniteur 27\" Full HD" !
  const queryFamilies = detectMatchedFamilies(rawQuery);
  if (queryFamilies.length > 0) {
    const itemFamilies = detectMatchedFamilies(`${item.title} ${itemCategory}`);
    const sharesFamily = queryFamilies.some((qf) =>
      itemFamilies.some((itf) => itf.id === qf.id)
    );
    if (sharesFamily) return true;

    // Vérifie aussi si un terme de la famille détectée est présent dans le titre de l'annonce
    for (const family of queryFamilies) {
      for (const syn of family.terms) {
        const synNorm = normalizeText(syn);
        const synTokens = synNorm.split(' ');
        if (
          synTokens.every((sTok) =>
            itemTokens.some((iTok) => isFuzzyWordMatch(sTok, iTok))
          )
        ) {
          return true;
        }
      }
    }
  }

  return false;
}
