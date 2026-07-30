import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Briefcase, Building2, Calendar, Clock, Search, Users, FileText,
    ChevronRight, Filter, AlertCircle, CheckCircle2, Hourglass,
    Eye, GraduationCap, MapPin,
} from 'lucide-react';
import { useState } from 'react';

function statutLabel(statut) {
    const map = {
        en_attente: 'En attente',
        en_cours: 'En stage (Actif)',
        termine: 'Stage achevé',
        non_approuve: 'Non approuvé',
        approuve_attente: 'Approuvé (En attente)',
    };
    return map[statut] || statut;
}

function statutColor(statut) {
    const map = {
        en_attente: 'bg-amber-50 text-amber-700 border border-amber-200',
        en_cours: 'bg-blue-50 text-blue-700 border border-blue-200',
        termine: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        non_approuve: 'bg-red-50 text-red-700 border border-red-200',
        approuve_attente: 'bg-amber-50 text-amber-700 border border-amber-200',
    };
    return map[statut] || 'bg-slate-100 text-slate-600';
}

export default function Stages({ stages = [], stats = {}, filieres = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statutFilter, setStatutFilter] = useState(filters.statut || '');
    const [filiereFilter, setFiliereFilter] = useState(filters.filiere || '');

    const applyFilters = () => {
        router.get(route('admin.stages.index'), {
            ...(search && { search }),
            ...(statutFilter && { statut: statutFilter }),
            ...(filiereFilter && { filiere: filiereFilter }),
        }, { preserveState: true });
    };

    const kpiCards = [
        { label: 'Total stages', value: stats.total || 0, icon: Briefcase, color: 'from-slate-500 to-slate-600' },
        { label: 'En attente', value: stats.en_attente || 0, icon: Hourglass, color: 'from-amber-500 to-orange-600' },
        { label: 'En cours', value: stats.en_cours || 0, icon: Clock, color: 'from-blue-500 to-indigo-600' },
        { label: 'Terminés', value: stats.termine || 0, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
    ];

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Suivi des Stages</h1>}>
            <Head title="Admin - Stages" />
            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">Bureau des stages</span>
                            <h2 className="text-2xl font-semibold tracking-tight">Suivi des Stages</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Vue d'ensemble des stages, filtrage par statut et consultation détaillée par étudiant.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiCards.map((kpi) => (
                        <div key={kpi.label} className={`panel-card relative overflow-hidden`}>
                            <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${kpi.color} opacity-10`} />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{kpi.label}</p>
                                    <p className="mt-1 text-2xl font-bold text-slate-950">{kpi.value}</p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${kpi.color} text-white shadow-lg`}>
                                    <kpi.icon size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="panel-card p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1 max-w-xs">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    placeholder="Rechercher un étudiant..."
                                    className="soft-input w-full pl-9"
                                />
                            </div>
                            <select
                                value={statutFilter}
                                onChange={(e) => { setStatutFilter(e.target.value); setTimeout(applyFilters, 0); }}
                                className="soft-input text-sm"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="en_attente">En attente</option>
                                <option value="en_cours">En cours</option>
                                <option value="termine">Terminé</option>
                            </select>
                            <select
                                value={filiereFilter}
                                onChange={(e) => { setFiliereFilter(e.target.value); setTimeout(applyFilters, 0); }}
                                className="soft-input text-sm"
                            >
                                <option value="">Toutes filières</option>
                                {filieres.map((f) => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {stages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                            <Users size={40} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-sm text-slate-500">Aucun stage trouvé.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="px-4 py-3 font-semibold text-slate-600">Étudiant</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Entreprise</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Période</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Progression</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Statut</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stages.map((stage) => (
                                        <tr key={stage.id} className="transition hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                        <Users size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-950">
                                                            {stage.projet?.etudiant?.user?.prenom} {stage.projet?.etudiant?.user?.nom}
                                                        </p>
                                                        <p className="text-xs text-slate-400">{stage.projet?.etudiant?.matricule}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={14} className="text-slate-400 shrink-0" />
                                                    <span className="text-slate-600">{stage.entreprise?.raison_sociale || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-slate-600">
                                                    <p>{new Date(stage.date_debut).toLocaleDateString('fr-FR')}</p>
                                                    <p className="text-xs text-slate-400">→ {new Date(stage.date_fin).toLocaleDateString('fr-FR')}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                                                            style={{ width: `${Math.min(100, stage.progression)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-600">{stage.progression}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`status-pill text-xs ${statutColor(stage.statut_courant)}`}>
                                                    {statutLabel(stage.statut_courant)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route('admin.stages.show', stage.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <Eye size={14} /> Détail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
