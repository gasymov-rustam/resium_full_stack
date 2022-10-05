export interface ICoords {
  longitude: number;
  latitude: number;
  height: number;
}

export interface IPlaneModel {
  userId?: string;
  _id?: string;
  id?: string;
  name: string;
  color: string;
  size: number;
  timeStepInSeconds: number;
  radius: number;
  targetCoords: ICoords;
  flightWay: ICoords[];
}
