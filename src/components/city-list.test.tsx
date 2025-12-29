import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CitiesList, CitiesListComponent } from './city-list';
import * as citySlice from '../store/slices/city.ts';
import React from 'react';

vi.mock('../shared/utils/offer.ts', () => ({
  getCitiesData: vi.fn((offers: { city: { name: string; location: { latitude: number; longitude: number } } }[]) => {
    const uniqueCities: Map<string, { name: string; location: { latitude: number; longitude: number } }> = new Map();

    offers.forEach((offer: { city: { name: string; location: { latitude: number; longitude: number } } }) => {
      if (!uniqueCities.has(offer.city.name)) {
        uniqueCities.set(offer.city.name, offer.city);
      }
    });
    return Array.from(uniqueCities.values());
  })
}));

vi.mock('../store/slices/city.ts', () => ({
  setCity: vi.fn((city: {name: string}) => ({ type: 'city/setCity', payload: city }))
}));

const mockOffers = [
  {
    id: '1',
    title: 'Offer 1',
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522 }
    }
  },
  {
    id: '2',
    title: 'Offer 2',
    city: {
      name: 'Amsterdam',
      location: { latitude: 52.3676, longitude: 4.9041 }
    }
  },
  {
    id: '3',
    title: 'Offer 3',
    city: {
      name: 'Cologne',
      location: { latitude: 50.9375, longitude: 6.9603 }
    }
  },
  {
    id: '4',
    title: 'Offer 4',
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522 }
    }
  }
];

const createMockStore = (
  currentCity = { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522 } },
  offers = mockOffers
) => configureStore({
  reducer: {
    city: () => ({ city: currentCity }),
    offers: () => ({ offers })
  }
});

const renderWithProviders = (
  component: React.ReactElement,
  store: ReturnType<typeof createMockStore>
) => render(
  <Provider store={store}>
    {component}
  </Provider>
);

