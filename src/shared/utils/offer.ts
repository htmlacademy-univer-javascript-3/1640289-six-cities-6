import { RoutePath } from '../constants/router.ts';
import { IDetailedOffer } from '../types/offer.ts';

export const getRatingPercent = (ratingNumber: number) => {
  const ratingPercentValue = ratingNumber / 5 * 100;

  return `${ratingPercentValue}%`;
};

export const getOfferRouteWithId = (id: string) => RoutePath.Offer.replace(':id', id);

export const getCoordinatesOffers = (offers: IDetailedOffer[]) => offers.map((offer) => ({lat: offer.info.coordinates.lat, lon: offer.info.coordinates.lon}));
