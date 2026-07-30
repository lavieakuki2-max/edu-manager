import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Briefcase, Building2, Calendar, Clock, User, MapPin, BookOpen,
    GraduationCap, FileText, Plus, Trash2, AlertCircle, CheckCircle2,
    Hourglass,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

function getStatutLabel(statut) {
    const labels = {
        en_attente: 'En attente',
        en_cours: 'En stage (Actif)',
        termine: 'Stage achevé',
        non_approuve: 'Non approuvé',
        approuve_attente: 'Approuvé (En attente)',
    };
    return labels[statut] || statut;
}

function getStatutColor(statut) {
    const colors = {
        en_attente: 'bg-amber-50 text-amber-700 border border-amber-200',
        en_cours: 'bg-blue-50 text-blue-700 border border-blue-200',
        termine: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        non_approuve: 'bg-red-50 text-red-700 border border-red-200',
        approuve_attente: 'bg-amber-50 text-amber-700 border border-amber-200',
    };
    return colors[statut] || 'bg-slate-100 text-slate-600';
}

function Chronometer({ stage }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const debut = new Date(stage.date_debut + 'T00:00:00');
    const fin = new Date(stage.date_fin + 'T00:00:00');
    const totalMs = fin.getTime() - debut.getTime();
    const elapsedMs = now.getTime() - debut.getTime();
    const remainingMs = fin.getTime() - now.getTime();

    const totalDays = Math.max(1, Math.ceil(totalMs / (1000 * 60 * 60 * 24)));
    const elapsedDays = Math.max(0, Math.ceil(elapsedMs / (1000 * 60 * 60 * 24)));
    const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
    const progress = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

    const daysUntilStart = Math.max(0, Math.ceil((debut.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <Clock size={24} className="mx-auto text-blue-500 mb-2" />
                <p className="text-3xl font-bold text-slate-950">
                    {stage.statut_courant === 'approuve_attente' ? daysUntilStart : elapsedDays}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    {stage.statut_courant === 'approuve_attente' ? 'jours avant début' : 'jours écoulés'}
                </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <Hourglass size={24} className="mx-auto text-amber-500 mb-2" />
                <p className="text-3xl font-bold text-slate-950">
                    {stage.statut_courant === 'termine' ? 0 : remainingDays}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    {stage.statut_courant === 'termine' ? 'Terminé' : 'jours restants'}
                </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <Calendar size={24} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-3xl font-bold text-slate-950">{totalDays}</p>
                <p className="text-xs text-slate-500 mt-1">jours totaux</p>
            </div>
        </div>
    );
}

function ProgressBar({ stage }) {
    return (
        <div className="panel-card p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">Progression du stage</h3>
                <span className="text-sm font-bold text-blue-600">{stage.progression}%</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-700"
                    style={{ width: `${Math.min(100, stage.progression)}%` }}
                />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Début: {new Date(stage.date_debut).toLocaleDateString('fr-FR')}</span>
                <span>Fin: {new Date(stage.date_fin).toLocaleDateString('fr-FR')}</span>
            </div>
        </div>
    );
}

function JournalEntry({ entry, onDelete, onEdit }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                        S{entry.semaine_numero}
                    </span>
                    <div>
                        <p className="text-sm font-medium text-slate-950">Semaine {entry.semaine_numero}</p>
                        <p className="text-xs text-slate-400">
                            {new Date(entry.date_soumission).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'short', year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(entry)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600" title="Modifier">
                        <FileText size={14} />
                    </button>
                    <button onClick={() => onDelete(entry.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600" title="Supprimer">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{entry.activites}</p>
        </div>
    );
}

export default function SuiviStage({ projet = null, stage = null }) {
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        stage_id: stage?.id || '',
        semaine_numero: '',
        activites: '',
    });

    const nextSemaine = useMemo(() => {
        if (!stage?.journalEntries?.length) return 1;
        const max = Math.max(...stage.journalEntries.map((e) => e.semaine_numero));
        return max + 1;
    }, [stage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingEntry) {
            put(route('etudiant.stage.journal.update', editingEntry.id), {
                onSuccess: () => { setShowForm(false); setEditingEntry(null); reset(); },
            });
        } else {
            post(route('etudiant.stage.journal.store'), {
                onSuccess: () => { setShowForm(false); reset(); },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Supprimer ce rapport ?')) {
            destroy(route('etudiant.stage.journal.destroy', id));
        }
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setData('semaine_numero', entry.semaine_numero);
        setData('activites', entry.activites);
        setData('stage_id', stage.id);
        setShowForm(true);
    };

    useEffect(() => {
        if (stage) setData('stage_id', stage.id);
    }, [stage]);

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Suivi de Stage</h1>}>
            <Head title="Suivi de Stage" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">Stage</span>
                            <h2 className="text-2xl font-semibold tracking-tight">Suivi de mon stage</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Consultez l'avancement de votre stage et ajoutez vos rapports hebdomadaires.
                            </p>
                        </div>
                        {stage && (
                            <span className={`status-pill text-xs ${getStatutColor(stage.statut_courant)}`}>
                                {getStatutLabel(stage.statut_courant)}
                            </span>
                        )}
                    </div>
                </section>

                {!stage ? (
                    <div className="panel-card p-16 text-center">
                        <Briefcase className="mx-auto text-slate-300" size={48} />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700">Aucun stage en cours</h3>
                        <p className="mt-2 max-w-sm mx-auto text-sm text-slate-500">
                            Vous n'avez pas encore de stage assigné. Soumettez d'abord votre sujet de stage depuis la page &laquo; Mon Projet &raquo;.
                        </p>
                        <Link href={route('projets.index')} className="soft-button-primary mt-6 inline-flex items-center gap-2">
                            <Briefcase size={16} /> Mon Projet
                        </Link>
                    </div>
                ) : stage.statut_courant === 'non_approuve' ? (
                    <div className="panel-card p-16 text-center">
                        <AlertCircle className="mx-auto text-red-300" size={48} />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700">Stage non approuvé</h3>
                        <p className="mt-2 max-w-sm mx-auto text-sm text-slate-500">
                            Votre stage est enregistré mais n&rsquo;a pas encore été approuvé par l&rsquo;administration.
                            Veuillez patienter jusqu&rsquo;à la validation de votre projet.
                        </p>
                    </div>
                ) : (
                    <>
                        {stage.statut_courant === 'approuve_attente' ? (
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center col-span-full">
                                    <Calendar size={32} className="mx-auto text-amber-500 mb-3" />
                                    <p className="text-lg font-semibold text-slate-700">Stage approuvé — En attente de démarrage</p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Début prévu le <strong>{new Date(stage.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Fin prévue le <strong>{new Date(stage.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                                        &nbsp;({stage.duree_jours} jours)
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 lg:grid-cols-3">
                                <div className="lg:col-span-2 space-y-6">
                                    <Chronometer stage={stage} />
                                    <ProgressBar stage={stage} />
                                </div>
                            <div className="space-y-4">
                                <div className="panel-card p-5">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                        <Building2 size={16} className="text-slate-400" /> Entreprise d'accueil
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Raison sociale</p>
                                            <p className="text-sm font-medium text-slate-950">{stage.entreprise?.raison_sociale || '-'}</p>
                                        </div>
                                        {stage.entreprise?.maitre_stage && (
                                            <div>
                                                <p className="text-xs text-slate-500">Maître de stage</p>
                                                <p className="text-sm font-medium text-slate-950">{stage.entreprise.maitre_stage}</p>
                                            </div>
                                        )}
                                        {stage.entreprise?.adresse && (
                                            <div>
                                                <p className="text-xs text-slate-500">Adresse</p>
                                                <p className="text-sm text-slate-600">{stage.entreprise.adresse}</p>
                                            </div>
                                        )}
                                        {stage.entreprise?.telephone && (
                                            <div>
                                                <p className="text-xs text-slate-500">Téléphone</p>
                                                <p className="text-sm text-slate-600">{stage.entreprise.telephone}</p>
                                            </div>
                                        )}
                                        {stage.entreprise?.email && (
                                            <div>
                                                <p className="text-xs text-slate-500">Email</p>
                                                <p className="text-sm text-slate-600">{stage.entreprise.email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {projet?.enseignant?.user && (
                                    <div className="panel-card p-5">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                            <User size={16} className="text-slate-400" /> Encadreur
                                        </h3>
                                        <p className="text-sm font-medium text-slate-950">
                                            {projet.enseignant.user.prenom} {projet.enseignant.user.nom}
                                        </p>
                                        {projet.enseignant.grade && (
                                            <p className="text-xs text-slate-500">{projet.enseignant.grade}</p>
                                        )}
                                    </div>
                                )}
                                <div className="panel-card p-5">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                        <Calendar size={16} className="text-slate-400" /> Période
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        {new Date(stage.date_debut).toLocaleDateString('fr-FR')} — {new Date(stage.date_fin).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        )}

                        <div className="panel-card p-5">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText size={16} className="text-slate-400" /> Journal de bord hebdomadaire
                                </h3>
                                {stage.statut_courant === 'en_cours' && (
                                    <button
                                        onClick={() => { setEditingEntry(null); reset(); setData('semaine_numero', nextSemaine); setShowForm(!showForm); }}
                                        className="soft-button-primary inline-flex items-center gap-1.5 text-xs"
                                    >
                                        <Plus size={14} /> Ajouter un rapport
                                    </button>
                                )}
                                {stage.statut_courant === 'termine' && (
                                    <button
                                        onClick={() => { setEditingEntry(null); reset(); setData('semaine_numero', nextSemaine); setShowForm(!showForm); }}
                                        className="soft-button bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1.5 text-xs"
                                    >
                                        <FileText size={14} /> Déposer le rapport final
                                    </button>
                                )}
                            </div>

                            {showForm && (
                                <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Semaine n°</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.semaine_numero}
                                            onChange={(e) => setData('semaine_numero', e.target.value)}
                                            className="soft-input w-24"
                                            required
                                        />
                                        {errors.semaine_numero && <p className="mt-1 text-xs text-red-500">{errors.semaine_numero}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Activités / Compte-rendu</label>
                                        <textarea
                                            value={data.activites}
                                            onChange={(e) => setData('activites', e.target.value)}
                                            className="soft-input w-full"
                                            rows={5}
                                            placeholder="Décrivez les activités réalisées cette semaine..."
                                            required
                                        />
                                        {errors.activites && <p className="mt-1 text-xs text-red-500">{errors.activites}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button type="submit" disabled={processing} className="soft-button-primary text-sm">
                                            {editingEntry ? 'Mettre à jour' : 'Enregistrer'}
                                        </button>
                                        <button type="button" onClick={() => { setShowForm(false); setEditingEntry(null); reset(); }} className="soft-button-secondary text-sm">
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            )}

                            {stage.journalEntries?.length > 0 ? (
                                <div className="space-y-3">
                                    {stage.journalEntries.map((entry) => (
                                        <JournalEntry
                                            key={entry.id}
                                            entry={entry}
                                            onDelete={handleDelete}
                                            onEdit={handleEdit}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                                    <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm text-slate-500">Aucun rapport hebdomadaire pour le moment.</p>
                                    <p className="text-xs text-slate-400 mt-1">Ajoutez vos comptes-rendus au fur et à mesure de l'avancement du stage.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
