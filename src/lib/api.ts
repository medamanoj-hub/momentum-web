// Momentum API layer
// ------------------------------------------------------------------
// Phase 2: real backend. When NEXT_PUBLIC_API_URL is set AND the user
// is authenticated, the app loads live data from the server via the
// HttpAdapter. Otherwise it falls back to the offline LocalAdapter
// (localStorage + seed) so the app is always usable (guest mode).
// ------------------------------------------------------------------

import { MomentumClient } from "./client";
import type {
  GoalDto,
  HabitDto,
  LifeAreaDto,
  TaskDto,
  UserDto,
} from "./client";
import { seed } from "./seed";
import { SyncQueue } from "./sync";
import type {
  Goal,
  Habit,
  LifeArea,
  LifeAreaId,
  MomentumState,
  Task,
  TaskStatus,
} from "./types";

const STORAGE_KEY = "momentum.state.v1";

// ── Remote backend ────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const remote: MomentumClient | null = API_URL ? new MomentumClient(API_URL) : null;
export const syncQueue: SyncQueue | null = remote ? new SyncQueue(remote) : null;

export interface MomentumAdapter {
  load(): Promise<MomentumState>;
  save(state: MomentumState): Promise<void>;
  reset(): Promise<MomentumState>;
}

// ==================================================================
// LocalAdapter — offline / guest mode (unchanged from Phase 1)
// ==================================================================
class LocalAdapter implements MomentumAdapter {
  async load(): Promise<MomentumState> {
    if (typeof window === "undefined") return seed;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return seed;
      return { ...seed, ...(JSON.parse(raw) as MomentumState) };
    } catch {
      return seed;
    }
  }
  async save(state: MomentumState): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* offline-first: swallow quota errors */
    }
  }
  async reset(): Promise<MomentumState> {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    return seed;
  }
}

// ==================================================================
// Mapping helpers: backend DTOs  ->  UI domain types
// The UI needs presentational fields (icon, color, unit, etc.) that
// the backend doesn't provide. We look those up from the seed by name
// where possible, and fall back to neutral defaults otherwise.
// ==================================================================

const LIFE_AREA_IDS: LifeAreaId[] = [
  "career", "learning", "health", "finance",
  "relationships", "home", "mind", "purpose", "hobbies",
];

// Resolve a backend life-area reference (name or id, free string) to the
// UI's strict LifeAreaId union. Falls back to "career" if unrecognized.
function toLifeAreaId(value: string | undefined): LifeAreaId {
  if (!value) return "career";
  const v = value.toLowerCase().trim();
  const direct = LIFE_AREA_IDS.find(id => id === v);
  if (direct) return direct;
  // try matching against seed area names ("Career" -> "career")
  const byName = seed.areas.find(a => a.name.toLowerCase() === v);
  if (byName) return byName.id;
  return "career";
}

// Seed lookups for presentational defaults
function seedAreaDefaults(id: LifeAreaId) {
  return seed.areas.find(a => a.id === id) ?? seed.areas[0];
}

function mapTask(dto: TaskDto): Task {
  const status: TaskStatus = dto.completed ? "completed" : "todo";
  const priority = (dto.priority && dto.priority >= 1 && dto.priority <= 3
    ? dto.priority
    : 2) as 1 | 2 | 3;
  return {
    id: dto.id,
    title: dto.title,
    area: "career", // backend tasks link to projects, not life-areas; default
    status,
    priority,
    estimateMin: dto.durationMinutes,
    points: dto.momentumPoints ?? 0,
    due: dto.dueDate,
    goalId: dto.projectId, // best-effort; may not correspond to a UI goal
  };
}

function mapGoal(dto: GoalDto): Goal {
  const area = toLifeAreaId(dto.lifeAreaId);
  return {
    id: dto.id,
    title: dto.title,
    area,
    progress: dto.progress ?? 0,
    deadline: dto.targetDate,
    milestones: [], // list endpoint doesn't include milestones
  };
}

function mapHabit(dto: HabitDto): Habit {
  const area = toLifeAreaId(dto.lifeAreaId);
  const areaDefaults = seedAreaDefaults(area);
  // Try to reuse seed presentational values for a same-named habit
  const seedMatch = seed.habits.find(
    h => h.title.toLowerCase() === dto.title.toLowerCase()
  );
  return {
    id: dto.id,
    title: dto.title,
    icon: seedMatch?.icon ?? "✅",
    area,
    color: seedMatch?.color ?? areaDefaults.color,
    target: seedMatch?.target ?? 1,
    progress: 0, // fresh each day; backend list doesn't give today's progress
    unit: seedMatch?.unit,
    streak: dto.streak ?? 0,
    bestStreak: dto.bestStreak ?? 0,
    points: seedMatch?.points ?? 5,
  };
}

function mapLifeArea(dto: LifeAreaDto): LifeArea {
  const id = toLifeAreaId(dto.name ?? dto.id);
  const defaults = seedAreaDefaults(id);
  return {
    id,
    name: dto.name ?? defaults.name,
    icon: dto.icon ?? defaults.icon,
    color: dto.color ?? defaults.color,
    progress: 0, // backend life-area DTO has no progress; default neutral
  };
}

// ==================================================================
// HttpAdapter — live backend data for authenticated users
// ==================================================================
class HttpAdapter implements MomentumAdapter {
  constructor(private client: MomentumClient) {}

