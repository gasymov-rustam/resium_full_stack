import axios from "axios";
import { store } from "../../app/store";
import { clearResults, setCredentials } from "../../features/authSlice/authSlice";
import { AuthResponse } from "../../types/response/authResponse";

export const API_URL = `http://localhost:5000/api`;

export const authApi = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

authApi.interceptors.request.use((config) => {
  const authToken = store.getState()?.auth?.user?.accessToken;

  config = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${authToken}`,
    },
  };

  return config;
});

authApi.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (+error.response.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true;

      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });

        store.dispatch(setCredentials(response.data));
        return authApi.request(originalRequest);
      } catch (error) {
        store.dispatch(clearResults());
      }
    }
    throw error;
  }
);

export default authApi;
