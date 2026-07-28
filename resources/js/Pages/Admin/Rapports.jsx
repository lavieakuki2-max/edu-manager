import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    BarChart3, BookOpen, GraduationCap, CheckCircle, Clock, Send, CalendarRange,
    AlertCircle, FileText, Download, Printer, Search, Briefcase, Users, Building2,
    FileCheck, ScrollText, UserCheck, PieChart, Building, ExternalLink,
} from 'lucide-react';

const statusColors = {
    'Validé': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'En Cours': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Sujet Soumis': 'bg-amber-50 text-amber-700 border border-amber-200',
    'À Corriger': 'bg-red-50 text-red-700 border border-red-200',
    'Prêt pour Soutenance': 'bg-purple-50 text-purple-700 border border-purple-200',
};

const rapportsList = [
    {
        id: 'statistique',
        titre: 'Rapport Statistique Global',
        description: 'Bilan complet de l\'annee avec taux d\'avancement et repartition par filiere.',
        icon: PieChart,
        url: route('admin.pdf.statistique'),
        tone: 'from-teal-500 to-emerald-600',
    },
    {
        id: 'etudiants',
        titre: 'Liste des Etudiants et Sujets Valides',
        description: 'Tableau recapitulatif (Nom, Matricule, Sujet, Encadreur).',
        icon: UserCheck,
        url: route('admin.pdf.etudiants-valides'),
        tone: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'lettres',
        titre: 'Lettres de Recommandation de Stage',
        description: 'Generation automatique des lettres pre-remplies pour les etudiants retenus.',
        icon: ScrollText,
        url: route('admin.pdf.lettres-recommandation'),
        tone: 'from-amber-500 to-orange-600',
    },
    {
        id: 'cotation',
        titre: 'Grilles et Fiches d\'Evaluation',
        description: 'Fiches de cotation vierges ou remplies pour le jury de soutenance.',
        icon: FileCheck,
        url: null,
        tone: 'from-purple-500 to-violet-600',
    },
    {
        id: 'repartition',
        titre: 'Repartition des Projets par Enseignant',
        description: 'Charge de travail et liste des etudiants sous chaque encadreur.',
        icon: Users,
        url: route('admin.pdf.repartition-enseignants'),
        tone: 'from-cyan-500 to-blue-600',
    },
    {
        id: 'entreprises',
        titre: 'Annuaire des Entreprises Partenaires',
        description: 'Liste des entreprises d\'accueil avec le nombre de stagiaires recus.',
        icon: Building2,
        url: route('admin.pdf.annuaire-entreprises'),
        tone: 'from-rose-500 to-pink-600',
    },
];

