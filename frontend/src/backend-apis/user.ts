import { API_ROUTES } from "@/config/apiRoutes";
import { BackendAPI } from "./axiosInstance";

export const getCurrentUser = async() => {
  return await BackendAPI.get(API_ROUTES.user.me);
}

export const onboardUser = async(data:Object)=>{
  return await BackendAPI.post(API_ROUTES.user.onboard, data);
}
