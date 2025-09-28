import axios from "axios";

export const BackendAPI = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/api`, 
  withCredentials: true,
});