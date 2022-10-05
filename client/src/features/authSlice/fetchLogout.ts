import { createAsyncThunk } from "@reduxjs/toolkit";
import { logoutUser } from "../../api/auth/authService";
import { clearResults } from "./authSlice";

export const fetchLogout = createAsyncThunk(
  "auth/fetchLogout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await logoutUser();
      dispatch(clearResults());
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
