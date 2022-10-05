import { IState } from "../planesSlice/planeSlice";

export const setLoad = (state: IState) => {
  state.error = null;
  state.status = true;
};
