export default function Features() {
    const features = [
      {
        title: "Life Dashboard",
        description:
          "See every important part of your life in one place.",
      },
      {
        title: "Daily Mission",
        description:
          "Know exactly what deserves your attention today.",
      },
      {
        title: "Momentum Score",
        description:
          "Measure progress across health, career, learning and life.",
      },
    ];
  
    return (
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-6xl mx-auto">
  
          <h2 className="text-5xl font-bold text-center">
            Your Life.
            <br />
            Organized.
          </h2>
  
          <p className="text-zinc-400 text-center mt-6 max-w-2xl mx-auto">
            Momentum isn't another productivity app.
            It's your personal Life Operating System.
          </p>
  
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-zinc-800 p-8 bg-zinc-950 hover:border-white transition"
              >
                <h3 className="text-2xl font-semibold">
                  {feature.title}
                </h3>
  
                <p className="text-zinc-400 mt-4 leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
  
        </div>
      </section>
    );
  }