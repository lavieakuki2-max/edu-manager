import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    CalendarRange, Search, Eye, Edit, Trash2, Plus, X, Check, Clock, GraduationCap,
    BookOpen, MapPin, Award, Calendar,
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

export default function Soutenances({ soutenances = [], projetsPrets = [] }) {
    const [search, setSearch] = useState('');
    const [showPlanifier, setShowPlanifier] = useState(null);
    const [showEditNote, setShowEditNote] = useState(null);
    const [showView, setShowView] = useState(null);
    const [showDelete, setShowDelete] = useState(null);

    const planifierForm = useForm({
        projet_id: '',
        date_soutenance: '',
        salle: '',
    });

    const noteForm = useForm({
        note_finale: '',
    });

    const submitPlanifier = (e) => {
        e.preventDefault();
        planifierForm.post(route('admin.soutenances.store'), {
            onSuccess: () => {
                setShowPlanifier(null);
                planifierForm.reset();
            },
        });
    };

    const submitNote = (e) => {
        e.preventDefault();
        if (!showEditNote) return;
        noteForm.patch(route('admin.soutenances.update', showEditNote.id), {
            onSuccess: () => {
                setShowEditNote(null);
                noteForm.reset();
            },
        });
    };

    const handleDelete = (soutenance) => {
        router.delete(route('admin.soutenances.destroy', soutenance.id), {
            onSuccess: () => setShowDelete(null),
        });
    };

    const openPlanifier = (projet) => {
        planifierForm.setData({
            projet_id: projet.id,
            date_soutenance: '',
            salle: '',
        });
        setShowPlanifier(true);
    };

    const openEditNote = (soutenance) => {
        noteForm.setData({
            note_finale: soutenance.note_finale || '',
        });
        setShowEditNote(soutenance);
    };

    const filtered = soutenances.filter((s) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (s.projet?.titre || '').toLowerCase().includes(q) ||
            (s.projet?.etudiant?.user?.prenom || '').toLowerCase().includes(q) ||
            (s.projet?.etudiant?.user?.nom || '').toLowerCase().includes(q) ||
            (s.salle || '').toLowerCase().includes(q)
        );
    });

    const upcomingSoutenances = filtered.filter((s) => s.statut !== 'realisee');
    const pastSoutenances = filtered.filter((s) => s.statut === 'realisee');

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Soutenances</h1>}>
            <Head title="Soutenances" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {soutenances.length} soutenance{soutenances.length !== 1 ? 's' : ''} au total
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Soutenances</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Planifiez les soutenances, attribuez les salles et saisissez les notes finales.
                            </p>
                        </div>
                        {projetsPrets.length > 0 && (
                            <button onClick={() => setShowPlanifier(true)} className="soft-button bg-white text-slate-950 hover:bg-slate-100">
                                <Plus size={16} /> Planifier
                            </button>
                        )}
                    </div>
                </section>

                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="soft-input pl-11"
                                    placeholder="Rechercher par étudiant, projet ou salle..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {upcomingSoutenances.length > 0 && (
                        <div>
                            <div className="border-b border-slate-200/80 bg-blue-50/30 px-5 py-3">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Clock size={15} className="text-blue-500" />
                                    Soutenances à venir ({upcomingSoutenances.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                            <th className="px-5 py-3 font-semibold text-slate-600">Étudiant</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Projet</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Date</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Salle</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Note</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Statut</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {upcomingSoutenances.map((soutenance) => (
                                            <tr key={soutenance.id} className="transition hover:bg-slate-50">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600">
                                                            <GraduationCap size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-950">
                                                                {soutenance.projet?.etudiant?.user?.prenom} {soutenance.projet?.etudiant?.user?.nom}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                {soutenance.projet?.etudiant?.matricule}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen size={14} className="text-slate-400" />
                                                        <span className="text-slate-600">{soutenance.projet?.titre || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-400" />
                                                        <span className="text-slate-600">
                                                            {soutenance.date_soutenance
                                                                ? new Date(soutenance.date_soutenance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                                                                : '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        <span className="text-slate-600">{soutenance.salle || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    {soutenance.note_finale != null ? (
                                                        <span className="status-pill bg-teal-50 text-teal-700 border border-teal-200 text-xs">
                                                            <Award size={12} />
                                                            {soutenance.note_finale}/20
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Non noté</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`status-pill text-xs ${statusColors[soutenance.statut] || 'bg-slate-100 text-slate-600'}`}>
                                                        {statusLabels[soutenance.statut] || soutenance.statut}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setShowView(soutenance)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                            <Eye size={15} />
                                                        </button>
                                                        <button onClick={() => openEditNote(soutenance)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                            <Edit size={15} />
                                                        </button>
                                                        <button onClick={() => setShowDelete(soutenance)} className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {pastSoutenances.length > 0 && (
                        <div>
                            <div className="border-b border-slate-200/80 bg-emerald-50/30 px-5 py-3">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Check size={15} className="text-emerald-500" />
                                    Soutenances réalisées ({pastSoutenances.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                            <th className="px-5 py-3 font-semibold text-slate-600">Étudiant</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Projet</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Date</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Salle</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Note</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Statut</th>
                                            <th className="px-5 py-3 font-semibold text-slate-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pastSoutenances.map((soutenance) => (
                                            <tr key={soutenance.id} className="transition hover:bg-slate-50">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600">
                                                            <GraduationCap size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-950">
                                                                {soutenance.projet?.etudiant?.user?.prenom} {soutenance.projet?.etudiant?.user?.nom}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                {soutenance.projet?.etudiant?.matricule}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen size={14} className="text-slate-400" />
                                                        <span className="text-slate-600">{soutenance.projet?.titre || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-slate-400" />
                                                        <span className="text-slate-600">
                                                            {soutenance.date_soutenance
                                                                ? new Date(soutenance.date_soutenance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                                                                : '-'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        <span className="text-slate-600">{soutenance.salle || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    {soutenance.note_finale != null ? (
                                                        <span className="status-pill bg-teal-50 text-teal-700 border border-teal-200 text-xs">
                                                            <Award size={12} />
                                                            {soutenance.note_finale}/20
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Non noté</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`status-pill text-xs ${statusColors[soutenance.statut] || 'bg-slate-100 text-slate-600'}`}>
                                                        {statusLabels[soutenance.statut] || soutenance.statut}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setShowView(soutenance)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                            <Eye size={15} />
                                                        </button>
                                                        <button onClick={() => openEditNote(soutenance)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                            <Edit size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {upcomingSoutenances.length === 0 && pastSoutenances.length === 0 && (
                        <div className="p-16 text-center">
                            <CalendarRange className="mx-auto text-slate-300" size={40} />
                            <p className="mt-4 text-sm font-medium text-slate-500">Aucune soutenance trouvée.</p>
                        </div>
                    )}
                </div>

                {projetsPrets.length > 0 && (
                    <section className="panel-card overflow-hidden">
                        <div className="border-b border-slate-200/80 p-5">
                            <h2 className="text-base font-semibold text-slate-950">Projets prêts pour soutenance</h2>
                            <p className="mt-1 text-sm text-slate-500">Projets dont le statut permet de planifier une soutenance.</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {projetsPrets.map((projet) => (
                                <div key={projet.id} className="flex items-center justify-between p-5 transition hover:bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-950">{projet.titre}</p>
                                            <p className="text-sm text-slate-500">
                                                {projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom}
                                                {projet.enseignant?.user && (
                                                    <span className="text-slate-400"> · Encadreur : {projet.enseignant.user.prenom} {projet.enseignant.user.nom}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => openPlanifier(projet)} className="soft-button soft-button-primary text-xs">
                                        <CalendarRange size={14} /> Planifier
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {showPlanifier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowPlanifier(null)} />
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Planifier une soutenance</h2>
                            <button onClick={() => setShowPlanifier(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitPlanifier} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Projet</label>
                                <select className="soft-input" value={planifierForm.data.projet_id} onChange={(e) => planifierForm.setData('projet_id', e.target.value)}>
                                    <option value="">Sélectionner un projet</option>
                                    {projetsPrets.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.titre} — {p.etudiant?.user?.prenom} {p.etudiant?.user?.nom}
                                        </option>
                                    ))}
                                </select>
                                {planifierForm.errors.projet_id && <p className="mt-1 text-xs text-red-600">{planifierForm.errors.projet_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date de soutenance</label>
                                <input type="datetime-local" className="soft-input" value={planifierForm.data.date_soutenance} onChange={(e) => planifierForm.setData('date_soutenance', e.target.value)} />
                                {planifierForm.errors.date_soutenance && <p className="mt-1 text-xs text-red-600">{planifierForm.errors.date_soutenance}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Salle</label>
                                <input className="soft-input" value={planifierForm.data.salle} onChange={(e) => planifierForm.setData('salle', e.target.value)} placeholder="Amphi A, Salle 201..." />
                                {planifierForm.errors.salle && <p className="mt-1 text-xs text-red-600">{planifierForm.errors.salle}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowPlanifier(null)} className="soft-button soft-button-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={planifierForm.processing} className="soft-button soft-button-primary disabled:opacity-50">
                                    <CalendarRange size={16} /> Planifier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowEditNote(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Saisir la note</h2>
                            <button onClick={() => setShowEditNote(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-950">
                                    {showEditNote.projet?.etudiant?.user?.prenom} {showEditNote.projet?.etudiant?.user?.nom}
                                </span>
                                {' '} — {showEditNote.projet?.titre}
                            </p>
                        </div>

                        <form onSubmit={submitNote} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Note finale (/20)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    className="soft-input"
                                    value={noteForm.data.note_finale}
                                    onChange={(e) => noteForm.setData('note_finale', e.target.value)}
                                    placeholder="15"
                                />
                                {noteForm.errors.note_finale && <p className="mt-1 text-xs text-red-600">{noteForm.errors.note_finale}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowEditNote(null)} className="soft-button soft-button-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={noteForm.processing} className="soft-button soft-button-primary disabled:opacity-50">
                                    <Check size={16} /> Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowView(null)} />
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Détails de la soutenance</h2>
                            <button onClick={() => setShowView(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <GraduationCap size={16} className="text-slate-400" />
                                    <span className="text-slate-600">
                                        <span className="font-medium text-slate-950">
                                            {showView.projet?.etudiant?.user?.prenom} {showView.projet?.etudiant?.user?.nom}
                                        </span>
                                        {showView.projet?.etudiant?.matricule && (
                                            <span className="text-slate-400"> ({showView.projet.etudiant.matricule})</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <BookOpen size={16} className="text-slate-400" />
                                    <span className="text-slate-600">{showView.projet?.titre || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span className="text-slate-600">
                                        {showView.date_soutenance
                                            ? new Date(showView.date_soutenance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                            : 'Non planifiée'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="text-slate-600">{showView.salle || 'Non assignée'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Award size={16} className={showView.note_finale != null ? 'text-teal-500' : 'text-slate-400'} />
                                    <span className="text-slate-600">
                                        Note : {showView.note_finale != null ? `${showView.note_finale}/20` : 'Non noté'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Check size={16} className="text-slate-400" />
                                    <span className={`status-pill text-xs ${statusColors[showView.statut] || 'bg-slate-100 text-slate-600'}`}>
                                        {statusLabels[showView.statut] || showView.statut}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowView(null)} className="soft-button soft-button-secondary">
                                    Fermer
                                </button>
                                <button onClick={() => { setShowView(null); openEditNote(showView); }} className="soft-button soft-button-primary">
                                    <Edit size={16} /> Modifier la note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowDelete(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Supprimer la soutenance</h2>
                            <button onClick={() => setShowDelete(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600">
                            Êtes-vous sûr de vouloir supprimer la soutenance de{' '}
                            <span className="font-semibold text-slate-950">
                                {showDelete.projet?.etudiant?.user?.prenom} {showDelete.projet?.etudiant?.user?.nom}
                            </span>{' '}
                            pour le projet <span className="font-semibold text-slate-950">{showDelete.projet?.titre}</span> ?
                            Cette action est irréversible.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowDelete(null)} className="soft-button soft-button-secondary">
                                Annuler
                            </button>
                            <button onClick={() => handleDelete(showDelete)} className="soft-button bg-red-600 text-white hover:bg-red-700 shadow-sm">
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
