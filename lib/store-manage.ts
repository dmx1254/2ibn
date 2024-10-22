import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ServerBuy } from "./utils";

interface MyStore {
  servers: ServerBuy[];
  addSevers: (servers: ServerBuy[]) => void;
}

const useStore = create<MyStore>()(
  persist(
    (set) => ({
      servers: [],
      addSevers: (servers) => set((state) => ({ servers: servers })),
    }),
    {
      name: "ibendouma-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
