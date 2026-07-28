import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    MessageSquare, GraduationCap, BookOpen, Calendar,
} from 'lucide-react';

export default function Commentaires({ commentaires = {} }) {
    const [expandedProjet, setExpandedProjet] = useState(null);

    const grouped = Object.entries(commentaires);

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Commentaires & Discussions</h1>}>
            <Head title="Commentaires" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {grouped.length} projet{grouped.length !== 1 ? 's' : ''} discuté{grouped.length !== 1 ? 's' : ''}
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Commentaires & Discussions</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Suivez les échanges et discussions sur les projets que vous encadrez.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="space-y-4">
                    {grouped.map(([projetKey, data]) => {
                        const projet = data.projet || {};
                        const comments = data.commentaires || [];
                        const isExpanded = expandedProjet === projetKey || expandedProjet === null;

                        return (
                            <div key={projetKey} className="panel-card overflow-hidden">
                                <button
                                    onClick={() => setExpandedProjet(isExpanded && expandedProjet !== null ? null : projetKey)}
                                    className="w-full border-b border-slate-200/80 p-5 text-left transition hover:bg-slate-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-950">{projet.titre || 'Projet'}</p>
                                                <p className="text-sm text-slate-500">
                                                    {projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom}
                                                    {projet.etudiant?.matricule && (
                                                        <span className="text-slate-400"> · {projet.etudiant.matricule}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="status-pill bg-slate-100 text-slate-600 text-xs">
                                            {comments.length} commentaire{comments.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="divide-y divide-slate-100">
                                        {comments.map((commentaire) => (
                                            <div key={commentaire.id} className="p-5">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-xs font-bold text-slate-950">
                                                        {commentaire.auteur?.prenom?.charAt(0)}{commentaire.auteur?.nom?.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-sm font-semibold text-slate-950">
                                                                {commentaire.auteur?.prenom} {commentaire.auteur?.nom}
                                                            </p>
                                                            {commentaire.auteur?.role && (
                                                                <span className="status-pill bg-slate-100 text-slate-500 text-[10px]">
                                                                    {commentaire.auteur.role === 'enseignant' ? 'Enseignant' : commentaire.auteur.role === 'admin' ? 'Admin' : 'Étudiant'}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                                <Calendar size={11} />
                                                                {commentaire.created_at
                                                                    ? new Date(commentaire.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                                    : ''}
                                                            </span>
                                                        </div>
                                                        <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{commentaire.contenu || commentaire.content || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {comments.length === 0 && (
                                            <div className="p-8 text-center">
                                                <MessageSquare className="mx-auto text-slate-300" size={28} />
                                                <p className="mt-3 text-sm text-slate-500">Aucun commentaire pour ce projet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {grouped.length === 0 && (
                    <div className="panel-card p-16 text-center">
                        <MessageSquare className="mx-auto text-slate-300" size={40} />
                        <p className="mt-4 text-sm font-medium text-slate-500">Aucun commentaire pour le moment.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
