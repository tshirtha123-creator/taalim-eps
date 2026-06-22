import { useRef, useState, type ChangeEvent } from "react";
import { Download, Info, Moon, RotateCcw, ShieldCheck, Sun, Upload } from "lucide-react";
import { courses } from "@/data/courses";
import { useApp } from "@/context/app-context";
import { Button, Card } from "@/components/ui";

export function SettingsPage() {
  const { exportData, importData, reset, dark, toggleTheme } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState(false);
  const totalCourses = new Set(courses.map(course => course.courseNumber)).size;
  const load = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { importData(JSON.parse(await file.text())); } catch { importData(null); }
    event.target.value = "";
  };

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-extrabold tracking-tight">Paramètres</h1><p className="mt-2 text-slate-500">Gère tes données et personnalise ton espace.</p></div>
    <div className="grid gap-5 lg:grid-cols-2">
      <Card><h2 className="flex items-center gap-2 font-bold"><ShieldCheck className="text-indigo-600" size={20} />Mes données</h2><p className="mt-2 text-sm text-slate-500">Tes données restent dans ce navigateur. Exporte une sauvegarde régulièrement.</p><div className="mt-5 flex flex-col gap-3"><Button onClick={exportData}><Download size={18} />Exporter ma progression</Button><input ref={input} type="file" accept="application/json,.json" className="hidden" onChange={load} /><Button variant="secondary" onClick={() => input.current?.click()}><Upload size={18} />Importer ma progression</Button><Button variant="secondary" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950" onClick={() => setConfirm(true)}><RotateCcw size={18} />Réinitialiser la progression</Button></div></Card>
      <Card><h2 className="flex items-center gap-2 font-bold">{dark ? <Moon className="text-indigo-600" size={20} /> : <Sun className="text-indigo-600" size={20} />}Apparence</h2><p className="mt-2 text-sm text-slate-500">Choisis le thème qui convient le mieux à tes séances.</p><Button variant="secondary" className="mt-5" onClick={toggleTheme}>{dark ? <><Sun size={18} />Passer en mode clair</> : <><Moon size={18} />Passer en mode sombre</>}</Button></Card>
    </div>
    <Card><h2 className="flex items-center gap-2 font-bold"><Info className="text-indigo-600" size={20} />À propos</h2><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><InfoRow label="Application" value="EPS Formation Tracker – Taâlim 2026" /><InfoRow label="Objectif" value="Préparation personnelle au concours Taâlim 2026" /><InfoRow label="Cours" value={String(totalCourses)} /><InfoRow label="Parties vidéo" value={String(courses.length)} /></dl></Card>
    {confirm && <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"><Card className="max-w-md shadow-2xl"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-950"><RotateCcw /></div><h2 className="mt-4 text-center text-xl font-extrabold">Réinitialiser la progression ?</h2><p className="mt-3 text-center text-sm text-slate-500">Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible.</p><div className="mt-6 flex justify-center gap-3"><Button variant="secondary" onClick={() => setConfirm(false)}>Annuler</Button><Button variant="danger" onClick={() => { reset(); setConfirm(false); }}>Oui, réinitialiser</Button></div></Card></div>}
  </div>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>;
}
