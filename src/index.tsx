import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const inputData = {
  placesCount: 5,
};

root.render(
  <React.StrictMode>
    <App placesCount={inputData.placesCount} />
  </React.StrictMode>
);
