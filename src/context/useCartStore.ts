import { create } from "zustand";
import { CartItem } from "../pages/CartItemsPage";

interface CartState {
  cartItems: CartItem[];
  totalQuantity: number;
  setCartItem: (cartItems: CartItem[]) => void;
  updateCartItems: (updatedCartItems: CartItem[]) => void;
}

const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  totalQuantity: 0,
  setCartItem: (cartItems) =>
    set((state) => ({
      ...state,
      cartItems,
      totalQuantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    })),
  updateCartItems: (updatedCartItems) =>
    set((state) => ({
      ...state,
      cartItems: updatedCartItems,
      totalQuantity: updatedCartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      ),
    })),
}));

export default useCartStore;
