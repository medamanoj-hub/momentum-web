export default function Features() {
    const cards = [
      {
        title: "Life Dashboard",
        desc: "Everything important in one place.",
      },
      {
        title: "Daily Mission",
        desc: "Know exactly what deserves your attention today.",
      },
      {
        title: "Momentum Score",
        desc: "Track your progress across every area of life.",
      },
    ];
  
    return (
      <section className="bg-black text-white py-32 px-8">
  
        <div className="max-w-7xl mx-auto">
  
          <h2 className="text-5xl font-bold text-center">
            Your Life.
            <br />
            Organized.
          </h2>
  
          <p className="text-zinc-400 text-center mt-6">
            Momentum is your personal Life Operating System.
          </p>
  
          <div className="grid md:grid-cols-3 gap-8 mt-20">
  
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8"
              >
                <h3 className="text-2xl font-semibold">
                  {card.title}
                </h3>
  
                <p className="mt-5 text-zinc-400">
                  {card.desc}
                </p>
              </div>
            ))}
  
          </div>
  
        </div>
  
      </section>
    );
  }