import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CourseState, PlannedItem, StudyData } from "@/types";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function createFacebookEmbedUrl(url: string) {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=800`;
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}
export function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isCourseState(value: unknown): value is CourseState {
  if (!isRecord(value)) return false;
  return (
    typeof value.completed === "boolean" &&
    typeof value.favorite === "boolean" &&
    ["facile", "moyen", "difficile"].includes(String(value.difficulty)) &&
    typeof value.notes === "string" &&
    typeof value.keyPoints === "string"
  );
}

function isPlannedItem(value: unknown): value is PlannedItem {
  if (!isRecord(value)) return false;
  const date = typeof value.date === "string" ? new Date(`${value.date}T00:00:00Z`) : null;
  return (
    typeof value.id === "string" && value.id.length > 0 &&
    typeof value.courseId === "string" && value.courseId.length > 0 &&
    typeof value.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
    date !== null && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value.date &&
    typeof value.objective === "string"
  );
}

export function isStudyData(value: unknown): value is StudyData {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.courses) || !Array.isArray(value.planning)) return false;
  if (value.lastOpenedCourseId !== undefined && typeof value.lastOpenedCourseId !== "string") return false;
  if (!Object.values(value.courses).every(isCourseState) || !value.planning.every(isPlannedItem)) return false;
  const planningIds = value.planning.map(item => (item as PlannedItem).id);
  return new Set(planningIds).size === planningIds.length;
}
