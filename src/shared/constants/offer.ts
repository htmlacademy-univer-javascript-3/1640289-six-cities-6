export const DEFAULT_OFFERS_LIST_LENGTH = 4;
export const NEAR_OFFERS_LIST_LENGTH = 3;

export const OFFER_CARD_CLASSNAMES = {
  main: {
    container: 'cities__places-list places__list tabs__content',
    item: 'cities__card place-card',
    image: 'cities__image-wrapper place-card__image-wrapper'
  },
  offer: {
    container: 'near-places__list places__list',
    item: 'near-places__card place-card',
    image: 'near-places__image-wrapper place-card__image-wrapper'
  },
  favorites: {
    container: 'favorites__places',
    item: 'favorites__card place-card',
    image: 'favorites__image-wrapper place-card__image-wrapper'
  }
};

export enum OfferPlaceType {
  Apartment = 'Apartment',
  Flat = 'Flat',
  House = 'House'
}

export enum OfferHostStatus {
  Pro = 'Pro',
  Beginner = 'Beginner'
}

export enum OfferCardType {
  Main = 'main',
  Offer = 'offer',
  Favorites = 'favorites'
}

export enum OffersSortType {
  Popular = 'Popular',
  PriceLowToHigh = 'Price: low to high',
  PriceHightToLow = 'Price: high to low',
  TopRated = 'Top rated first',
}

export const RATING_VALUES = [
  {
    value: '5',
    title: 'perfect'
  },
  {
    value: '4',
    title: 'good'
  },
  {
    value: '3',
    title: 'not bad'
  },
  {
    value: '2',
    title: 'badly'
  },
  {
    value: '1',
    title: 'terribly'
  },
];

export const COMMENT_OPTIONS = {
  minLength: 50,
  maxLength: 300
};
