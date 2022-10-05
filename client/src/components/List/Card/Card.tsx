import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCurrentSelectedPlane } from "../../../features/planesSlice/planeSlice";
import { CurrentInfo } from "../CurrentInfo";
import { IPlaneModel } from "../../../types/IPlane";

import styles from "./Card.module.css";
import cn from "classnames";

interface IProps {
  plane: IPlaneModel;
}

export const Card: FC<IProps> = ({ plane }) => {
  const selectedPlane = useAppSelector((state) => state.planes.selectedPlane);
  const dispatch = useAppDispatch();

  const activePlane = selectedPlane?.id === plane.id;

  const handlePlaneActive = (plane: IPlaneModel) => () => {
    dispatch(setCurrentSelectedPlane(plane));
  };

  return (
    <>
      <button
        className={cn(styles.wrapper, { [styles.active]: activePlane })}
        onClick={handlePlaneActive(plane)}
      >
        {plane.name}
      </button>
      {activePlane ? <CurrentInfo data={plane} /> : <></>}
    </>
  );
};
