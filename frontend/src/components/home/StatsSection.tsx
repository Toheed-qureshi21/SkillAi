"use client";
import React, { useEffect, useRef, useState } from 'react';

const StatsSection = () => {
  const [industryNum, setIndustryNum] = useState(0);
  const [InterviewQNum, setInterviewQNum] = useState(0);
  const [startCounting, setStartCounting] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartCounting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startCounting) return;

    let start = 0;
    const end = 100;
    let interviewQStart = 0
    const interviewQEnd = 1000
    const duration = 2000; // 2s
    const stepTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      interviewQStart +=10;
      setIndustryNum(start);
      setInterviewQNum(interviewQStart);
      if (start === end || interviewQStart == interviewQEnd) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [startCounting]);

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">{industryNum}+</h3>
            <p className="text-muted-foreground">Industries Covered</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">{InterviewQNum}+</h3>
            <p className="text-muted-foreground">Interview Questions</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">95%</h3>
            <p className="text-muted-foreground">Success Rate</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="text-muted-foreground">AI Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
