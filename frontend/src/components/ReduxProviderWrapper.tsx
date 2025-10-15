"use client";

import { Provider } from "react-redux";
import { createStore } from "@/redux/store";
import { User } from "@/redux/userSlice";
import { ReactNode } from "react";

interface ReduxProviderProps {
  children: ReactNode;
  initialUser?: User | null; // same type as preloadedState
}

import { useMemo } from "react";

export default function ReduxProviderWrapper({
  children,
  initialUser,
}: ReduxProviderProps) {
  const store = useMemo(() => createStore({ user: initialUser ?? null }), []);

  return <Provider store={store}>{children}</Provider>;
}
