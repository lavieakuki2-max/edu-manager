import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Users, Search, GraduationCap, BookOpen, CheckCircle, Clock,
} from 'lucide-react';

const statusColors = {
    valide: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    en_cours: 'bg-blue-50 text-blue-700 border border-blue-200',
    soumis: 'bg-amber-50 text-amber-700 border border-amber-200',
    a_corriger: 'bg-red-50 text-red-700 border border-red-200',
    brouillon: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const statusLabels = {
    valide: 'Validé',
    en_cours: 'En cours',
    soumis: 'Soumis',
    a_corriger: 'À corriger',
    brouillon: 'Brouillon',
};

export default function MesEtudiants({ etudiants = [], stats = {} }) {
    const [search, setSearch] = useState('');

    const filtered = etudiants.filter((e) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (e.user?.prenom || '').toLowerCase().includes(q) ||
            (e.user?.nom || '').toLowerCase().includes(q) ||
            (e.matricule || '').toLowerCase().includes(q) ||
            (e.classe || '').toLowerCase().includes(q) ||
            (e.filiere || '').toLowerCase().includes(q)
        );
    });

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Mes Étudiants</h1>}>
            <Head title="Mes Étudiants" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {etudiants.length} étudiant{etudiants.length !== 1 ? 's' : ''} suivi{etudiants.length !== 1 ? 's' : ''}
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Mes Étudiants</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Consultez les étudiants qui vous sont assignés et suivez l'avancement de leurs projets.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total', value: stats.total || etudiants.length, icon: Users, tone: 'from-slate-500 to-slate-600' },
                        { label: 'Projets', value: stats.projets || 0, icon: BookOpen, tone: 'from-blue-500 to-indigo-500' },
                        { label: 'Validés', value: stats.valides || 0, icon: CheckCircle, tone: 'from-emerald-500 to-green-500' },
                        { label: 'En cours', value: stats.en_cours || 0, icon: Clock, tone: 'from-amber-500 to-orange-500' },
                    ].map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="panel-card p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="panel-title">{card.label}</p>
                                        <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${card.tone}`}>
                                        <Icon size={22} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="soft-input pl-11"
                                placeholder="Rechercher par nom, matricule, classe ou filière..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((etudiant) => (
                            <div key={etudiant.id} className="panel-card overflow-hidden transition hover:shadow-lg">
                                <div className="p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-sm font-bold text-white">
                                            {etudiant.user?.prenom?.charAt(0)}{etudiant.user?.nom?.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-slate-950 truncate">{etudiant.user?.prenom} {etudiant.user?.nom}</p>
                                            <p className="text-sm text-slate-500 truncate">{etudiant.matricule}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                                        {etudiant.classe && (
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                                                <GraduationCap size={12} /> {etudiant.classe}
                                            </span>
                                        )}
                                        {etudiant.filiere && (
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                                                <BookOpen size={12} /> {etudiant.filiere}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <p className="text-xs font-semibold text-slate-700 mb-2">
                                            {etudiant.projets?.length || 0} projet{(etudiant.projets?.length || 0) !== 1 ? 's' : ''}
                                        </p>
                                        {etudiant.projets && etudiant.projets.length > 0 && (
                                            <div className="space-y-1.5">
                                                {etudiant.projets.map((projet) => (
                                                    <div key={projet.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                                                        <span className="text-xs text-slate-600 truncate mr-2">{projet.titre}</span>
                                                        <span className={`status-pill shrink-0 text-[10px] ${statusColors[projet.statut] || 'bg-slate-100 text-slate-600'}`}>
                                                            {statusLabels[projet.statut] || projet.statut}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="p-16 text-center">
                            <Users className="mx-auto text-slate-300" size={40} />
                            <p className="mt-4 text-sm font-medium text-slate-500">Aucun étudiant trouvé.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
