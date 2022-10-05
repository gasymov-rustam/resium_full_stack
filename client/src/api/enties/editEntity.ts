import { IPlaneModel } from "../../types/IPlane";
import authApi from "../auth/authApi";

export const editEntity = (data: IPlaneModel, id: string) => authApi.patch(`/planes/${id}`, data);
