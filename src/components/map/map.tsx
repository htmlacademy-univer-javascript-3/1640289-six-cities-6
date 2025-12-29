import {useRef, useEffect, useMemo} from 'react';
import { Marker, layerGroup } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import useMap from '../../hooks/use-map.tsx';
import { Points } from '../../shared/types/map.ts';
import classNames from 'classnames';

interface MapProps {
  points: Points;
  additionalClass: string;
}

function Map(props: MapProps): JSX.Element {
  const { points } = props;

  const mapRef = useRef(null);
  const map = useMap(mapRef);

  const markers = useMemo(() => points.map((point) => {
    const marker = new Marker({
      lat: point.lat,
      lng: point.lon,
    });

    marker.setIcon(point.icon);
    return marker;
  }), [points]);

  useEffect(() => {
    if (map) {
      const markerLayer = layerGroup().addTo(map);

      markers.forEach((marker) => {
        marker.addTo(markerLayer);
      });

      return () => {
        map.removeLayer(markerLayer);
      };
    }
  }, [map, markers]);

  return <section className={classNames('map', props.additionalClass)} ref={mapRef} />;
}

export default Map;
