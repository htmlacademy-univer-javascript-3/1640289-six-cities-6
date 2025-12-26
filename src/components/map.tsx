import { useRef, useEffect } from 'react';
import { Marker, layerGroup } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import useMap from '../hooks/use-map.tsx';
import { defaultCustomIcon } from '../shared/constants/asset.ts';
import { Points } from '../shared/types/map.ts';
import classNames from 'classnames';
import { City } from '../mocks/city.ts';

interface MapProps {
  city: City;
  points: Points;
  additionalClass: string;
}

function Map(props: MapProps): JSX.Element {
  const {city, points} = props;

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);

      points.forEach((point) => {
        const marker = new Marker({
          lat: point.lat,
          lng: point.lon
        });

        marker
          .setIcon(defaultCustomIcon)
          .addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, points]);

  return <section className= {classNames('map', props.additionalClass)} ref={mapRef} />;
}

export default Map;
