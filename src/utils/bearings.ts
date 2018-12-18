// https://stackoverflow.com/questions/11415106/issue-with-calcuating-compass-bearing-between-two-gps-coordinates

const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export const bearings = (
  startLatitude: number,
  startLongitude: number,
  stopLatitude: number,
  stopLongitude: number
) => {
  const dLon = toRad(stopLongitude - startLongitude);
  const y = Math.sin(dLon) * Math.cos(toRad(stopLatitude));
  const x =
    Math.cos(toRad(startLatitude)) * Math.sin(toRad(stopLatitude)) -
    Math.sin(toRad(startLatitude)) *
      Math.cos(toRad(stopLatitude)) *
      Math.cos(dLon);
  const degrees = toDeg(Math.atan2(y, x));

  if (degrees > -22.5 && degrees <= 22.5) {
    return "N";
  } else if (degrees > 22.5 && degrees <= 67.5) {
    return "NE";
  } else if (degrees > 67.5 && degrees <= 112.5) {
    return "E";
  } else if (degrees > 112.5 && degrees <= 157.5) {
    return "SE";
  } else if (degrees > 157.5 || degrees <= -157.5) {
    return "S";
  } else if (degrees > -157.5 && degrees <= -112.5) {
    return "SW";
  } else if (degrees > -112.5 && degrees <= -67.5) {
    return "W";
  } else {
    return "NW";
  }
};
