import { Icon } from 'leaflet';

export type City = {
  title: string;
  lat: number;
  lng: number;
  zoom: number;
};

export type Point = {
  lat: number;
  lon: number;
  icon: Icon;
};

export type Points = Point[];
