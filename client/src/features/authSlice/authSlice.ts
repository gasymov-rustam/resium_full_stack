import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/IUser";
import { fetchCheckAuth } from "./fetchCheckAuth";
import { fetchLogin } from "./fetchLogin";
import { fetchRegistration } from "./fetchRegistration";

const initialState = {
  isLoading: false,
  error: null as Error | null,
  user: {} as IUser,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = payload?.user?.isActivated ? true : false;
      state.user = payload;
    },
    setUnathorizedError: (state, { payload }) => {
      state.error = payload;
    },
    clearResults() {},
    setNewUser: (state, { payload }) => {
      window.location.href = "http://localhost:3000/login";
      state.isAuthenticated = payload?.user?.isActivated ? true : false;
      state.user = payload;
    },
  },
  extraReducers: {
    [fetchLogin.pending.type]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [fetchLogin.fulfilled.type]: (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = payload?.user?.isActivated ? true : false;
      state.user = payload;
    },
    [fetchLogin.rejected.type]: (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = payload.message;
    },

    [fetchRegistration.pending.type]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [fetchRegistration.fulfilled.type]: (state, { payload }) => {
      window.location.href = "http://localhost:3000/login";
      state.isLoading = false;
      state.error = null;
      state.user = payload;
    },
    [fetchRegistration.rejected.type]: (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = payload.message;
    },

    [fetchCheckAuth.pending.type]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [fetchCheckAuth.fulfilled.type]: (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.user = payload;
    },
    [fetchCheckAuth.rejected.type]: (state, { payload }) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = payload.message;
    },
  },
});

export const { clearResults, setCredentials, setUnathorizedError, setNewUser } = authSlice.actions;
export default authSlice.reducer;
