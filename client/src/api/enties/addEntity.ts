import authApi from "../auth/authApi";
import { IPlaneModel } from "../../types/IPlane";

export const addEntity = (data: IPlaneModel) => authApi.post("/planes", data);
