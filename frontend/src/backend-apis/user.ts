import { API_ROUTES } from "@/config/apiRoutes";
import { BackendAPI } from "./axiosInstance";
import { payloadForOnboarding } from "@/types";

export const getCurrentUser = async() => {
  return await BackendAPI.get(API_ROUTES.user.me);
}

export const onboardUser = async(data:payloadForOnboarding)=>{
  return await BackendAPI.post(API_ROUTES.user.onboard, data);
}
