import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    CalendarRange, Calendar, MapPin, Award, Check, BookOpen, GraduationCap, User, Users, Clock,
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

export default function MaSoutenance({ projet = null, soutenance = null }) {
    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Ma Soutenance</h1>}>
            <Head title="Ma Soutenance" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                Soutenance
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Ma Soutenance</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Consultez les détails de votre soutenance de projet.
                            </p>
                        </div>
                    </div>
                </section>

                {!soutenance ? (
                    <div className="panel-card p-16 text-center">
                        <CalendarRange className="mx-auto text-slate-300" size={48} />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700">Aucune soutenance planifiée</h3>
                        <p className="mt-2 max-w-sm mx-auto text-sm text-slate-500">
                            Votre soutenance n'a pas encore été planifiée. Vous serez informé(e) une fois la date, la salle et la composition du jury attribuées.
                        </p>
                        {projet && (
                            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3">
                                <BookOpen size={16} className="text-slate-400" />
                                <span className="text-sm text-slate-600">
                                    Projet : <span className="font-medium text-slate-950">{projet.titre}</span>
                                </span>
                                <span className="status-pill text-xs bg-purple-50 text-purple-700 border border-purple-200">
                                    {projet.type === 'Projet_Tutore' ? 'Projet Tutoré' : projet.type}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="panel-card overflow-hidden">
                        <div className="border-b border-slate-200/80 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg">
                                        <CalendarRange size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-950">Soutenance planifiée</h3>
                                        <span className={`status-pill mt-1 text-xs ${statusColors[soutenance.statut] || 'bg-slate-100 text-slate-600'}`}>
                                            {statusLabels[soutenance.statut] || soutenance.statut}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-blue-500" />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</p>
                                            <p className="mt-1 text-sm font-medium text-slate-950">
                                                {soutenance.date_soutenance
                                                    ? new Date(soutenance.date_soutenance).toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    })
                                                    : 'Non définie'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Clock size={18} className="text-blue-500" />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Horaire</p>
                                            <p className="mt-1 text-sm font-medium text-slate-950">
                                                {soutenance.heure_debut
                                                    ? `${soutenance.heure_debut.substring(0, 5)}${soutenance.heure_fin ? ` - ${soutenance.heure_fin.substring(0, 5)}` : ''}`
                                                    : 'Non défini'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className="text-purple-500" />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Salle</p>
                                            <p className="mt-1 text-sm font-medium text-slate-950">{soutenance.salle || 'Non définie'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Award size={18} className={soutenance.note_finale != null ? 'text-emerald-500' : 'text-slate-400'} />
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Note finale</p>
                                            <p className="mt-1 text-sm font-medium text-slate-950">
                                                {soutenance.note_finale != null ? `${soutenance.note_finale}/20` : 'Non encore noté'}
                                            </p>
                                            {soutenance.mention && (
                                                <span className={`status-pill mt-1 text-xs ${mentionColors[soutenance.mention] || 'bg-slate-100 text-slate-600'}`}>
                                                    {soutenance.mention}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-slate-400" />
                                    <h4 className="text-sm font-semibold text-slate-700">Composition du jury</h4>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {soutenance.president?.user && (
                                        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Président</p>
                                            <p className="mt-1 text-sm font-medium text-slate-950">
                                                {soutenance.president.user.prenom} {soutenance.president.user.nom}
                                            </p>
                                            {soutenance.president.grade && (
                                                <p className="text-xs text-slate-400">{soutenance.president.grade}</p>
                                            )}
                                        </div>
                                    )}
                                    {soutenance.rapporteur?.user && (
                                        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Rapporteur</p>
                                            <p className="mt-1 text-sm font-medium text-slate-950">
                                                {soutenance.rapporteur.user.prenom} {soutenance.rapporteur.user.nom}
                                            </p>
                                            {soutenance.rapporteur.grade && (
                                                <p className="text-xs text-slate-400">{soutenance.rapporteur.grade}</p>
                                            )}
                                        </div>
                                    )}
                                    {soutenance.membre?.user && (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Membre</p>
                                            <p className="mt-1 text-sm font-medium text-slate-950">
                                                {soutenance.membre.user.prenom} {soutenance.membre.user.nom}
                                            </p>
                                            {soutenance.membre.grade && (
                                                <p className="text-xs text-slate-400">{soutenance.membre.grade}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {!soutenance.president?.user && !soutenance.rapporteur?.user && !soutenance.membre?.user && (
                                    <p className="text-sm text-slate-400 text-center py-2">Jury non encore constitué</p>
                                )}
                            </div>

                            {soutenance.remarques && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Remarques</p>
                                    <p className="text-sm text-slate-600 italic">"{soutenance.remarques}"</p>
                                </div>
                            )}

                            {projet && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-700">Informations du projet</h4>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <BookOpen size={16} className="text-slate-400" />
                                            <div>
                                                <p className="text-xs text-slate-500">Titre</p>
                                                <p className="text-sm font-medium text-slate-950">{projet.titre || '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <GraduationCap size={16} className="text-slate-400" />
                                            <div>
                                                <p className="text-xs text-slate-500">Type</p>
                                                <p className="text-sm font-medium text-slate-950">
                                                    {projet.type === 'Projet_Tutore' ? 'Projet Tutoré' : projet.type || '-'}
                                                </p>
                                            </div>
                                        </div>
                                        {projet.enseignant?.user && (
                                            <div className="flex items-center gap-3">
                                                <User size={16} className="text-slate-400" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Encadreur</p>
                                                    <p className="text-sm font-medium text-slate-950">
                                                        {projet.enseignant.user.prenom} {projet.enseignant.user.nom}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
