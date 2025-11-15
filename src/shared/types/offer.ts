export enum OfferPlaceType {
  Apartment = 'Apartment',
  Flat = 'Flat',
  House = 'House'
}

export enum OfferHostStatus {
  Pro = 'Pro',
  Beginner = 'Beginner'
}

export interface ISimpleOfferInfo {
  title: string;
  rating: number;
  price: number;
  placeType: OfferPlaceType;
  image: string;
  isPremium?: boolean;
}

export interface IDetailedOfferInfo extends ISimpleOfferInfo {
  numberOfRooms: number;
  numberOfGuests: number;
  features: string[];
}

export interface IDetailedOffer {
  id: string;
  info: IDetailedOfferInfo;
  host: IOfferHost;
  reviews: IOfferReview[];
  images: string[];
}

export interface IOfferHost {
  name: string;
  avatar: string;
  status: OfferHostStatus;
  description: string[];
}

export interface IOfferReview {
  name: string;
  avatar: string;
  rating: number;
  description: string;
  dateTime: string;
}

export enum OfferCardType {
  Main = 'main',
  Offer = 'offer',
  Favorites = 'favorites'
}
