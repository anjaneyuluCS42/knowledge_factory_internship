import { create } from "zustand";

const useCounterStore = create(
 (set) => ({
   count: 0,

   increment: () =>
     set((state) => ({
       count: state.count + 1,
     })),

   decrement: () =>
     set((state) => ({
       count: state.count - 1,
     })),
 })
);

export default useCounterStore;

//

export const useCartStore = create((set, get) => ({

  cart: [],

  addItem: (product) =>
    set((state) => ({
      cart: [...state.cart, product],
    })),

}));

// export default useCartStore;
//

