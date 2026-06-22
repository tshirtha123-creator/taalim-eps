import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import { CourseViewer } from "@/components/course-viewer";
import { CoursesPage } from "@/components/courses-page";
import { Dashboard } from "@/components/dashboard";
import { PlanningPage } from "@/components/planning-page";
import { SettingsPage } from "@/components/settings-page";
import { StatisticsPage } from "@/components/statistics-page";

export function App() {
  return <Routes>
    <Route element={<AppShell />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/course/:id" element={<CourseViewer />} />
      <Route path="/planning" element={<PlanningPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
