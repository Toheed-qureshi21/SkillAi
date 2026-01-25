"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("x-id");

  useEffect(() => {
    const redirect = async () => {
      // Give browser a moment to finalize cookies
      await new Promise((res) => setTimeout(res, 300));
      await new Promise((res) => setTimeout(res, 300));
      if (id) {
        localStorage.setItem("x-id",id)
        localStorage.setItem("isLoggedIn", "true");
      }
      toast.success("Login successful! Redirecting to dashboard...");
      router.push("/dashboard");
    };
    redirect();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center text-lg font-medium">
      Waiting to confirm you are logged in...
    </div>
  );
}
