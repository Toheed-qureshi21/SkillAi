"use client"

import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const {user} = useAppSelector((state)=>state.user);
    const router = useRouter();
   useEffect(() => {
    if (user && !user.isOnboarded) {
      router.replace("/onboard-user");
    }
  }, [user, router]);
    return(
        <div className="text-3xl text-center ">Welcome to your Dashboard {user?.name}!</div>
    )
}