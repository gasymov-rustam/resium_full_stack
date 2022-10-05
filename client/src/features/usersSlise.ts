import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../types/IUser";

interface IState {
  error: Error | null;
  status: string | null;
  user: IUser | null;
}

const initialState: IState = {
  error: null,
  status: null,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.user = payload;
    },
    removeCurrentUser: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
  extraReducers: {},
});

export const { setCurrentUser, removeCurrentUser } = userSlice.actions;
export default userSlice.reducer;
