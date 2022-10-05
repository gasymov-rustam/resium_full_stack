import { Math as MathCessium } from "cesium";
import { ICoords } from "../types/IPlane";

export const getCircleCoords = (lon: number, lat: number, radius: number, height: number) => {
  const positions: ICoords[] = [];

  for (let i = 0; i <= 360; i += 10) {
    const radians = MathCessium.toRadians(i);

    const position = {
      longitude: lon + radius * 0.1 * Math.cos(radians),
      latitude: lat + radius * 0.1 * Math.sin(radians),
      height,
    };
    positions.push(position);
  }

  return positions;
};
