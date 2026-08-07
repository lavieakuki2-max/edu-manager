import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TableScroll from '@/Components/TableScroll';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    CalendarRange, Search, GraduationCap, BookOpen, MapPin, Award, Calendar, Clock, Check, User, Users,
} from 'lucide-react';

const statusColors = {
    planifiee: 'bg-blue-50 text-blue-700 border border-blue-200',
    realisee: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    annulee: 'bg-red-50 text-red-700 border border-red-200',
};

const statusLabels = {
    planifiee: 'Planifiée',
    realisee: 'Réalisée',
    annulee: 'Annulée',
};

const mentionColors = {
    'Très Bien': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    'Bien': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Assez Bien': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Passable': 'bg-orange-50 text-orange-700 border border-orange-200',
    'Insuffisant': 'bg-red-50 text-red-700 border border-red-200',
};

export default function Soutenances({ soutenances = [], monRole, enseignantId }) {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [showEvaluation, setShowEvaluation] = useState(null);

    const evalForm = useForm({
        note_finale: '',
        remarques: '',
    });

    const submitEvaluation = (e) => {
        e.preventDefault();
        if (!showEvaluation) return;
        evalForm.post(route('enseignant.soutenances.evaluation', showEvaluation.id), {
            onSuccess: () => {
                setShowEvaluation(null);
                evalForm.reset();
            },
        });
    };

    const getMonRole = (s) => {
        const eId = Number(enseignantId);
        if (s.projet?.enseignant_id === eId) return 'encadreur';
        if (s.president_id === eId) return 'president';
        if (s.rapporteur_id === eId) return 'rapporteur';
        if (s.membre_id === eId) return 'membre';
        return null;
    };

    const roleLabels = {
        encadreur: 'Encadreur',
        president: 'Président du jury',
        rapporteur: 'Rapporteur',
        membre: 'Membre du jury',
    };

    const roleColors = {
        encadreur: 'bg-purple-50 text-purple-700 border border-purple-200',
        president: 'bg-amber-50 text-amber-700 border border-amber-200',
        rapporteur: 'bg-blue-50 text-blue-700 border border-blue-200',
        membre: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    };

    const filtered = soutenances.filter((s) => {
        if (filter === 'encadreur' && getMonRole(s) !== 'encadreur') return false;
        if (filter === 'jury' && !['president', 'rapporteur', 'membre'].includes(getMonRole(s))) return false;
        if (filter === 'upcoming' && s.statut === 'realisee') return false;
        if (filter === 'past' && s.statut !== 'realisee') return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                (s.projet?.titre || '').toLowerCase().includes(q) ||
                (s.projet?.etudiant?.user?.prenom || '').toLowerCase().includes(q) ||
                (s.projet?.etudiant?.user?.nom || '').toLowerCase().includes(q) ||
                (s.salle || '').toLowerCase().includes(q)
            );
        }
        return true;
    });

    const encadreurCount = soutenances.filter((s) => getMonRole(s) === 'encadreur').length;
    const juryCount = soutenances.filter((s) => ['president', 'rapporteur', 'membre'].includes(getMonRole(s))).length;
    const upcomingCount = soutenances.filter((s) => s.statut !== 'realisee').length;
    const pastCount = soutenances.filter((s) => s.statut === 'realisee').length;

    const filters = [
        { key: 'all', label: 'Toutes', count: soutenances.length },
        { key: 'encadreur', label: 'Encadrement', count: encadreurCount },
        { key: 'jury', label: 'Membre jury', count: juryCount },
        { key: 'upcoming', label: 'À venir', count: upcomingCount },
        { key: 'past', label: 'Passées', count: pastCount },
    ];

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Mes Soutenances</h1>}>
            <Head title="Soutenances" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {soutenances.length} soutenance{soutenances.length !== 1 ? 's' : ''} au total
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Mes Soutenances</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Consultez les soutenances liées à vos projets et votre participation aux jurys.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-2xl bg-white/10 p-4">
                            <p className="text-2xl font-bold">{encadreurCount}</p>
                            <p className="text-xs text-white/70">Encadrement</p>
                        </div>
                        <div className="rounded-2xl bg-amber-500/20 p-4">
                            <p className="text-2xl font-bold">{juryCount}</p>
                            <p className="text-xs text-white/70">Membre jury</p>
                        </div>
                        <div className="rounded-2xl bg-blue-500/20 p-4">
                            <p className="text-2xl font-bold">{upcomingCount}</p>
                            <p className="text-xs text-white/70">À venir</p>
                        </div>
                        <div className="rounded-2xl bg-emerald-500/20 p-4">
                            <p className="text-2xl font-bold">{pastCount}</p>
                            <p className="text-xs text-white/70">Réalisées</p>
                        </div>
                    </div>
                </section>

                <div className="flex flex-wrap gap-2">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                filter === f.key
                                    ? 'bg-slate-950 text-white shadow-lg'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {f.label} ({f.count})
                        </button>
                    ))}
                </div>

                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="soft-input pl-11"
                                placeholder="Rechercher par étudiant, projet ou salle..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <TableScroll>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                    <th className="px-5 py-3 font-semibold text-slate-600">Mon rôle</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Étudiant</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Projet</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Date / Heure</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Salle</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Jury</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Note</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((soutenance) => {
                                    const monRole = getMonRole(soutenance);
                                    return (
                                        <tr key={soutenance.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-3">
                                                {monRole && (
                                                    <span className={`status-pill text-xs ${roleColors[monRole] || 'bg-slate-100 text-slate-600'}`}>
                                                        {roleLabels[monRole] || monRole}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600">
                                                        <GraduationCap size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-950">
                                                            {soutenance.projet?.etudiant?.user?.prenom} {soutenance.projet?.etudiant?.user?.nom}
                                                        </p>
                                                        <p className="text-xs text-slate-400">{soutenance.projet?.etudiant?.matricule}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen size={14} className="text-slate-400 shrink-0" />
                                                    <span className="text-slate-600 line-clamp-2">{soutenance.projet?.titre || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-400 shrink-0" />
                                                        <span className="text-slate-600">
                                                            {soutenance.date_soutenance
                                                                ? new Date(soutenance.date_soutenance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                                                                : '-'}
                                                        </span>
                                                    </div>
                                                    {soutenance.heure_debut && (
                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <Clock size={12} className="shrink-0" />
                                                            <span>{soutenance.heure_debut.substring(0, 5)}{soutenance.heure_fin ? ` - ${soutenance.heure_fin.substring(0, 5)}` : ''}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-slate-400 shrink-0" />
                                                    <span className="text-slate-600">{soutenance.salle || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="space-y-1">
                                                    {soutenance.president?.user && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <span className="text-slate-400">[P]</span>
                                                            <span className="text-slate-600">{soutenance.president.user.prenom} {soutenance.president.user.nom}</span>
                                                        </div>
                                                    )}
                                                    {soutenance.rapporteur?.user && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <span className="text-slate-400">[R]</span>
                                                            <span className="text-slate-600">{soutenance.rapporteur.user.prenom} {soutenance.rapporteur.user.nom}</span>
                                                        </div>
                                                    )}
                                                    {soutenance.membre?.user && (
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <span className="text-slate-400">[M]</span>
                                                            <span className="text-slate-600">{soutenance.membre.user.prenom} {soutenance.membre.user.nom}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                {soutenance.note_finale != null ? (
                                                    <div className="flex flex-col gap-0.5">
                                                            <span className="status-pill bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                                                                <Award size={12} />
                                                                {soutenance.note_finale}/20
                                                            </span>
                                                        {soutenance.mention && (
                                                            <span className={`status-pill text-xs ${mentionColors[soutenance.mention] || 'bg-slate-100 text-slate-600'}`}>
                                                                {soutenance.mention}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    {soutenance.statut !== 'realisee' && ['president', 'rapporteur', 'membre'].includes(monRole) && (
                                                        <button onClick={() => setShowEvaluation(soutenance)} className="soft-button text-xs py-1.5 px-3">
                                                            <Award size={13} /> Évaluer
                                                        </button>
                                                    )}
                                                    {soutenance.remarques && (
                                                        <span className="text-xs text-slate-400 italic max-w-[120px] truncate" title={soutenance.remarques}>
                                                            "{soutenance.remarques}"
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </TableScroll>

                    {filtered.length === 0 && (
                        <div className="p-16 text-center">
                            <CalendarRange className="mx-auto text-slate-300" size={40} />
                            <p className="mt-4 text-sm font-medium text-slate-500">Aucune soutenance trouvée.</p>
                        </div>
                    )}
                </div>
            </div>

            {showEvaluation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowEvaluation(null)} />
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Évaluation de soutenance</h2>
                            <button onClick={() => setShowEvaluation(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-950">
                                    {showEvaluation.projet?.etudiant?.user?.prenom} {showEvaluation.projet?.etudiant?.user?.nom}
                                </span>
                            </p>
                            <p className="text-sm text-slate-500">{showEvaluation.projet?.titre}</p>
                            <p className="text-xs text-slate-400">
                                {showEvaluation.date_soutenance && new Date(showEvaluation.date_soutenance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                {showEvaluation.heure_debut && ` à ${showEvaluation.heure_debut.substring(0, 5)}`}
                            </p>
                        </div>

                        <form onSubmit={submitEvaluation} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Note (/20)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    className="soft-input"
                                    value={evalForm.data.note_finale}
                                    onChange={(e) => evalForm.setData('note_finale', e.target.value)}
                                    placeholder="15"
                                />
                                {evalForm.errors.note_finale && <p className="mt-1 text-xs text-red-600">{evalForm.errors.note_finale}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Remarques</label>
                                <textarea
                                    className="soft-input"
                                    rows={4}
                                    value={evalForm.data.remarques}
                                    onChange={(e) => evalForm.setData('remarques', e.target.value)}
                                    placeholder="Vos observations sur la soutenance..."
                                />
                                {evalForm.errors.remarques && <p className="mt-1 text-xs text-red-600">{evalForm.errors.remarques}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowEvaluation(null)} className="soft-button soft-button-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={evalForm.processing} className="soft-button soft-button-primary disabled:opacity-50">
                                    <Check size={16} /> Enregistrer l'évaluation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
