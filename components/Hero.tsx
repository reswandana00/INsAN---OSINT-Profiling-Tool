"use client";

import React, { useEffect, useState } from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import DashboardButton from "./ui/dashboard-button";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center flex-col h-screen -mt-20">
      <div className="text-5xl md:text-6xl lg:text-7xl font-medium mx-10 [&>*]:font-black items-center justify-center text-center">
        <TextGenerateEffect words="OSINT Base Profiling Tools" />
      </div>

      <div
        className={`font-mono items-center justify-center text-center mt-8 md:text-lg lg:text-xl mx-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 blur-none" : "opacity-0 blur-lg"
        }`}
      >
        Temukan informasi mendalam dengan cepat dan akurat melalui solusi OSINT
        Base Profiling.
      </div>

      <div
        className={`relative flex flex-col mt-10 md:mt-12 lg:mt-15 items-end right-[15%] md:right-[20%] lg:right-[25%] transition-all duration-1000 ${
          isVisible ? "opacity-100 blur-none" : "opacity-0 blur-lg"
        }`}
      >
        <DashboardButton />
      </div>
    </div>
  );
};

export default Hero;
