import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle, ArrowUpRight, BookOpen, CalendarRange, CheckCircle2, Clock, FileText, Files,
    GraduationCap, MessageSquare, TrendingUp, Users,
} from 'lucide-react';

const statusColors = {
    'Sujet Soumis': 'bg-amber-50 text-amber-700 border border-amber-200',
    'En Cours': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Pret pour Soutenance': 'bg-purple-50 text-purple-700 border border-purple-200',
    'Valide': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'A Corriger': 'bg-red-50 text-red-700 border border-red-200',
};

const roleGreeting = {
    admin: 'Administration',
    enseignant: 'Encadreur',
    etudiant: 'Etudiant',
};

export default function Dashboard({ role, userName, stats, projets, documentsRecents, recentActivity, alertes }) {
    const greeting = `Bonjour, ${userName}`;

    const cards = [
        { label: 'Projets', value: stats.projets, icon: BookOpen, tone: 'from-teal-500 to-emerald-500' },
        { label: 'En cours', value: stats.en_cours, icon: Clock, tone: 'from-blue-500 to-indigo-500' },
        { label: 'Valides', value: stats.valides, icon: CheckCircle2, tone: 'from-emerald-500 to-lime-500' },
        { label: 'Soutenances', value: stats.soutenances, icon: CalendarRange, tone: 'from-amber-500 to-orange-500' },
    ];

    if (role === 'admin') {
        cards.push({ label: 'Utilisateurs', value: stats.utilisateurs, icon: Users, tone: 'from-violet-500 to-purple-500' });
    }

    cards.push({ label: 'Documents', value: stats.documents, icon: FileText, tone: 'from-sky-500 to-blue-500' });

    const progressPercent = stats.projets > 0 ? Math.round((stats.valides / stats.projets) * 100) : 0;

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Tableau de bord</h1>}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
                        <div className="space-y-4">
                            <span className="status-pill bg-white/10 text-white/90">
                                {roleGreeting[role] || 'EduManager'} - UNILUK
                            </span>
                            <div>
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{greeting}</h2>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200/85">
                                    {role === 'admin' && "Gerez les projets, assignez les encadreurs et validez les soutenances."}
                                    {role === 'enseignant' && "Suivez les projets que vous encadrez et echangez avec les etudiants."}
                                    {role === 'etudiant' && "Suivez l'avancement de vos projets et deposez vos livrables."}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href={route('projets.index')} className="soft-button bg-white text-slate-950 hover:bg-slate-100">
                                    Ouvrir les projets <ArrowUpRight size={16} />
                                </Link>
                                <Link href={route('documents.index')} className="soft-button border border-white/15 bg-white/10 text-white hover:bg-white/15">
                                    Documents <Files size={16} />
                                </Link>
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                                <div className="flex items-center justify-between text-sm text-slate-200">
                                    <span>Progression globale</span>
                                    <span>{progressPercent}%</span>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-white/10">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-slate-300">A corriger</p>
                                        <p className="mt-2 text-lg font-semibold">{stats.a_corriger} projet{stats.a_corriger !== 1 ? 's' : ''}</p>
                                    </div>
                                    <AlertTriangle className="text-amber-300" size={26} />
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

                {alertes && alertes.length > 0 && (
                    <section className="panel-card overflow-hidden border-l-4 border-l-amber-400">
                        <div className="border-b border-slate-200/80 p-5">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950">
                                <AlertTriangle size={18} className="text-amber-500" /> Alertes
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {role === 'admin' ? "Projets en attente d'assignation d'encadreur." : 'Projets necessitant votre attention.'}
                            </p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {alertes.map((projet) => (
                                <Link href={route('projets.show', projet.id)} key={projet.id} className="block p-5 transition hover:bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-slate-950">{projet.titre}</p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom} - {projet.type}
                                            </p>
                                        </div>
                                        <span className={`status-pill text-xs ${statusColors[projet.statut_actuel] || 'bg-slate-100 text-slate-600'}`}>
                                            {projet.statut_actuel}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    <section className="panel-card overflow-hidden">
                        <div className="border-b border-slate-200/80 p-5">
                            <h2 className="text-base font-semibold text-slate-950">Projets recents</h2>
                            <p className="mt-1 text-sm text-slate-500">Derniers projets suivis.</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {projets.map((projet) => (
                                <Link href={route('projets.show', projet.id)} key={projet.id} className="block p-5 transition hover:bg-slate-50">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-slate-950">{projet.titre}</p>
                                            <p className="mt-1 text-sm text-slate-500">{projet.type} - {projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom}</p>
                                        </div>
                                        <span className={`status-pill text-xs ${statusColors[projet.statut_actuel] || 'bg-slate-100 text-slate-600'}`}>
                                            {projet.statut_actuel}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            {projets.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Aucun projet a afficher.</div>}
                        </div>
                    </section>

                    <section className="panel-card overflow-hidden">
                        <div className="border-b border-slate-200/80 p-5">
                            <h2 className="text-base font-semibold text-slate-950">Activite recente</h2>
                            <p className="mt-1 text-sm text-slate-500">Dernieres transitions de statut.</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
                                            <TrendingUp size={14} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-slate-700">
                                                <span className="font-medium text-slate-950">{activity.user?.prenom} {activity.user?.nom}</span>
                                                {' '}a change le statut de{' '}
                                                <span className={`status-pill text-xs ${statusColors[activity.ancien_statut] || 'bg-slate-100 text-slate-600'}`}>
                                                    {activity.ancien_statut}
                                                </span>
                                                {' '}vers{' '}
                                                <span className={`status-pill text-xs ${statusColors[activity.nouveau_statut] || 'bg-slate-100 text-slate-600'}`}>
                                                    {activity.nouveau_statut}
                                                </span>
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {activity.projet?.titre} - {new Date(activity.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Aucune activite recente.</div>}
                        </div>
                    </section>
                </div>

                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <h2 className="text-base font-semibold text-slate-950">Derniers documents</h2>
                        <p className="mt-1 text-sm text-slate-500">Livrables recents deposes par les etudiants.</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {documentsRecents.map((document) => (
                            <div key={document.id} className="flex items-center gap-4 p-5">
                                <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                                    <FileText size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-slate-950">{document.titre_fichier}</p>
                                    <p className="text-sm text-slate-500">v{document.version} - {document.projet?.titre} - {document.auteur?.prenom} {document.auteur?.nom}</p>
                                </div>
                                <p className="hidden text-xs text-slate-400 sm:block">
                                    {new Date(document.date_depot).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                        ))}
                        {documentsRecents.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Aucun document recent.</div>}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}