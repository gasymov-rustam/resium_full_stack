import { FC, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { colorsMap } from "../../constants/colors";
import { inputsMap } from "../../constants/inputs";
import { sizesMap } from "../../constants/sizes";
import { addPlane } from "../../features/planesSlice/addPlane";
import { setModalVisible, setNewPlane } from "../../features/planesSlice/planeSlice";
import { IPlaneModel } from "../../types/IPlane";
import { getCircleCoords } from "../../utils/getCircleCoords";
import { useMutation } from "@apollo/client";
import { CREATE_PLANE } from "../../apollo/mutations/planes";

import styles from "./Modal.module.css";

interface IState {
  name: string;
  color: string;
  radius: number;
  latitude: number;
  longitude: number;
  height: number;
  size: number;
}

export const Modal: FC = () => {
  const { isModalVisible, error } = useAppSelector((state) => state.planes);
  const { user } = useAppSelector((state) => state.auth.user);
  const { isApolloServer } = useAppSelector((state) => state.server);
  const [newApolloPlane] = useMutation(CREATE_PLANE);
  const [isValid, setIsValid] = useState(false);
  const [isColor, setIsColor] = useState("RED");
  const [isSize, setIsSize] = useState(64);
  const [values, setValues] = useState<any>({
    name: "",
    color: "red",
    size: 32,
    radius: 5,
    latitude: 0,
    longitude: 0,
    height: 0,
  });

  const dispatch = useAppDispatch();

  const handleWindowClose = () => {
    setValues({
      name: "",
      size: 32,
      radius: 5,
      latitude: 0,
      longitude: 0,
      height: 0,
    });
    dispatch(setModalVisible(false));
  };

  const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev: IState) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newPlane: Omit<IPlaneModel, "id"> = {
      userId: user?.id,
      name: values.name,
      timeStepInSeconds: 360,
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
      dispatch(addPlane(newPlane));
    }

    if (!isApolloServer) {
      try {
        const response = await newApolloPlane({
          variables: {
            input: newPlane,
          },
        });

        const data = await response.data?.createPlane;
        dispatch(setNewPlane(data));
      } catch (error) {
        throw new Error();
      }
    }

    setValues({
      name: "",
      latitude: 0,
      longitude: 0,
      height: 0,
      radius: 5,
    });
  };

  const handleVisibilityChange = useCallback(() => {
    const validName = values.name && values.name.length > 3;
    const validRadius = values.radius && values.radius > 1 && values.radius < 9;
    const validLatitude = values.latitude && values.latitude > 0;
    const validLongitude = values.longitude && values.longitude > 0;
    const validHeight = values.height && values.height > 0;
    setIsValid(validName && validLatitude && validLongitude && validRadius && validHeight);
  }, [values]);

  const modal = (
    <div className={styles.wrapper} onClick={handleWindowClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Add Plane</h2>

        <form name="plane" className={styles.root} onSubmit={handleSubmit}>
          {inputsMap.map((inp, idx) => (
            <label key={idx} className={styles[inp.className]}>
              <span>{inp.name}</span>
              <input
                type={inp.type}
                name={inp.name}
                placeholder={inp.placeholder}
                value={values[inp.name] || ""}
                onChange={handleValuesChange}
              />
              {inp.name === "name" ? <span>{error?.message}</span> : <></>}
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

          <div className={styles["modal-btn"]}>
            <button className={styles.btn} onClick={handleWindowClose}>
              Close
            </button>

            <button type="submit" className={styles.btn} disabled={!isValid}>
              Add Plane
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const portal = createPortal(modal, document.body);

  useEffect(() => {
    handleVisibilityChange();
  }, [values, handleVisibilityChange]);

  if (isModalVisible) {
    return <>{portal}</>;
  }

  return <></>;
};
