import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
  cart: [],

  addItem: (product) => {
    const cart = get().cart;

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        ),
      });
    } else {
      set({
        cart: [...cart, product],
      });
    }
  },

  removeItem: (id) =>
  set((state) => ({
    cart: state.cart.filter(
      (item) => item.id !== id
    ),
  })),
}),
{
  name: "cart-storage",
}
)
);

export default useCartStore;