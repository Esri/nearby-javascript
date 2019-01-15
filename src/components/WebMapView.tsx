import React, { useContext, useEffect, useRef } from "react";

import { AppContext } from "../contexts/App";
import useWebMap from "../hooks/useWebMap";
import Notification from "./Notification";
import MapContainer from "./styled/MapContainer";

const WebMapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setContainer] = useWebMap(mapRef.current as HTMLDivElement);
  const { state, setState } = useContext(AppContext);
  const { items } = state;

  useEffect(
    () => {
      setContainer(mapRef.current as HTMLDivElement);
    },
    [items, mapRef.current]
  );
  
  let mounted = false;

  useEffect(() => {
    mounted = true;
    setState({
      mounted
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MapContainer ref={mapRef}>
      <Notification />
    </MapContainer>
  );
};

export default WebMapView;
