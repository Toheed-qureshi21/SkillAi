"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { logoutUser } from "@/backend-apis/auth";
import { redirect } from "next/navigation";
import { Loader2, Repeat1 } from "lucide-react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleLogoutSubmission = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await logoutUser();
      if (data.success) {
        toast.success(data.message || "User logged out successfully");
        router.push("/login");
       return router.refresh();
      }
      throw new Error("Something went wrong");
    } catch (error) {
      console.log(error);
      return toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleLogoutSubmission} disabled={loading}>
      {loading ? <Loader2/> : "Logout"}
    </Button>
  );
};

export default LogoutButton;
