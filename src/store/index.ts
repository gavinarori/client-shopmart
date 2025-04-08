import { configureStore } from "@reduxjs/toolkit";
import rootReducers from "./rootReducer";

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for Thunks
    }),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development mode
});

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch; 

export default store;