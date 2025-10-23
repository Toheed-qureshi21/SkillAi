import { API_ROUTES } from "@/config/apiRoutes"
import { BackendAPI } from "./axiosInstance"



export const getIndustryInsights = async() => {
  return await BackendAPI.get(API_ROUTES.industryInsights.getIndustryInsights);
}
