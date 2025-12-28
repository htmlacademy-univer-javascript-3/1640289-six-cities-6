import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainOfferInfo } from '../../shared/types/offer.ts';

interface FavoritesState {
  offerFavorites: MainOfferInfo[];
}

const INITIAL_STATE: FavoritesState = {
  offerFavorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: INITIAL_STATE,
  reducers: {
    setFavorites(state, action: PayloadAction<MainOfferInfo>) {
      const { id } = action.payload;
      const findFavorite = state.offerFavorites.find((item) => item.id === id);

      if (findFavorite) {
        state.offerFavorites = state.offerFavorites.filter((item) => item.id !== id);
      } else {
        state.offerFavorites.push(action.payload);
      }
    },
  },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
