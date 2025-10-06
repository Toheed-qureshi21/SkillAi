import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

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
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <LogoutButton/>
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
