import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  FileTextIcon,
  GraduationCap,
  LucideLayoutDashboard,
  LucideLogOut,
  PenBox,
  UserCircle2,
} from "lucide-react";

const Header = async () => {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken") || cookieStore.get("refreshToken");

  return (
    <header className="px-4 py-2 border-b sticky top-0 backdrop-blur-xl bg-transparent z-50">
      <nav className=" flex items-center justify-between ">
        <Link href="/">
          <Image
            src="/SkilllAI.png"
            alt="SkillAI logo"
            width={200}
            height={60}
            className="h-20 py-1 w-auto object-contain"
          />
        </Link>

        {token ? (
          <div className="flex gap-4">
            {/* <Link href="/dashboard"> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image
                  src="/avatar.jpg"
                  className="rounded-full hover:cursor-pointer"
                  width="40"
                  height="10"
                  alt="user-avatar"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-3" align="start" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <UserCircle2 /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LucideLayoutDashboard /> Dashboard
                  </Link>
                </DropdownMenuItem>{" "}
                <DropdownMenuItem asChild>
                  <Link href="/resume" className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="flex items-center gap-2">
                    <LucideLogOut className="h-4 w-4" />
                    <LogoutButton />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
