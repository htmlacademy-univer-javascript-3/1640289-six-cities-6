import {describe, it, expect, vi, beforeEach, afterEach, Mock} from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React, { MutableRefObject } from 'react';
import useMap from './use-map';
import { Map, TileLayer } from 'leaflet';

vi.mock('leaflet', () => ({
  Map: vi.fn(),
  TileLayer: vi.fn(),
}));

describe('useMap', () => {
  const mockCity = {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
    },
    zoom: 13,
  };

  const createMockStore = (city = mockCity) => configureStore({
    reducer: {
      city: () => ({ city }),
    },
  });

  const createWrapper = (store: ReturnType<typeof createMockStore>) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    Wrapper.displayName = 'Wrapper';
    return Wrapper;
  };

  let mockMapInstance: {
    addLayer: ReturnType<typeof vi.fn>;
    setView: ReturnType<typeof vi.fn>;
    getZoom: Mock;
  };

  beforeEach(() => {
    mockMapInstance = {
      addLayer: vi.fn(),
      setView: vi.fn(),
      getZoom: vi.fn().mockReturnValue(13),
    };

    (Map as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockMapInstance);
    (TileLayer as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({}));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('must return null if mapRef.current is null', () => {
    const store = createMockStore();
    const mapRef: MutableRefObject<HTMLElement | null> = { current: null };

    const { result } = renderHook(() => useMap(mapRef), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBeNull();
  });

  it('must create an instance of the map with the correct parameters', () => {
    const store = createMockStore();
    const mapRef: MutableRefObject<HTMLElement | null> = {
      current: document.createElement('div'),
    };

    renderHook(() => useMap(mapRef), {
      wrapper: createWrapper(store),
    });

    expect(Map).toHaveBeenCalledWith(mapRef.current, {
      center: {
        lat: mockCity.location.latitude,
        lng: mockCity.location.longitude,
      },
      zoom: 12,
    });
  });

  it('must create a TileLayer with the correct parameters', () => {
    const store = createMockStore();
    const mapRef: MutableRefObject<HTMLElement | null> = {
      current: document.createElement('div'),
    };

    renderHook(() => useMap(mapRef), {
      wrapper: createWrapper(store),
    });

    expect(TileLayer).toHaveBeenCalledWith(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    );
  });

  it('must add a layer to the map', () => {
    const store = createMockStore();
    const mapRef: MutableRefObject<HTMLElement | null> = {
      current: document.createElement('div'),
    };

    renderHook(() => useMap(mapRef), {
      wrapper: createWrapper(store),
    });

    expect(mockMapInstance.addLayer).toHaveBeenCalledTimes(1);
  });

  it('must return an instance of the map after creation', () => {
    const store = createMockStore();
    const mapRef: MutableRefObject<HTMLElement | null> = {
      current: document.createElement('div'),
    };

    const { result } = renderHook(() => useMap(mapRef), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBe(mockMapInstance);
  });

  it('must create a map only once', () => {
    const store = createMockStore();
    const mapRef: MutableRefObject<HTMLElement | null> = {
      current: document.createElement('div'),
    };

    const { rerender } = renderHook(() => useMap(mapRef), {
      wrapper: createWrapper(store),
    });

    rerender();
    rerender();

    expect(Map).toHaveBeenCalledTimes(1);
  });

  it('must update the map view when the city changes', () => {
    const store = createMockStore();
    const mapRef: MutableRefObject<HTMLElement | null> = {
      current: document.createElement('div'),
    };

    const { rerender } = renderHook(() => useMap(mapRef), {
      wrapper: createWrapper(store),
    });

    const newCity = {
      name: 'Amsterdam',
      location: {
        latitude: 52.370216,
        longitude: 4.895168,
      },
      zoom: 13,
    };
    createMockStore(newCity);
    rerender();

    expect(mockMapInstance.setView).toHaveBeenCalledWith(
      [mockCity.location.latitude, mockCity.location.longitude],
      13
    );
  });

  it('It should not call setView if the map has not been created', () => {
    const store = createMockStore();
    const mapRef: MutableRefObject<HTMLElement | null> = { current: null };

    renderHook(() => useMap(mapRef), {
      wrapper: createWrapper(store),
    });

    expect(mockMapInstance.setView).not.toHaveBeenCalled();
  });
});
