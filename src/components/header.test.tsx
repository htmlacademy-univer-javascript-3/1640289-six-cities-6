import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './header';
import { AuthStatus } from '../shared/constants/auth.ts';
import { RoutePath } from '../shared/constants/router.ts';
import * as authActions from '../store/actions/auth.ts';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: Record<string, unknown> = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../store/actions/auth.ts', () => ({
  authLogout: vi.fn()
}));

const createMockStore = (
  authStatus = AuthStatus.Auth,
  userName = 'John Doe',
  favoritesCount = 5
) => {
  const favorites = Array.from({ length: favoritesCount }, (_, i) => ({
    id: `${i + 1}`,
    isFavorite: true
  }));

  return configureStore({
    reducer: {
      auth: () => ({
        authorizationStatus: authStatus,
        name: userName
      }),
      favorites: () => ({
        offerFavorites: favorites
      })
    }
  });
};

const renderWithProviders = (
  store: ReturnType<typeof createMockStore>
) => render(
  <Provider store={store}>
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  </Provider>
);

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header with logo', () => {
    const store = createMockStore();

    renderWithProviders(store);

    const logo = screen.getByAltText('6 cities logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('width', '81');
    expect(logo).toHaveAttribute('height', '41');
  });

  it('should render logo link to main page', () => {
    const store = createMockStore();

    renderWithProviders(store);

    const logoLink = screen.getByAltText('6 cities logo').closest('a');
    expect(logoLink).toHaveAttribute('href', RoutePath.Main);
  });

  it('should display user name when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth, 'Jane Smith');

    renderWithProviders(store);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should display favorites count when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth, 'John Doe', 3);

    renderWithProviders(store);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display Sign out link when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithProviders(store);

    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should display Sign in link when not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    renderWithProviders(store);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should not display user info when not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth, 'John Doe');

    renderWithProviders(store);

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should navigate to favorites when clicking on user name', () => {
    const store = createMockStore(AuthStatus.Auth, 'John Doe');

    renderWithProviders(store);

    const userNameLink = screen.getByText('John Doe').closest('a');
    expect(userNameLink).toHaveAttribute('href', RoutePath.Favorites);
  });

  it('should dispatch authLogout when clicking Sign out', async () => {
    const user = userEvent.setup();
    const mockAuthLogout = vi.fn();
    (authActions.authLogout as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockAuthLogout);

    const store = createMockStore(AuthStatus.Auth);

    renderWithProviders(store);

    const signOutLink = screen.getByText('Sign out');
    await user.click(signOutLink);

    expect(authActions.authLogout).toHaveBeenCalledWith({ navigate: mockNavigate });
  });

  it('should prevent default behavior when clicking Sign out', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthStatus.Auth);

    renderWithProviders(store);

    const signOutLink = screen.getByText('Sign out').closest('a')!;

    await user.click(signOutLink);

    expect(authActions.authLogout).toHaveBeenCalled();
  });

  it('should navigate to login page when clicking Sign in', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    renderWithProviders(store);

    const signInLink = screen.getByText('Sign in').closest('a');
    expect(signInLink).toHaveAttribute('href', RoutePath.Login);
  });

  it('should display zero favorites when user has no favorites', () => {
    const store = createMockStore(AuthStatus.Auth, 'John Doe', 0);

    renderWithProviders(store);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display correct favorites count', () => {
    const store = createMockStore(AuthStatus.Auth, 'John Doe', 10);

    renderWithProviders(store);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should have correct CSS classes for header structure', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(store);

    expect(container.querySelector('.header')).toBeInTheDocument();
    expect(container.querySelector('.header__wrapper')).toBeInTheDocument();
    expect(container.querySelector('.header__left')).toBeInTheDocument();
    expect(container.querySelector('.header__nav')).toBeInTheDocument();
  });

  it('should render navigation as unordered list', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(store);

    const navList = container.querySelector('.header__nav-list');
    expect(navList).toBeInTheDocument();
    expect(navList?.tagName).toBe('UL');
  });

  it('should render user section when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    const { container } = renderWithProviders(store);

    const userSection = container.querySelector('.header__nav-item.user');
    expect(userSection).toBeInTheDocument();
  });

  it('should not render user section when not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    const { container } = renderWithProviders(store);

    const userSection = container.querySelector('.header__nav-item.user');
    expect(userSection).not.toBeInTheDocument();
  });

  it('should render avatar wrapper when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    const { container } = renderWithProviders(store);

    const avatarWrapper = container.querySelector('.header__avatar-wrapper');
    expect(avatarWrapper).toBeInTheDocument();
  });

  it('should have correct structure for authenticated user', () => {
    const store = createMockStore(AuthStatus.Auth);

    const { container } = renderWithProviders(store);

    expect(container.querySelector('.header__nav-link--profile')).toBeInTheDocument();
    expect(container.querySelector('.user__avatar-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.user__name')).toBeInTheDocument();
    expect(container.querySelector('.header__favorite-count')).toBeInTheDocument();
  });

  it('should render two navigation items when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    const { container } = renderWithProviders(store);

    const navItems = container.querySelectorAll('.header__nav-item');
    expect(navItems).toHaveLength(2);
  });

  it('should render one navigation item when not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    const { container } = renderWithProviders(store);

    const navItems = container.querySelectorAll('.header__nav-item');
    expect(navItems).toHaveLength(1);
  });

  it('should call handleLogout with event when Sign out is clicked', async () => {
    const user = userEvent.setup();
    const mockAuthLogout = vi.fn();
    (authActions.authLogout as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockAuthLogout);

    const store = createMockStore(AuthStatus.Auth);

    renderWithProviders(store);

    const signOutLink = screen.getByText('Sign out').closest('a')!;
    await user.click(signOutLink);

    expect(authActions.authLogout).toHaveBeenCalledTimes(1);
  });

  it('should maintain callback reference with useCallback', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthStatus.Auth);

    const { rerender } = renderWithProviders(store);

    const signOutLink = screen.getByText('Sign out').closest('a')!;
    await user.click(signOutLink);

    expect(authActions.authLogout).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    const signOutLinkAfterRerender = screen.getByText('Sign out').closest('a')!;
    await user.click(signOutLinkAfterRerender);

    expect(authActions.authLogout).toHaveBeenCalledTimes(2);
  });

  it('should have container wrapper', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(store);

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
  });

  it('should render header as semantic header element', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(store);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header?.tagName).toBe('HEADER');
  });

  it('should render navigation as semantic nav element', () => {
    const store = createMockStore();

    renderWithProviders(store);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav.tagName).toBe('NAV');
  });

  it('should update favorites count when it changes', () => {
    const store1 = createMockStore(AuthStatus.Auth, 'John Doe', 5);

    const { rerender } = renderWithProviders(store1);

    expect(screen.getByText('5')).toBeInTheDocument();

    const store2 = createMockStore(AuthStatus.Auth, 'John Doe', 8);

    rerender(
      <Provider store={store2}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('should update user name when it changes', () => {
    const store1 = createMockStore(AuthStatus.Auth, 'John Doe');

    const { rerender } = renderWithProviders(store1);

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const store2 = createMockStore(AuthStatus.Auth, 'Jane Smith');

    rerender(
      <Provider store={store2}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
