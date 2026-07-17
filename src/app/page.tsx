import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import DashboardMockup from "@/components/landing/DashboardMockup";
import LifeAreas from "@/components/landing/LifeAreas";
import AISection from "@/components/landing/AISection";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <DashboardMockup />
      <LifeAreas />
      <AISection />
      <Testimonials />
      <Pricing />
      <Footer />
    </>
  );
}