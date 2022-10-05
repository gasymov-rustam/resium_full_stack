import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Camera, CesiumComponentRef, Clock, Globe, NightVisionStage, Scene, Viewer } from "resium";
import {
  Cartographic,
  ClockRange,
  createWorldTerrain,
  Ion,
  JulianDate,
  Math as MathCessium,
  Viewer as CesiumViewer,
} from "cesium";
import { throttle } from "lodash";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IPlaneModel } from "../../types/IPlane";
import {
  removeSelectedPlane,
  setCurrentPosition,
  setSelectedPlaneFromViewer,
} from "../../features/planesSlice/planeSlice";
import { Model } from "./Model";
import styles from "./Map.module.css";
import { Arrow } from "./Arrow";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYWY4ODUyMC1kYzRkLTRkMzEtOTczNS0wY2JkNzI4ODlhYWYiLCJpZCI6ODM0NzcsImlhdCI6MTY0NTYwNzYyOH0.2hWt0sf57NEZekKTGqDp5WadUzPPX3Z4aU4__Ou400U";

const terrainProvider = createWorldTerrain();
const timeStepInSeconds = 60;
const totalSeconds = timeStepInSeconds * 36;
// const start = JulianDate.fromIso8601("2020-03-09T23:10:00Z");
const start = JulianDate.fromDate(new Date());
const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());

export const Map: FC = () => {
  const dispatch = useAppDispatch();
  const [isNight, setIsNight] = useState(false);
  const planes = useAppSelector((state) => state.planes.planes);
  const error = useAppSelector((state) => state.planes.error);
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);

  const handleViewerClick = () => {
    if (!viewerRef.current?.cesiumElement?.selectedEntity) {
      dispatch(removeSelectedPlane());
    } else {
      const id = viewerRef.current?.cesiumElement?.selectedEntity["id"];
      dispatch(setSelectedPlaneFromViewer(id));
    }
  };

  const getCurrentPosition = useCallback(
    (time: JulianDate) => {
      if (viewerRef.current?.cesiumElement?.selectedEntity) {
        const position = viewerRef.current?.cesiumElement?.selectedEntity?.position?.getValue(time);

        if (position) {
          const cartographicLocation = Cartographic.fromCartesian(position);
          const coords = {
            latitude: MathCessium.toDegrees(cartographicLocation.latitude),
            longitude: MathCessium.toDegrees(cartographicLocation.longitude),
            height: cartographicLocation.height,
          };

          dispatch(setCurrentPosition(coords));
        }
      }
    },
    [dispatch]
  );

  const handleClockTick = throttle(getCurrentPosition, 100);

  useEffect(() => {
    if (new Date().getHours() >= 18) {
      setIsNight(true);
    } else if (new Date().getHours() <= 7) {
      setIsNight(true);
    } else {
      setIsNight(false);
    }
  }, []);

  return (
    <div className={styles.root}>
      {error && (
        // <div className={styles["network-error"]}>{errorMessage}. Please try again!</div>
        <div className={styles["network-error"]}>{error?.message}. Please try again!</div>
      )}

      <Viewer ref={viewerRef} full terrainProvider={terrainProvider} onClick={handleViewerClick}>
        <Scene />
        <Globe />
        <Camera />
        <Arrow viewer={viewerRef} />
        <NightVisionStage enabled={isNight} />
        <Clock
          startTime={start.clone()}
          stopTime={stop.clone()}
          currentTime={start.clone()}
          multiplier={10}
          shouldAnimate={true}
          clockRange={ClockRange.LOOP_STOP}
          onTick={(clock) => handleClockTick(clock.currentTime)}
        />

        {planes?.map((plane: IPlaneModel) => (
          <Model
            key={plane.id}
            entity={plane}
            start={start}
            stop={stop}
            timeStepInSeconds={timeStepInSeconds}
          />
        ))}
      </Viewer>
    </div>
  );
};
