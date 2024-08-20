import { create } from "zustand";

interface State {
  addCartNumber: number;
  cartProductName: string;
  setAddCart: (productId: string) => void;
}

const useAddCartQueryState = create<State>((set) => ({
  addCartNumber: 0,
  cartProductName: "",
  setAddCart: (productId) =>
    set((store) => ({
      addCartNumber: store.addCartNumber + 1,
      cartProductName: productId,
    })),
}));

export default useAddCartQueryState;
