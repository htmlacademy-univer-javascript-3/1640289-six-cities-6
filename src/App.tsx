import React from 'react';
import Main from './pages/Main.tsx';

interface AppProps {
  placesCount: number;
}

const App: React.FC<AppProps> = ({ placesCount }) => <Main placesCount={placesCount} />;

export default App;
