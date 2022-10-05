import {
  ArcType,
  CallbackProperty,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Color,
  PolylineArrowMaterialProperty,
  SceneTransforms,
  Viewer as CesiumViewer,
  Math as MathCessium,
} from "cesium";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { CesiumComponentRef, Entity, PolylineGraphics } from "resium";
import { useAppSelector } from "../../../app/hooks";
import { ICoords } from "../../../types/IPlane";
import st from "./Arrow.module.css";

export const Arrow: FC<{
  viewer: RefObject<CesiumComponentRef<CesiumViewer>>;
}> = ({ viewer }) => {
  const position = useAppSelector((state) => state.planes.currentPosition);
  const plane = useAppSelector((state) => state.planes.selectedPlane);
  const [popUpPosition, setPopUpPosition] = useState<Cartesian2 | null>(null);
  const [endOfLine, setEndOfLine] = useState<ICoords | null>(null);
  const lonRef = useRef<number>(0);
  const entityRef = useRef<any>(null);

  useEffect(() => {
    if (position) {
      if (lonRef.current !== 0) {
        setEndOfLine({
          longitude: lonRef.current,
          latitude: position.latitude + 3,
          height: position.height,
        });
      } else {
        setEndOfLine({
          longitude: position.longitude + 3,
          latitude: position.latitude + 3,
          height: position.height,
        });
      }
    }
  }, [position]);

  useEffect(() => {
    if (viewer?.current?.cesiumElement?.scene && endOfLine) {
      setPopUpPosition(
        SceneTransforms.wgs84ToWindowCoordinates(
          viewer.current?.cesiumElement.scene,
          Cartesian3.fromDegrees(endOfLine.longitude, endOfLine.latitude, endOfLine.height),
          new Cartesian2()
        )
      );
    }
  }, [viewer, endOfLine]);

  useEffect(() => {
    if (!plane) {
      setEndOfLine(null);
    }
  }, [plane]);

  useEffect(() => {
    if (popUpPosition && popUpPosition?.x < 0) {
      if (endOfLine && lonRef.current === 0) {
        lonRef.current = endOfLine?.longitude;
      }
      setPopUpPosition((prev: any) => {
        return { ...prev, x: 40 };
      });

      // setEndOfLine((prev: any) => {
      //   return { ...prev, longitude: lonRef.current };
      // });
    }
  }, [popUpPosition, lonRef, endOfLine, viewer]);

  useEffect(() => {
    if (lonRef.current !== 0 && viewer?.current?.cesiumElement?.camera) {
      // const position = viewer.current?.cesiumElement.scene
      // const a = SceneTransforms.wgs84ToDrawingBufferCoordinates(
      //   viewer.current?.cesiumElement.scene,
      //   Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
      //   new Cartesian2()
      // );
      // console.log(position);
    }

    // console.log(viewer?.current?.cesiumElement?.camera?.position);

    // console.log(
    //   viewer?.current?.cesiumElement?.camera.flyTo({
    //     destination: Cartesian3.fromDegrees(20, 10, 1000), //lon, lat, height
    //   })
    // );
  }, [popUpPosition, lonRef, viewer]);

  return (
    <>
      {position && endOfLine && (
        <Entity>
          <PolylineGraphics
            positions={
              new CallbackProperty(() => {
                return [
                  Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
                  Cartesian3.fromDegrees(endOfLine.longitude, endOfLine.latitude, endOfLine.height),
                ];
              }, false)
            }
            width={5}
            arcType={ArcType.NONE}
            material={new PolylineArrowMaterialProperty(Color.GREEN)}
          />
        </Entity>
      )}

      {popUpPosition && (
        <div
          className={plane ? st.popUp : st.popUpNoneVisible}
          style={{ left: popUpPosition.x, top: popUpPosition.y }}
        >
          <div>{plane && plane.name}</div>
          <button className={st.btn} onClick={() => console.log(222222222)}>
            Click me!
          </button>
        </div>
      )}
    </>
  );
};