  async load(): Promise<MomentumState> {
    // Not logged in -> behave like guest (seed). This is what makes
    // "Continue as guest" and logged-out states still work.
    if (!this.client.authenticated) {
      return new LocalAdapter().load();
    }

    try {
      // Fire everything in parallel. Any individual call that fails is
      // tolerated (Promise.allSettled) so one missing endpoint doesn't
      // blank the whole app.
      const [
        meR, areasR, tasksR, goalsR, habitsR, scoreR, historyR,
      ] = await Promise.allSettled([
        this.client.users.me(),
        this.client.lifeAreas.list(),
        this.client.tasks.list(),
        this.client.goals.list(),
        this.client.habits.list(),
        this.client.momentumScore.current(),
        this.client.momentumScore.history(),
      ]);

      const me = meR.status === "fulfilled" ? (meR.value as UserDto) : undefined;
      const areas = areasR.status === "fulfilled" ? areasR.value : [];
      const tasks = tasksR.status === "fulfilled" ? tasksR.value : [];
      const goals = goalsR.status === "fulfilled" ? goalsR.value : [];
      const habits = habitsR.status === "fulfilled" ? habitsR.value : [];
      const score = scoreR.status === "fulfilled" ? scoreR.value : undefined;
      const history = historyR.status === "fulfilled" ? historyR.value : [];

      // Start from seed for all the presentational / static pieces the
      // backend doesn't own (achievements, brief, events styling, daily
      // goal), then overlay real data on top.
      const state: MomentumState = {
        ...seed,

        user: {
          name: me?.name ?? seed.user.name,
          handle: me?.name ?? seed.user.handle,
        },

        // Real areas if the backend returned any; otherwise keep seed areas
        areas: areas.length ? areas.map(mapLifeArea) : seed.areas,

        // Real lists (empty for a brand-new user -> clean dashboard)
        tasks: tasks.map(mapTask),
        goals: goals.map(mapGoal),
        habits: habits.map(mapHabit),

        // Score from the momentum-score endpoint; fall back to seed
        score: score?.today ?? 0,
        scoreDelta: 0,
        scoreHistory:
          Array.isArray(history) && history.length
            ? history.slice(-7).map((h, i) => ({
                day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
                value: h.points ?? 0,
              }))
            : seed.scoreHistory.map(p => ({ ...p, value: 0 })),

        // A real, authenticated user has completed signup; treat as onboarded
        onboarded: Boolean(me?.onboardingCompleted),
      };

      return state;
    } catch {
      // Total failure (network down, etc.) -> don't break the app.
      // Fall back to local/guest data.
      return new LocalAdapter().load();
    }
  }

  async save(state: MomentumState): Promise<void> {
    // Mutations are pushed to the backend incrementally via syncQueue
    // (wired in store.tsx). We still cache locally for offline resilience.
    return new LocalAdapter().save(state);
  }

  async reset(): Promise<MomentumState> {
    // Local reset only; we don't wipe the server account here.
    return new LocalAdapter().reset();
  }
}

// ==================================================================
// Choose the adapter. When a backend is configured, use HttpAdapter
// (which itself falls back to local/seed when the user isn't logged
// in). Without a backend, pure LocalAdapter.
// ==================================================================
export const api: MomentumAdapter = remote
  ? new HttpAdapter(remote)
  : new LocalAdapter();

// ------------------------------------------------------------------
// AI Coach service (unchanged)
// ------------------------------------------------------------------
export async function askCoach(
  input: string,
  state: MomentumState
): Promise<{ text: string; actions: string[] }> {
  if (remote) {
    try {
      const { reply } = await remote.ai.chat(input);
      return { text: reply, actions: ["Start Focus Session", "Open Planner"] };
    } catch {
      /* fall through to offline coach */
    }
  }
  return coachReply(input, state);
}

export function coachReply(input: string, state: MomentumState): { text: string; actions: string[] } {
  const q = input.toLowerCase();
  const open = state.tasks.filter(t => t.status !== "completed" && t.status !== "skipped");
  const topTask = open.sort((a, b) => a.priority - b.priority)[0];
  const habitsDone = state.habits.filter(h => h.progress >= h.target).length;

  if (q.includes("distract") || q.includes("focus")) {
    return {
      text: `Let's narrow the field. Your highest-impact open task is "${topTask?.title ?? "planning tomorrow"}". One 25-minute focus session on it will restore momentum faster than anything else.`,
      actions: ["Start Focus Session", "Reschedule Tasks", "Take Break"]
    };
  }
  if (q.includes("tired") || q.includes("sleep") || q.includes("energy")) {
    return {
      text: `Your Sleep 8h habit logged 7h 15m — a little under target. Protect tonight's wind-down, and put your hardest block in the morning where your energy peaks.`,
      actions: ["Start Focus Session", "Reflect"]
    };
  }
  if (q.includes("plan") || q.includes("today") || q.includes("next")) {
    return {
      text: `You're at ${state.score} of ${state.dailyGoal} points with ${open.length} tasks open. Next best move: "${topTask?.title}". After that, ${habitsDone}/${state.habits.length} habits are done — close out No Sugar and Sleep to finish strong.`,
      actions: ["Start Focus Session", "Open Planner"]
    };
  }
  if (q.includes("goal")) {
    const g = state.goals[0];
    return {
      text: `"${g?.title}" is at ${g?.progress}%. The next milestone is "${g?.milestones.find(m => !m.done)?.title}". Small daily reps on this compound — one focused session today keeps the streak alive.`,
      actions: ["Open Goals", "Start Focus Session"]
    };
  }
  return {
    text: `Based on your patterns, I recommend scheduling your toughest tasks in the morning. You're most productive between 9 AM – 12 PM. Your next best move right now is "${topTask?.title ?? "an evening reflection"}".`,
    actions: ["Start Focus Session", "Open Planner", "Reflect"]
  };
}
