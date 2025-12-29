import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {render} from '@testing-library/react';
import {layerGroup, Marker} from 'leaflet';
import Map from './map.tsx';
import {DEFAULT_CUSTOM_ICON} from '../../shared/constants/asset.ts';

vi.mock('leaflet', () => {
  const mockMarker = {
    addTo: vi.fn().mockReturnThis(),
    setIcon: vi.fn().mockReturnThis(),
    remove: vi.fn()
  };

  const mockLayerGroup = {
    addTo: vi.fn().mockReturnThis(),
    clearLayers: vi.fn()
  };

  const mockMap = {
    removeLayer: vi.fn(),
    setView: vi.fn().mockReturnThis(),
    addLayer: vi.fn()
  };

  return {
    Marker: vi.fn(() => mockMarker),
    layerGroup: vi.fn(() => mockLayerGroup),
    Icon: vi.fn(),
    Map: vi.fn(() => mockMap),
    TileLayer: vi.fn()
  };
});

vi.mock('leaflet/dist/leaflet.css', () => ({}));

const mockMap = {
  removeLayer: vi.fn(),
  setView: vi.fn().mockReturnThis(),
  addLayer: vi.fn()
};

vi.mock('../../hooks/use-map.tsx', () => ({
  default: vi.fn(() => mockMap)
}));

const mockPoints = [
  {
    lat: 48.8566,
    lon: 2.3522,
    icon: DEFAULT_CUSTOM_ICON
  },
  {
    lat: 48.8606,
    lon: 2.3376,
    icon: DEFAULT_CUSTOM_ICON
  },
  {
    lat: 48.8738,
    lon: 2.2950,
    icon: DEFAULT_CUSTOM_ICON
  }
];

describe('Map Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render map section', () => {
    const { container } = render(
      <Map points={mockPoints} additionalClass="custom-map" />
    );

    const mapSection = container.querySelector('.map');
    expect(mapSection).toBeInTheDocument();
  });

  it('should apply additional class to map section', () => {
    const { container } = render(
      <Map points={mockPoints} additionalClass="cities__map" />
    );

    const mapSection = container.querySelector('.map');
    expect(mapSection).toHaveClass('map');
    expect(mapSection).toHaveClass('cities__map');
  });

  it('should create markers for all points', () => {
    render(<Map points={mockPoints} additionalClass="test-map" />);

    expect(Marker).toHaveBeenCalledTimes(mockPoints.length);
    expect(Marker).toHaveBeenCalledWith({ lat: 48.8566, lng: 2.3522 });
    expect(Marker).toHaveBeenCalledWith({ lat: 48.8606, lng: 2.3376 });
    expect(Marker).toHaveBeenCalledWith({ lat: 48.8738, lng: 2.2950 });
  });

  it('should create layer group when map is available', () => {
    render(<Map points={mockPoints} additionalClass="test-map" />);

    expect(layerGroup).toHaveBeenCalled();
  });

  it('should remove layer on cleanup', () => {
    const { unmount } = render(
      <Map points={mockPoints} additionalClass="test-map" />
    );

    unmount();

    expect(mockMap.removeLayer).toHaveBeenCalled();
  });

  it('should handle empty points array', () => {
    render(<Map points={[]} additionalClass="test-map" />);

    expect(Marker).not.toHaveBeenCalled();
  });

  it('should handle single point', () => {
    const singlePoint = [mockPoints[0]];

    render(<Map points={singlePoint} additionalClass="test-map" />);

    expect(Marker).toHaveBeenCalledTimes(1);
    expect(Marker).toHaveBeenCalledWith({
      lat: singlePoint[0].lat,
      lng: singlePoint[0].lon
    });
  });

  it('should update markers when points change', () => {
    const { rerender } = render(
      <Map points={mockPoints} additionalClass="test-map" />
    );

    const initialCallCount = vi.mocked(Marker).mock.calls.length;

    const newPoints = [
      {
        lat: 48.8584,
        lon: 2.2945,
        icon: DEFAULT_CUSTOM_ICON
      }
    ];

    rerender(<Map points={newPoints} additionalClass="test-map" />);

    expect(vi.mocked(Marker).mock.calls.length).toBeGreaterThan(initialCallCount);
  });

  it('should apply multiple additional classes', () => {
    const { container } = render(
      <Map points={mockPoints} additionalClass="cities__map offer__map" />
    );

    const mapSection = container.querySelector('.map');
    expect(mapSection).toHaveClass('map');
    expect(mapSection?.className).toContain('cities__map offer__map');
  });

  it('should render as section element', () => {
    const { container } = render(
      <Map points={mockPoints} additionalClass="test-map" />
    );

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('should create markers with correct coordinates format', () => {
    const points = [
      {
        lat: 52.3676,
        lon: 4.9041,
        icon: DEFAULT_CUSTOM_ICON
      }
    ];

    render(<Map points={points} additionalClass="test-map" />);

    expect(Marker).toHaveBeenCalledWith({
      lat: 52.3676,
      lng: 4.9041
    });
  });

  it('should memoize markers based on points', () => {
    const { rerender } = render(
      <Map points={mockPoints} additionalClass="test-map" />
    );

    const initialCallCount = vi.mocked(Marker).mock.calls.length;

    rerender(<Map points={mockPoints} additionalClass="test-map" />);

    expect(vi.mocked(Marker).mock.calls.length).toBe(initialCallCount);
  });

  it('should handle map reference correctly', () => {
    const { container } = render(
      <Map points={mockPoints} additionalClass="test-map" />
    );

    const mapSection = container.querySelector('.map');
    expect(mapSection).toBeInTheDocument();
  });

  it('should recreate markers when points array changes', () => {
    const { rerender } = render(
      <Map points={mockPoints} additionalClass="test-map" />
    );

    vi.clearAllMocks();

    const newPoints = [
      {
        lat: 50.0,
        lon: 3.0,
        icon: DEFAULT_CUSTOM_ICON
      },
      {
        lat: 51.0,
        lon: 4.0,
        icon: DEFAULT_CUSTOM_ICON
      }
    ];

    rerender(<Map points={newPoints} additionalClass="test-map" />);

    expect(Marker).toHaveBeenCalledTimes(newPoints.length);
  });

  it('should handle points with negative coordinates', () => {
    const points = [
      {
        lat: -33.8688,
        lon: 151.2093,
        icon: DEFAULT_CUSTOM_ICON
      }
    ];

    render(<Map points={points} additionalClass="test-map" />);

    expect(Marker).toHaveBeenCalledWith({
      lat: -33.8688,
      lng: 151.2093
    });
  });

  it('should maintain correct structure with custom class', () => {
    const { container } = render(
      <Map points={mockPoints} additionalClass="offer__map" />
    );

    const section = container.querySelector('section.map.offer__map');
    expect(section).toBeInTheDocument();
  });
});
