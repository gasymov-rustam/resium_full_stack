import { PayloadAction } from "@reduxjs/toolkit";
import { IState } from "../planesSlice/planeSlice";

export const setError = (state: IState, { payload }: PayloadAction<Error>) => {
  state.error = payload;
  state.status = false;
};
