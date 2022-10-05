import { FC } from "react";
import { List } from "../List";
import { Map } from "../Map";
import { Modal } from "../Modal";
import { Header } from "./Header";

import styles from "./Layout.module.css";

export const Layout: FC = () => {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.wrapper}>
        <Map />
        <List />
        <Modal />
      </div>
    </div>
  );
};
