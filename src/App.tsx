import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute.tsx';

import { Main } from './pages/main';
import { Favorites } from './pages/favorites';
import { Login } from './pages/login';
import { Offer } from './pages/offer';
import { NotFoundPage } from './pages/not-found-page';

import { IDetailedOffer } from './shared/types/offer.ts';
import { RoutePath } from './shared/constants/router.ts';

interface AppProps {
  offerCount: number;
  offers: IDetailedOffer[];
}

const App: React.FC<AppProps> = ({ offerCount, offers }) => {
  const isAuthorized = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePath.Main} element={<Main offerCount={offerCount} offers={offers} />} />

        <Route path={RoutePath.Login} element={<Login />} />

        <Route
          path={RoutePath.Favorites}
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <Favorites offers={offers} />
            </PrivateRoute>
          }
        />

        <Route path={RoutePath.Offer} element={<Offer offers={offers} />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
