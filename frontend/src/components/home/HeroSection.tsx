import Link from "next/link";
import { Button } from "../ui/button";
import Orb from "../ui/Orb";

const HeroSection = () => {
  return (
    <section className="relative w-full h-fit flex flex-col items-center justify-center overflow-hidden pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-10 mb-12">
      {/* Orb + Text container */}
      <div className="relative w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[550px] md:h-[550px] lg:w-[750px] lg:h-[750px] flex items-center justify-center">
        {/* Orb canvas */}
        <div className="absolute inset-0 scale-[1.7] sm:scale-[1.8] md:scale-[2.2] ">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} />
        </div>

        {/* Centered text */}
        <div className="absolute z-10 text-center flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl md:text-6xl font-bold gradient-title animate-gradient leading-tight">
            {" "}
            Your AI Career Coach{" "}
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-xl lg:text-2xl text-gray-200 max-w-[90%] sm:max-w-lg md:max-w-2xl leading-relaxed drop-shadow-md">
            Advance your career with intelligent, AI-powered tools for real
            professional growth.
          </p>
          <div className="mt-6 sm:mt-8">
            <Link href="/dashboard">
              <Button className="w-full max-w-xs sm:max-w-sm md:w-96 text-base sm:text-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
