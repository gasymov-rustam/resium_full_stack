import { FC } from "react";

import styles from "./Loader.module.css";

import logo from "../../assets/images/logo-devalore.jpg";

export const Loader: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.fly}></div>

        <img
          src={logo}
          className={styles.img}
          loading="lazy"
          width="2"
          height="1"
          alt="what`s wrong with downloading"
          decoding="async"
        />
      </div>
    </div>
  );
};
