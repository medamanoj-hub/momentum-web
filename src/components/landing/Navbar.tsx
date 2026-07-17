export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-900">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        <a href="#hero" className="text-3xl font-bold text-white">
          Momentum
        </a>

        <nav className="hidden md:flex gap-10 text-zinc-400">

          <a href="#dashboard">Dashboard</a>

          <a href="#lifeareas">Life Areas</a>

          <a href="#ai">AI Coach</a>

          <a href="#pricing">Pricing</a>

        </nav>

        <button className="bg-white text-black rounded-full px-7 py-3 font-semibold">
          Get Started
        </button>

      </div>

    </header>
  );
}