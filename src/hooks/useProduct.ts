import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";

export interface Gallery {
  gallery: string;
}

export interface VariationTypes {
  id: string;
  name: string;
}

export interface VariationValues {
  id: string;
  type: string;
  value: string;
}

export interface Variations {
  id: string;
  product: string;
  price: number;
  stock: number;
  variation_values: VariationValues[];
}

interface Product {
  id: string;
  name: string;
  image: string;
  base_price: string;
  ordered_count: number;
  is_available: boolean;
  details: string;
  description: string;
  owner: string;
  gallery: Gallery[];
  variation_types: VariationTypes[];
  variations: Variations[];
}

const useProduct = (id: string) => {
  const apiClient = new APIClient<Product>(`product/${id}/`);
  return useQuery({
    queryKey: ["product", id],
    queryFn: apiClient.getAll,
  });
};

export default useProduct;
