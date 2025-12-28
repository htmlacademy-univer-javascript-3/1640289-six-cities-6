import { Icon } from 'leaflet';

export const DEFAULT_CUSTOM_ICON = new Icon({
  iconUrl: 'img/pin.svg',
  iconSize: [30, 40],
  iconAnchor: [20, 40],
});

export const CURRENT_CUSTOM_ICON = new Icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [30, 40],
  iconAnchor: [20, 40],
});
