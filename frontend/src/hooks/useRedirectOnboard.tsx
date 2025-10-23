"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRedirectOnboard() {
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();
  console.log(user);
  

  useEffect(() => {
    if (user && !user.isOnboarded) {
      router.replace("/onboard-user");
    }
  }, [user, router]);
}
