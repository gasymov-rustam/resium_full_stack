import { createAsyncThunk } from "@reduxjs/toolkit";
import { registrationUser } from "../../api/auth/authService";

export const fetchRegistration = createAsyncThunk(
  "auth/fetchNRegistration",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await registrationUser(data.email, data.password);
      const credentials = await response.data;
      return credentials;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
