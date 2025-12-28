import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainOfferInfo } from '../../shared/types/offer.ts';
import { OffersSortType } from '../../shared/constants/offer.ts';
import { getSortedOffers } from '../../shared/utils/offer.ts';

interface OffersState {
  initialOffers: MainOfferInfo[];
  offers: MainOfferInfo[];
  offersLoading: boolean;
  offersSort: OffersSortType;
}

const INITIAL_STATE: OffersState = {
  initialOffers: [],
  offers: [],
  offersLoading: true,
  offersSort: OffersSortType.Popular,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState: INITIAL_STATE,
  reducers: {
    setInitialOffers(state, action: PayloadAction<MainOfferInfo[]>) {
      state.initialOffers = action.payload;
    },
    setOffers(state, action: PayloadAction<MainOfferInfo[]>) {
      state.offers = action.payload;
    },
    setOffersLoading(state, action: PayloadAction<boolean>) {
      state.offersLoading = action.payload;
    },
    setOffersSort(state, action: PayloadAction<OffersSortType>) {
      state.offersSort = action.payload;
      state.offers = getSortedOffers(action.payload, state.initialOffers);
    },
  },
});

export const { setOffers, setInitialOffers, setOffersLoading, setOffersSort } = offersSlice.actions;
export default offersSlice.reducer;
