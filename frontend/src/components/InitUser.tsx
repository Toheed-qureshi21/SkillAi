// "use client";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setUser, clearUser } from "@/store/userSlice";

// export default function InitUser({ hasAuth }) {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user.data);

//   useEffect(() => {
//     if (!hasAuth) {
//       dispatch(clearUser());
//       return;
//     }

//     // ✅ Only fetch if Redux doesn't have user yet
//     if (!user) {
//       const fetchUser = async () => {
//         try {
//           const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROUTE}/api/auth/me`, {
//             credentials: "include",
//           });
//           const data = await res.json();

//           if (data.success && data.user) {
//             dispatch(setUser(data.user));
//           } else {
//             dispatch(clearUser());
//           }
//         } catch {
//           dispatch(clearUser());
//         }
//       };

//       fetchUser();
//     }
//   }, [hasAuth, dispatch, user]);

//   return null;
// }
