"use client";

import { store } from "@/lib/mobx";
import { createContext } from "react";

export const StoreContext = createContext(store);
export const StoreWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
