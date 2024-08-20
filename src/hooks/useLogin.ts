import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/api-client";

interface formData {
  email: string;
  password: string;
}

const apiClient = new APIClient<formData>("user/login/");

const useLogin = () => {
  return useMutation({
    mutationFn: (formData: formData) => apiClient.post(formData),
  });
};

export default useLogin;
