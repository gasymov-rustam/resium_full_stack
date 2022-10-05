import { FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { removeOnePlane, setUpdatePlane } from "../../../features/planesSlice/planeSlice";
import { IPlaneModel } from "../../../types/IPlane";

import { getCircleCoords } from "../../../utils/getCircleCoords";
import { inputsMap } from "../../../constants/inputs";
import { sizesMap } from "../../../constants/sizes";
import { colorsMap } from "../../../constants/colors";
import { useMutation } from "@apollo/client";
import { deletePlane } from "../../../features/planesSlice/deletePlane";
import { editPLane } from "../../../features/planesSlice/editPlane";
import { DELETE_PLANE, UPDATE_PLANE } from "../../../apollo/mutations/planes";

import styles from "./CurrentInfo.module.css";

interface IState {
  name: string;
  radius: number;
  latitude: number;
  longitude: number;
  height: number;
}

interface IProps {
  data: IPlaneModel;
}

export const CurrentInfo: FC<IProps> = ({ data }) => {
  const { isApolloServer } = useAppSelector((state) => state.server);
  const [updateApolloPlane] = useMutation(UPDATE_PLANE);
  const [deleteApolloPlane] = useMutation(DELETE_PLANE);
  const [isDisableButton, setIsDisableButton] = useState(true);
  const [isVisibleChanges, setIsVisibleChanges] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isColor, setIsColor] = useState(data.color);
  const [isSize, setIsSize] = useState(data.size);
  const position = useAppSelector((state) => state.planes.currentPosition);
  const [values, setValues] = useState<any>({
    name: data.name,
    radius: data.radius,
    latitude: data.targetCoords.latitude,
    longitude: data.targetCoords.longitude,
    height: data.targetCoords.height,
  });

  const dispatch = useAppDispatch();

  const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev: IState) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedPlane = {
      userId: data.userId,
      id: data.id,
      name: values.name,
      color: isColor,
      size: isSize,
      radius: +values.radius,
      targetCoords: {
        longitude: +values.longitude,
        latitude: +values.latitude,
        height: +values.height,
      },
      flightWay: getCircleCoords(
        +values.longitude,
        +values.latitude,
        +values.radius,
        +values.height
      ),
    };

    if (isApolloServer) {
      dispatch(editPLane(updatedPlane));
    }

    if (!isApolloServer) {
      try {
        const response = await updateApolloPlane({
          variables: {
            input: updatedPlane,
          },
        });

        const data = await response.data?.updatePlane;
        dispatch(setUpdatePlane(data));
      } catch (error) {
        throw new Error();
      }
    }

    setIsVisibleChanges(false);

    setValues({
      name: data.name,
      radius: data.radius,
      latitude: data.targetCoords.latitude,
      longitude: data.targetCoords.longitude,
      height: data.targetCoords.height,
    });
  };

  const handleVisibilityChange = useCallback(() => {
    if (!isDisableButton) {
      const validName = values.name && values.name.length > 3;
      const validRadius = values.radius && values.radius > 1 && values.radius < 9;
      const validLatitude = values.latitude && values.latitude > 0;
      const validLongitude = values.longitude && values.longitude > 0;
      const validHeight = values.height && values.height > 0;

      setIsValid(validName && validLatitude && validLongitude && validRadius && validHeight);
    }
  }, [values, isDisableButton]);

  const handlePlaneRemove = (id: string | undefined) => async () => {
    if (id) {
      if (isApolloServer) {
        dispatch(deletePlane(id));
      }

      if (!isApolloServer) {
        try {
          const response = await deleteApolloPlane({
            variables: {
              id,
            },
          });

          const data = await response.data?.deletePlane;
          dispatch(removeOnePlane(data.id));
        } catch (error) {
          throw new Error();
        }
      }
    }
  };

  useEffect(() => {
    if (isDisableButton) {
      setIsDisableButton(false);
    }

    handleVisibilityChange();
  }, [values, handleVisibilityChange, isDisableButton]);

  return (
    <div className={styles.coords}>
      <div>lat: {position && position.latitude.toFixed(4)}</div>
      <div>lon: {position && position.longitude.toFixed(4)}</div>
      {/* <div>height: {position && position.height.toFixed(4)}</div> */}

      {isVisibleChanges && (
        <form name="saveChanges" className={styles.root} onSubmit={handleSubmit}>
          {inputsMap.map((inp, idx) => (
            <label key={idx} className={styles[inp.className]}>
              <span>{inp.name}</span>
              <input
                type={inp.type}
                name={inp.name}
                autoComplete="off"
                placeholder={inp.placeholder}
                value={values[inp.name] || ""}
                onChange={handleValuesChange}
              />
            </label>
          ))}

          <div className={styles["select-size"]}>
            <h3 className={styles["size-title"]}>Size of Plane</h3>
            <select
              name="size"
              className={styles.size}
              defaultValue={isSize}
              onChange={(e) => setIsSize(+e.target.value)}
            >
              {sizesMap.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles["colors-wrapper"]}>
            <h3 className={styles["color-title"]}>Color of Plane</h3>
            <div className={styles.colors}>
              {colorsMap.map((color) => (
                <label key={color.value} className={styles["radio-colors"]}>
                  <input
                    type="radio"
                    name={color.value}
                    value={color.value}
                    checked={color.value === isColor}
                    onChange={(e) =>
                      setIsColor((color) => (color === e.target.value ? color : e.target.value))
                    }
                  />
                  <span>{color.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.btn} disabled={!isValid}>
            Save
          </button>
        </form>
      )}

      {!isVisibleChanges && (
        <div className={styles["wrapper-btn"]}>
          <button onClick={() => setIsVisibleChanges(true)} className={styles.btn}>
            Edit
          </button>
          <button onClick={handlePlaneRemove(data.id)} className={styles.btn}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
