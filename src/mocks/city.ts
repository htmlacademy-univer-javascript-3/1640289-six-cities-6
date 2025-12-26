import { OfferCity } from '../shared/types/offer.ts';

export enum City {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf'
}

export const cityMocks: Record<City, OfferCity> = {
  [City.Paris]: {
    id: 1,
    title: City.Paris,
    lat: 48.8566,
    lng: 2.3522
  },
  [City.Cologne]: {
    id: 2,
    title: City.Cologne,
    lat: 50.9375,
    lng: 6.9603
  },
  [City.Brussels]: {
    id: 3,
    title: City.Brussels,
    lat: 50.8503,
    lng: 4.3517
  },
  [City.Amsterdam]: {
    id: 4,
    title: City.Amsterdam,
    lat: 52.3676,
    lng: 4.9041
  },
  [City.Hamburg]: {
    id: 5,
    title: City.Hamburg,
    lat: 53.5511,
    lng: 9.9937
  },
  [City.Dusseldorf]: {
    id: 6,
    title: City.Dusseldorf,
    lat: 51.2277,
    lng: 6.7735
  }
};
