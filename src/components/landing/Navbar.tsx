export default function Navbar() {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
          <h1 className="text-xl font-bold text-white">
            Momentum
          </h1>
  
          <div className="hidden gap-8 text-sm text-zinc-400 md:flex">
            <a href="#">Features</a>
            <a href="#">Dashboard</a>
            <a href="#">Pricing</a>
          </div>
  
          <button className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black">
            Get Started
          </button>
        </div>
      </nav>
    );
  }