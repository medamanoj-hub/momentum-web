"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api, syncQueue } from "./api";
import { seed } from "./seed";
import type { Habit, JournalEntry, LifeAreaId, MomentumState, Task } from "./types";

interface Store {
  state: MomentumState;
  ready: boolean;
  toggleTask(id: string): void;
  addTask(title: string, area: LifeAreaId): void;
  bumpHabit(id: string): void;
  addJournal(entry: Omit<JournalEntry, "id">): void;
  completeFocusSession(minutes: number): void;
  setName(name: string): void;
  resetAll(): void;
}

const Ctx = createContext<Store | null>(null);

export function MomentumProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MomentumState>(seed);
  const [ready, setReady] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    api.load().then(s => { setState(s); setReady(true); });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!dirty.current) { dirty.current = true; return; }
    api.save(state);
  }, [state, ready]);

  const store = useMemo<Store>(() => ({
    state,
    ready,
    toggleTask(id) {
      setState(s => {
        const tasks = s.tasks.map(t => {
          if (t.id !== id) return t;
          const done = t.status === "completed";
          return { ...t, status: (done ? "todo" : "completed") as Task["status"] };
        });
        const t = s.tasks.find(x => x.id === id)!;
        const wasDone = t.status === "completed";
        const delta = wasDone ? -t.points : t.points;
        syncQueue?.push(wasDone ? { kind: "task.reopen", id } : { kind: "task.complete", id });
        return { ...s, tasks, score: Math.max(0, s.score + delta), scoreDelta: s.scoreDelta + delta };
      });
    },
    addTask(title, area) {
      syncQueue?.push({ kind: "task.create", title, priority: 2 });
      setState(s => ({
        ...s,
        tasks: [...s.tasks, { id: `t${Date.now()}`, title, area, status: "todo", priority: 2, points: 8 }]
      }));
    },
    bumpHabit(id) {
      setState(s => {
        let scoreDelta = 0;
        const habits = s.habits.map<Habit>(h => {
          if (h.id !== id) return h;
          const wasDone = h.progress >= h.target;
          // Binary habits toggle; unit habits increment then wrap to 0.
          const next = h.target === 1
            ? (wasDone ? 0 : 1)
            : (wasDone ? 0 : Math.min(h.target, h.progress + (h.unit === "min" ? 45 : 1)));
          const nowDone = next >= h.target;
          if (!wasDone && nowDone) { scoreDelta = h.points; syncQueue?.push({ kind: "habit.complete", id }); }
          if (wasDone && !nowDone) { scoreDelta = -h.points; syncQueue?.push({ kind: "habit.uncomplete", id }); }
          return { ...h, progress: next, streak: !wasDone && nowDone ? h.streak + 1 : h.streak };
        });
        return { ...s, habits, score: Math.max(0, s.score + scoreDelta), scoreDelta: s.scoreDelta + scoreDelta };
      });
    },
    addJournal(entry) {
      syncQueue?.push({ kind: "journal.create", content: entry.text });
      setState(s => ({
        ...s,
        journal: [{ id: `j${Date.now()}`, ...entry }, ...s.journal],
        score: s.score + 5,
        scoreDelta: s.scoreDelta + 5
      }));
    },
    completeFocusSession(minutes) {
      const pts = Math.max(5, Math.round(minutes / 5) * 4); // ~20 pts / 25 min
      syncQueue?.push({ kind: "focus.end", duration: minutes });
      setState(s => ({ ...s, score: s.score + pts, scoreDelta: s.scoreDelta + pts }));
    },
    setName(name) {
      setState(s => ({ ...s, user: { ...s.user, name }, onboarded: true }));
    },
    resetAll() {
      api.reset().then(setState);
    }
  }), [state, ready]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useMomentum(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMomentum must be used inside MomentumProvider");
  return ctx;
}
