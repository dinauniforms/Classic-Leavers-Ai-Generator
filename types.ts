export enum Step {
  LANDING = 'LANDING',
  DESIGN = 'DESIGN',
  COLOR = 'COLOR',
  LOGO = 'LOGO',
  PREVIEW = 'PREVIEW'
}

export interface DesignTemplate {
  id: string;
  name: string;
  image: string;
  mask: string; // URL to the mask image used for tinting
  maxColors: number;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface UserDesign {
  designId: string | null;
  colorHexes: string[];
  logoUrl: string | null;
  generatedImageUrl: string | null;
}