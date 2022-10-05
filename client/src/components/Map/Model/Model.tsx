import { FC } from "react";
import {
  Cartesian3,
  Color,
  JulianDate,
  PolylineGlowMaterialProperty,
  SampledPositionProperty,
  TimeInterval,
  TimeIntervalCollection,
  VelocityOrientationProperty,
} from "cesium";
import { Entity } from "resium";
import { ICoords, IPlaneModel } from "../../../types/IPlane";
import { useAppSelector } from "../../../app/hooks";

interface IProps {
  entity: IPlaneModel;
  start: JulianDate;
  stop: JulianDate;
  timeStepInSeconds: number;
}

export const Model: FC<IProps> = ({ entity, start, stop, timeStepInSeconds }) => {
  const selectedPlane = useAppSelector((state) => state.planes.selectedPlane);

  const isEntitySelected = selectedPlane?.id === entity.id;

  const positionProperty = new SampledPositionProperty();

  entity.flightWay.forEach((way: ICoords, index: number) => {
    const time = JulianDate.addSeconds(start, index * timeStepInSeconds, new JulianDate());
    const cartesianPosition = Cartesian3.fromDegrees(way.longitude, way.latitude, way.height);

    positionProperty.addSample(time, cartesianPosition);
  });

  return (
    <>
      <Entity
        id={`${entity.id}`}
        name={entity.name}
        availability={new TimeIntervalCollection([new TimeInterval({ start: start, stop: stop })])}
        position={positionProperty}
        orientation={new VelocityOrientationProperty(positionProperty)}
        selected={isEntitySelected}
        model={{
          uri: "/models/Cesium_Air.glb",
          minimumPixelSize: entity.size,
          color: Color.fromCssColorString(entity.color),
        }}
        path={{
          resolution: 1,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: Color.YELLOW,
          }),
          width: 10,
        }}
      />
      <Entity
        position={Cartesian3.fromDegrees(
          entity.targetCoords.longitude,
          entity.targetCoords.latitude,
          entity.targetCoords.height
        )}
        name="target"
        point={{ pixelSize: 10, color: Color.RED }}
      />
    </>
  );
};
