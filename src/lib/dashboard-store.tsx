"use client";
import { createContext, useContext, useMemo, useReducer, ReactNode } from "react";
import type { Member, Project, Task, Settings } from "./types";

type State = {
  projects: Project[];
  members: Member[];
  tasks: Task[];
  settings: Settings;
  loading: boolean;
  error?: string | null;
};

type Action =
  | { type: "loading"; payload: boolean }
  | { type: "error"; payload: string | null }
  | { type: "project/add" | "project/update"; payload: Project }
  | { type: "project/delete"; payload: string }
  | { type: "member/add" | "member/update"; payload: Member }
  | { type: "member/delete"; payload: string }
  | { type: "task/add" | "task/update"; payload: Task }
  | { type: "task/delete"; payload: string }
  | { type: "settings/save"; payload: Settings };

const initial: State = {
  projects: [
    { id: crypto.randomUUID(), name: "Alpha", description: "Demo", category: "web", memberIds: [], createdAt: new Date() },
  ],
  members: [],
  tasks: [],
  settings: { denseUI: false, emailNotifications: true, themeName: "emerald" },
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loading": return { ...state, loading: action.payload };
    case "error": return { ...state, error: action.payload };

    case "project/add":
      return { ...state, projects: [...state.projects, action.payload] };
    case "project/update":
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case "project/delete":
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        tasks: state.tasks.filter(t => t.projectId !== action.payload),
        members: state.members.map(m => m.projectId === action.payload ? { ...m, projectId: undefined } : m),
      };

    case "member/add":
      return { ...state, members: [...state.members, action.payload] };
    case "member/update":
      return { ...state, members: state.members.map(m => m.userId === action.payload.userId ? action.payload : m) };
    case "member/delete":
      return {
        ...state,
        members: state.members.filter(m => m.userId !== action.payload),
        tasks: state.tasks.map(t => t.userId === action.payload ? { ...t, userId: "" } : t),
      };

    case "task/add":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "task/update":
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case "task/delete":
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

    case "settings/save":
      return { ...state, settings: action.payload };

    default: return state;
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboard() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
