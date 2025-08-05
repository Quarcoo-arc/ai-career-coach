import { Features, HeroSection } from "@/components/landing";

export default function Home() {
  return (
    <div className="w-full">
      <div className="grid-background"></div>
      <HeroSection />
      <Features />
    </div>
  );
}
