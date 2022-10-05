import { FC, useMemo } from "react";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setModalVisible } from "../../features/planesSlice/planeSlice";
import { IPlaneModel } from "../../types/IPlane";
import { Card } from "./Card";

import styles from "./List.module.css";

export const List: FC = () => {
  const planes = useAppSelector((state: RootState) => state.planes.planes);
  const error = useAppSelector((state: RootState) => state.planes.error);
  const dispatch = useAppDispatch();

  const isError = useMemo(() => (error ? true : false), [error]);

  const handlePlaneCreate = () => {
    dispatch(setModalVisible(true));
  };

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        {planes?.length ? (
          planes?.map((item: IPlaneModel) => <Card key={item.id} plane={item} />)
        ) : (
          <></>
        )}
      </div>

      <button className={styles.btn} disabled={isError} onClick={handlePlaneCreate}>
        Add Plane
      </button>
    </div>
  );
};
