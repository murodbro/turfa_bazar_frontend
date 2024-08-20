import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sub_category: SubCategory[];
}

export interface Products {
  name: string;
  id: string;
  image: string;
  base_price: string;
  description: string;
  category?: Category;
  subcategory?: SubCategory;
}

const apiClient = new APIClient<Products[]>("");

const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: apiClient.getAll,
  });

export default useProducts;
