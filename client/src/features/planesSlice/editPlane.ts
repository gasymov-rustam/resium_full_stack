import { editEntity } from "./../../api/enties/editEntity";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const editPLane = createAsyncThunk(
  "planes/editPlane",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await editEntity(data, data.id);
      const updatedPlane = await response.data;
      return updatedPlane;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
