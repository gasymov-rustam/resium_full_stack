import { ApiError } from "../../../helpers/AppError";
import { PlaneInput, PlaneModel, PlaneDocument } from "../models/model";

export const getAllPlanes = async (id: string) => {
  return await PlaneModel.find({ userId: id });
};

export const getOnePlane = async (id: string) => {
  const plane = await PlaneModel.findById(id);

  if (!plane) {
    throw ApiError.IdPlane();
  }

  return plane;
};

export const createPlane = async (plane: PlaneDocument) => {
  const existPlane = await PlaneModel.findOne({ name: plane.name });

  if (existPlane) {
    throw ApiError.ExistPlane();
  }

  const createdPlane = await PlaneModel.create(plane);

  return createdPlane;
};

export const updatePlane = async (id: string, plane: PlaneInput) => {
  if (!id) {
    throw ApiError.IdPlane();
  }

  const existPlane = await PlaneModel.findOne({ name: plane.name });

  if (existPlane && existPlane.id !== id) {
    throw ApiError.ExistPlane();
  }

  const updatedPlane = await PlaneModel.findByIdAndUpdate(id, plane, {
    runValidators: true,
    new: true,
  });

  return updatedPlane;
};

export const deletePlane = async (id: string) => {
  const plane = await PlaneModel.findById(id);

  if (!plane) {
    throw ApiError.IdPlane();
  }

  return PlaneModel.findByIdAndDelete(id);
};
