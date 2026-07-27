import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, BookOpen, CalendarRange, CheckCircle2, FileText, Files, GraduationCap, Users } from 'lucide-react';

const workflowSteps = ['Depot', 'Validation plan', 'Chapitres', 'Soutenance'];

export default function Dashboard({ role, stats, projets, documentsRecents }) {
    const cards = [
        { label: 'Projets suivis', value: stats.projets, icon: BookOpen, tone: 'from-teal-500 to-emerald-500' },
        { label: 'Valides', value: stats.valides, icon: CheckCircle2, tone: 'from-emerald-500 to-lime-500' },
        { label: 'Prets pour soutenance', value: stats.soutenances, icon: CalendarRange, tone: 'from-amber-500 to-orange-500' },
        { label: role === 'admin' ? 'Utilisateurs' : 'Documents', value: role === 'admin' ? stats.utilisateurs : stats.documents, icon: role === 'admin' ? Users : FileText, tone: 'from-sky-500 to-blue-500' },
    ];

    const activeWorkflowIndex = 2;

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Tableau de bord</h1>}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
                        <div className="space-y-4">
                            <span className="status-pill bg-white/10 text-white/90">UNILUK - Gestion des stages et memoires</span>
                            <div>
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Suivez les sujets, les depots et les soutenances dans un seul espace.</h2>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200/85">Une interface pensee pour les etudiants, encadreurs et le bureau des stages, avec validation, commentaires, documents PDF et planification de soutenance.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href={route('projets.index')} className="soft-button bg-white text-slate-950 hover:bg-slate-100">
                                    Ouvrir les projets <ArrowUpRight size={16} />
                                </Link>
                                <Link href={route('documents.index')} className="soft-button border border-white/15 bg-white/10 text-white hover:bg-white/15">
                                    Voir les documents <Files size={16} />
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                                <div className="flex items-center justify-between text-sm text-slate-200">
                                    <span>Workflow moyen</span>
                                    <span>72%</span>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-white/10">
                                    <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
                                </div>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Dernier depot</p>
                                        <p className="mt-2 text-lg font-semibold">Document PDF</p>
                                    </div>
                                    <GraduationCap className="text-teal-300" size={26} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div key={card.label} className="panel-card p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="panel-title">{card.label}</p>
                                        <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value ?? 0}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${card.tone}`}>
                                        <Icon size={22} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    <section className="panel-card overflow-hidden">
                        <div className="border-b border-slate-200/80 p-5">
                            <h2 className="text-base font-semibold text-slate-950">Suivi workflow</h2>
                            <p className="mt-1 text-sm text-slate-500">Vue synthetique des etapes en cours sur les derniers projets.</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {projets.map((projet) => (
                                <Link href={route('projets.index')} key={projet.id} className="block p-5 transition hover:bg-slate-50">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-slate-950">{projet.titre}</p>
                                            <p className="mt-1 text-sm text-slate-500">{projet.type} - {projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom}</p>
                                        </div>
                                        <span className="status-pill bg-teal-50 text-teal-700">{projet.statut_actuel}</span>
                                    </div>
                                    <div className="mt-4 grid gap-2 sm:grid-cols-4">
                                        {workflowSteps.map((step, index) => (
                                            <div key={step} className={`rounded-2xl px-3 py-2 text-xs font-semibold ${index <= activeWorkflowIndex ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-400'}`}>
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                            {projets.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Aucun projet a afficher.</div>}
                        </div>
                    </section>

                    <section className="panel-card overflow-hidden">
                        <div className="border-b border-slate-200/80 p-5">
                            <h2 className="text-base font-semibold text-slate-950">Derniers documents</h2>
                            <p className="mt-1 text-sm text-slate-500">Livrables recents deposes par les etudiants.</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {documentsRecents.map((document) => (
                                <div key={document.id} className="p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                                            <FileText size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-950">{document.titre_fichier}</p>
                                            <p className="mt-1 text-sm text-slate-500">v{document.version} - {document.projet?.titre}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {documentsRecents.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Aucun document recent.</div>}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
