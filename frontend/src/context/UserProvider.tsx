"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { User } from "@/redux/userSlice";
import { getCurrentUser } from "@/backend-apis/user";
import { useAppSelector } from "@/redux/hooks";

interface UserContextType {
  contextUser: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  contextUser: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      //   const storedUser = sessionStorage.getItem("user");
      //   if (storedUser) {
      //     const parsed = JSON.parse(storedUser);
      //     setLocalUser(parsed);
      //     dispatch(setUser(parsed));
      //     setLoading(false);
      //     return;
      //   }

      try {
        const res = await getCurrentUser();
        if (res?.data?.user) {
          setLocalUser(res.data.user);
          dispatch(setUser(res.data.user));
        }          return;
        }catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ contextUser: localUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
