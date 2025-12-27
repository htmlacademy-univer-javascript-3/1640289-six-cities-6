import { Icon } from 'leaflet';

export const defaultCustomIcon = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [30, 40],
  iconAnchor: [20, 40],
});

export const currentCustomIcon = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [30, 40],
  iconAnchor: [20, 40],
});
