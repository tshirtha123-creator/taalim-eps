import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, CirclePlay, Clock3, Flame, Gauge, Heart, Sparkles, Target } from "lucide-react";
import { courses } from "@/data/courses";
import { useApp } from "@/context/app-context";
import { Badge, Button, Card, Progress } from "@/components/ui";

export function Dashboard() {
  const navigate = useNavigate();
  const { data, courseState } = useApp();
  const totalCourses = new Set(courses.map(course => course.courseNumber)).size;
  const completed = courses.filter(course => courseState(course.id).completed).length;
  const remaining = courses.length - completed;
  const percent = Math.round(completed / courses.length * 100);
  const favorites = courses.filter(course => courseState(course.id).favorite).length;
  const difficult = courses.filter(course => courseState(course.id).difficulty === "difficile").length;
  const last = courses.find(course => course.id === data.lastOpenedCourseId && !courseState(course.id).completed);
  const next = courses.find(course => !courseState(course.id).completed);
  const openCourse = (id: string) => navigate(`/course/${id}`);
  const stats = [
    { label: "Total des cours", value: totalCourses, icon: BookOpen, color: "blue" },
    { label: "Parties vidéo", value: courses.length, icon: CirclePlay, color: "blue" },
    { label: "Vidéos terminées", value: completed, icon: CheckCircle2, color: "emerald" },
    { label: "Vidéos restantes", value: remaining, icon: Clock3, color: "blue" },
    { label: "Progression", value: `${percent}%`, icon: Gauge, color: "emerald" },
    { label: "Favoris", value: favorites, icon: Heart, color: "rose" },
    { label: "Cours difficiles", value: difficult, icon: Flame, color: "amber" },
  ];

  return <div className="space-y-7">
    <section><Badge tone="indigo">TON ESPACE DE PRÉPARATION</Badge><h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Bonjour Hamza 👋</h1><p className="mt-2 max-w-2xl text-slate-500">Organise tes cours EPS, suis ta progression et prépare ton concours efficacement.</p></section>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{stats.map(stat => <Card key={stat.label} className="flex items-center gap-4"><div className={`stat-icon ${stat.color}`}><stat.icon size={22} /></div><div><div className="text-2xl font-extrabold">{stat.value}</div><div className="text-sm text-slate-500">{stat.label}</div></div></Card>)}</section>
    <Card className="overflow-hidden p-0"><div className="grid lg:grid-cols-[1fr_260px]"><div className="p-6 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-indigo-600">Progression globale</p><h2 className="mt-1 text-xl font-bold">{completed} vidéos sur {courses.length} terminées</h2></div><span className="text-3xl font-extrabold text-indigo-600">{percent}%</span></div><Progress value={percent} /><div className="mt-3 flex justify-between text-xs text-slate-400"><span>{totalCourses} cours · {courses.length} parties</span><span>{remaining} restantes</span></div></div><div className="hidden items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 p-5 text-white lg:flex"><div className="relative grid h-32 w-32 place-items-center rounded-full" style={{ background: `conic-gradient(white ${percent * 3.6}deg, rgba(255,255,255,.2) 0)` }}><div className="grid h-24 w-24 place-items-center rounded-full bg-indigo-600 text-2xl font-extrabold">{percent}%</div></div></div></div></Card>
    <section className="grid gap-5 lg:grid-cols-2"><ActionCard icon={CirclePlay} eyebrow="Reprendre" title={last ? `${last.title}${last.part ? ` · ${last.part}` : ""}` : "Aucun cours en attente"} text={last ? "Continue là où tu t’es arrêté." : "Ouvre un cours pour le retrouver ici."} button="Continuer" disabled={!last} onClick={() => last && openCourse(last.id)} /><ActionCard icon={Target} eyebrow="Objectif du jour" title={next ? `${next.title}${next.part ? ` · ${next.part}` : ""}` : "Tout est terminé !"} text={next ? "La prochaine étape de ton parcours t’attend." : "Bravo, ta préparation est complète."} button="Commencer maintenant" disabled={!next} onClick={() => next && openCourse(next.id)} /></section>
    <Card className="flex items-start gap-4 border-indigo-100 bg-indigo-50/70 dark:border-indigo-900 dark:bg-indigo-950/40"><div className="rounded-xl bg-indigo-600 p-3 text-white"><Sparkles size={22} /></div><div><p className="font-bold">La dose de motivation</p><blockquote className="mt-1 text-slate-600 dark:text-slate-300">« La régularité est plus forte que la motivation. »</blockquote></div></Card>
  </div>;
}

function ActionCard({ icon: Icon, eyebrow, title, text, button, onClick, disabled }: { icon: typeof BookOpen; eyebrow: string; title: string; text: string; button: string; onClick: () => void; disabled: boolean }) {
  return <Card className="group relative overflow-hidden"><div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><Icon /></div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">{eyebrow}</p><h3 className="mt-2 text-xl font-bold">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p><Button className="mt-5" onClick={onClick} disabled={disabled}>{button}<ArrowRight size={17} /></Button></Card>;
}
