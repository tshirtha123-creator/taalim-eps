import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Check, ChevronDown, Heart, Search, SlidersHorizontal, StickyNote } from "lucide-react";
import { courses, type Course } from "@/data/courses";
import { useApp } from "@/context/app-context";
import type { Difficulty } from "@/types";
import { Badge, Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

type Filter = "tous" | "termines" | "non-termines" | "favoris" | "difficiles";

export function CoursesPage() {
  const navigate = useNavigate();
  const { courseState } = useApp();
  const [filter, setFilter] = useState<Filter>("tous");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ordre");
  const totalCourses = new Set(courses.map(course => course.courseNumber)).size;
  const list = useMemo(() => courses.filter(course => {
    const state = courseState(course.id);
    const matches = `${course.title} ${course.courseNumber} ${course.part || ""}`.toLowerCase().includes(search.toLowerCase());
    return matches && (filter === "tous" || (filter === "termines" && state.completed) || (filter === "non-termines" && !state.completed) || (filter === "favoris" && state.favorite) || (filter === "difficiles" && state.difficulty === "difficile"));
  }).sort((a, b) => {
    const first = courseState(a.id), second = courseState(b.id);
    if (sort === "termines") return Number(second.completed) - Number(first.completed);
    if (sort === "non-termines") return Number(first.completed) - Number(second.completed);
    if (sort === "difficiles") return Number(second.difficulty === "difficile") - Number(first.difficulty === "difficile");
    return 0;
  }), [filter, search, sort, courseState]);

  const filters: [Filter, string][] = [["tous", "Tous"], ["termines", "Terminés"], ["non-termines", "Non terminés"], ["favoris", "Favoris"], ["difficiles", "Difficiles"]];
  return <div className="space-y-6">
    <div><h1 className="text-3xl font-extrabold tracking-tight">Mes cours</h1><p className="mt-2 text-slate-500">Retrouve tes {totalCourses} cours EPS et suis chaque partie à ton rythme.</p></div>
    <Card className="space-y-4"><div className="flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={19} /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Rechercher un cours…" className="pl-10" /></div><div className="relative"><SlidersHorizontal className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} /><select value={sort} onChange={event => setSort(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"><option value="ordre">Ordre des cours</option><option value="termines">Terminés d’abord</option><option value="non-termines">Non terminés d’abord</option><option value="difficiles">Difficiles d’abord</option></select></div></div><div className="flex gap-2 overflow-x-auto pb-1">{filters.map(([id, label]) => <button key={id} onClick={() => setFilter(id)} className={cn("whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition", filter === id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300")}>{label}</button>)}</div></Card>
    <p className="text-sm text-slate-500"><b className="text-slate-900 dark:text-white">{list.length}</b> vidéo{list.length !== 1 ? "s" : ""}</p>
    {list.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map(course => <CourseCard key={course.id} course={course} open={() => navigate(`/course/${course.id}`)} />)}</div> : <Card className="py-16 text-center"><BookOpen className="mx-auto text-slate-300" size={42} /><h3 className="mt-4 font-bold">Aucun cours trouvé.</h3><p className="mt-1 text-sm text-slate-500">Essaie un autre filtre ou une autre recherche.</p></Card>}
  </div>;
}

function CourseCard({ course, open }: { course: Course; open: () => void }) {
  const { courseState, patchCourse } = useApp();
  const state = courseState(course.id);
  return <Card className="group flex flex-col p-0 transition hover:-translate-y-0.5 hover:shadow-lg"><div className="relative h-28 overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-600 p-5 text-white"><div className="absolute -right-5 -top-8 h-28 w-28 rounded-full border-[18px] border-white/5" /><p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Cours {course.courseNumber}</p><h3 className="mt-2 text-xl font-bold">{course.title}</h3>{course.part && <span className="text-xs text-indigo-200">{course.part}</span>}<button aria-label="Favori" onClick={() => patchCourse(course.id, { favorite: !state.favorite })} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 backdrop-blur hover:bg-white/20"><Heart size={18} className={state.favorite ? "fill-rose-400 text-rose-400" : ""} /></button></div><div className="flex flex-1 flex-col p-5"><div className="mb-4 flex items-center justify-between"><Badge tone={state.completed ? "green" : "slate"}>{state.completed ? <><Check size={13} /> Terminé</> : "Non terminé"}</Badge>{(state.notes || state.keyPoints) && <span title="Notes enregistrées" className="text-indigo-500"><StickyNote size={18} /></span>}</div><label className="text-xs font-semibold text-slate-500">Difficulté<div className="relative mt-1"><select value={state.difficulty} onChange={event => patchCourse(course.id, { difficulty: event.target.value as Difficulty })} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium capitalize dark:border-slate-700 dark:bg-slate-900"><option value="facile">Facile</option><option value="moyen">Moyen</option><option value="difficile">Difficile</option></select><ChevronDown className="pointer-events-none absolute right-3 top-2.5" size={16} /></div></label><div className="mt-5 grid gap-2"><Button onClick={open}><BookOpen size={17} />Voir le cours</Button><Button variant="secondary" onClick={() => patchCourse(course.id, { completed: !state.completed })}>{state.completed ? "Marquer comme non terminé" : "Marquer comme terminé"}</Button></div></div></Card>;
}
