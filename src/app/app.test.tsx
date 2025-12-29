import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './app.tsx';
import * as offerActions from '../store/actions/offer';
import * as authActions from '../store/actions/auth';

vi.mock('react-router-dom', async () => {
  const actual: Record<string, unknown> = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Routes: ({ children }: { children: React.ReactNode }) => <div data-testid="routes">{children}</div>,
    Route: () => null,
  };
});

vi.mock('../pages/main', () => ({
  Main: () => <div>Main Page</div>,
}));

vi.mock('../pages/favorites', () => ({
  Favorites: () => <div>Favorites Page</div>,
}));

vi.mock('../pages/login', () => ({
  Login: () => <div>Login Page</div>,
}));

vi.mock('../pages/offer', () => ({
  Offer: () => <div>Offer Page</div>,
}));

vi.mock('../pages/not-found-page', () => ({
  NotFoundPage: () => <div>Not Found Page</div>,
}));

vi.mock('../components/private-route.tsx', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../components/spinner/spinner.tsx', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('../store/actions/offer', () => ({
  fetchOffers: vi.fn(() => () => ({ type: 'FETCH_OFFERS' })),
  fetchFavorites: vi.fn(() => () => ({ type: 'FETCH_FAVORITES' })),
}));

vi.mock('../store/actions/auth', () => ({
  authCheck: vi.fn(() => () => ({ type: 'AUTH_CHECK' })),
}));

describe('App', () => {
  const createMockStore = (offersLoading = false) => configureStore({
    reducer: {
      offers: () => ({ offersLoading }),
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('It should display the spinner when loading offers', () => {
    const store = createMockStore(true);

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('it should display Routes when the download is completed', () => {
    const store = createMockStore(false);

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });

  it('should call fetchOffers when offersLoading = true', () => {
    const store = createMockStore(true);
    const fetchOffersSpy = vi.spyOn(offerActions, 'fetchOffers');

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(fetchOffersSpy).toHaveBeenCalledTimes(1);
  });

  it('should call fetchFavorites and authCheck when mounting', () => {
    const store = createMockStore(false);
    const fetchFavoritesSpy = vi.spyOn(offerActions, 'fetchFavorites');
    const authCheckSpy = vi.spyOn(authActions, 'authCheck');

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(fetchFavoritesSpy).toHaveBeenCalledTimes(1);
    expect(authCheckSpy).toHaveBeenCalledTimes(1);
  });

  it('should not call fetchOffers when offersLoading = false', () => {
    const store = createMockStore(false);
    const fetchOffersSpy = vi.spyOn(offerActions, 'fetchOffers');

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(fetchOffersSpy).not.toHaveBeenCalled();
  });
});