export default function Rapports({ projets = [], documents = [], stats = {} }) {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatut, setFilterStatut] = useState('all');
    const [annee, setAnnee] = useState('2025-2026');

    const filtered = projets.filter((p) => {
        if (filterType !== 'all' && p.type !== filterType) return false;
        if (filterStatut !== 'all' && p.statut_actuel !== filterStatut) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                (p.titre || '').toLowerCase().includes(q) ||
                (p.etudiant?.user?.prenom || '').toLowerCase().includes(q) ||
                (p.etudiant?.user?.nom || '').toLowerCase().includes(q) ||
                (p.etudiant?.matricule || '').toLowerCase().includes(q)
            );
        }
        return true;
    });

    const kpiCards = [
        { label: 'Total projets', sub: `${stats.stages || 0} stages / ${stats.memoires || 0} memoires`, value: stats.total_projets || projets.length, icon: BookOpen, tone: 'from-slate-500 to-slate-600' },
        { label: 'Taux de reussite', sub: `${stats.valides || 0} valides`, value: `${stats.taux_reussite || 0}%`, icon: CheckCircle, tone: 'from-emerald-500 to-green-500' },
        { label: 'Soutenances', sub: `${stats.soutenances_planifiees || 0} planifiees / ${stats.soutenances_effectuees || 0} effectuees`, value: (stats.soutenances_planifiees || 0), icon: CalendarRange, tone: 'from-teal-500 to-emerald-500' },
        { label: 'Etudiants / Enseignant', sub: `Moyenne par encadreur`, value: stats.moyenne_etudiants_par_enseignant || 0, icon: Users, tone: 'from-blue-500 to-cyan-500' },
    ];

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Rapports & Statistiques</h1>}>
            <Head title="Rapports" />
            <div className="space-y-6">

                {/* HEADER */}
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">{projets.length} projet{projets.length !== 1 ? 's' : ''}</span>
                            <h2 className="text-2xl font-semibold tracking-tight">Rapports & Statistiques</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">Consultez les statistiques, generez et imprimez les rapports officiels.</p>
                        </div>
                    </div>
                </section>

                {/* KPI CARDS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="panel-card p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="panel-title">{card.label}</p>
                                        <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
                                        <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${card.tone}`}><Icon size={22} /></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* PROGRESS BAR */}
                <div className="panel-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-700">Taux de reussite global</h3>
                        <span className="text-sm font-bold text-teal-600">{stats.taux_reussite || 0}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-500" style={{ width: `${stats.taux_reussite || 0}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{stats.valides || 0} valide(s) sur {projets.length} projet(s)</p>
                </div>

                {/* PDF EXPORT SECTION */}
                <section className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-slate-950">Generation de rapports PDF</h2>
                                <p className="mt-1 text-sm text-slate-500">Selectionnez l'annee academique puis telechargez le rapport souhaite.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-slate-600">Annee :</label>
                                <select className="soft-input w-40" value={annee} onChange={(e) => setAnnee(e.target.value)}>
                                    <option value="2024-2025">2024-2025</option>
                                    <option value="2025-2026">2025-2026</option>
                                    <option value="2026-2027">2026-2027</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                        {rapportsList.map((r) => {
                            const Icon = r.icon;
                            return (
                                <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className={`rounded-xl bg-gradient-to-br p-2.5 text-white shadow ${r.tone}`}><Icon size={20} /></div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-semibold text-slate-900">{r.titre}</h3>
                                            <p className="mt-1 text-xs text-slate-500">{r.description}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        {r.url ? (
                                            <>
                                                <a href={`${r.url}?annee=${annee}`} target="_blank" rel="noopener noreferrer" className="soft-button soft-button-secondary flex-1 justify-center text-xs">
                                                    <ExternalLink size={13} /> Apercu
                                                </a>
                                                <a href={`${r.url}?annee=${annee}`} download className="soft-button soft-button-primary flex-1 justify-center text-xs">
                                                    <Download size={13} /> Telecharger
                                                </a>
                                            </>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Selectionnez un projet dans le tableau ci-dessous</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* PROJECTS TABLE */}
                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-base font-semibold text-slate-950">Liste des projets</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input className="soft-input pl-9 text-xs" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                                <select className="soft-input text-xs" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    <option value="all">Tous types</option>
                                    <option value="Stage">Stage</option>
                                    <option value="Memoire">Memoire</option>
                                </select>
                                <select className="soft-input text-xs" value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
                                    <option value="all">Tous statuts</option>
                                    <option value="Sujet Soumis">Sujet Soumis</option>
                                    <option value="En Cours">En Cours</option>
                                    <option value="À Corriger">A Corriger</option>
                                    <option value="Prêt pour Soutenance">Pret soutenance</option>
                                    <option value="Validé">Valide</option>
                                </select>
                                <button onClick={() => window.print()} className="soft-button soft-button-secondary text-xs"><Printer size={13} /> Imprimer</button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                    <th className="px-5 py-3 font-semibold text-slate-600">Etudiant</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Titre</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Type</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Encadreur</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Statut</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Fiches</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="transition hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <div>
                                                <p className="font-medium text-slate-950">{p.etudiant?.user?.prenom} {p.etudiant?.user?.nom}</p>
                                                <p className="text-xs text-slate-400">{p.etudiant?.matricule}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{p.titre || '-'}</td>
                                        <td className="px-5 py-3"><span className="status-pill bg-slate-100 text-slate-600 text-xs">{p.type}</span></td>
                                        <td className="px-5 py-3 text-slate-600 text-xs">{p.enseignant?.user?.prenom} {p.enseignant?.user?.nom}</td>
                                        <td className="px-5 py-3">
                                            <span className={`status-pill text-xs ${statusColors[p.statut_actuel] || 'bg-slate-100 text-slate-600'}`}>{p.statut_actuel}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {p.type === 'Stage' && (
                                                <a href={route('admin.pdf.lettre-stage', p.id)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-teal-600 hover:bg-teal-50">
                                                    <FileText size={12} /> Lettre
                                                </a>
                                            )}
                                            {p.statut_actuel === 'Validé' || p.soutenance ? (
                                                <a href={route('admin.pdf.fiche-cotation', p.id)} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-purple-600 hover:bg-purple-50">
                                                    <FileCheck size={12} /> Fiche
                                                </a>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="px-5 py-16 text-center"><BarChart3 className="mx-auto text-slate-300" size={40} /><p className="mt-4 text-sm font-medium text-slate-500">Aucun projet trouve.</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