describe('CitiesList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cities list', () => {
    const store = createMockStore();

    renderWithProviders(<CitiesList />, store);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
  });

  it('should render all unique cities from offers', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(<CitiesList />, store);

    const cityItems = container.querySelectorAll('.locations__item');
    expect(cityItems).toHaveLength(3);
  });

  it('should highlight active city', () => {
    const store = createMockStore({
      name: 'Amsterdam',
      location: { latitude: 52.3676, longitude: 4.9041 }
    });

    renderWithProviders(<CitiesList/>, store);

    const amsterdamLink = screen.getByText('Amsterdam').closest('a');
    expect(amsterdamLink).toHaveClass('tabs__item--active');
  });

  it('should not highlight non-active cities', () => {
    const store = createMockStore({
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522 }
    });

    renderWithProviders(<CitiesList/>, store);

    const amsterdamLink = screen.getByText('Amsterdam').closest('a');
    expect(amsterdamLink).not.toHaveClass('tabs__item--active');
  });

  it('should dispatch setCity when clicking on a city', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    renderWithProviders(<CitiesList />, store);

    const amsterdamCity = screen.getByText('Amsterdam').closest('li')!;
    await user.click(amsterdamCity);

    expect(citySlice.setCity).toHaveBeenCalledWith({
      name: 'Amsterdam',
      location: { latitude: 52.3676, longitude: 4.9041 }
    });
  });

  it('should dispatch setCity with correct city data', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    renderWithProviders(<CitiesList />, store);

    const cologneCity = screen.getByText('Cologne').closest('li')!;
    await user.click(cologneCity);

    expect(citySlice.setCity).toHaveBeenCalledWith({
      name: 'Cologne',
      location: { latitude: 50.9375, longitude: 6.9603 }
    });
  });

  it('should render cities as list items', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(<CitiesList />, store);

    const listItems = container.querySelectorAll('.locations__item');
    listItems.forEach((item) => {
      expect(item.tagName).toBe('LI');
    });
  });

  it('should render cities list as unordered list', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(<CitiesList />, store);

    const ul = container.querySelector('.locations__list');
    expect(ul).toBeInTheDocument();
    expect(ul?.tagName).toBe('UL');
  });

  it('should have correct CSS classes', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(<CitiesList />, store);

    expect(container.querySelector('.tabs')).toBeInTheDocument();
    expect(container.querySelector('.locations.container')).toBeInTheDocument();
    expect(container.querySelector('.locations__list.tabs__list')).toBeInTheDocument();
  });

  it('should render links with href="#"', () => {
    const store = createMockStore();

    renderWithProviders(<CitiesList />, store);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '#');
    });
  });

  it('should handle empty offers array', () => {
    const store = createMockStore(
      { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522 } },
      []
    );

    const { container } = renderWithProviders(<CitiesList />, store);

    const cityItems = container.querySelectorAll('.locations__item');
    expect(cityItems).toHaveLength(0);
  });

  it('should update cities when offers change', () => {
    const store1 = createMockStore();

    const { rerender } = renderWithProviders(<CitiesList />, store1);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();

    const newOffers = [
      {
        id: '5',
        title: 'Offer 5',
        city: {
          name: 'Brussels',
          location: { latitude: 50.8503, longitude: 4.3517 }
        }
      }
    ];

    const store2 = createMockStore(
      { name: 'Brussels', location: { latitude: 50.8503, longitude: 4.3517 } },
      newOffers
    );

    rerender(
      <Provider store={store2}>
        <CitiesList />
      </Provider>
    );

    expect(screen.getByText('Brussels')).toBeInTheDocument();
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();
  });

  it('should maintain callback reference with useCallback', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    const { rerender } = renderWithProviders(<CitiesListComponent />, store);

    const amsterdamCity = screen.getByText('Amsterdam').closest('li')!;
    await user.click(amsterdamCity);

    expect(citySlice.setCity).toHaveBeenCalledTimes(1);

    rerender(
      <Provider store={store}>
        <CitiesListComponent />
      </Provider>
    );

    const cologneCity = screen.getByText('Cologne').closest('li')!;
    await user.click(cologneCity);

    expect(citySlice.setCity).toHaveBeenCalledTimes(2);
  });

  it('should render section element', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(<CitiesList />, store);

    const section = container.querySelector('section.locations');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('should apply correct link classes', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(<CitiesList />, store);

    const links = container.querySelectorAll('.locations__item-link');
    links.forEach((link) => {
      expect(link).toHaveClass('locations__item-link');
      expect(link).toHaveClass('tabs__item');
    });
  });

  it('should handle multiple clicks on the same city', async () => {
    const user = userEvent.setup();
    const store = createMockStore();

    renderWithProviders(<CitiesList />, store);

    const parisCity = screen.getByText('Paris').closest('li')!;

    await user.click(parisCity);
    await user.click(parisCity);
    await user.click(parisCity);

    expect(citySlice.setCity).toHaveBeenCalledTimes(3);
  });

  it('should change active city when clicking different cities', async () => {
    const user = userEvent.setup();
    const store1 = createMockStore({
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522 }
    });

    const { rerender } = renderWithProviders(<CitiesList />, store1);

    let parisLink = screen.getByText('Paris').closest('a');
    expect(parisLink).toHaveClass('tabs__item--active');

    const amsterdamCity = screen.getByText('Amsterdam').closest('li')!;
    await user.click(amsterdamCity);

    const store2 = createMockStore({
      name: 'Amsterdam',
      location: { latitude: 52.3676, longitude: 4.9041 }
    });

    rerender(
      <Provider store={store2}>
        <CitiesList />
      </Provider>
    );

    const amsterdamLink = screen.getByText('Amsterdam').closest('a');
    expect(amsterdamLink).toHaveClass('tabs__item--active');

    parisLink = screen.getByText('Paris').closest('a');
    expect(parisLink).not.toHaveClass('tabs__item--active');
  });

  it('should be memoized with React.memo', () => {
    const store = createMockStore();

    const { rerender } = renderWithProviders(<CitiesList />, store);

    const initialCitiesText = screen.getByText('Paris').textContent;

    rerender(
      <Provider store={store}>
        <CitiesList />
      </Provider>
    );

    expect(screen.getByText('Paris').textContent).toBe(initialCitiesText);
  });

  it('should render city names inside span elements', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(<CitiesList />, store);

    const citySpans = container.querySelectorAll('.locations__item-link span');
    expect(citySpans).toHaveLength(3);

    const cityNames = Array.from(citySpans).map((span) => span.textContent);
    expect(cityNames).toContain('Paris');
    expect(cityNames).toContain('Amsterdam');
    expect(cityNames).toContain('Cologne');
  });

  it('should use city name as key for list items', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(<CitiesList />, store);

    const cityItems = container.querySelectorAll('.locations__item');
    expect(cityItems).toHaveLength(3);
  });
});
