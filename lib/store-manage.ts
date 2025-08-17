import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CURRENCY, ServerBuy } from "./utils";
import { Cart, USERLOGINRESPONSE } from "./types/types";

interface MyStore {
  servers: ServerBuy[];
  addSevers: (servers: ServerBuy[]) => void;
  devise: CURRENCY;
  addNewDevise: (dev: CURRENCY) => void;
  carts: Cart[];
  addToCart: (cart: Cart) => void;
  updateToCart: (productId: string, amount: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  activeServerRequest: string;
  addToActiveServerRequest: (serverActive: string) => void;
  user: USERLOGINRESPONSE | null;
  addUser: (user: USERLOGINRESPONSE) => void;
  deleteUser: () => void;
}

const useStore = create<MyStore>()(
  persist(
    (set) => ({
      user: null,
      servers: [],
      devise: { currencyName: "mad", curencyVal: 1 },
      carts: [],
      totalItems: 0,
      activeServerRequest: "dofus-kamas",
      addSevers: (servers) => set({ servers: servers }),
      addToActiveServerRequest: (serverActive) =>
        set({ activeServerRequest: serverActive }),
      addNewDevise: (dev) => set({ devise: dev }),
      addUser: (userLogin) => set({ user: userLogin }),
      deleteUser: () => set({ user: null }),
      addToCart: (cart) =>
        set((state) => {
          const updateCart = state.carts.map((crt) => {
            if (
              cart?.productId === crt?.productId &&
              crt.unitPrice === cart?.unitPrice
            ) {
              return {
                ...crt,
                totalPrice: crt.totalPrice + cart.totalPrice,
                amount: crt.amount + cart.amount,
              };
            }
            return crt;
          });
          if (!state.carts.some((crt) => crt?.productId === cart.productId)) {
            updateCart.push(cart);
          }
          return {
            carts: updateCart,
            totalItems: updateCart.length,
          };
        }),
      updateToCart: (productId, amount) =>
        set((state) => {
          const updatedCart = state.carts.map((crt) => {
            if (crt?.productId === productId) {
              return {
                ...crt,
                amount: amount,
                totalPrice: crt.unitPrice * amount,
              };
            }
            return crt;
          });
          return {
            carts: updatedCart,
            totalItems: updatedCart.length,
          };
        }),
      removeFromCart: (productId) =>
        set((state) => {
          const removeFromCart = state.carts.filter(
            (crt) => crt?.productId !== productId
          );
          return {
            carts: removeFromCart,
            totalItems: removeFromCart.length,
          };
        }),
      clearCart: () => set({ carts: [], totalItems: 0 }),
    }),

    {
      name: "ibendouma-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
