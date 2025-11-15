"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import GitHubIcon from "@/assets/svg/github.svg";

const HeroSection = () => {
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-16 md:pt-28">
      <div className="space-y-6 text-center mx-auto">
        <div className="space-y-6">
          <h1 className="gradient-title text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl">
            Your AI Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link
            target="_blank"
            href="https://github.com/Quarcoo-arc/ai-career-coach"
          >
            <Button size={"lg"} className="px-8" variant={"outline"}>
              View on GitHub <GitHubIcon fill="white" />
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src={"/banner.jpg"}
              width={1280}
              height={720}
              alt="AI Career Coach Banner"
              className="rounded-lg shadow-2xl border mx-auto brightness-70"
              priority
            ></Image>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
