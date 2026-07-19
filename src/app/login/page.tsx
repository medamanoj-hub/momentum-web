"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Shell";
import { Card, GradientButton } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm animate-rise">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo />
          <p className="text-[13px] text-mute">Design Your Life. Every Day.</p>
        </div>
        <Card className="p-6">
          <h1 className="text-[18px] font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-[12px] text-mute">Sign in to continue building momentum.</p>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="mt-5 w-full rounded-xl border border-line bg-raise px-4 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-indigo focus:outline-none"
          />
          <input
            placeholder="Password"
            type="password"
            className="mt-2.5 w-full rounded-xl border border-line bg-raise px-4 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-indigo focus:outline-none"
          />
          <GradientButton className="mt-4 w-full" onClick={() => router.push("/onboarding")}>Sign in</GradientButton>
          <div className="my-4 flex items-center gap-3 text-[10px] text-dim">
            <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
          </div>
          <button onClick={() => router.push("/onboarding")}
            className="w-full rounded-xl border border-line bg-raise py-2.5 text-[13px] font-medium text-ink transition hover:border-indigo/40">
             Continue with Apple
          </button>
          <button onClick={() => router.push("/onboarding")}
            className="mt-2 w-full rounded-xl border border-line bg-raise py-2.5 text-[13px] font-medium text-ink transition hover:border-indigo/40">
            G  Continue with Google
          </button>
          <button onClick={() => router.push("/dashboard")}
            className="mt-4 w-full text-center text-[12px] text-dim transition hover:text-mute">
            Continue as guest
          </button>
        </Card>
        <p className="mt-4 text-center text-[11px] text-dim">
          Authentication is stubbed in Phase 1 — Sign in with Apple / Google wire up with the backend.
        </p>
      </div>
    </div>
  );
}
