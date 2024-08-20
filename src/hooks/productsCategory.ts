import { create } from "zustand";

interface CategoryQuery {
  slug?: string;
}

interface ProductCategoryQuery {
  productQuery: CategoryQuery;
  setProductCategory: (productCategorySlug: string) => void;
  clearProductCategory: () => void;
}

const useProductCategory = create<ProductCategoryQuery>((set) => ({
  productQuery: {},
  setProductCategory: (categorySlug) => {
    set((store) => ({
      productQuery: { ...store.productQuery, slug: categorySlug },
    }));
  },
  clearProductCategory: () => set(() => ({ productQuery: {} })),
}));

export default useProductCategory;
