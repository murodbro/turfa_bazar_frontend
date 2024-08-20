import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";
import { Category } from "./useProducts";

const apiClient = new APIClient<Category[]>(`category_items/`);

const useAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: apiClient.getAll,
  });
};

export default useAllCategories;
