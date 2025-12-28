import { combineReducers } from 'redux';
import authReducer from './auth.ts';
import cityReducer from './city.ts';
import offersReducer from './offer.ts';
import currentOfferReducer from './current-offer.ts';
import favoritesReducer from './favorite.ts';

const rootReducer = combineReducers({
  auth: authReducer,
  city: cityReducer,
  offers: offersReducer,
  currentOffer: currentOfferReducer,
  favorites: favoritesReducer,
});

export default rootReducer;
