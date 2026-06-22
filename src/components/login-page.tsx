import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import { useApp } from "@/context/app-context";
import { Button, Card, Input } from "@/components/ui";

export function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await login(String(form.get("email")), String(form.get("password")));
    setLoading(false);
    if (result) setError(result);
    else navigate("/dashboard", { replace: true });
  };

  return <main className="login-bg flex min-h-screen items-center justify-center p-5">
    <Card className="relative w-full max-w-md overflow-hidden border-white/60 p-7 shadow-2xl sm:p-9">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400" />
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"><GraduationCap size={32} /></div>
        <h1 className="text-2xl font-extrabold tracking-tight">EPS Formation Tracker</h1>
        <p className="mt-1 font-semibold text-indigo-600">Taâlim 2026</p>
        <p className="mt-3 text-sm text-slate-500">Connecte-toi pour suivre ta progression</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold">Adresse e-mail<div className="relative mt-2"><Mail className="absolute left-3 top-3 text-slate-400" size={19} /><Input name="email" type="email" autoComplete="username" defaultValue={import.meta.env.VITE_DEMO_EMAIL || ""} className="pl-10" required /></div></label>
        <label className="block text-sm font-semibold">Mot de passe<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 text-slate-400" size={19} /><Input name="password" type={show ? "text" : "password"} autoComplete="current-password" className="px-10" required /><button type="button" aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"} onClick={() => setShow(!show)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700">{show ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}
        <Button className="w-full" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</Button>
      </form>
      <p className="mt-7 text-center text-sm italic text-slate-500">« Chaque cours terminé te rapproche de ton objectif. »</p>
    </Card>
  </main>;
}
