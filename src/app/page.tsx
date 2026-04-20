import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import Comments from "@/components/Comments";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Suspense fallback={null}>
        <PortfolioShowcase />
      </Suspense>
      <Comments />
    </main>
  );
}
