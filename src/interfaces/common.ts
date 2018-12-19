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
  currentPosition?: AppPosition,
  isDayTime: boolean;
  items: NearbyItem[];
  mode: string;
  position?: AppPosition;
  showNotification: boolean;
}

export interface LatLon {
  latitude: number;
  longitude: number;
}