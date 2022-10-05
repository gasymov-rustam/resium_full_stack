import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchLogout } from "../../../features/authSlice/fetchLogout";

import logo from "../../../assets/images/logo-devalore.jpg";
import styles from "./Header.module.css";
import { LOGOUT_USER } from "../../../apollo/mutations/user";
import { useMutation } from "@apollo/client";
import { clearResults } from "../../../features/authSlice/authSlice";

export const Header: FC = () => {
  const [logoutUser] = useMutation(LOGOUT_USER);
  const { isApolloServer } = useAppSelector((state) => state.server);
  const user = useAppSelector((state) => state.auth.user?.user);
  const dispatch = useAppDispatch();

  const logout = async () => {
    if (isApolloServer) {
      dispatch(fetchLogout());
    }

    if (!isApolloServer) {
      try {
        await logoutUser();
        dispatch(clearResults());
        console.log("logout reset");
      } catch (error) {
        throw new Error();
      }
    }
  };

  return (
    <div className={styles.root}>
      <img
        src={logo}
        className={styles.img}
        loading="lazy"
        width="2"
        height="1"
        alt="what`s wrong with downloading"
        decoding="async"
      />

      {/* <button onClick={getUsers}>Users</button> */}

      <div className={styles.credentials}>
        <span className={styles.user}>{user?.email}</span>

        <button className={styles.btn} onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};
