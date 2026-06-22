import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import { CourseViewer } from "@/components/course-viewer";
import { CoursesPage } from "@/components/courses-page";
import { Dashboard } from "@/components/dashboard";
import { LoginPage } from "@/components/login-page";
import { PlanningPage } from "@/components/planning-page";
import { SettingsPage } from "@/components/settings-page";
import { StatisticsPage } from "@/components/statistics-page";
import { useApp } from "@/context/app-context";

function ProtectedRoute() {
  const { ready, authenticated } = useApp();
  if (!ready) return <div className="grid min-h-screen place-items-center"><div className="loader" /></div>;
  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function LoginRoute() {
  const { ready, authenticated } = useApp();
  if (!ready) return <div className="grid min-h-screen place-items-center"><div className="loader" /></div>;
  return authenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

export function App() {
  return <Routes>
    <Route path="/login" element={<LoginRoute />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:id" element={<CourseViewer />} />
        <Route path="/planning" element={<PlanningPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
