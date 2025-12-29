import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Login } from './login';

vi.mock('../../components/login-form/login-form.tsx', () => ({
  LoginForm: () => <div data-testid="login-form">Login Form</div>
}));

vi.mock('../../components/header/header.tsx', () => ({
  Header: () => <div data-testid="header">Header</div>
}));

const createMockStore = (cityName: string | null = 'Paris') => configureStore({
  reducer: {
    city: () => ({
      city: cityName ? { name: cityName } : null
    })
  }
});

describe('Login Component', () => {
  it('should render login page with all sections', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should display city name when city is provided', () => {
    const store = createMockStore('Amsterdam');

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
  });

  it('should display empty string when city is null', () => {
    const store = createMockStore(null);

    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    const locationLink = screen.getByRole('link');
    expect(locationLink.querySelector('span')).toHaveTextContent('');
  });

  it('should have correct CSS classes', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    expect(container.querySelector('.page--login')).toBeInTheDocument();
    expect(container.querySelector('.page__main--login')).toBeInTheDocument();
    expect(container.querySelector('.locations--login')).toBeInTheDocument();
  });

  it('should render login section with proper structure', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    const loginSection = container.querySelector('.login');
    expect(loginSection).toBeInTheDocument();
    expect(loginSection?.querySelector('.login__title')).toBeInTheDocument();
  });
});
