import { AxiosResponse } from "axios";
import { IUser } from "../types/IUser";
import { authApi } from "./auth/authApi";

export const getUsersList = async (): Promise<AxiosResponse<IUser[]>> =>
  authApi.get<IUser[]>("/users");
