import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, BookOpen, Briefcase, CheckCircle2, FileText, GraduationCap, Shield } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const features = [
        { icon: Briefcase, title: 'Suivi des stages', desc: 'Suivez les stages des etudiants aupres des entreprises partenaires.' },
        { icon: BookOpen, title: 'Gestion des memoires', desc: 'Encadrez et validez les sujets de memoire avec un workflow clair.' },
        { icon: FileText, title: 'Depot de documents', desc: 'Versionnez les livrables PDF et telechargez les fichiers.' },
        { icon: CheckCircle2, title: 'Workflow de validation', desc: 'Transitions de statut guidees avec historique complet.' },
    ];

    const roles = [
        { icon: GraduationCap, label: 'Etudiant', desc: 'Soumettez vos sujets, deposez vos documents et suivez votre progression.', color: 'from-teal-400 to-emerald-500' },
        { icon: BookOpen, label: 'Encadreur', desc: 'Validez les sujets, commentez les travaux et orientez les etudiants.', color: 'from-cyan-400 to-blue-500' },
        { icon: Shield, label: 'Administration', desc: 'Gerez les projets, planifiez les soutenances et generez les documents officiels.', color: 'from-amber-400 to-orange-500' },
    ];

    return (
        <>
            <Head title="EduManager - UNILUK" />

            <div className="min-h-screen">
                <div
                    className="fixed inset-0 -z-10"
                    style={{
                        background: 'linear-gradient(180deg, #08111f 0%, #0f172a 38%, #f8fafc 38%, #f8fafc 100%)',
                    }}
                />

                <header className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-black text-slate-950">ED</span>
                            <div>
                                <div className="text-lg font-semibold leading-5 text-white">EduManager</div>
                                <div className="text-xs text-slate-400">UNILUK</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15">
                                        Connexion
                                    </Link>
                                    <Link href={route('register')} className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                                        Inscription
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <section className="py-20 text-center lg:py-32">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
                            Plateforme academique — UNILUK
                        </span>
                        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Suivez les stages et memoires dans un seul espace
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300">
                            EduManager est la plateforme de l'Universite de Lukanga pour la gestion des projets academiques.
                            Deposez vos sujets, telechargez vos livrables, echangez avec vos encadreurs et validez les soutenances.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                            <Link href={route('register')} className="rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                                Creer un compte <ArrowUpRight size={16} className="inline" />
                            </Link>
                            <Link href={route('login')} className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15">
                                Se connecter
                            </Link>
                        </div>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-20">
                        {features.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mb-4 inline-flex rounded-2xl bg-teal-50 p-3 text-teal-600">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">{f.desc}</p>
                                </div>
                            );
                        })}
                    </section>

                    <section className="pb-20">
                        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">Un espace pour chaque role</h2>
                        <div className="mt-10 grid gap-6 sm:grid-cols-3">
                            {roles.map((r) => {
                                const Icon = r.icon;
                                return (
                                    <div key={r.label} className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                                        <div className={`mx-auto mb-5 inline-flex rounded-2xl bg-gradient-to-br p-4 text-white shadow-lg ${r.color}`}>
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900">{r.label}</h3>
                                        <p className="mt-3 text-sm leading-6 text-slate-500">{r.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
                        EduManager — Universite de Lukanga (UNILUK) — Laravel {laravelVersion} / PHP {phpVersion}
                    </footer>
                </main>
            </div>
        </>
    );
}
