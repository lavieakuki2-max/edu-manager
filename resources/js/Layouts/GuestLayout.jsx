import { Link } from '@inertiajs/react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-dvh overflow-x-clip bg-slate-950 text-white [color-scheme:dark]">
            <div className="grid min-h-dvh lg:grid-cols-[1.05fr_.95fr]">
                <aside className="relative hidden overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-indigo-950 p-12 lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-white/8 blur-3xl" />
                    <Link href="/" className="relative flex items-center gap-3 text-xl font-bold">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700">
                            <GraduationCap size={24} />
                        </span>
                        EduManager
                    </Link>
                    <div className="relative max-w-lg">
                        <p className="mb-5 text-sm font-semibold uppercase tracking-[.22em] text-blue-200">Plateforme academique — UNILUK</p>
                        <h1 className="text-5xl font-bold leading-tight">Suivez vos stages et mémoires, simplement.</h1>
                        <p className="mt-6 text-lg leading-8 text-white/75">Centralisez vos projets, documents, validations et soutenances dans un espace conçu pour réussir.</p>
                    </div>
                    <div className="relative flex items-center gap-3 text-sm text-blue-200">
                        <ShieldCheck size={18} /> Données et échanges sécurisés
                    </div>
                </aside>

                <main className="relative flex items-center justify-center px-4 py-8 sm:px-10 sm:py-12">
                    <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
                    <div className="relative w-full max-w-md">
                        <Link href="/" className="mb-8 flex items-center gap-3 text-xl font-bold lg:hidden">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
                                <GraduationCap size={21} />
                            </span>
                            EduManager
                        </Link>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}