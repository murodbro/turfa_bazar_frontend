import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  sub_category: SubCategory[];
}

const useCategory = (slug: string) => {
  const apiClient = new APIClient<Category>(`category_items/${slug}/`);
  return useQuery({
    queryKey: ["category", slug],
    queryFn: apiClient.getAll,
  });
};

export default useCategory;
