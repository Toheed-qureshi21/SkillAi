import { configureStore } from "@reduxjs/toolkit";
import userReducer, { User } from "./userSlice";

interface PreloadedState {
  user?: User | null; // initialUser
}

export const createStore = (preloadedState?: PreloadedState) =>
  configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: preloadedState
      ? {
          user: {
            user: preloadedState.user ?? null, // ensure null if undefined
            loading: false,
            error: null,
          },
        }
      : undefined,
  });

const store = createStore();
// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
