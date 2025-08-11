import {
  Faqs,
  Features,
  HeroSection,
  Statistics,
  Testimonials,
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
      <Testimonials />
      <Faqs />
    </div>
  );
}
