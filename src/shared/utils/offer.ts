import { RoutePath } from '../constants/router.ts';

export const getRatingPercent = (ratingNumber: number) => {
  const ratingPercentValue = ratingNumber / 5 * 100;

  return `${ratingPercentValue}%`;
};

export const getOfferRouteWithId = (id: string) => RoutePath.Offer.replace(':id', id);
