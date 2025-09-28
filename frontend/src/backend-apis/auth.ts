import { API_ROUTES } from "@/config/apiRoutes";
import { BackendAPI } from "./axiosInstance";


export const signupUser = async (data: { name: string; email: string; password: string }) => {
  return await  BackendAPI.post(API_ROUTES.auth.signup, data);
};

export const loginUser = async (data: { email: string; password: string }) => {
  return await  BackendAPI.post(API_ROUTES.auth.login, data);
};
export const verifyEmail = async (data: { token: string }) => {
  return await  BackendAPI.post(API_ROUTES.auth.verifyEmail, data);
}