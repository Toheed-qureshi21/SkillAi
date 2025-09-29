"use client";
import { loginUser, signupUser } from "@/backend-apis/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormState } from "@/types";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await loginUser({
          email: form.email,
          password: form.password,
        });
        console.log(response.data);
        return toast.success("Login Successful");
      } else {
        // Call signup API
        const response = await signupUser({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        console.log(response.data);
         toast.success("Signup Successful");
         return router.push("/verify-email");
      }
    } catch (error: unknown) {
  if (error instanceof Error) {
    return toast.error(error.message);
  }

  // Axios-style error
  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as { response?: { data?: { message?: string } } };
    return toast.error(err.response?.data?.message || "Something went wrong");
  }

  return toast.error("Something went wrong");
}

  };

  return (
    <section className="h-screen flex items-center justify-center mx-4">
      <Card className="w-96">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h2 className="text-2xl font-bold">
            {isLogin ? "Login" : "Create an account"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isLogin
              ? "Welcome back! Please sign in to continue"
              : "Join us today! Create your account to get started"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <Button variant="outline">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.36 0 6.39 1.15 8.76 3.04l6.52-6.52C34.67 2.55 29.67 0 24 0 14.64 0 6.57 5.7 2.64 14.02l7.79 6.06C12.03 13.4 17.58 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.1 24.56c0-1.56-.14-3.05-.39-4.5H24v8.5h12.5c-.54 2.85-2.18 5.26-4.62 6.92l7.36 5.73C43.81 37.04 46.1 31.25 46.1 24.56z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.43 28.08A14.87 14.87 0 019.5 24c0-1.42.2-2.8.57-4.08l-7.79-6.06A23.933 23.933 0 000 24c0 3.83.92 7.45 2.57 10.61l7.86-6.53z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.91-2.14 15.88-5.8l-7.36-5.73C30.71 37.39 27.55 38.5 24 38.5c-6.41 0-11.96-3.9-13.57-9.57l-7.86 6.53C6.57 42.3 14.64 48 24 48z"
                />
              </svg>
              Login with Google
            </Button>
          </div>
          <div className="mt-4 flex justify-center items-center">
            <div className=" border-t-2 w-1/2"></div>
            <p className="mx-2 text-muted-foreground text-sm">OR</p>
            <div className="border-t-2 w-1/2"></div>
          </div>
          <form onSubmit={handleSubmit} className="mb-2 mt-4 flex flex-col gap-6">
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <Label>Full Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your Full Name"
                  type="text"
                ></Input>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                type="email"
              ></Input>
            </div>
            <div className="flex flex-col gap-2 relative">
              <Label>Password</Label>
              <Input
                placeholder="Enter your Password"
                value={form.password}
                name="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type={showPassword ? "text" : "password"}
                className=""
              ></Input>
              <button type="button">
                {showPassword ? (
                  <EyeOff
                    className="absolute right-3 top-[38px] cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-[38px] cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </button>
            </div>
            <Button type="submit" className="w-full pt-2">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-muted-foreground text-md">
            {isLogin ? "New to SkillAI?" : "Already have an account?"}{" "}
            <Link
              href={`${isLogin ? "/signup" : "/login"}`}
              className="font-bold text-white"
            >
              {isLogin ? "Sign up" : "Login"}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default AuthForm;
