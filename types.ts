
export enum ScreenType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor'
}

export enum LeadStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ScreenType;
  purpose: string[];
  pixelPitch: string;
  brightness: number;
  refreshRate: number;
  ipRating: string;
  viewingDistanceMin: number;
  viewingDistanceMax: number;
  priceFrom?: number;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  isFeatured: boolean;
  sortOrder: number;
  warranty: number;
  leadTime: number;
}

export interface Solution {
  id: string;
  slug: string;
  name: string;
  type: ScreenType;
  width: number;
  height: number;
  area: number;
  pixelPitch: string;
  brightness: number;
  included: string[];
  priceFrom: number;
  warranty: number;
  leadTime: number;
  images: string[];
  isFeatured: boolean;
  featuredOrder: number;
}

export interface Case {
  id: string;
  slug: string;
  title: string;
  city: string;
  industry: string;
  task: string;
  solution: string;
  specs: string[];
  duration: number;
  result: string;
  images: string[];
  videoUrl?: string;
  testimonial?: string;
  isFeatured: boolean;
  featuredOrder: number;
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  city: string;
  message: string;
  pageUrl: string;
  source: string;
  productId?: string;
  solutionId?: string;
  status: LeadStatus;
  managerNote?: string;
}
