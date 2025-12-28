import React from 'react';
import { RoutePath } from '../../shared/constants/router.ts';

export const NotFoundPage: React.FC = () => (
  <section style={{ padding: '50px', textAlign: 'center' }}>
    <h1>404 Not Found</h1>
    <a href={RoutePath.Main}>Go back to the main page</a>
  </section>
);
