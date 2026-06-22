import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, Heart } from "lucide-react";
import { courses } from "@/data/courses";
import { useApp } from "@/context/app-context";
import { createFacebookEmbedUrl } from "@/lib/utils";
import type { Difficulty } from "@/types";
import { Badge, Button, Card, Textarea } from "@/components/ui";

export function CourseViewer() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { courseState, patchCourse, openCourse } = useApp();
  const index = courses.findIndex(course => course.id === id);
  const course = courses[index];
  const state = courseState(id);

  useEffect(() => {
    if (course) openCourse(course.id);
  }, [course, openCourse]);

  if (!course) return <Navigate to="/courses" replace />;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button variant="secondary" className="px-3" aria-label="Retour aux cours" onClick={() => navigate("/courses")}><ArrowLeft size={18} /></Button>
        <div>
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{course.title}</h1>{course.part && <Badge tone="indigo">{course.part}</Badge>}</div>
          <p className="mt-1 text-sm text-slate-500">Vidéo {index + 1} sur {courses.length}</p>
        </div>
      </div>
      <Badge tone={state.completed ? "green" : "slate"}>{state.completed ? "Terminé" : "Non terminé"}</Badge>
    </div>

    <Card className="overflow-hidden p-0">
      <div className="bg-slate-950">
        <div className="aspect-video"><iframe title={`${course.title} ${course.part || ""}`} src={createFacebookEmbedUrl(course.url)} className="h-full w-full" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen /></div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-3 sm:px-5">
          <p className="text-xs text-slate-400">Si la vidéo ne s’affiche pas, ouvre-la directement sur Facebook.</p>
          <a href={course.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"><ExternalLink size={16} />Ouvrir sur Facebook</a>
        </div>
      </div>
    </Card>

    <div className="flex flex-wrap gap-2">
      <Button onClick={() => patchCourse(course.id, { completed: !state.completed })}><CheckCircle2 size={18} />{state.completed ? "Marquer comme non terminé" : "Marquer comme terminé"}</Button>
      <Button variant="secondary" onClick={() => patchCourse(course.id, { favorite: !state.favorite })}><Heart size={18} className={state.favorite ? "fill-rose-500 text-rose-500" : ""} />{state.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}</Button>
      <select aria-label="Difficulté" value={state.difficulty} onChange={event => patchCourse(course.id, { difficulty: event.target.value as Difficulty })} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold capitalize dark:border-slate-700 dark:bg-slate-900"><option value="facile">Facile</option><option value="moyen">Moyen</option><option value="difficile">Difficile</option></select>
    </div>

    <div className="grid gap-5 lg:grid-cols-2">
      <Card><label className="block"><span className="mb-2 block font-bold">Notes personnelles</span><Textarea value={state.notes} onChange={event => patchCourse(course.id, { notes: event.target.value })} placeholder="Mes notes pour ce cours…" /></label></Card>
      <Card><label className="block"><span className="mb-2 block font-bold">Points importants à retenir</span><Textarea value={state.keyPoints} onChange={event => patchCourse(course.id, { keyPoints: event.target.value })} placeholder="• Points importants à retenir…" /></label></Card>
    </div>

    <div className="flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-800">
      <Button variant="secondary" disabled={index === 0} onClick={() => navigate(`/course/${courses[index - 1].id}`)}><ArrowLeft size={17} /><span className="hidden sm:inline">Cours précédent</span></Button>
      <span className="text-xs font-semibold text-slate-400">Sauvegarde automatique</span>
      <Button variant="secondary" disabled={index === courses.length - 1} onClick={() => navigate(`/course/${courses[index + 1].id}`)}><span className="hidden sm:inline">Cours suivant</span><ArrowRight size={17} /></Button>
    </div>
  </div>;
}
