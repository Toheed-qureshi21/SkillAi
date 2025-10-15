export const API_ROUTES = {
  auth: {
    signup: "auth/signup",
    login: "auth/login",
    logout: "auth/logout",
    verifyEmail:"auth/verify-email"
  },
  user:{
    me:"/user/me",
    onboard:"user/onboard",
  }
};

// call like this 
// const loginUser = async (data: any) => {
//   return await axios.post(API_ROUTES.auth.login, data);
// };