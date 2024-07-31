import { StoreContext } from "@/components/StoreContext";
import { useContext } from "react";

export const useStores = () => {
  return useContext(StoreContext);
};
