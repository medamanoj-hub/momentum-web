import Navbar from "./Navbar";
import Features from "./Features";
import Footer from "./Footer";

export default function Hero() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <h1 className="text-7xl font-bold tracking-tight">
          Momentum
        </h1>

        <p className="mt-6 text-xl text-zinc-400 text-center max-w-xl">
          Build your life.
          <br />
          One day at a time.
        </p>

        <button className="mt-10 rounded-xl bg-white px-8 py-4 text-black font-semibold transition hover:scale-105">
          Get Started
        </button>
      </main>

      <Features />

      <Footer />
    </>
  );
}