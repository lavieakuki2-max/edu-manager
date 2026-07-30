import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    MessageSquare, GraduationCap, BookOpen, Calendar, Send, User,
} from 'lucide-react';

export default function Commentaires({ commentaires = {}, projets = [] }) {
    const [expandedProjet, setExpandedProjet] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        contenu: '',
    });

    const handleSubmit = (e, projetId) => {
        e.preventDefault();
        post(route('projets.commentaires.store', projetId), {
            onSuccess: () => reset('contenu'),
        });
    };

    const grouped = Object.entries(commentaires);

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Commentaires & Discussions</h1>}>
            <Head title="Commentaires" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {projets.length} projet{projets.length !== 1 ? 's' : ''}
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Commentaires & Discussions</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Échangez avec vos étudiants sur leurs projets. Vous pouvez initier la conversation à tout moment.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="space-y-4">
                    {projets.map((projet) => {
                        const projetComments = commentaires[projet.id] || [];
                        const isExpanded = expandedProjet === projet.id || expandedProjet === null;

                        return (
                            <div key={projet.id} className="panel-card overflow-hidden">
                                <button
                                    onClick={() => setExpandedProjet(isExpanded && expandedProjet !== null ? null : projet.id)}
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
                                                    <User size={12} className="inline mr-1" />
                                                    {projet.etudiant?.user?.prenom} {projet.etudiant?.user?.nom}
                                                    {projet.etudiant?.matricule && (
                                                        <span className="text-slate-400"> · {projet.etudiant.matricule}</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="status-pill bg-slate-100 text-slate-600 text-xs">
                                            {projetComments.length} message{projetComments.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div>
                                        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                                            {projetComments.map((commentaire) => (
                                                <div key={commentaire.id} className="p-5">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                                                            commentaire.auteur?.role === 'enseignant'
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'
                                                        }`}>
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
                                                            <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{commentaire.contenu || '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {projetComments.length === 0 && (
                                                <div className="p-8 text-center">
                                                    <MessageSquare className="mx-auto text-slate-300" size={28} />
                                                    <p className="mt-3 text-sm text-slate-500">Aucun message. Lancez la discussion !</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-slate-200/80 p-5 bg-slate-50/50">
                                            <form onSubmit={(e) => handleSubmit(e, projet.id)} className="flex gap-3">
                                                <textarea
                                                    className="soft-input flex-1 resize-none"
                                                    rows={2}
                                                    placeholder="Écrire un message..."
                                                    value={expandedProjet === projet.id ? data.contenu : ''}
                                                    onChange={(e) => {
                                                        if (expandedProjet === projet.id) {
                                                            setData('contenu', e.target.value);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={processing || !data.contenu.trim()}
                                                    className="soft-button-primary self-end disabled:opacity-50"
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </form>
                                            {errors.contenu && <p className="mt-1 text-xs text-red-600">{errors.contenu}</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {projets.length === 0 && (
                    <div className="panel-card p-16 text-center">
                        <MessageSquare className="mx-auto text-slate-300" size={40} />
                        <p className="mt-4 text-sm font-medium text-slate-500">Aucun projet assigné pour le moment.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
