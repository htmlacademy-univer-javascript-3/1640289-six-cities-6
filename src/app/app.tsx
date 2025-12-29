import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import PrivateRoute from '../components/private-route/private-route.tsx';

import { Main } from '../pages/main';
import { Favorites } from '../pages/favorites';
import { Login } from '../pages/login';
import { Offer } from '../pages/offer';
import { NotFoundPage } from '../pages/not-found-page';

import { RoutePath } from '../shared/constants/router.ts';
import { RootState, useAppDispatch } from '../hooks/use-store.ts';
import { fetchFavorites, fetchOffers } from '../store/actions/offer.ts';
import Spinner from '../components/spinner/spinner.tsx';
import { authCheck } from '../store/actions/auth.ts';
import { useSelector } from 'react-redux';

const App = () => {
  const dispatch = useAppDispatch();
  const { offersLoading } = useSelector((state: RootState) => state.offers);

  useEffect(() => {
    if (offersLoading) {
      dispatch(fetchOffers());
    }
    dispatch(fetchFavorites());
    dispatch(authCheck());
  }, [dispatch, offersLoading]);

  if (offersLoading) {
    return <Spinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePath.Main} element={<Main />} />

        <Route path={RoutePath.Login} element={<Login />} />

        <Route
          path={RoutePath.Favorites}
          element={
            <PrivateRoute>
              <Favorites />
            </PrivateRoute>
          }
        />

        <Route path={RoutePath.Offer} element={<Offer />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
