import { removeEntity } from "../../api/enties/removeEntity";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const deletePlane = createAsyncThunk(
  "planes/deletePlane",
  async (id: string, { rejectWithValue }) => {
    try {
      await removeEntity(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
