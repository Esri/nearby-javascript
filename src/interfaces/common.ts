export interface NearbyItem {
  OBJECTID: string;
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

export interface AppPosition {
  type: string;
  latitude: number;
  longitude: number;
}

export interface Category {
  name: string;
  selected: boolean
}

export interface AppState {
  categories: Category[],
  currentNearbyItem?: NearbyItem,
  currentPosition?: AppPosition,
  redoSearch: boolean;
  isDayTime: boolean;
  items: NearbyItem[];
  mode: string;
  position?: AppPosition;
  showFilter: boolean;
  showNotification: boolean;
}

export interface LatLon {
  latitude: number;
  longitude: number;
}