export type PortfolioCategoryId = 
  | 'all' 
  | 'bridal' 
  | 'haldi' 
  | 'engagement' 
  | 'party' 
  | 'hairstyle';

export interface PortfolioItemConfig {
  id: string;
  category: Exclude<PortfolioCategoryId, 'all'>;
  imageSrc: string;
  width: number;
  height: number;
  isTemporaryPlaceholder?: boolean;
}

export interface PortfolioVideoConfig {
  videoSrc: string;
  posterSrc: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategoryId[] = [
  'all',
  'bridal',
  'haldi',
  'engagement',
  'party',
  'hairstyle',
];

export const PORTFOLIO_ITEMS: PortfolioItemConfig[] = [
  // 1. Bridal Artistry
  {
    id: 'bridal-0882',
    category: 'bridal',
    imageSrc: '/images/portfolio/bridal/IMG_0882.PNG',
    width: 1179,
    height: 1757,
    isTemporaryPlaceholder: false,
  },
  {
    id: 'bridal-0893',
    category: 'bridal',
    imageSrc: '/images/portfolio/bridal/IMG_0893.PNG',
    width: 1179,
    height: 1884,
    isTemporaryPlaceholder: false,
  },

  // 2. Haldi Celebrations (Temporary Illustrative Placeholders)
  {
    id: 'haldi-0882',
    category: 'haldi',
    imageSrc: '/images/portfolio/haldi/IMG_0882.PNG',
    width: 1179,
    height: 1757,
    isTemporaryPlaceholder: true,
  },
  {
    id: 'haldi-0893',
    category: 'haldi',
    imageSrc: '/images/portfolio/haldi/IMG_0893.PNG',
    width: 1179,
    height: 1884,
    isTemporaryPlaceholder: true,
  },

  // 3. Engagement Occasions
  {
    id: 'engagement-0881',
    category: 'engagement',
    imageSrc: '/images/portfolio/engagement/IMG_0881.PNG',
    width: 1179,
    height: 1843,
    isTemporaryPlaceholder: false,
  },
  {
    id: 'engagement-0889',
    category: 'engagement',
    imageSrc: '/images/portfolio/engagement/IMG_0889.PNG',
    width: 1179,
    height: 1641,
    isTemporaryPlaceholder: false,
  },
  {
    id: 'engagement-0894',
    category: 'engagement',
    imageSrc: '/images/portfolio/engagement/IMG_0894.PNG',
    width: 1179,
    height: 1811,
    isTemporaryPlaceholder: false,
  },

  // 4. Party & Reception
  {
    id: 'party-0886',
    category: 'party',
    imageSrc: '/images/portfolio/party/IMG_0886.PNG',
    width: 1179,
    height: 1489,
    isTemporaryPlaceholder: false,
  },
  {
    id: 'party-0888',
    category: 'party',
    imageSrc: '/images/portfolio/party/IMG_0888.PNG',
    width: 1179,
    height: 1792,
    isTemporaryPlaceholder: false,
  },

  // 5. Hairstyle Artistry
  {
    id: 'hairstyle-9148',
    category: 'hairstyle',
    imageSrc: '/images/portfolio/hairstyle/IMG_9148.PNG',
    width: 1086,
    height: 1448,
    isTemporaryPlaceholder: false,
  },
  {
    id: 'hairstyle-9441',
    category: 'hairstyle',
    imageSrc: '/images/portfolio/hairstyle/IMG_9441.PNG',
    width: 1086,
    height: 1448,
    isTemporaryPlaceholder: false,
  },
];

export const PORTFOLIO_VIDEO: PortfolioVideoConfig = {
  videoSrc: '/videos/portfolio/IMG_0186.MP4',
  posterSrc: '/images/portfolio/video-poster.svg',
  width: 1080,
  height: 1920,
  aspectRatio: '9/16',
};
