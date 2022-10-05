import axios from "axios";
import { store } from "../../app/store";

const planesApi = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-type": "application/json;charset=utf-8",
  },
});

planesApi.interceptors.request.use(
  (config) => {
    const authToken = store.getState()?.auth?.user?.accessToken;

    config = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${authToken}`,
      },
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default planesApi;
