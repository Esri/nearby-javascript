import { useEffect, useState } from "react";

import { LatLon } from "../interfaces/common";

/**
 * Hook to determine current geolocation
 */
const useGeolocation = () => {
  const [state, setState] = useState<LatLon>({
    latitude: 0,
    longitude: 0
  });

  let mounted = true;

  const locate = (latLon?: LatLon) => {
    // If geolocation not supported in the
    // browser, set lat/lon to 0
    // will be handled in application context
    if (!("geolocation" in navigator)) {
      setState({ latitude: 0, longitude: 0 });
      return;
    }
    if (latLon) {
      setState(latLon);
    } else {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setState({ latitude, longitude });
      });
    }
  };

  useEffect(
    () => {
      if (mounted) {
        locate();
      }
      return () => {
        mounted = false;
      };
    },
  []
  );
  return [state, locate];
};

export default useGeolocation;
