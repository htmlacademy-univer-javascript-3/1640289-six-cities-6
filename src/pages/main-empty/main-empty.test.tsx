import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MainEmpty } from './main-empty.tsx';

vi.mock('../../components/city-list/city-list.tsx', () => ({
  CitiesList: () => <div data-testid="cities-list">Cities List</div>
}));

vi.mock('../../components/header/header.tsx', () => ({
  Header: () => <div data-testid="header">Header</div>
}));

const createMockStore = (cityName: string = 'Paris') => configureStore({
  reducer: {
    city: () => ({
      city: { name: cityName }
    })
  }
});

describe('MainEmpty Component', () => {
  it('should render main empty page with all sections', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MainEmpty />
      </Provider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('cities-list')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cities/i, hidden: true })).toBeInTheDocument();
  });

  it('should display "No places to stay available" message', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MainEmpty />
      </Provider>
    );

    expect(screen.getByText(/no places to stay available/i)).toBeInTheDocument();
  });

  it('should display city name in status description', () => {
    const store = createMockStore('Amsterdam');

    render(
      <Provider store={store}>
        <MainEmpty />
      </Provider>
    );

    expect(
      screen.getByText(/we could not find any property available at the moment in amsterdam/i)
    ).toBeInTheDocument();
  });

  it('should display different city name when city changes', () => {
    const store = createMockStore('Cologne');

    render(
      <Provider store={store}>
        <MainEmpty />
      </Provider>
    );

    expect(
      screen.getByText(/we could not find any property available at the moment in cologne/i)
    ).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MainEmpty />
      </Provider>
    );

    expect(container.querySelector('.page--main')).toBeInTheDocument();
    expect(container.querySelector('.page__main--index-empty')).toBeInTheDocument();
    expect(container.querySelector('.cities__no-places')).toBeInTheDocument();
    expect(container.querySelector('.cities__places-container--empty')).toBeInTheDocument();
  });

  it('should render visually hidden heading', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MainEmpty />
      </Provider>
    );

    const heading = container.querySelector('.visually-hidden');
    expect(heading).toBeInTheDocument();
    expect(heading?.tagName).toBe('H1');
  });

  it('should render empty right section', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MainEmpty />
      </Provider>
    );

    expect(container.querySelector('.cities__right-section')).toBeInTheDocument();
  });

  it('should render status wrapper with tabs content class', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MainEmpty />
      </Provider>
    );

    const statusWrapper = container.querySelector('.cities__status-wrapper');
    expect(statusWrapper).toBeInTheDocument();
    expect(statusWrapper?.classList.contains('tabs__content')).toBe(true);
  });
});
