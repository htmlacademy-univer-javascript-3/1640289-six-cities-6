import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute.tsx';

import Main from './pages/Main.tsx';
import Favorites from './pages/Favorites.tsx';
import Login from './pages/Login.tsx';
import Offer from './pages/Offer.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

interface AppProps {
  placesCount: number;
}

const App: React.FC<AppProps> = ({ placesCount }) => {
  const isAuthorized = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main placesCount={placesCount} />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthorized={isAuthorized}>
              <Favorites />
            </PrivateRoute>
          }
        />

        <Route path="/offer/:id" element={<Offer />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
