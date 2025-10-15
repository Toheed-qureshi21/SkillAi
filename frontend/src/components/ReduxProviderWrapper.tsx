"use client";

import { Provider } from "react-redux";
import { createStore } from "@/redux/store";
import { ReactNode, useMemo } from "react";

interface ReduxProviderProps {
  children: ReactNode;
}

export default function ReduxProviderWrapper({ children }: ReduxProviderProps) {
  const store = useMemo(() => createStore(), []);

  return <Provider store={store}>{children}</Provider>;
}
