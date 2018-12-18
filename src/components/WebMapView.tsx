import React, { useContext, useEffect, useRef } from "react";

import { AppContext } from "../contexts/App";
import useWebMap from "../hooks/useWebMap";
import MapContainer from "./styled/MapContainer";

const WebMapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setContainer] = useWebMap(mapRef.current as HTMLDivElement);
  const { state } = useContext(AppContext);
  const { items } = state;

  useEffect(
    () => {
      setContainer(mapRef.current as HTMLDivElement);
    },
    [items, mapRef.current]
  );

  return <MapContainer ref={mapRef} />;
};

export default WebMapView;
