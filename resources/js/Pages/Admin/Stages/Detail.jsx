import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft, Building2, Calendar, Clock, User, Users, FileText, Download,
    Briefcase, BookOpen, GraduationCap, Award, MapPin, Mail, Phone,
    CheckCircle2,
} from 'lucide-react';

function statutLabel(statut) {
    const map = { en_attente: 'En attente', en_cours: 'En cours', termine: 'Terminé' };
    return map[statut] || statut;
}

function statutColor(statut) {
    const map = {
        en_attente: 'bg-amber-50 text-amber-700 border border-amber-200',
        en_cours: 'bg-blue-50 text-blue-700 border border-blue-200',
        termine: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    };
    return map[statut] || 'bg-slate-100 text-slate-600';
}

export default function StageDetail({ stage }) {
    const projet = stage.projet;
    const etudiant = projet?.etudiant;
    const entreprise = stage.entreprise;

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Détail du stage</h1>}>
            <Head title="Détail Stage" />

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link href={route('admin.stages.index')} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                        <ArrowLeft size={16} /> Retour
                    </Link>
                    <span className={`status-pill text-xs ${statutColor(stage.statut_calcule)}`}>
                        {statutLabel(stage.statut_calcule)}
                    </span>
                </div>

                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {etudiant?.user?.prenom} {etudiant?.user?.nom}
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Stage — {entreprise?.raison_sociale || 'Entreprise inconnue'}
                            </h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                {projet?.titre || 'Projet sans titre'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                            >
                                <Download size={15} /> Exporter
                            </button>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="panel-card p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <Clock size={16} className="text-slate-400" /> Progression du stage
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-3 mb-5">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                                    <p className="text-2xl font-bold text-blue-600">{stage.jours_ecoules || 0}</p>
                                    <p className="text-xs text-slate-500">jours écoulés</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                                    <p className="text-2xl font-bold text-amber-600">{stage.duree_jours - (stage.jours_ecoules || 0)}</p>
                                    <p className="text-xs text-slate-500">jours restants</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                                    <p className="text-2xl font-bold text-emerald-600">{stage.duree_jours}</p>
                                    <p className="text-xs text-slate-500">jours totaux</p>
                                </div>
                            </div>
                            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-700"
                                    style={{ width: `${Math.min(100, stage.progression)}%` }}
                                />
                            </div>
                            <p className="mt-2 text-right text-sm font-semibold text-blue-600">{stage.progression}%</p>
                            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                                <span>Début: {new Date(stage.date_debut).toLocaleDateString('fr-FR')}</span>
                                <span>Fin: {new Date(stage.date_fin).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>

                        <div className="panel-card p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-slate-400" /> Journal de bord hebdomadaire
                            </h3>
                            {stage.journalEntries?.length > 0 ? (
                                <div className="space-y-3">
                                    {stage.journalEntries.map((entry) => (
                                        <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                                                    S{entry.semaine_numero}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(entry.date_soumission).toLocaleDateString('fr-FR', {
                                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{entry.activites}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                                    <FileText size={28} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm text-slate-500">Aucun rapport hebdomadaire soumis.</p>
                                </div>
                            )}
                        </div>

                        {projet?.documents?.length > 0 && (
                            <div className="panel-card p-5">
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <BookOpen size={16} className="text-slate-400" /> Documents déposés
                                </h3>
                                <div className="space-y-2">
                                    {projet.documents.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <FileText size={16} className="text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-950">{doc.titre_fichier || doc.titre}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {doc.auteur?.prenom} {doc.auteur?.nom} · {new Date(doc.date_depot || doc.created_at).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <a href={route('documents.download', doc.id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-blue-600">
                                                <Download size={16} />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="panel-card p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <User size={16} className="text-slate-400" /> Étudiant
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Nom complet</p>
                                    <p className="text-sm font-medium text-slate-950">{etudiant?.user?.prenom} {etudiant?.user?.nom}</p>
                                </div>
                                {etudiant?.matricule && (
                                    <div>
                                        <p className="text-xs text-slate-500">Matricule</p>
                                        <p className="text-sm text-slate-600">{etudiant.matricule}</p>
                                    </div>
                                )}
                                {etudiant?.filiere && (
                                    <div>
                                        <p className="text-xs text-slate-500">Filière</p>
                                        <p className="text-sm text-slate-600">{etudiant.filiere}</p>
                                    </div>
                                )}
                                {etudiant?.classe && (
                                    <div>
                                        <p className="text-xs text-slate-500">Classe</p>
                                        <p className="text-sm text-slate-600">{etudiant.classe}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="panel-card p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                <Building2 size={16} className="text-slate-400" /> Entreprise
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Raison sociale</p>
                                    <p className="text-sm font-medium text-slate-950">{entreprise?.raison_sociale || '-'}</p>
                                </div>
                                {entreprise?.maitre_stage && (
                                    <div>
                                        <p className="text-xs text-slate-500">Maître de stage</p>
                                        <p className="text-sm text-slate-600">{entreprise.maitre_stage}</p>
                                    </div>
                                )}
                                {entreprise?.adresse && (
                                    <div className="flex items-start gap-2">
                                        <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                        <p className="text-sm text-slate-600">{entreprise.adresse}</p>
                                    </div>
                                )}
                                {entreprise?.telephone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="shrink-0 text-slate-400" />
                                        <p className="text-sm text-slate-600">{entreprise.telephone}</p>
                                    </div>
                                )}
                                {entreprise?.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="shrink-0 text-slate-400" />
                                        <p className="text-sm text-slate-600">{entreprise.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {projet?.enseignant?.user && (
                            <div className="panel-card p-5">
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <Users size={16} className="text-slate-400" /> Encadreur
                                </h3>
                                <p className="text-sm font-medium text-slate-950">
                                    {projet.enseignant.user.prenom} {projet.enseignant.user.nom}
                                </p>
                                {projet.enseignant.grade && (
                                    <p className="text-xs text-slate-500">{projet.enseignant.grade}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
