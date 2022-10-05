import { createAsyncThunk } from "@reduxjs/toolkit";
import { getEntities } from "../../api/enties/getEntities";

export const getPlanes = createAsyncThunk("planes/getPlanes", async (_, { rejectWithValue }) => {
  try {
    const response = await getEntities();
    const data = await response.data;
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
