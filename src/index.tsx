import React from 'react';
import ReactDOM from 'react-dom/client';

import { offerMocks } from './mocks/offer.ts';

import App from './App.tsx';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const inputData = {
  offerCount: 6,
};

root.render(
  <React.StrictMode>
    <App offerCount={inputData.offerCount} offers={offerMocks} />
  </React.StrictMode>
);
