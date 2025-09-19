"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = () => {
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
        <Link href="/login">
        <Button variant="outline">
        Login
        </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
