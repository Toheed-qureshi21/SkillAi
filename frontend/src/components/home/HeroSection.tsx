"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
    const imageRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleImageScroll = () => {
            const scrollY = window.scrollY;
            const scrollThreshold = 100;
            if (scrollY > scrollThreshold) {
                imageRef.current?.classList.add("scrolled");
            }
        };
        window.addEventListener("scroll", handleImageScroll);
        return () => window.removeEventListener("scroll", handleImageScroll);
    }, []);
  return (
    <section className="w-full pt-20 md:pt-16 pb-10">
      <div className="text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>
        <div className="flex- mt-4 justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 w-xs">
              Get Started
            </Button>
          </Link>
        </div>
            <div className="hero-image-wrapper mt-5 md:mt-0">
                 <div ref={imageRef} className="hero-image">
                    <Image
                        src="/Banner.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
                    />
                 </div>
                </div>
      </div>
    </section>
  );
};

export default HeroSection;
