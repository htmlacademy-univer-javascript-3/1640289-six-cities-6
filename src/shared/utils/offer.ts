import { RoutePath } from '../constants/router.ts';
import { MainOfferInfo, OfferCity} from '../types/offer.ts';
import {COMMENT_OPTIONS, OffersSortType} from '../constants/offer.ts';
import { currentCustomIcon, defaultCustomIcon } from '../constants/asset.ts';

export const getRatingPercent = (ratingNumber: number) => {
  const ratingPercentValue = ratingNumber / 5 * 100;

  return `${ratingPercentValue}%`;
};

export const getOfferRouteWithId = (id: string) => RoutePath.Offer.replace(':id', id);

export const getCoordinatesOffers = (offers: MainOfferInfo[], currentOfferId?: string) => offers.map((offer) => {
  const currentOfferPointType = offer.id === currentOfferId ? currentCustomIcon : defaultCustomIcon;

  return { lat: offer.location.latitude, lon: offer.location.longitude, icon: currentOfferPointType };
});

export const getSortedOffers = (type: OffersSortType, offers: MainOfferInfo[]) => {
  switch (type) {
    case OffersSortType.Popular:
      return offers;
    case OffersSortType.PriceLowToHigh:
      return offers.sort((a, b) => a.price - b.price);
    case OffersSortType.PriceHightToLow:
      return offers.sort((a, b) => b.price - a.price);
    case OffersSortType.TopRated:
      return offers.sort((a, b) => b.rating - a.rating);
    default:
      return offers;
  }
};

export const getCitiesData = (offersData: MainOfferInfo[]) => {
  const citiesNames = new Set();
  const citiesData: OfferCity[] = [];

  for (const offer of offersData) {
    const currentCity = offer.city;

    if (!citiesNames.has(currentCity.name)) {
      citiesNames.add(currentCity.name);
      citiesData.push(currentCity);
    }
  }

  return citiesData;
};

export const validateValues = (rating: number, comment: string) => rating > 0 && comment.length >= COMMENT_OPTIONS.minLength;
