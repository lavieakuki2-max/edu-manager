import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowUpRight, Award, BookOpen, Briefcase, CalendarRange, CheckCircle2, ChevronDown, ChevronUp,
    Clock, Download, ExternalLink, Eye, FileCheck, FileText, Filter, GraduationCap, Plus,
    RefreshCw, Search, Send, Shield, SlidersHorizontal, UserCheck, UserPlus, Users, X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const statusColors = {
    'Sujet Soumis': 'bg-amber-50 text-amber-700 border border-amber-200',
    'En Cours': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Prêt pour Soutenance': 'bg-purple-50 text-purple-700 border border-purple-200',
    'Validé': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'À Corriger': 'bg-red-50 text-red-700 border border-red-200',
};

const typeIcons = {
    Stage: Briefcase,
    Memoire: BookOpen,
    Projet_Tutore: Shield,
};

const typeColors = {
    Stage: 'bg-blue-50 text-blue-600',
    Memoire: 'bg-purple-50 text-purple-600',
    Projet_Tutore: 'bg-amber-50 text-amber-600',
};

const typeLabels = {
    Stage: 'Stage',
    Memoire: 'Mémoire',
    Projet_Tutore: 'Projet Tutoré',
};

const statutLabels = {
    'all': 'Tous les statuts',
    'en_attente_attribution': 'En attente d\'attribution',
    'Sujet Soumis': 'Sujet Soumis (assigné)',
    'En Cours': 'En cours',
    'À Corriger': 'À corriger',
    'Prêt pour Soutenance': 'Prêt pour soutenance',
    'Validé': 'Validé',
};

