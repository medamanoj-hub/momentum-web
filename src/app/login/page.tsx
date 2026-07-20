"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Shell";
import { Card, GradientButton } from "@/components/ui";
import { remote } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  // "login" = existing user, "register" = create account
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);

    // If there's no backend configured, we can't authenticate for real.
    if (!remote) {
      setError("No backend configured (NEXT_PUBLIC_API_URL is missing).");
      return;
    }

    // Basic guard so we don't send empty requests.
    if (!email || !password || (mode === "register" && !name)) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await remote.auth.register({ name, email, password });
      } else {
        await remote.auth.login({ email, password });
      }
      // On success the client has stored the JWT. New users go to onboarding,
      // returning users go straight to the dashboard.
      router.push(mode === "register" ? "/onboarding" : "/dashboard");
    } catch (err: unknown) {
      // ApiError carries a human-readable message from the backend.
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm animate-rise">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo />
          <p className="text-[13px] text-mute">Design Your Life. Every Day.</p>
        </div>
        <Card className="p-6">
          {/* Tab switcher */}
          <div className="mb-5 flex gap-2 rounded-xl border border-line bg-raise p-1">
            <button
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition ${
                mode === "login" ? "bg-indigo text-white" : "text-mute hover:text-ink"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setMode("register"); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition ${
                mode === "register" ? "bg-indigo text-white" : "text-mute hover:text-ink"
              }`}
            >
              Create account
            </button>
          </div>

          <h1 className="text-[18px] font-bold text-ink">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-[12px] text-mute">
            {mode === "login"
              ? "Sign in to continue building momentum."
              : "Start designing your life today."}
          </p>

          {/* Name field only appears when creating an account */}
          {mode === "register" && (
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              type="text"
              className="mt-5 w-full rounded-xl border border-line bg-raise px-4 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-indigo focus:outline-none"
            />
          )}

          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className={`${mode === "register" ? "mt-2.5" : "mt-5"} w-full rounded-xl border border-line bg-raise px-4 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-indigo focus:outline-none`}
          />

          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="mt-2.5 w-full rounded-xl border border-line bg-raise px-4 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-indigo focus:outline-none"
          />

          {/* Error message from the backend, if any */}
          {error && (
            <p className="mt-3 text-[12px] text-red-400">{error}</p>
          )}

          <GradientButton
            className="mt-4 w-full"
            onClick={handleSubmit}
          >
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Sign in"
              : "Create account"}
          </GradientButton>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 w-full text-center text-[12px] text-dim transition hover:text-mute"
          >
            Continue as guest
          </button>
        </Card>
      </div>
    </div>
  );
}
