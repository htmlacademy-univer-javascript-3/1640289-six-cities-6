import { Coordinate } from './global.ts';
import { OfferHostStatus, OfferPlaceType } from '../constants/offer.ts';
import { City } from '../../mocks/city.ts';

export interface MainOfferInfo {
  title: string;
  rating: number;
  coordinates: Coordinate;
  price: number;
  placeType: OfferPlaceType;
  image: string;
  isPremium?: boolean;
}

export interface AdditionalOfferInfo extends MainOfferInfo {
  numberOfRooms: number;
  numberOfGuests: number;
  features: string[];
}

export interface IDetailedOffer {
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
  id: number;
  title: City;
  lat: number;
  lng: number;
}
