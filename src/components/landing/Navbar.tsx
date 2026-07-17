export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur border-b border-zinc-900">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-5 px-8">

        <h1 className="text-2xl font-bold text-white">
          Momentum
        </h1>

        <nav className="flex gap-10 text-zinc-400">

          <a href="#">Features</a>

          <a href="#">Dashboard</a>

          <a href="#">Pricing</a>

        </nav>

        <button className="bg-white text-black px-6 py-3 rounded-full font-semibold">
          Get Started
        </button>

      </div>
    </header>
  );
}