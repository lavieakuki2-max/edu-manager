import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserAvatar from '@/Components/UserAvatar';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, BookOpen, Briefcase, CheckCircle2, Clock, Download, Eye, FileText, History, Send, Shield, UploadCloud,
} from 'lucide-react';
import { useState } from 'react';
import ChapitreCard from './Partials/ChapitreCard';
import DiscussionFil from './Partials/DiscussionFil';

const statusColors = {
    'Sujet Soumis': 'bg-amber-50 text-amber-700 border border-amber-200',
    'En Cours': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Prêt pour Soutenance': 'bg-purple-50 text-purple-700 border border-purple-200',
    'Validé': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'À Corriger': 'bg-red-50 text-red-700 border border-red-200',
};

const statusDescriptions = {
    'Sujet Soumis': 'Le sujet a été soumis et attend une assignation.',
    'En Cours': 'Le projet est en cours de réalisation.',
    'Prêt pour Soutenance': 'Le projet est prêt pour la soutenance.',
    'Validé': 'Le projet a été validé avec succès.',
    'À Corriger': 'Des corrections sont demandées.',
};

const transitionLabels = {
    'En Cours': 'Passer en cours',
    'Prêt pour Soutenance': 'Marquer prêt pour soutenance',
    'Validé': 'Valider le projet',
    'À Corriger': 'Demander des corrections',
    'Sujet Soumis': 'Revenir à "Sujet Soumis"',
};

const workflowSteps = {
    Stage: ['Sujet Soumis', 'En Cours', 'Prêt pour Soutenance', 'Validé'],
    Memoire: ['Sujet Soumis', 'En Cours', 'Prêt pour Soutenance', 'Validé'],
    Projet_Tutore: ['Sujet Soumis', 'En Cours', 'Prêt pour Soutenance', 'Validé'],
};

function getWorkflowIndex(statut) {
    const map = { 'Sujet Soumis': 0, 'En Cours': 1, 'Prêt pour Soutenance': 2, 'Validé': 3, 'À Corriger': -1 };
    return map[statut] ?? 0;
}

const typeIcons = {
    Stage: Briefcase,
    Memoire: BookOpen,
    Projet_Tutore: Shield,
};

const typeLabels = {
    Stage: 'Stage',
    Memoire: 'Mémoire',
    Projet_Tutore: 'Projet Tutoré',
};

const typeColors = {
    Stage: 'bg-blue-400/20 text-blue-300',
    Memoire: 'bg-purple-400/20 text-purple-300',
    Projet_Tutore: 'bg-amber-400/20 text-amber-300',
};

const typeBg = {
    Stage: 'bg-blue-50 text-blue-600',
    Memoire: 'bg-purple-50 text-purple-600',
    Projet_Tutore: 'bg-amber-50 text-amber-600',
};

