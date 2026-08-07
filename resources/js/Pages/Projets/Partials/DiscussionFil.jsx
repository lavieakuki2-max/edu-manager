import { useForm } from '@inertiajs/react';
import { MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export default function DiscussionFil({ document, projetId, commentaires = [], canComment = false, isSupervision = false }) {
    const [open, setOpen] = useState(false);
    const form = useForm({ contenu: '', document_id: document.id });
    const docComments = (commentaires || []).filter((c) => c.document_id === document.id);

    const submit = (e) => {
        e.preventDefault();
        form.post(route('projets.commentaires.store', projetId), {
            onSuccess: () => form.reset('contenu'),
        });
    };

    return (
        <div className="mt-3 rounded-xl bg-slate-50 p-4">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
                <MessageSquare size={14} />
                Discussion sur cette version {docComments.length > 0 && `(${docComments.length})`}
            </button>

            {open && (
                <div className="mt-3 space-y-3">
                    {docComments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                                {c.auteur?.prenom?.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs">
                                    <span className="font-semibold text-slate-900">{c.auteur?.prenom} {c.auteur?.nom}</span>
                                    <span className="ml-1 text-slate-400">
                                        {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </p>
                                <p className="mt-0.5 text-sm text-slate-700">{c.contenu}</p>
                            </div>
                        </div>
                    ))}
                    {docComments.length === 0 && <p className="text-xs text-slate-400">Aucun commentaire sur cette version.</p>}

                    {canComment && !isSupervision && (
                        <form onSubmit={submit} className="flex gap-2">
                            <input
                                type="text"
                                className="soft-input flex-1 text-sm"
                                placeholder="Commenter cette version..."
                                value={form.data.contenu}
                                onChange={(e) => form.setData('contenu', e.target.value)}
                            />
                            <button type="submit" disabled={form.processing || !form.data.contenu.trim()} className="soft-button soft-button-primary disabled:opacity-50">
                                <Send size={14} />
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
