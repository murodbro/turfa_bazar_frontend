import axios from "axios";

export const baseURL = "http://127.0.0.1:8000/";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = () => {
    return axiosInstance.get<T>(this.endpoint).then((res) => res.data);
  };

  post = (data: T) => {
    return axiosInstance.post(this.endpoint, data).then((res) => res.data);
  };
}

export default APIClient;
