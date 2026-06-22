import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ExternalLink, Plus, Trash2 } from "lucide-react";
import { courses } from "@/data/courses";
import { useApp } from "@/context/app-context";
import { formatDate, localDate } from "@/lib/utils";
import { Badge, Button, Card, Input } from "@/components/ui";

export function PlanningPage() {
  const navigate = useNavigate();
  const { data, addPlan, removePlan, courseState } = useApp();
  const [show, setShow] = useState(false);
  const today = localDate();
  const sections = useMemo(() => [
    { title: "Aujourd’hui", items: data.planning.filter(item => item.date === today) },
    { title: "À venir", items: data.planning.filter(item => item.date > today) },
    { title: "Déjà passé", items: data.planning.filter(item => item.date < today) },
  ], [data.planning, today]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addPlan({ courseId: String(form.get("course")), date: String(form.get("date")), objective: String(form.get("objective")) });
    setShow(false);
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-extrabold tracking-tight">Planning</h1><p className="mt-2 text-slate-500">Planifie tes séances et garde un rythme régulier.</p></div><Button onClick={() => setShow(!show)}><Plus size={18} />Planifier une séance</Button></div>
    {show && <Card><form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
      <label className="text-sm font-semibold">Cours<select name="course" required className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">{courses.map(course => <option value={course.id} key={course.id}>{course.title}{course.part ? ` — ${course.part}` : ""}</option>)}</select></label>
      <label className="text-sm font-semibold">Date<Input name="date" type="date" min={today} defaultValue={today} className="mt-2" required /></label>
      <label className="text-sm font-semibold">Objectif (facultatif)<Input name="objective" placeholder="Ex. Prendre des notes" className="mt-2" /></label>
      <div className="flex gap-2 md:col-span-3"><Button type="submit">Ajouter au planning</Button><Button type="button" variant="ghost" onClick={() => setShow(false)}>Annuler</Button></div>
    </form></Card>}
    {sections.map(section => <section key={section.title}>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><CalendarDays size={20} className="text-indigo-600" />{section.title}<Badge>{section.items.length}</Badge></h2>
      {section.items.length ? <div className="space-y-3">{section.items.toSorted((a, b) => a.date.localeCompare(b.date)).map(item => {
        const course = courses.find(candidate => candidate.id === item.courseId);
        if (!course) return null;
        const done = courseState(course.id).completed;
        return <Card key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 font-extrabold text-indigo-700 dark:bg-indigo-950">{course.courseNumber}</div>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{course.title}{course.part ? ` · ${course.part}` : ""}</h3><Badge tone={done ? "green" : "slate"}>{done ? "Terminé" : "À faire"}</Badge></div><p className="text-sm text-slate-500">{formatDate(item.date)}{item.objective ? ` · ${item.objective}` : ""}</p></div>
          <div className="flex gap-2"><Button variant="secondary" onClick={() => navigate(`/course/${course.id}`)}><ExternalLink size={16} />Ouvrir</Button><Button variant="ghost" aria-label="Supprimer" onClick={() => removePlan(item.id)} className="text-red-600"><Trash2 size={18} /></Button></div>
        </Card>;
      })}</div> : <Card className="border-dashed py-8 text-center text-sm text-slate-400">Aucune séance dans cette section.</Card>}
    </section>)}
  </div>;
}
