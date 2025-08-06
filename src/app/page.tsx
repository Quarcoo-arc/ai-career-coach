import {
  Features,
  HeroSection,
  Statistics,
  UserGuide,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="w-full">
      <div className="grid-background"></div>
      <HeroSection />
      <Features />
      <Statistics />
      <UserGuide />
    </div>
  );
}
