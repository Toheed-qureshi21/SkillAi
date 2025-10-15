"use client";
import { Suspense } from "react";
import VerifyEmailComponent from "@/components/auth/VerifyEmailComponent";

export default function VerifyEmailPage() {
    return(
         <Suspense fallback={<p>Loading...</p>}>
        <VerifyEmailComponent/>
         </Suspense>
    )
}