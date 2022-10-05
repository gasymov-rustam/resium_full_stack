import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../api/auth/authService";

export const fetchLogin = createAsyncThunk(
  "auth/fetchNLogin",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUser(data.email, data.password);
      const credentials = await response.data;
      return credentials;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
