import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdditionalOfferInfo, MainOfferInfo, OfferFeedback } from '../../shared/types/offer.ts';

interface CurrentOfferState {
  currentOffer: AdditionalOfferInfo | null;
  currentOfferId?: string;
  currentOfferLoading: boolean;
  currentOfferFeedbacks: OfferFeedback[];
  currentOfferNearby: MainOfferInfo[];
}

const INITIAL_STATE: CurrentOfferState = {
  currentOffer: null,
  currentOfferId: undefined,
  currentOfferLoading: false,
  currentOfferFeedbacks: [],
  currentOfferNearby: [],
};

const currentOfferSlice = createSlice({
  name: 'currentOffer',
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentOffer(state, action: PayloadAction<AdditionalOfferInfo>) {
      state.currentOffer = action.payload;
    },
    setCurrentOfferId(state, action: PayloadAction<string>) {
      state.currentOfferId = action.payload;
    },
    setCurrentOfferLoading(state, action: PayloadAction<boolean>) {
      state.currentOfferLoading = action.payload;
    },
    setCurrentOfferFeedbacks(state, action: PayloadAction<OfferFeedback[]>) {
      state.currentOfferFeedbacks = action.payload;
    },
    setCurrentOfferNearbyOffers(state, action: PayloadAction<MainOfferInfo[]>) {
      state.currentOfferNearby = action.payload;
    },
  },
});

export const { setCurrentOffer, setCurrentOfferId, setCurrentOfferLoading, setCurrentOfferFeedbacks, setCurrentOfferNearbyOffers } = currentOfferSlice.actions;
export default currentOfferSlice.reducer;
