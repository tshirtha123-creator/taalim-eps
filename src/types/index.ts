export type Difficulty = "facile" | "moyen" | "difficile";
export type CourseState = { completed: boolean; favorite: boolean; difficulty: Difficulty; notes: string; keyPoints: string };
export type PlannedItem = { id: string; courseId: string; date: string; objective: string };
export type StudyData = {
  version: number;
  courses: Record<string, CourseState>;
  planning: PlannedItem[];
  lastOpenedCourseId?: string;
};
