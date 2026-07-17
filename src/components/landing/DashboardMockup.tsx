export default function DashboardMockup() {
    return (
      <section className="bg-black py-32">
        <div className="max-w-6xl mx-auto px-6">
  
          <h2 className="text-5xl font-bold text-white text-center">
            Your entire life.
          </h2>
  
          <p className="text-center text-zinc-400 mt-6 text-xl">
            One beautiful dashboard.
          </p>
  
          <div className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
  
            <div className="flex gap-8">
  
              {/* Sidebar */}
              <div className="w-64 border-r border-zinc-800 pr-6">
  
                <h3 className="text-white font-semibold mb-8">
                  Momentum
                </h3>
  
                <div className="space-y-5 text-zinc-400">
  
                  <p>🏠 Dashboard</p>
  
                  <p>💪 Health</p>
  
                  <p>💼 Career</p>
  
                  <p>📚 Learning</p>
  
                  <p>💰 Finance</p>
  
                  <p>❤️ Relationships</p>
  
                </div>
  
              </div>
  
              {/* Main Content */}
  
              <div className="flex-1">
  
                <div className="grid grid-cols-3 gap-6">
  
                  <div className="rounded-2xl bg-zinc-900 p-6">
  
                    <p className="text-zinc-500">
                      Momentum Score
                    </p>
  
                    <h2 className="text-5xl font-bold text-white mt-4">
                      86
                    </h2>
  
                  </div>
  
                  <div className="rounded-2xl bg-zinc-900 p-6">
  
                    <p className="text-zinc-500">
                      Today's Tasks
                    </p>
  
                    <h2 className="text-5xl font-bold text-white mt-4">
                      12
                    </h2>
  
                  </div>
  
                  <div className="rounded-2xl bg-zinc-900 p-6">
  
                    <p className="text-zinc-500">
                      Habits
                    </p>
  
                    <h2 className="text-5xl font-bold text-white mt-4">
                      8/10
                    </h2>
  
                  </div>
  
                </div>
  
                <div className="mt-8 rounded-2xl bg-zinc-900 p-8">
  
                  <h3 className="text-white text-xl font-semibold mb-6">
                    Daily Progress
                  </h3>
  
                  <div className="h-56 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500">
  
                    Progress Graph
  
                  </div>
  
                </div>
  
              </div>
  
            </div>
  
          </div>
  
        </div>
  
      </section>
    );
  }