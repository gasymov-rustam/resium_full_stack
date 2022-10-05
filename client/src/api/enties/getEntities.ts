import authApi from "../auth/authApi";

export const getEntities = () => authApi.get("/planes");
