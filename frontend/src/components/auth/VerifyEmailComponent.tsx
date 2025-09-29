"use client";
import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
  useEffect,
} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/backend-apis/auth";
import toast from "react-hot-toast";

const VerifyEmailComponent = () => {
  const searchParams = useSearchParams();
  const tokenFromLink = searchParams.get("token"); // Get token from ?token=xxxxx
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showErrorBorder, setShowErrorBorder] = useState(false); // Controls red border
  const router = useRouter();

  // Autofocus first input on mount or auto-fill if token exists
  useEffect(() => {
    if (tokenFromLink && /^\d{6}$/.test(tokenFromLink)) {
      const digits = tokenFromLink.split("");
      setOtp(digits);
      verifyOtp(tokenFromLink);
    } else {
      const firstInput = document.getElementById(
        "otp-0"
      ) as HTMLInputElement | null;
      firstInput?.focus();
    }
  }, [tokenFromLink]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;
      nextInput?.focus();
    }

    // Verify OTP automatically when all digits are filled
    if (newOtp.every((d) => d !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement | null;
      prevInput?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtp(digits);
      verifyOtp(pasteData);
    }
  };

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setShowErrorBorder(false); // Remove red border on inputs
    const firstInput = document.getElementById(
      "otp-0"
    ) as HTMLInputElement | null;
    firstInput?.focus();
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    setError(null);
    setShowErrorBorder(false);
    try {
      const response = await verifyEmail({ token: code });
      if (response.data.success) {
        setSuccess(true);
        setError(null);
        setShowErrorBorder(false);
        toast.success("Email verified successfully!");
        return router.push("/dashboard");
      } else {
        setError("Invalid OTP, please try again.");
        setShowErrorBorder(true);
        clearOtp();
      }
    } catch (err: unknown) {
      let message = "Something went wrong. Please try again.";

      if (err instanceof Error) message = err.message;
      // Optional: if you use Axios
      else if (typeof err === "object" && err !== null && "response" in err) {
        const e = err as { response?: { data?: { message?: string } } };
        message = e.response?.data?.message || message;
      }

      setError(message);
      setShowErrorBorder(true);
      clearOtp();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">
            Enter the Verification Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mt-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoComplete="off"
                onPaste={handlePaste}
                className={`w-10 h-12 text-center border rounded-md focus:outline-white ${
                  success
                    ? "border-green-500"
                    : showErrorBorder
                    ? "border-red-500"
                    : ""
                }`}
                disabled={loading || success}
              />
            ))}
          </div>

          {/* Show error below inputs */}
          {error && <p className="mt-2 text-center text-red-500">{error}</p>}
          {loading && (
            <p className="mt-2 text-center text-gray-500">Verifying...</p>
          )}
          {success && (
            <p className="mt-2 text-center text-green-500">
              OTP Verified Successfully!
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default VerifyEmailComponent;
