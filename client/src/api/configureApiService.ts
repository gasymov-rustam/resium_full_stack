// import { store } from "../app/store";
// import { api } from "./api";

// api.interceptors.request.use(
//   (config) => {
//     const authToken = store.getState()?.auth?.token;

//     config = {
//       ...config,
//       headers: {
//         ...config.headers,
//         Authorization: `Bearer ${authToken}`,
//       },
//     };
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
