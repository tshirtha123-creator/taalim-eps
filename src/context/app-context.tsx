import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { courses } from "@/data/courses";
import type { CourseState, PlannedItem, StudyData } from "@/types";
import { isStudyData } from "@/lib/utils";

const STORAGE_KEY = "eps-formation-data-v1";
const SESSION_KEY = "eps-formation-session";
const emptyCourse = (): CourseState => ({ completed: false, favorite: false, difficulty: "moyen", notes: "", keyPoints: "" });
const defaultData = (): StudyData => ({ version: 1, courses: Object.fromEntries(courses.map(course => [course.id, emptyCourse()])), planning: [] });
const courseIds = new Set(courses.map(course => course.id));

function normalizeData(value: StudyData): StudyData {
  const defaults = defaultData();
  const importedCourses = Object.fromEntries(
    Object.entries(value.courses).filter(([id]) => courseIds.has(id)),
  );

  return {
    version: 1,
    courses: { ...defaults.courses, ...importedCourses },
    planning: value.planning.filter(item => courseIds.has(item.courseId)),
    ...(value.lastOpenedCourseId && courseIds.has(value.lastOpenedCourseId)
      ? { lastOpenedCourseId: value.lastOpenedCourseId }
      : {}),
  };
}

type Toast = { id: number; message: string; type: "success" | "error" };
type AppContextValue = {
  ready: boolean; authenticated: boolean; data: StudyData; dark: boolean; toasts: Toast[];
  login: (email: string, password: string) => Promise<string | null>; logout: () => void;
  courseState: (id: string) => CourseState; patchCourse: (id: string, patch: Partial<CourseState>) => void;
  openCourse: (id: string) => void; addPlan: (item: Omit<PlannedItem, "id">) => void; removePlan: (id: string) => void;
  reset: () => void; importData: (value: unknown) => boolean; exportData: () => void; toggleTheme: () => void;
  notify: (message: string, type?: Toast["type"]) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<StudyData>(defaultData);
  const [dark, setDark] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (isStudyData(saved)) setData(normalizeData(saved));
      setAuthenticated(localStorage.getItem(SESSION_KEY) === "active");
      const theme = localStorage.getItem("eps-theme") === "dark";
      setDark(theme);
      document.documentElement.classList.toggle("dark", theme);
    } catch { /* Ignore damaged browser data and start clean. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const notify = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(current => [...current, { id, message, type }]);
    window.setTimeout(() => setToasts(current => current.filter(toast => toast.id !== id)), 3200);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const demoEmail = import.meta.env.VITE_DEMO_EMAIL;
    const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;
    if (!demoEmail || !demoPassword) return "Configuration de connexion manquante.";
    if (email.trim().toLowerCase() !== demoEmail.trim().toLowerCase() || password !== demoPassword) {
      return "Email ou mot de passe incorrect.";
    }
    localStorage.setItem(SESSION_KEY, "active");
    setAuthenticated(true);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  }, []);

  const courseState = useCallback((id: string) => data.courses[id] || emptyCourse(), [data.courses]);

  const patchCourse = useCallback((id: string, patch: Partial<CourseState>) => {
    if (!courseIds.has(id)) return;
    setData(current => ({
      ...current,
      courses: {
        ...current.courses,
        [id]: { ...(current.courses[id] || emptyCourse()), ...patch },
      },
    }));
  }, []);

  const openCourse = useCallback((id: string) => {
    if (!courseIds.has(id)) return;
    setData(current => current.lastOpenedCourseId === id ? current : { ...current, lastOpenedCourseId: id });
  }, []);

  const addPlan = useCallback((item: Omit<PlannedItem, "id">) => {
    if (!courseIds.has(item.courseId)) return;
    setData(current => ({ ...current, planning: [...current.planning, { ...item, id: crypto.randomUUID() }] }));
  }, []);

  const removePlan = useCallback((id: string) => {
    setData(current => ({ ...current, planning: current.planning.filter(item => item.id !== id) }));
  }, []);

  const reset = useCallback(() => {
    setData(defaultData());
    notify("Progression réinitialisée.");
  }, [notify]);

  const importData = useCallback((value: unknown) => {
    if (!isStudyData(value)) {
      notify("Fichier invalide ou incompatible.", "error");
      return false;
    }
    setData(normalizeData(value));
    notify("Progression importée avec succès.");
    return true;
  }, [notify]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eps-progression-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    notify("Progression exportée.");
  }, [data, notify]);

  const toggleTheme = useCallback(() => setDark(current => {
    const next = !current;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("eps-theme", next ? "dark" : "light");
    return next;
  }), []);

  const value = useMemo<AppContextValue>(() => ({
    ready, authenticated, data, dark, toasts,
    login, logout, courseState, patchCourse, openCourse, addPlan, removePlan,
    reset, importData, exportData, toggleTheme, notify,
  }), [
    ready, authenticated, data, dark, toasts,
    login, logout, courseState, patchCourse, openCourse, addPlan, removePlan,
    reset, importData, exportData, toggleTheme, notify,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp doit être utilisé dans AppProvider");
  return context;
}
