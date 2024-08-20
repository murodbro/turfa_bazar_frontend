import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/api-client";

interface formData {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  password2: string;
}

const apiClient = new APIClient<formData>("user/register/");

const useRegister = () => {
  return useMutation({
    mutationFn: (formData: formData) => apiClient.post(formData),
  });
};

export default useRegister;
