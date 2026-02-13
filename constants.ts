
import { DesignTemplate, ColorOption } from './types';

export const DESIGNS: DesignTemplate[] = [
  {
    id: 'heritage-stripe',
    name: 'Heritage Stripe',
    image: 'https://i.imgur.com/Nz9lroz.png',
    mask: 'https://i.imgur.com/Nz9lroz.png',
    maxColors: 2
  },
  {
    id: 'classic-hoop',
    name: 'Classic Hoop',
    image: 'https://i.imgur.com/zD6iDT7.png',
    mask: 'https://i.imgur.com/zD6iDT7.png',
    maxColors: 3
  },
  {
    id: 'signature-panel',
    name: 'Signature Panel',
    image: 'https://i.imgur.com/aMbwsIx.png',
    mask: 'https://i.imgur.com/aMbwsIx.png',
    maxColors: 3
  }
];

export const COLORS: ColorOption[] = [
  { name: 'Black', hex: '#1D1D1F' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Jade', hex: '#00A896' },
  { name: 'Grey', hex: '#8E9191' },
  { name: 'Umber', hex: '#5E3B3B' },
  { name: 'Sky', hex: '#6397D0' },
  { name: 'Royal', hex: '#2D458C' },
  { name: 'Navy', hex: '#141B2D' },
  { name: 'Maroon', hex: '#500A16' },
  { name: 'Fushia', hex: '#C01E61' },
  { name: 'Flag Red', hex: '#9E2129' },
  { name: 'Purple', hex: '#413567' },
  { name: 'Emerald', hex: '#008144' },
  { name: 'Gold', hex: '#E1AD21' },
  { name: 'Forest', hex: '#0B3121' }
];