export default function AdminProjets({ projets, stats, enseignants, filieres, annees, filters }) {
    const [activeFilters, setActiveFilters] = useState(filters || { type: 'all', statut: 'all', filiere: 'all', annee: 'all', search: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [assignModal, setAssignModal] = useState(null);
    const [sortField, setSortField] = useState('updated_at');
    const [sortDir, setSortDir] = useState('desc');

    const assignForm = useForm({ enseignant_id: '' });
    const [expandedRows, setExpandedRows] = useState({});

    const applyFilters = () => {
        const params = new URLSearchParams();
        Object.entries(activeFilters).forEach(([k, v]) => { if (v && v !== 'all') params.set(k, v); });
        router.get(route('admin.projets.index') + '?' + params.toString(), {}, { preserveState: true, replace: true });
    };

    useEffect(() => { applyFilters(); }, [activeFilters.type, activeFilters.statut, activeFilters.filiere, activeFilters.annee]);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const openAssign = (projet) => { assignForm.setData('enseignant_id', projet.enseignant_id || ''); setAssignModal(projet); };
    const submitAssign = () => {
        assignForm.patch(route('admin.projets.assigner', assignModal.id), {
            onSuccess: () => { setAssignModal(null); assignForm.reset(); },
        });
    };

    const sorted = [...projets].sort((a, b) => {
        let va = a[sortField]; let vb = b[sortField];
        if (sortField === 'updated_at') { va = new Date(a.updated_at); vb = new Date(b.updated_at); }
        if (sortField === 'etudiant') { va = a.etudiant?.user?.nom; vb = b.etudiant?.user?.nom; }
        if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        return sortDir === 'asc' ? va - vb : vb - va;
    });

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDir === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />;
    };

    const kpiCards = [
        { label: 'Total projets', value: stats.total, sub: `${stats.stages} Stages / ${stats.memoires} Mémoires / ${stats.projets_tutores} Projets Tutorés`, icon: Briefcase, tone: 'from-slate-500 to-slate-600' },
        { label: 'En attente', value: stats.en_attente, sub: `Sujets sans encadreur`, icon: Clock, tone: 'from-amber-500 to-orange-600', urgent: stats.en_attente > 0 },
        { label: 'En cours', value: stats.en_cours, sub: `${stats.a_corriger} à corriger`, icon: BookOpen, tone: 'from-blue-500 to-indigo-600' },
        { label: 'Prêts / Validés', value: `${stats.prets} / ${stats.valides}`, sub: `Taux: ${stats.taux_reussite}%`, icon: Award, tone: 'from-emerald-500 to-emerald-600' },
    ];

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Gestion des Projets</h1>}>
            <Head title="Admin - Projets" />
            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">{stats.total} projet{stats.total !== 1 ? 's' : ''} — Bureau des stages</span>
                            <h2 className="text-2xl font-semibold tracking-tight">Gestion des Projets Académiques</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Validez les sujets, assignez les encadreurs et suivez l'avancement des stages, mémoires et projets tutorés.
                            </p>
                        </div>
                        <Link href={route('admin.rapports')} className="soft-button border border-white/15 bg-white/10 text-white hover:bg-white/15">
                            <FileText size={16} /> Rapports & Statistiques
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className={`panel-card p-5 ${card.urgent ? 'border-l-4 border-l-amber-400' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="panel-title">{card.label}</p>
                                        <p className={`mt-3 text-3xl font-semibold ${card.urgent ? 'text-amber-600' : 'text-slate-950'}`}>{card.value}</p>
                                        <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${card.tone}`}><Icon size={22} /></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-base font-semibold text-slate-950">Projets</h3>
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{sorted.length} résultat{sorted.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <form onSubmit={handleSearch} className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        className="soft-input pl-9 text-xs w-48"
                                        placeholder="Rechercher (nom, matricule, titre)..."
                                        value={activeFilters.search}
                                        onChange={(e) => setActiveFilters({ ...activeFilters, search: e.target.value })}
                                    />
                                </form>
                                <button onClick={() => setShowFilters(!showFilters)} className={`soft-button text-xs ${showFilters ? 'soft-button-primary' : 'soft-button-secondary'}`}>
                                    <SlidersHorizontal size={14} /> Filtres {Object.values(activeFilters).filter(v => v && v !== 'all' && v !== '').length > 1 ? `(${Object.values(activeFilters).filter(v => v && v !== 'all' && v !== '').length - 1})` : ''}
                                </button>
                                <button onClick={() => { setActiveFilters({ type: 'all', statut: 'all', filiere: 'all', annee: 'all', search: '' }); router.get(route('admin.projets.index'), {}, { preserveState: true, replace: true }); }} className="soft-button soft-button-secondary text-xs">
                                    <RefreshCw size={14} /> Réinitialiser
                                </button>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="mt-4 grid gap-3 sm:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600">Type</label>
                                    <select className="soft-input text-xs" value={activeFilters.type} onChange={(e) => setActiveFilters({ ...activeFilters, type: e.target.value })}>
                                        <option value="all">Tous les types</option>
                                        <option value="Stage">Stage</option>
                                        <option value="Memoire">Mémoire</option>
                                        <option value="Projet_Tutore">Projet Tutoré</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600">Statut</label>
                                    <select className="soft-input text-xs" value={activeFilters.statut} onChange={(e) => setActiveFilters({ ...activeFilters, statut: e.target.value })}>
                                        {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600">Filière</label>
                                    <select className="soft-input text-xs" value={activeFilters.filiere} onChange={(e) => setActiveFilters({ ...activeFilters, filiere: e.target.value })}>
                                        <option value="all">Toutes les filières</option>
                                        {filieres.map((f) => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-600">Année académique</label>
                                    <select className="soft-input text-xs" value={activeFilters.annee} onChange={(e) => setActiveFilters({ ...activeFilters, annee: e.target.value })}>
                                        <option value="all">Toutes les années</option>
                                        {annees.map((a) => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                    <th className="px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-950" onClick={() => toggleSort('etudiant')}>
                                        Étudiant <SortIcon field="etudiant" />
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-950" onClick={() => toggleSort('titre')}>
                                        Projet <SortIcon field="titre" />
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-950" onClick={() => toggleSort('enseignant')}>
                                        Encadreur (charge) <SortIcon field="enseignant" />
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-950" onClick={() => toggleSort('statut_actuel')}>
                                        Statut <SortIcon field="statut_actuel" />
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-slate-950" onClick={() => toggleSort('updated_at')}>
                                        Mis à jour <SortIcon field="updated_at" />
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sorted.map((projet) => {
                                    const TypeIcon = typeIcons[projet.type] || Briefcase;
                                    const isUnassigned = projet.statut_actuel === 'Sujet Soumis' && !projet.enseignant_id;
                                    const expanded = expandedRows[projet.id];
                                    return (
                                        <>
                                            <tr key={projet.id} className={`transition hover:bg-slate-50 ${isUnassigned ? 'bg-amber-50/50' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                                                            {projet.etudiant?.user?.prenom?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-950 text-xs">{projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom}</p>
                                                            <p className="text-[10px] text-slate-400">{projet.etudiant?.matricule} · {projet.etudiant?.filiere}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 max-w-[200px]">
                                                    <p className="font-medium text-slate-950 text-xs truncate">{projet.titre}</p>
                                                    <p className="text-[10px] text-slate-400">{projet.annee_academique}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold ${typeColors[projet.type] || 'bg-slate-100 text-slate-600'}`}>
                                                        <TypeIcon size={11} /> {typeLabels[projet.type] || projet.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {projet.enseignant?.user ? (
                                                        <div>
                                                            <p className="text-xs font-medium text-slate-950">{projet.enseignant.user.prenom} {projet.enseignant.user.nom}</p>
                                                            {projet.enseignant.grade && <p className="text-[10px] text-slate-400">{projet.enseignant.grade}</p>}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-amber-600 font-medium">Non assigné</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`status-pill text-[10px] ${statusColors[projet.statut_actuel] || 'bg-slate-100 text-slate-600'}`}>
                                                        {projet.statut_actuel}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-[10px] text-slate-400">
                                                    {new Date(projet.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={route('projets.show', projet.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Voir">
                                                            <Eye size={15} />
                                                        </Link>
                                                        <button onClick={() => openAssign(projet)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600" title={projet.enseignant_id ? 'Réaffecter' : 'Assigner'}>
                                                            {projet.enseignant_id ? <UserCheck size={15} /> : <UserPlus size={15} />}
                                                        </button>
                                                        {projet.statut_actuel === 'Prêt pour Soutenance' && (
                                                            <Link href={route('admin.soutenances.index')} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-purple-600" title="Planifier soutenance">
                                                                <CalendarRange size={15} />
                                                            </Link>
                                                        )}
                                                        {projet.type === 'Stage' && projet.enseignant_id && (
                                                            <a href={route('admin.pdf.lettre-stage', projet.id)} target="_blank" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600" title="Lettre de stage">
                                                                <FileText size={15} />
                                                            </a>
                                                        )}
                                                        <button onClick={() => setExpandedRows({ ...expandedRows, [projet.id]: !expanded })} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                                            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expanded && (
                                                <tr key={`${projet.id}-exp`} className="bg-slate-50/70">
                                                    <td colSpan={7} className="px-6 py-4">
                                                        <div className="grid gap-4 sm:grid-cols-3">
                                                            <div>
                                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Documents</p>
                                                                <p className="text-sm font-medium text-slate-950">{projet.documents?.length || 0} fichier{(projet.documents?.length || 0) !== 1 ? 's' : ''}</p>
                                                                {projet.documents?.length > 0 && (
                                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                                        {projet.documents.slice(0, 3).map((doc) => (
                                                                            <a key={doc.id} href={route('documents.download', doc.id)} className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] text-slate-600 shadow-sm hover:text-blue-600">
                                                                                <Download size={10} /> v{doc.version}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Commentaires</p>
                                                                <p className="text-sm font-medium text-slate-950">{projet.commentaires?.length || 0} message{(projet.commentaires?.length || 0) !== 1 ? 's' : ''}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Statut détaillé</p>
                                                                <p className="text-xs text-slate-700">{'Sujet Soumis' === projet.statut_actuel && !projet.enseignant_id ? 'En attente d\'assignation d\'encadreur' : projet.statut_actuel}</p>
                                                                {projet.soutenance && (
                                                                    <p className="mt-1 text-[10px] text-slate-500">
                                                                        Soutenance: {new Date(projet.soutenance.date_soutenance).toLocaleDateString('fr-FR')} {projet.soutenance.salle && `- ${projet.soutenance.salle}`}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 flex gap-2">
                                                            <Link href={route('projets.show', projet.id)} className="soft-button soft-button-primary text-[10px]">
                                                                <Eye size={13} /> Ouvrir la fiche détaillée
                                                            </Link>
                                                            {projet.statut_actuel === 'Prêt pour Soutenance' && (
                                                                <Link href={route('admin.soutenances.index')} className="soft-button soft-button-secondary text-[10px]">
                                                                    <CalendarRange size={13} /> Planifier soutenance
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                                {sorted.length === 0 && (
                                    <tr><td colSpan={7} className="px-4 py-16 text-center"><Briefcase className="mx-auto text-slate-300" size={40} /><p className="mt-4 text-sm font-medium text-slate-500">Aucun projet trouvé.</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {assignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => { setAssignModal(null); assignForm.reset(); }} />
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-950">{assignModal.enseignant_id ? 'Réaffecter' : 'Assigner'} un encadreur</h2>
                                <p className="mt-1 text-sm text-slate-500">Projet: {assignModal.titre}</p>
                            </div>
                            <button onClick={() => { setAssignModal(null); assignForm.reset(); }} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); submitAssign(); }} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Enseignant / Encadreur</label>
                                <select className="soft-input" value={assignForm.data.enseignant_id} onChange={(e) => assignForm.setData('enseignant_id', e.target.value)} required>
                                    <option value="">Sélectionner un encadreur...</option>
                                    {enseignants.map((ens) => (
                                        <option key={ens.id} value={ens.id}>
                                            {ens.nom_complet} {ens.grade ? `(${ens.grade})` : ''} — {ens.charge_actuelle} projet{ens.charge_actuelle !== 1 ? 's' : ''} en cours
                                        </option>
                                    ))}
                                </select>
                                {assignForm.errors.enseignant_id && <p className="mt-1 text-xs text-red-600">{assignForm.errors.enseignant_id}</p>}
                            </div>

                            {enseignants.length > 0 && (
                                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Charge actuelle des encadreurs</p>
                                    {enseignants.map((ens) => (
                                        <div key={ens.id} className="flex items-center justify-between py-1 text-xs">
                                            <span className="text-slate-700">{ens.nom_complet}</span>
                                            <span className={`font-semibold ${ens.charge_actuelle >= 5 ? 'text-red-600' : ens.charge_actuelle >= 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {ens.charge_actuelle} projet{ens.charge_actuelle !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {assignModal.enseignant_id && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                                    <p className="text-xs text-amber-800">
                                        <strong>Réaffectation :</strong> L'encadreur actuel ({assignModal.enseignant?.user?.prenom} {assignModal.enseignant?.user?.nom}) sera remplacé. Une notification sera envoyée.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => { setAssignModal(null); assignForm.reset(); }} className="soft-button soft-button-secondary">Annuler</button>
                                <button type="submit" disabled={assignForm.processing || !assignForm.data.enseignant_id} className="soft-button soft-button-primary disabled:opacity-50">
                                    <UserCheck size={16} /> {assignModal.enseignant_id ? 'Réaffecter' : 'Assigner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
