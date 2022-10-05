import { AxiosResponse } from "axios";
import { AuthResponse } from "../../types/response/authResponse";
import { authApi } from "./authApi";

export const loginUser = async (
  email: string,
  password: string
): Promise<AxiosResponse<AuthResponse>> => {
  return authApi.post<AuthResponse>("/login", { email, password });
};

export const registrationUser = async (
  email: string,
  password: string
): Promise<AxiosResponse<AuthResponse>> => {
  return authApi.post<AuthResponse>("/registration", { email, password });
};

export const logoutUser = async (): Promise<void> => {
  return authApi.post("/logout");
};
