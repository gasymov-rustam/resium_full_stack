import { addPlane } from "./addPlane";
import { setLoad } from "../helpers/setLoad";
import { ICoords, IPlaneModel } from "../../types/IPlane";
import { createSlice } from "@reduxjs/toolkit";
import { getPlanes } from "./getPlanes";
import { setError } from "../helpers/setError";
import { deletePlane } from "./deletePlane";
import { editPLane } from "./editPlane";

export interface IState {
  error: Error | null;
  status: boolean;
  selectedPlane: IPlaneModel | null | undefined;
  isModalVisible: false;
  currentPosition: ICoords | null;
  planes: IPlaneModel[];
}

const initialState: IState = {
  error: null,
  status: false,
  selectedPlane: null,
  isModalVisible: false,
  currentPosition: null,
  planes: [],
};

const planesSlice = createSlice({
  name: "planes",
  initialState,
  reducers: {
    getAllPlanes: (state, { payload }) => {
      state.planes = payload;
    },
    setModalVisible: (state, { payload }) => {
      state.isModalVisible = payload;
    },
    setNewPlane: (state, { payload }) => {
      state.planes = state.planes.concat(payload);
      state.isModalVisible = false;
    },
    setCurrentSelectedPlane: (state, { payload }) => {
      state.selectedPlane = payload;
    },
    setCurrentPosition: (state, { payload }) => {
      state.currentPosition = payload;
    },
    setUpdatePlane: (state, { payload }) => {
      const planeIdx = state.planes.findIndex((item) => item.id === payload.id);
      state.planes.splice(planeIdx, 1, payload);
      state.planes[planeIdx] = payload;
    },
    removeSelectedPlane: (state) => {
      state.selectedPlane = null;
    },
    setSelectedPlaneFromViewer: (state, { payload }) => {
      state.selectedPlane = state.planes.find((plane) => plane.id === payload);
    },
    removeAllPlanes: (state) => {
      state.planes = [];
    },
    removeOnePlane: (state, { payload }) => {
      state.planes = state.planes.filter((plane) => plane.id !== payload);
    },
    setApolloErrorToGetPlanes: setError,
  },
  extraReducers: {
    [getPlanes.pending.type]: setLoad,
    [getPlanes.fulfilled.type]: (state, { payload }) => {
      state.planes = payload;
      state.error = null;
      state.status = false;
    },
    [getPlanes.rejected.type]: setError,

    [addPlane.pending.type]: setLoad,
    [addPlane.fulfilled.type]: (state, { payload }) => {
      state.planes = state.planes.concat(payload);
      state.isModalVisible = false;
      state.error = null;
      state.status = false;
    },
    [addPlane.rejected.type]: setError,

    [deletePlane.pending.type]: setLoad,
    [deletePlane.fulfilled.type]: (state, { payload }) => {
      state.planes = state.planes.filter((plane) => plane.id !== payload);
      state.selectedPlane = null;
      state.error = null;
      state.status = false;
    },
    [deletePlane.rejected.type]: setError,

    [editPLane.pending.type]: setLoad,
    [editPLane.fulfilled.type]: (state, { payload }) => {
      const planeIdx = state.planes.findIndex((plane) => plane.id === payload.id);
      state.planes.splice(planeIdx, 1, payload);
      state.error = null;
      state.status = false;
    },
    [editPLane.rejected.type]: setError,
  },
});

export const {
  getAllPlanes,
  setModalVisible,
  setNewPlane,
  setCurrentSelectedPlane,
  setCurrentPosition,
  setUpdatePlane,
  removeSelectedPlane,
  setSelectedPlaneFromViewer,
  removeAllPlanes,
  removeOnePlane,
  setApolloErrorToGetPlanes,
} = planesSlice.actions;

export default planesSlice.reducer;
