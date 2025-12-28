import { Icon } from 'leaflet';

export type Point = {
  lat: number;
  lon: number;
  icon: Icon;
};

export type Points = Point[];

export type LocationType = {
  latitude: number;
  longitude: number;
  zoom: number;
}