export default function Show({ projet, canAdmin, canComment = false, canUpload = false, isSupervision = false, canManageChapitres = false, availableTransitions = [], workflowStatuses = [] }) {
    const [activeTab, setActiveTab] = useState('info');
    const [showUpload, setShowUpload] = useState(false);
    const [showTransition, setShowTransition] = useState(false);

    const commentForm = useForm({ contenu: '' });
    const uploadForm = useForm({ fichier: null, chapitre_id: '' });
    const chapitreForm = useForm({ titre: '' });
    const statutForm = useForm({ statut_actuel: '', commentaire: '' });

    const submitComment = (e) => {
        e.preventDefault();
        commentForm.post(route('projets.commentaires.store', projet.id), {
            onSuccess: () => commentForm.reset('contenu'),
        });
    };

    const submitUpload = (e) => {
        e.preventDefault();
        uploadForm.post(route('documents.store', projet.id), {
            forceFormData: true,
            onSuccess: () => {
                uploadForm.reset('fichier');
                setShowUpload(false);
            },
        });
    };

    const submitStatut = (targetStatus) => {
        statutForm.setData('statut_actuel', targetStatus);
        statutForm.patch(route('projets.statut', projet.id), {
            onSuccess: () => {
                setShowTransition(false);
                statutForm.reset();
            },
        });
    };

    const submitChapitre = (e) => {
        e.preventDefault();
        chapitreForm.post(route('projets.chapitres.store', projet.id), {
            onSuccess: () => chapitreForm.reset('titre'),
        });
    };

    const steps = workflowSteps[projet.type] || workflowSteps.Stage;
    const activeIdx = getWorkflowIndex(projet.statut_actuel);
    const TypeIcon = typeIcons[projet.type] || Briefcase;
    const typeColor = typeColors[projet.type] || typeColors.Stage;

    const chapitreMap = Object.fromEntries((projet.chapitres || []).map((c) => [c.id, c]));
    const projectComments = (projet.commentaires || []).filter((c) => !c.document_id);

    const tabs = [
        { key: 'info', label: 'Informations' },
        { key: 'documents', label: `Documents (${projet.documents?.length || 0})` },
        ...(projet.type === 'Memoire' ? [{ key: 'chapitres', label: `Chapitres (${projet.chapitres?.length || 0})` }] : []),
        { key: 'commentaires', label: `Discussion (${projectComments.length})` },
        { key: 'historique', label: `Historique (${projet.historique?.length || 0})` },
    ];

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">{projet.titre}</h1>}>
            <Head title={projet.titre} />

            <div className="space-y-6">
                <Link href={route('projets.index')} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950">
                    <ArrowLeft size={16} /> Retour aux projets
                </Link>

                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`rounded-2xl p-3 ${typeColor}`}>
                                <TypeIcon size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="status-pill bg-white/10 text-white/80 mb-2">{typeLabels[projet.type] || projet.type} — {projet.annee_academique}</span>
                                    {isSupervision && (
                                        <span className="status-pill bg-amber-400/20 text-amber-300 mb-2">
                                            <Eye size={12} className="mr-1 inline" /> Mode supervision
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-semibold tracking-tight">{projet.titre}</h2>
                                <p className="mt-1 text-sm text-slate-200/80">
                                    Étudiant : {projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom}
                                    {projet.etudiant?.matricule && <span className="text-slate-400"> ({projet.etudiant.matricule})</span>}
                                </p>
                                {projet.enseignant?.user && (
                                    <p className="text-sm text-slate-200/80">
                                        Encadreur : {projet.enseignant.user.prenom} {projet.enseignant.user.nom}
                                        {projet.enseignant.grade && <span className="text-slate-400"> — {projet.enseignant.grade}</span>}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`status-pill ${statusColors[projet.statut_actuel] || 'bg-slate-100 text-slate-600'}`}>
                                {projet.statut_actuel}
                            </span>
                            {availableTransitions.length > 0 && (
                                <button
                                    onClick={() => setShowTransition(!showTransition)}
                                    className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition"
                                >
                                    Changer le statut
                                </button>
                            )}
                        </div>
                    </div>

                    {showTransition && (
                        <div className="mt-4 rounded-2xl bg-white/10 p-4">
                            <p className="text-sm font-medium text-white/80 mb-3">Sélectionner le nouveau statut :</p>
                            <div className="flex flex-wrap gap-2">
                                {availableTransitions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => submitStatut(s)}
                                        disabled={statutForm.processing}
                                        className="rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition disabled:opacity-50"
                                    >
                                        {transitionLabels[s] || s}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3">
                                <input
                                    type="text"
                                    className="w-full rounded-xl bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                    placeholder="Commentaire optionnel sur la transition..."
                                    value={statutForm.data.commentaire}
                                    onChange={(e) => statutForm.setData('commentaire', e.target.value)}
                                />
                            </div>
                            {statutForm.errors.statut_actuel && (
                                <p className="mt-2 text-sm text-red-300">{statutForm.errors.statut_actuel}</p>
                            )}
                        </div>
                    )}

                    <div className="mt-6 grid gap-1.5 sm:grid-cols-4">
                        {steps.map((step, idx) => (
                            <div key={step} className={`rounded-xl px-3 py-2.5 text-center text-xs font-semibold transition ${
                                idx <= activeIdx ? 'bg-blue-400/20 text-blue-300' : 'bg-white/5 text-white/30'
                            }`}>
                                {idx <= activeIdx && <CheckCircle2 size={12} className="mx-auto mb-1" />}
                                {step}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex gap-2 overflow-x-auto border-b border-slate-200 scrollbar-none">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`whitespace-nowrap px-4 py-3 text-sm font-semibold transition border-b-2 ${
                                activeTab === tab.key
                                    ? 'border-slate-950 text-slate-950'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'info' && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="panel-card p-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h3>
                            <p className="mt-3 text-sm leading-relaxed text-slate-700">{projet.description}</p>
                        </div>

                        <div className="space-y-6">
                            {projet.type === 'Stage' && projet.stage && (
                                <div className="panel-card p-6">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Entreprise d'accueil</h3>
                                    <dl className="mt-3 space-y-2 text-sm">
                                        <div className="flex justify-between"><dt className="text-slate-500">Raison sociale</dt><dd className="font-medium text-slate-900">{projet.stage.entreprise?.raison_sociale || '—'}</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Secteur</dt><dd className="font-medium text-slate-900">{projet.stage.entreprise?.secteur || '—'}</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Adresse</dt><dd className="font-medium text-slate-900">{projet.stage.entreprise?.adresse || '—'}</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Téléphone</dt><dd className="font-medium text-slate-900">{projet.stage.entreprise?.telephone || '—'}</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{projet.stage.entreprise?.email || '—'}</dd></div>
                                        <div className="border-t border-slate-200 my-2" />
                                        <div className="flex justify-between"><dt className="text-slate-500 font-semibold">Maître de stage</dt><dd className="font-medium text-slate-900">{projet.stage.entreprise?.maitre_stage || '—'}</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Tél. maître de stage</dt><dd className="font-medium text-slate-900">{projet.stage.entreprise?.maitre_stage_telephone || '—'}</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Email maître de stage</dt><dd className="font-medium text-slate-900">{projet.stage.entreprise?.maitre_stage_email || '—'}</dd></div>
                                        <div className="border-t border-slate-200 my-2" />
                                        <div className="flex justify-between"><dt className="text-slate-500">Période</dt><dd className="font-medium text-slate-900">{projet.stage.date_debut} → {projet.stage.date_fin}</dd></div>
                                    </dl>
                                </div>
                            )}

                            {projet.type === 'Memoire' && projet.memoire && (
                                <div className="panel-card p-6">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Détails du mémoire</h3>
                                    <dl className="mt-3 space-y-2 text-sm">
                                        <div className="flex justify-between"><dt className="text-slate-500">Thème</dt><dd className="font-medium text-slate-900">{projet.memoire.theme_recherche}</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Mots-clés</dt><dd className="font-medium text-slate-900">{projet.memoire.mots_cles || '—'}</dd></div>
                                    </dl>
                                </div>
                            )}

                            {projet.type === 'Projet_Tutore' && (
                                <div className="panel-card p-6">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Détails du projet tutoré</h3>
                                    <dl className="mt-3 space-y-2 text-sm">
                                        <div className="flex justify-between"><dt className="text-slate-500">Type</dt><dd className="font-medium text-slate-900">Projet Tutoré</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Année</dt><dd className="font-medium text-slate-900">{projet.annee_academique}</dd></div>
                                    </dl>
                                </div>
                            )}

                            {projet.soutenance && (
                                <div className="panel-card p-6">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Soutenance</h3>
                                    <dl className="mt-3 space-y-2 text-sm">
                                        <div className="flex justify-between"><dt className="text-slate-500">Date</dt><dd className="font-medium text-slate-900">{projet.soutenance.date_soutenance}</dd></div>
                                        <div className="flex justify-between"><dt className="text-slate-500">Salle</dt><dd className="font-medium text-slate-900">{projet.soutenance.salle}</dd></div>
                                        {projet.soutenance.note_finale && (
                                            <div className="flex justify-between"><dt className="text-slate-500">Note finale</dt><dd className="font-bold text-slate-950">{projet.soutenance.note_finale}/20</dd></div>
                                        )}
                                    </dl>
                                </div>
                            )}
                        </div>

                        {canAdmin && (
                            <div className="panel-card p-6 lg:col-span-2">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Actions administrateur</h3>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {projet.type === 'Stage' && (
                                        <a href={route('admin.pdf.lettre-stage', projet.id)} className="soft-button soft-button-secondary text-xs">
                                            <FileText size={14} /> Lettre de stage
                                        </a>
                                    )}
                                    <a href={route('admin.pdf.fiche-cotation', projet.id)} className="soft-button soft-button-secondary text-xs">
                                        <FileText size={14} /> Fiche de cotation
                                    </a>
                                    <a href={route('admin.pdf.rapport-global')} className="soft-button soft-button-secondary text-xs">
                                        <FileText size={14} /> Rapport global
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-4">
                        {canUpload && !isSupervision && (
                            <div className="panel-card border-dashed border-blue-200 p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-950">Dépôt de document</h3>
                                        <p className="mt-1 text-sm text-slate-500">PDF uniquement · Max 10 Mo · Incrémentation automatique de la version.</p>
                                    </div>
                                    <button onClick={() => setShowUpload(!showUpload)} className="soft-button soft-button-primary text-xs">
                                        <UploadCloud size={16} /> Déposer
                                    </button>
                                </div>
                                {showUpload && (
                                    <form onSubmit={submitUpload} className="flex flex-wrap items-end gap-4">
                                        <label className="flex-1 cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-center text-sm text-slate-600 hover:bg-slate-100">
                                            <UploadCloud size={18} className="mx-auto mb-1" />
                                            {uploadForm.data.fichier ? uploadForm.data.fichier.name : 'Sélectionner un PDF'}
                                            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => uploadForm.setData('fichier', e.target.files[0])} />
                                        </label>
                                        {projet.type === 'Memoire' && (
                                            <select
                                                className="soft-input text-sm"
                                                value={uploadForm.data.chapitre_id}
                                                onChange={(e) => uploadForm.setData('chapitre_id', e.target.value)}
                                            >
                                                <option value="">Document général</option>
                                                {(projet.chapitres || []).map((ch) => (
                                                    <option key={ch.id} value={ch.id}>{ch.numero}. {ch.titre}</option>
                                                ))}
                                            </select>
                                        )}
                                        <button type="submit" disabled={uploadForm.processing || !uploadForm.data.fichier} className="soft-button soft-button-primary disabled:opacity-50 text-xs">
                                            Envoyer
                                        </button>
                                    </form>
                                )}
                                {uploadForm.errors.fichier && <p className="mt-2 text-sm text-red-600">{uploadForm.errors.fichier}</p>}
                            </div>
                        )}

                        {isSupervision && (
                            <div className="panel-card border-l-4 border-l-amber-400 p-5">
                                <div className="flex items-center gap-3">
                                    <Eye size={18} className="text-amber-500" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-950">Mode supervision</p>
                                        <p className="text-xs text-slate-500">Vous visualisez les documents en tant qu'administrateur. Le dépôt est réservé à l'étudiant et à l'encadreur.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="panel-card overflow-hidden">
                            <div className="divide-y divide-slate-100">
                                {projet.documents?.map((doc) => {
                                    const chapitre = chapitreMap[doc.chapitre_id];
                                    return (
                                        <div key={doc.id} className="p-5">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-2xl bg-red-50 p-3 text-red-600"><FileText size={18} /></div>
                                                    <div>
                                                        <p className="font-medium text-slate-950">{doc.titre_fichier}</p>
                                                        <p className="text-sm text-slate-500">
                                                            v{doc.version} · {doc.auteur?.prenom} {doc.auteur?.nom} · {new Date(doc.date_depot).toLocaleDateString('fr-FR')}
                                                            {chapitre && <span className="text-slate-400"> · Chapitre {chapitre.numero} — {chapitre.titre}</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <a href={route('documents.download', doc.id)} className="soft-button soft-button-secondary w-fit text-xs">
                                                    <Download size={14} /> Télécharger
                                                </a>
                                            </div>
                                            <DiscussionFil document={doc} projetId={projet.id} commentaires={projet.commentaires} canComment={canComment} isSupervision={isSupervision} />
                                        </div>
                                    );
                                })}
                                {(!projet.documents || projet.documents.length === 0) && (
                                    <div className="p-10 text-center text-sm text-slate-500">Aucun document déposé.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'chapitres' && (
                    <div className="space-y-4">
                        {canManageChapitres && (
                            <div className="panel-card p-6">
                                <h3 className="text-base font-semibold text-slate-950">Ajouter un chapitre</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Le plan validé se traduit en chapitres que l'encadreur valide un à un (Validation par chapitre).
                                </p>
                                <form onSubmit={submitChapitre} className="mt-3 flex flex-wrap items-end gap-3">
                                    <input
                                        type="text"
                                        className="soft-input min-w-[260px] flex-1 text-sm"
                                        placeholder="Ex : Chapitre 4 — Expérimentation"
                                        value={chapitreForm.data.titre}
                                        onChange={(e) => chapitreForm.setData('titre', e.target.value)}
                                    />
                                    <button type="submit" disabled={chapitreForm.processing || !chapitreForm.data.titre.trim()} className="soft-button soft-button-primary disabled:opacity-50 text-xs">
                                        Ajouter
                                    </button>
                                </form>
                                {chapitreForm.errors.titre && <p className="mt-2 text-sm text-red-600">{chapitreForm.errors.titre}</p>}
                            </div>
                        )}

                        {projet.chapitres?.map((chapitre) => (
                            <ChapitreCard
                                key={chapitre.id}
                                chapitre={chapitre}
                                projet={projet}
                                canManage={canManageChapitres}
                                canComment={canComment}
                                isSupervision={isSupervision}
                            />
                        ))}
                        {(!projet.chapitres || projet.chapitres.length === 0) && (
                            <div className="panel-card p-10 text-center text-sm text-slate-500">Aucun chapitre défini pour ce mémoire.</div>
                        )}
                    </div>
                )}

                {activeTab === 'commentaires' && (
                    <div className="space-y-4">
                        {isSupervision && (
                            <div className="panel-card border-l-4 border-l-amber-400 p-5">
                                <div className="flex items-center gap-3">
                                    <Eye size={18} className="text-amber-500" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-950">Mode supervision</p>
                                        <p className="text-xs text-slate-500">Vous visualisez les échanges en tant qu'administrateur. Seuls l'étudiant et l'encadreur peuvent poster des commentaires.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="panel-card overflow-hidden">
                            <div className="divide-y divide-slate-100">
                                {projectComments.map((c) => (
                                    <div key={c.id} className="p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                                                {c.auteur?.prenom?.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-sm font-semibold text-slate-950">
                                                        {c.auteur?.prenom} {c.auteur?.nom}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-700">{c.contenu}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {projectComments.length === 0 && (
                                    <div className="p-10 text-center text-sm text-slate-500">Aucun commentaire.</div>
                                )}
                            </div>
                        </div>

                        {canComment && !isSupervision && (
                            <form onSubmit={submitComment} className="panel-card p-4">
                                <div className="flex gap-3">
                                    <textarea
                                        className="soft-input min-h-[60px] flex-1"
                                        placeholder="Écrire un commentaire..."
                                        value={commentForm.data.contenu}
                                        onChange={(e) => commentForm.setData('contenu', e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={commentForm.processing || !commentForm.data.contenu.trim()}
                                        className="soft-button soft-button-primary self-end disabled:opacity-50"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                                {commentForm.errors.contenu && <p className="mt-2 text-sm text-red-600">{commentForm.errors.contenu}</p>}
                            </form>
                        )}
                    </div>
                )}

                {activeTab === 'historique' && (
                    <div className="panel-card overflow-hidden">
                        {projet.historique?.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {projet.historique.map((h) => (
                                    <div key={h.id} className="flex items-start gap-4 p-5">
                                        <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
                                            <History size={16} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`status-pill text-xs ${statusColors[h.ancien_statut] || 'bg-slate-100 text-slate-600'}`}>
                                                    {h.ancien_statut}
                                                </span>
                                                <span className="text-slate-400">→</span>
                                                <span className={`status-pill text-xs ${statusColors[h.nouveau_statut] || 'bg-slate-100 text-slate-600'}`}>
                                                    {h.nouveau_statut}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Par {h.user?.prenom} {h.user?.nom}
                                                {h.commentaire && <span className="text-slate-400"> — "{h.commentaire}"</span>}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(h.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 text-center text-sm text-slate-500">Aucun historique de transition.</div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
