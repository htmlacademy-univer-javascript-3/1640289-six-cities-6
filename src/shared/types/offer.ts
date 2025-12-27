import { OfferHostStatus } from '../constants/offer.ts';

export type LocationType = {
  latitude: number;
  longitude: number;
  zoom: number;
}

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

export interface AdditionalOfferInfo extends MainOfferInfo {
  numberOfRooms: number;
  numberOfGuests: number;
  features: string[];
}

export interface DetailedOffer {
  id: string;
  info: AdditionalOfferInfo;
  host: OfferHostInfo;
  reviews: OfferFeedback[];
  images: string[];
}

export interface OfferHostInfo {
  name: string;
  avatar: string;
  status: OfferHostStatus;
  description: string[];
}

export interface OfferFeedback {
  name: string;
  avatar: string;
  rating: number;
  description: string;
  dateTime: string;
}

export interface OfferCity {
  name: string;
  location: LocationType;
}
