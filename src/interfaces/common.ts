export interface NearbyItem {
  OBJECTID?: string;
  address: string;
  name: string;
  phone: string,
  url: string,
  type: string;
  location: {
    x: number;
    y: number;
  };
  bearing: string;
  distance: number;
  icon: string;
}

export interface AddressItem {
  name: string;
  address: string;
  type: string;
  distance: number;
  bearing: string;
  icon: string;
}

export interface AppPosition {
  type: string;
  latitude: number;
  longitude: number;
}

export interface AppState {
  mode: string;
  items: NearbyItem[];
  isDayTime: boolean;
  position?: AppPosition;
}

export interface LatLon {
  latitude: number;
  longitude: number;
}