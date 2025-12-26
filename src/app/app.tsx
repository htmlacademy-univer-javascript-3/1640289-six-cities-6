import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from '../components/private-route.tsx';

import { Main } from '../pages/main';
import { Favorites } from '../pages/favorites';
import { Login } from '../pages/login';
import { Offer } from '../pages/offer';
import { NotFoundPage } from '../pages/not-found-page';

import { RoutePath } from '../shared/constants/router.ts';

const App = () => {
  const isAuthorized = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path={RoutePath.Main} element={<Main />} />

        <Route path={RoutePath.Login} element={<Login />} />

        <Route
          path={RoutePath.Favorites}
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
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
