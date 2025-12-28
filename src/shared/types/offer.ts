import { LocationType } from './map.ts';

export interface MainOfferInfo {
  id: string;
  title: string;
  type: string;
  price: number;
  city: OfferCity;
  location: LocationType;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
}

export interface OfferUser {
  name: string;
  avatarUrl: string;
  isPro: boolean;
}

export type AdditionalOfferInfo = Omit<MainOfferInfo, 'previewImage'> & {
  description: string;
  bedrooms: number;
  goods: string[];
  host: OfferUser;
  images: string[];
  maxAdults: number;
}

export interface OfferFeedback {
  id: string;
  date: string;
  user: OfferUser;
  comment: string;
  rating: number;
}

export interface OfferCity {
  name: string;
  location: LocationType;
}
