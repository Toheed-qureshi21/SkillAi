import AccelerateCareer from "@/components/home/AccelerateCareer";
import FAQS from "@/components/home/FAQS";
import FeatureSection from "@/components/home/FeatureSection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import StatsSection from "@/components/home/StatsSection";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <StatsSection />
      <HowItWorks />
      <Testimonials />
      <FAQS />
      <AccelerateCareer />
    </>
  );
}
