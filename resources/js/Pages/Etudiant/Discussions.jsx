import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    MessageSquare, Send, BookOpen, GraduationCap, Calendar, Check,
} from 'lucide-react';

const statusColors = {
    valide: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    en_cours: 'bg-blue-50 text-blue-700 border border-blue-200',
    soumis: 'bg-amber-50 text-amber-700 border border-amber-200',
    a_corriger: 'bg-red-50 text-red-700 border border-red-200',
    brouillon: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const statusLabels = {
    valide: 'Validé',
    en_cours: 'En cours',
    soumis: 'Soumis',
    a_corriger: 'À corriger',
    brouillon: 'Brouillon',
};

export default function Discussions({ commentaires = [], projets = [] }) {
    const [activeProjet, setActiveProjet] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        contenu: '',
    });

    const handleSubmit = (e, projetId) => {
        e.preventDefault();
        post(route('projets.commentaires.store', projetId), {
            onSuccess: () => {
                reset('contenu');
            },
        });
    };

    const handleProjetSelect = (projetId) => {
        setActiveProjet(projetId);
    };

    const projetsWithComments = projets.map((p) => ({
        ...p,
        commentaires: commentaires.filter((c) => c.projet_id === p.id),
    }));

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Discussions</h1>}>
            <Head title="Discussions" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {projets.length} projet{projets.length !== 1 ? 's' : ''} discuté{projets.length !== 1 ? 's' : ''}
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Discussions</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Échangez avec votre enseignant encadrant sur l'avancement de vos projets.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="space-y-4">
                    {projetsWithComments.map((projet) => (
                        <div key={projet.id} className="panel-card overflow-hidden">
                            <button
                                onClick={() => handleProjetSelect(activeProjet === projet.id ? null : projet.id)}
                                className="w-full border-b border-slate-200/80 p-5 text-left transition hover:bg-slate-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-950">{projet.titre}</p>
                                            <p className="text-sm text-slate-500">
                                                Encadreur : {projet.enseignant?.user?.prenom} {projet.enseignant?.user?.nom}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`status-pill text-xs ${statusColors[projet.statut] || 'bg-slate-100 text-slate-600'}`}>
                                            {statusLabels[projet.statut] || projet.statut}
                                        </span>
                                        <span className="status-pill bg-slate-100 text-slate-600 text-xs">
                                            {projet.commentaires.length} message{projet.commentaires.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </button>

                            {activeProjet === projet.id && (
                                <div>
                                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                                        {projet.commentaires.map((commentaire) => (
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
                                                        <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{commentaire.contenu || commentaire.content || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {projet.commentaires.length === 0 && (
                                            <div className="p-8 text-center">
                                                <MessageSquare className="mx-auto text-slate-300" size={28} />
                                                <p className="mt-3 text-sm text-slate-500">Aucun commentaire. Soyez le premier à écrire !</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-200/80 p-5 bg-slate-50/50">
                                        <form onSubmit={(e) => handleSubmit(e, projet.id)} className="flex gap-3">
                                            <textarea
                                                className="soft-input flex-1 resize-none"
                                                rows={2}
                                                placeholder="Écrire un commentaire..."
                                                value={activeProjet === projet.id ? data.contenu : ''}
                                                onChange={(e) => {
                                                    if (activeProjet === projet.id) {
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
                    ))}
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
