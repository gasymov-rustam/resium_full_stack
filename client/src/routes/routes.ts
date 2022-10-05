import { Activation } from "../pages/Activation";
import { Layout } from "../pages/Layout";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export const routes = [
  {
    path: "/",
    exact: true,
    component: Layout,
  },
  {
    path: "/login",
    exact: true,
    component: Login,
  },
  {
    path: "/register",
    exact: true,
    component: Register,
  },
  {
    path: "/activate/:link",
    exact: true,
    component: Activation,
  },
];
