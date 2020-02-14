import esri = __esri;

export interface NearbyItem {
    OBJECTID: string;
    address: string;
    name: string;
    phone: string;
    url: string;
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
    selected: boolean;
}

export interface DirectionsResult {
    directions: esri.DirectionsFeatureSet;
    name: string;
}

export interface AppState {
    categories?: Category[];
    currentNearbyItem?: NearbyItem;
    currentPosition?: AppPosition;
    currentRoute?: DirectionsResult;
    hasGeolocationPermission?: boolean;
    isDayTime?: boolean;
    items?: NearbyItem[];
    mode?: string;
    mounted?: boolean;
    position?: AppPosition;
    redoSearch?: boolean;
    showFilter?: boolean;
    showDirections?: boolean;
    showNotification?: boolean;
}

export interface LatLon {
    latitude: number;
    longitude: number;
}

export interface ContextProps {
    state: AppState;
    setState: React.Dispatch<{}>;
}

export interface AppProviderProps {
    children: JSX.Element[];
    location: Location;
}

export interface RouteDirectionsProps {
    start: esri.Graphic;
    stop: esri.Graphic;
    view: esri.MapView;
}

export interface ListenForLocateProps {
    position?: AppPosition;
    hasGeolocationPermission?: boolean;
}

export interface UpdateExtentChangeProps {
    currentPosition?: AppPosition;
    showNotification?: boolean;
}
