import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, BookOpen, CalendarDays, ChevronLeft, GraduationCap, LayoutDashboard, Menu, Moon, Settings, Sun, X } from "lucide-react";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const links = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/courses", label: "Mes cours", icon: BookOpen },
  { to: "/planning", label: "Planning", icon: CalendarDays },
  { to: "/statistics", label: "Statistiques", icon: BarChart3 },
  { to: "/settings", label: "Paramètres", icon: Settings },
];

export function AppShell() {
  const { dark, toggleTheme, toasts } = useApp();
  const [mobile, setMobile] = useState(false);
  const [compact, setCompact] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {mobile && <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden" onClick={() => setMobile(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900", compact ? "w-20" : "w-64", mobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5 dark:border-slate-800">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap size={23} /></div>
          {!compact && <div><div className="font-extrabold leading-tight">EPS Tracker</div><div className="text-xs font-semibold text-indigo-600">Taâlim 2026</div></div>}
          <button className="ml-auto lg:hidden" aria-label="Fermer le menu" onClick={() => setMobile(false)}><X /></button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map(link => <NavLink key={link.to} to={link.to} onClick={() => setMobile(false)} title={link.label} className={({ isActive }) => cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition", isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white")}><link.icon size={20} />{!compact && link.label}</NavLink>)}
        </nav>
        <div className="space-y-1 border-t border-slate-100 p-3 dark:border-slate-800">
          <button onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">{dark ? <Sun size={20} /> : <Moon size={20} />}{!compact && (dark ? "Mode clair" : "Mode sombre")}</button>
          <button onClick={() => setCompact(!compact)} aria-label={compact ? "Agrandir le menu" : "Réduire le menu"} className="hidden w-full items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 lg:flex"><ChevronLeft className={cn("transition", compact && "rotate-180")} size={19} /></button>
        </div>
      </aside>
      <div className={cn("transition-all", compact ? "lg:pl-20" : "lg:pl-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 lg:px-8">
          <Button variant="ghost" className="px-2 lg:hidden" aria-label="Ouvrir le menu" onClick={() => setMobile(true)}><Menu /></Button>
          <div className="ml-2"><p className="text-xs text-slate-400">Espace public</p><p className="text-sm font-bold">Préparation EPS · Taâlim 2026</p></div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
      <div className="fixed bottom-5 right-5 z-[70] space-y-2" aria-live="polite">{toasts.map(toast => <div key={toast.id} className={cn("rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl", toast.type === "success" ? "bg-emerald-600" : "bg-red-600")}>{toast.message}</div>)}</div>
    </div>
  );
}
