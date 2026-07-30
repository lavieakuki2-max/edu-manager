import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowUpRight, BookOpen, Briefcase, CheckCircle2, Clock, FileText, Plus, Send, X } from 'lucide-react';
import { useState } from 'react';

const statusColors = {
    'Sujet Soumis': 'bg-amber-50 text-amber-700',
    'En Cours': 'bg-blue-50 text-blue-700',
    'Prêt pour Soutenance': 'bg-purple-50 text-purple-700',
    'Validé': 'bg-emerald-50 text-emerald-700',
};

const workflowSteps = {
    Stage: ['Sujet Soumis', 'Validé Admin', 'En Cours', 'Rapport Déposé', 'Soutenance', 'Validé'],
    Memoire: ['Sujet Soumis', 'Encadreur Attribué', 'Plan Validé', 'Chapitres', 'Soutenance', 'Validé'],
};

function getWorkflowIndex(statut) {
    const map = {
        'Sujet Soumis': 0,
        'En Cours': 2,
        'Prêt pour Soutenance': 4,
        'Validé': 5,
    };
    return map[statut] ?? 0;
}

export default function Index({ projets, enseignants, entreprises, canCreate, canAdmin }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState('all');

    const createForm = useForm({
        titre: '',
        description: '',
        type: 'Memoire',
        annee_academique: '2025-2026',
        theme_recherche: '',
        mots_cles: '',
        entreprise_id: '',
        nouvelle_entreprise: '',
        nouvelle_entreprise_adresse: '',
        nouvelle_entreprise_secteur: '',
        nouvelle_entreprise_telephone: '',
        nouvelle_entreprise_email: '',
        nouvelle_entreprise_maitre_stage: '',
        nouvelle_entreprise_maitre_stage_telephone: '',
        nouvelle_entreprise_maitre_stage_email: '',
        date_debut: '',
        date_fin: '',
        objectifs_stage: '',
    });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('projets.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const filtered = projets.filter((p) => {
        if (filter === 'all') return true;
        if (filter === 'stage') return p.type === 'Stage';
        if (filter === 'memoire') return p.type === 'Memoire';
        return p.statut_actuel === filter;
    });

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Projets</h1>}>
            <Head title="Projets" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {projets.length} projet{projets.length !== 1 ? 's' : ''} au total
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Gestion des projets académiques</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Suivez l'avancement des stages et mémoires, déposez des documents et échangez avec votre encadreur.
                            </p>
                        </div>
                        {canCreate && (
                            <button onClick={() => setShowCreateModal(true)} className="soft-button bg-white text-slate-950 hover:bg-slate-100">
                                <Plus size={16} /> Nouveau projet
                            </button>
                        )}
                    </div>
                </section>

                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'all', label: 'Tous' },
                        { key: 'stage', label: 'Stages' },
                        { key: 'memoire', label: 'Mémoires' },
                        { key: 'Sujet Soumis', label: 'En attente' },
                        { key: 'En Cours', label: 'En cours' },
                        { key: 'Validé', label: 'Validés' },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                filter === f.key
                                    ? 'bg-slate-950 text-white shadow-lg'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filtered.map((projet) => {
                        const steps = workflowSteps[projet.type] || workflowSteps.Stage;
                        const activeIdx = getWorkflowIndex(projet.statut_actuel);
                        const TypeIcon = projet.type === 'Stage' ? Briefcase : BookOpen;

                        return (
                            <Link
                                href={route('projets.show', projet.id)}
                                key={projet.id}
                                className="panel-card block overflow-hidden transition hover:shadow-xl"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`rounded-2xl p-3 ${
                                                projet.type === 'Stage'
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-purple-50 text-purple-600'
                                            }`}>
                                                <TypeIcon size={22} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base font-semibold text-slate-950">{projet.titre}</h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {projet.type} — {projet.annee_academique}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom}
                                                    {projet.enseignant?.user && (
                                                        <span className="text-slate-400"> · Encadreur : {projet.enseignant.user.prenom} {projet.enseignant.user.nom}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`status-pill ${statusColors[projet.statut_actuel] || 'bg-slate-100 text-slate-600'}`}>
                                                {projet.statut_actuel}
                                            </span>
                                            <ArrowUpRight size={16} className="text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-1.5 sm:grid-cols-6">
                                        {steps.map((step, idx) => (
                                            <div
                                                key={step}
                                                className={`rounded-xl px-3 py-2 text-center text-xs font-semibold transition ${
                                                    idx <= activeIdx
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}
                                            >
                                                {step}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                                        {projet.documents?.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <FileText size={13} /> {projet.documents.length} document{projet.documents.length !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                        {projet.commentaires?.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Send size={13} /> {projet.commentaires.length} commentaire{projet.commentaires.length !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                        {projet.soutenance && (
                                            <span className="flex items-center gap-1">
                                                <Clock size={13} /> Soutenance planifiée
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="panel-card p-16 text-center">
                            <BookOpen className="mx-auto text-slate-300" size={40} />
                            <p className="mt-4 text-sm font-medium text-slate-500">Aucun projet trouvé.</p>
                        </div>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Nouveau projet</h2>
                            <button onClick={() => setShowCreateModal(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitCreate} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Titre</label>
                                <input className="soft-input" value={createForm.data.titre} onChange={(e) => createForm.setData('titre', e.target.value)} placeholder="Titre du projet" />
                                {createForm.errors.titre && <p className="mt-1 text-xs text-red-600">{createForm.errors.titre}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Description</label>
                                <textarea className="soft-input min-h-[80px]" value={createForm.data.description} onChange={(e) => createForm.setData('description', e.target.value)} placeholder="Description du projet" />
                                {createForm.errors.description && <p className="mt-1 text-xs text-red-600">{createForm.errors.description}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Type</label>
                                    <select className="soft-input" value={createForm.data.type} onChange={(e) => createForm.setData('type', e.target.value)}>
                                        <option value="Memoire">Mémoire</option>
                                        <option value="Stage">Stage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Année académique</label>
                                    <input className="soft-input" value={createForm.data.annee_academique} onChange={(e) => createForm.setData('annee_academique', e.target.value)} placeholder="2025-2026" />
                                </div>
                            </div>

                            {createForm.data.type === 'Memoire' && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Thème de recherche</label>
                                        <input className="soft-input" value={createForm.data.theme_recherche} onChange={(e) => createForm.setData('theme_recherche', e.target.value)} placeholder="Thème" />
                                        {createForm.errors.theme_recherche && <p className="mt-1 text-xs text-red-600">{createForm.errors.theme_recherche}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mots-clés</label>
                                        <input className="soft-input" value={createForm.data.mots_cles} onChange={(e) => createForm.setData('mots_cles', e.target.value)} placeholder="Laravel, Inertia..." />
                                    </div>
                                </div>
                            )}

                            {createForm.data.type === 'Stage' && (
                                <>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Entreprise</label>
                                        <select className="soft-input" value={createForm.data.entreprise_id} onChange={(e) => {
                                            createForm.setData('entreprise_id', e.target.value);
                                            if (e.target.value !== '__nouvelle__') {
                                                createForm.setData('nouvelle_entreprise', '');
                                            }
                                        }}>
                                            <option value="">Sélectionner une entreprise</option>
                                            {entreprises.map((ent) => (
                                                <option key={ent.id} value={ent.id}>{ent.raison_sociale}</option>
                                            ))}
                                            <option value="__nouvelle__">Autre / Saisir une nouvelle entreprise</option>
                                        </select>
                                        {createForm.errors.entreprise_id && <p className="mt-1 text-xs text-red-600">{createForm.errors.entreprise_id}</p>}
                                    </div>

                                    {createForm.data.entreprise_id === '__nouvelle__' && (
                                        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-4">
                                            <p className="text-sm font-semibold text-blue-700">Nouvelle entreprise</p>
                                            <div>
                                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Raison sociale *</label>
                                                <input className="soft-input" value={createForm.data.nouvelle_entreprise} onChange={(e) => createForm.setData('nouvelle_entreprise', e.target.value)} placeholder="Nom de l'entreprise" />
                                                {createForm.errors.nouvelle_entreprise && <p className="mt-1 text-xs text-red-600">{createForm.errors.nouvelle_entreprise}</p>}
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Adresse</label>
                                                    <input className="soft-input" value={createForm.data.nouvelle_entreprise_adresse} onChange={(e) => createForm.setData('nouvelle_entreprise_adresse', e.target.value)} placeholder="Adresse complète" />
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Secteur</label>
                                                    <input className="soft-input" value={createForm.data.nouvelle_entreprise_secteur} onChange={(e) => createForm.setData('nouvelle_entreprise_secteur', e.target.value)} placeholder="Secteur d'activité" />
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Téléphone</label>
                                                    <input className="soft-input" value={createForm.data.nouvelle_entreprise_telephone} onChange={(e) => createForm.setData('nouvelle_entreprise_telephone', e.target.value)} placeholder="+243..." />
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                                                    <input type="email" className="soft-input" value={createForm.data.nouvelle_entreprise_email} onChange={(e) => createForm.setData('nouvelle_entreprise_email', e.target.value)} placeholder="contact@entreprise.com" />
                                                </div>
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-3">
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Maître de stage</label>
                                                    <input className="soft-input" value={createForm.data.nouvelle_entreprise_maitre_stage} onChange={(e) => createForm.setData('nouvelle_entreprise_maitre_stage', e.target.value)} placeholder="Nom complet" />
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tél. maître de stage</label>
                                                    <input className="soft-input" value={createForm.data.nouvelle_entreprise_maitre_stage_telephone} onChange={(e) => createForm.setData('nouvelle_entreprise_maitre_stage_telephone', e.target.value)} placeholder="+243..." />
                                                </div>
                                                <div>
                                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email maître de stage</label>
                                                    <input type="email" className="soft-input" value={createForm.data.nouvelle_entreprise_maitre_stage_email} onChange={(e) => createForm.setData('nouvelle_entreprise_maitre_stage_email', e.target.value)} placeholder="maitre@entreprise.com" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date début</label>
                                            <input type="date" className="soft-input" value={createForm.data.date_debut} onChange={(e) => createForm.setData('date_debut', e.target.value)} />
                                            {createForm.errors.date_debut && <p className="mt-1 text-xs text-red-600">{createForm.errors.date_debut}</p>}
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date fin</label>
                                            <input type="date" className="soft-input" value={createForm.data.date_fin} onChange={(e) => createForm.setData('date_fin', e.target.value)} />
                                            {createForm.errors.date_fin && <p className="mt-1 text-xs text-red-600">{createForm.errors.date_fin}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Objectifs du stage</label>
                                        <textarea className="soft-input min-h-[60px]" value={createForm.data.objectifs_stage} onChange={(e) => createForm.setData('objectifs_stage', e.target.value)} placeholder="Objectifs" />
                                        {createForm.errors.objectifs_stage && <p className="mt-1 text-xs text-red-600">{createForm.errors.objectifs_stage}</p>}
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="soft-button soft-button-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={createForm.processing} className="soft-button soft-button-primary disabled:opacity-50">
                                    <Send size={16} /> Soumettre
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
