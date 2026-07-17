export default function AISection() {
    return (
      <section className="bg-black py-32">
        <div className="max-w-6xl mx-auto px-6">
  
          <div className="text-center mb-20">
            <p className="text-zinc-500 uppercase tracking-[0.3em]">
              AI COACH
            </p>
  
            <h2 className="text-5xl font-bold text-white mt-4">
              Meet your personal Life Coach.
            </h2>
  
            <p className="text-zinc-400 mt-6 text-xl max-w-3xl mx-auto">
              Momentum doesn't just remind you about tasks.
              It understands your goals, habits and routines,
              helping you make better decisions every day.
            </p>
          </div>
  
          <div className="max-w-3xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-8 space-y-6">
  
            <div className="flex justify-end">
              <div className="bg-white text-black rounded-2xl px-5 py-3 max-w-sm">
                What should I focus on today?
              </div>
            </div>
  
            <div className="flex justify-start">
              <div className="bg-zinc-800 text-white rounded-2xl px-5 py-4 max-w-lg">
                Good morning 👋
  
                <br /><br />
  
                Finish your CAT preparation first.
  
                <br />
  
                You also have Guitar practice scheduled tonight.
  
                <br /><br />
  
                Completing both will increase your Momentum Score by +12.
              </div>
            </div>
  
          </div>
  
        </div>
      </section>
    );
  }