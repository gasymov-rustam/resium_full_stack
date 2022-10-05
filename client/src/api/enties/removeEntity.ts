import authApi from "../auth/authApi";

export const removeEntity = (id: string) => authApi.delete(`/planes/${id}`);
