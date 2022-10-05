import { IPlaneModel } from "../../types/IPlane";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addEntity } from "../../api/enties/addEntity";

export const addPlane = createAsyncThunk(
  "planes/addPlane",
  async (data: Omit<IPlaneModel, "id">, { rejectWithValue }) => {
    try {
      const response: any = await addEntity(data);
      const plane = await response.data;
      return plane;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
