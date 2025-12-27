import { RoutePath } from '../constants/router.ts';
import { DetailedOffer } from '../types/offer.ts';
import { OffersSortType } from '../constants/offer.ts';
import { currentCustomIcon, defaultCustomIcon } from '../constants/asset.ts';

export const getRatingPercent = (ratingNumber: number) => {
  const ratingPercentValue = ratingNumber / 5 * 100;

  return `${ratingPercentValue}%`;
};

export const getOfferRouteWithId = (id: string) => RoutePath.Offer.replace(':id', id);

export const getCoordinatesOffers = (offers: DetailedOffer[], currentOfferId?: string) => offers.map((offer) => {
  const currentOfferPointType = offer.id === currentOfferId ? currentCustomIcon : defaultCustomIcon;

  return { lat: offer.info.coordinates.lat, lon: offer.info.coordinates.lon, icon: currentOfferPointType };
});

export const getSortedOffers = (type: OffersSortType, offers: DetailedOffer[]) => {
  switch (type) {
    case OffersSortType.Popular:
      return offers;
    case OffersSortType.PriceLowToHigh:
      return offers.sort((a, b) => a.info.price - b.info.price);
    case OffersSortType.PriceHightToLow:
      return offers.sort((a, b) => b.info.price - a.info.price);
    case OffersSortType.TopRated:
      return offers.sort((a, b) => b.info.rating - a.info.rating);
    default:
      return offers;
  }
};
