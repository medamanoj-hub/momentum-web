export default function LifeAreas() {
    const areas = [
      "💼 Career",
      "📚 Learning",
      "💪 Health",
      "💰 Finance",
      "🏡 Home",
      "❤️ Relationships",
      "🎸 Hobbies",
      "🧠 Mind",
    ];
  
    return (
      <section className="bg-black py-32">
  
        <div className="max-w-6xl mx-auto px-6">
  
          <h2 className="text-5xl font-bold text-center text-white">
            Every part of your life.
          </h2>
  
          <p className="text-zinc-400 text-center mt-6 text-xl">
            Organized beautifully.
          </p>
  
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
  
            {areas.map((area) => (
  
              <div
                key={area}
                className="rounded-2xl bg-zinc-900 p-8 text-center border border-zinc-800 hover:border-white transition"
              >
  
                <h3 className="text-white text-lg font-semibold">
                  {area}
                </h3>
  
              </div>
  
            ))}
  
          </div>
  
        </div>
  
      </section>
    );
  }