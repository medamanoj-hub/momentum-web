export default function Hero() {
  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-7xl font-bold tracking-tight">
        Momentum
      </h1>

      <p className="mt-6 text-xl text-zinc-400 text-center max-w-xl">
        Build your life.
        <br />
        One day at a time.
      </p>

      <button className="mt-10 rounded-xl bg-white px-8 py-4 text-black font-semibold hover:scale-105 transition">
        Get Started
      </button>
    </section>
  );
}