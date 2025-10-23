"use client"

import { getIndustryInsights } from "@/backend-apis/industryInsights";
import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const {user} = useAppSelector((state)=>state.user);
    const router = useRouter();
   useEffect(() => {
    if (user && user.isOnboarded === false) {
      router.replace("/onboard-user");
    }
    (async()=>{
      const response = await getIndustryInsights();
      console.log(response);
      
    })();
  }, []);
    return(
        <div className="text-3xl text-center ">Welcome to your Dashboard {user?.name}!</div>
    )
}