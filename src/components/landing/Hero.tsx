export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6"
    >

      <h1 className="text-7xl font-bold text-center">
        Momentum
      </h1>

      <p className="text-zinc-400 text-center mt-8 text-2xl">
        Build your life.
        <br />
        One day at a time.
      </p>

      <button className="mt-10 bg-white text-black rounded-full px-8 py-4 font-semibold">
        Get Started
      </button>

    </section>
  );
}