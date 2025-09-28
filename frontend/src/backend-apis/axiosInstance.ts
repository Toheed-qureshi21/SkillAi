import axios from "axios";

const backendRoute = process.env.NEXT_PUBLIC_BACKEND_ROUTE;

if (!backendRoute) {
  throw new Error("NEXT_PUBLIC_BACKEND_ROUTE must be defined");
}

export const BackendAPI = axios.create({
  baseURL: `${backendRoute.replace(/\/$/, "")}/api`,
  withCredentials: true,
});
