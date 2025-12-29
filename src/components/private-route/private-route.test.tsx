import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './private-route.tsx';
import { AuthStatus } from '../../shared/constants/auth.ts';
import { RoutePath } from '../../shared/constants/router.ts';
import React from 'react';

const PrivateComponent = () => <div>Private Content</div>;
const LoginComponent = () => <div>Login Page</div>;
const PublicComponent = () => <div>Public Content</div>;

const createMockStore = (authStatus = AuthStatus.Auth) => configureStore({
  reducer: {
    auth: () => ({ authorizationStatus: authStatus })
  }
});

const renderWithRouter = (
  component: React.ReactElement,
  store: ReturnType<typeof createMockStore>,
  initialRoute = '/'
) => render(
  <Provider store={store}>
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={component} />
        <Route path={RoutePath.Login} element={<LoginComponent />} />
        <Route path="/public" element={<PublicComponent />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

describe('PrivateRoute Component', () => {
  beforeEach(() => {});

  it('should render children when user is authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithRouter(
      <PrivateRoute>
        <PrivateComponent />
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('Private Content')).toBeInTheDocument();
  });

  it('should not render login page when user is authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithRouter(
      <PrivateRoute>
        <PrivateComponent />
      </PrivateRoute>,
      store
    );

    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    renderWithRouter(
      <PrivateRoute>
        <PrivateComponent />
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should not render children when user is not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    renderWithRouter(
      <PrivateRoute>
        <PrivateComponent />
      </PrivateRoute>,
      store
    );

    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when authorization status is Unknown', () => {
    const store = createMockStore(AuthStatus.Unknown);

    renderWithRouter(
      <PrivateRoute>
        <PrivateComponent />
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render multiple children when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithRouter(
      <PrivateRoute>
        <div>
          <h1>Title</h1>
          <p>Description</p>
          <button>Action</button>
        </div>
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('should render complex component tree when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    const ComplexComponent = () => (
      <div>
        <header>Header</header>
        <main>Main Content</main>
        <footer>Footer</footer>
      </div>
    );

    renderWithRouter(
      <PrivateRoute>
        <ComplexComponent />
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should handle text node as children when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithRouter(
      <PrivateRoute>
        Simple text content
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('Simple text content')).toBeInTheDocument();
  });

  it('should handle fragment as children when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithRouter(
      <PrivateRoute>
        <>
          <div>First Element</div>
          <div>Second Element</div>
        </>
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('First Element')).toBeInTheDocument();
    expect(screen.getByText('Second Element')).toBeInTheDocument();
  });

  it('should work with nested routes', () => {
    const store = createMockStore(AuthStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private/nested']}>
          <Routes>
            <Route
              path="/private/*"
              element={
                <PrivateRoute>
                  <Routes>
                    <Route path="nested" element={<div>Nested Private Route</div>} />
                  </Routes>
                </PrivateRoute>
              }
            />
            <Route path={RoutePath.Login} element={<LoginComponent />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Nested Private Route')).toBeInTheDocument();
  });

  it('should redirect nested routes when not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private/nested']}>
          <Routes>
            <Route
              path="/private/*"
              element={
                <PrivateRoute>
                  <Routes>
                    <Route path="nested" element={<div>Nested Private Route</div>} />
                  </Routes>
                </PrivateRoute>
              }
            />
            <Route path={RoutePath.Login} element={<LoginComponent />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Nested Private Route')).not.toBeInTheDocument();
  });

  it('should handle null children when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithRouter(
      <PrivateRoute>
        {null}
      </PrivateRoute>,
      store
    );

    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should handle undefined children when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithRouter(
      <PrivateRoute>
        {undefined}
      </PrivateRoute>,
      store
    );

    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should render component with props when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    const ComponentWithProps = ({ title, count }: { title: string; count: number }) => (
      <div>
        <h1>{title}</h1>
        <p>Count: {count}</p>
      </div>
    );

    renderWithRouter(
      <PrivateRoute>
        <ComponentWithProps title="Test Title" count={42} />
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Count: 42')).toBeInTheDocument();
  });

  it('should preserve children state when authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    const StatefulComponent = () => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
      );
    };

    const { rerender } = renderWithRouter(
      <PrivateRoute>
        <StatefulComponent />
      </PrivateRoute>,
      store
    );

    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    rerender(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <StatefulComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('should work correctly in a route configuration', () => {
    const store = createMockStore(AuthStatus.Auth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <Routes>
            <Route path="/public" element={<PublicComponent />} />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <div>Favorites Page</div>
                </PrivateRoute>
              }
            />
            <Route path={RoutePath.Login} element={<LoginComponent />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Favorites Page')).toBeInTheDocument();
  });

  it('should redirect to correct login path', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <PrivateComponent />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginComponent />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should not render children during redirect', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    const ComponentWithSideEffect = () => {
      React.useEffect(() => {
        throw new Error('This should not be called during redirect');
      });
      return <div>Should Not Render</div>;
    };

    expect(() => {
      renderWithRouter(
        <PrivateRoute>
          <ComponentWithSideEffect />
        </PrivateRoute>,
        store
      );
    }).not.toThrow();

    expect(screen.queryByText('Should Not Render')).not.toBeInTheDocument();
  });
});
