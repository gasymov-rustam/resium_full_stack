import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
  Reducer,
  AnyAction,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import authSlice from "../features/authSlice/authSlice";
import planeSlice from "../features/planesSlice/planeSlice";
import serverSlice from "../features/serverSlice";

const persistConfig = {
  key: process.env.REACT_APP_STORAGE_KEY as string,
  storage,
  whitelist: ["auth"],
};

const appReducer = combineReducers({
  planes: planeSlice,
  auth: authSlice,
  server: serverSlice,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "auth/clearResults") {
    // this applies to all keys defined in persistConfig(s)
    storage.removeItem("persist:root");

    state = {} as RootState;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
