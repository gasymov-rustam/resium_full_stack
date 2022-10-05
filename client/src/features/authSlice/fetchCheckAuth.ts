import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthResponse } from "../../types/response/authResponse";
import { API_URL } from "../../api/auth/authApi";

export const fetchCheckAuth = createAsyncThunk(
  "auth/fetchCheckAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      const data = await response.data;
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
