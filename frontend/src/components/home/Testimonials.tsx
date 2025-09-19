"use client";

import React, { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "../ui/card";
import { testimonial } from "@/data/testimonial";
import Image from "next/image";

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.scrollTo(0);

    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, 2500);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center pt-4">
        What our users say
      </h2>

      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* Embla container */}
        <div className="flex gap-4 pt-6 sm:pt-8 mb-6 sm:mb-8">
          {testimonial.map((t, index) => (
            <div
              key={index}
              className="flex-none w-full sm:w-1/2 lg:w-1/3 px-2 sm:px-4"
            >
              <Card className="bg-background h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={48}
                          height={48}
                          src={t.image}
                          alt={t.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-base sm:text-lg">
                          {t.author}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {t.role}
                        </p>
                        <p className="text-xs sm:text-sm text-primary">
                          {t.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-sm sm:text-base text-muted-foreground italic relative">
                        <span className="text-2xl sm:text-3xl text-primary absolute -top-3 sm:-top-4 -left-2">
                          &quot;
                        </span>
                        {t.quote}
                        <span className="text-2xl sm:text-3xl text-primary absolute -bottom-3 sm:-bottom-4">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
