// import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
      {/* <Footer /> */}
    </div>
  );
}