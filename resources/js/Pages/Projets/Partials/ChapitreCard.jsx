import { useForm } from '@inertiajs/react';
import { Download, FileText, Trash2 } from 'lucide-react';
import DiscussionFil from './DiscussionFil';

const chapitreColors = {
    'En Attente': 'bg-slate-100 text-slate-600 border border-slate-200',
    'En Cours': 'bg-blue-50 text-blue-700 border border-blue-200',
    'À Corriger': 'bg-red-50 text-red-700 border border-red-200',
    'Validé': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const statutButtons = [
    { statut: 'En Cours', label: 'En cours' },
    { statut: 'À Corriger', label: 'À corriger' },
    { statut: 'Validé', label: 'Valider' },
];

export default function ChapitreCard({ chapitre, projet, canManage = false, canComment = false, isSupervision = false }) {
    const form = useForm({ statut: '' });
    const deleteForm = useForm({});

    const setStatut = (statut) => {
        form.setData('statut', statut);
        form.patch(route('chapitres.statut', chapitre.id), { preserveScroll: true });
    };

    const remove = (e) => {
        e.preventDefault();
        if (window.confirm('Supprimer ce chapitre ? Les documents liés seront conservés.')) {
            deleteForm.delete(route('chapitres.destroy', chapitre.id), { preserveScroll: true });
        }
    };

    return (
        <div className="panel-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                        {chapitre.numero}
                    </span>
                    <div>
                        <h4 className="font-semibold text-slate-950">{chapitre.titre}</h4>
                        {chapitre.documents?.length > 0 && (
                            <p className="text-xs text-slate-500">{chapitre.documents.length} document(s) déposé(s)</p>
                        )}
                    </div>
                </div>
                <span className={`status-pill ${chapitreColors[chapitre.statut] || chapitreColors['En Attente']}`}>
                    {chapitre.statut}
                </span>
            </div>

            <div className="space-y-3 p-5">
                {chapitre.documents?.map((doc) => (
                    <div key={doc.id} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-red-50 p-2 text-red-600"><FileText size={16} /></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{doc.titre_fichier}</p>
                                    <p className="text-xs text-slate-500">
                                        v{doc.version} · {doc.auteur?.prenom} {doc.auteur?.nom} · {new Date(doc.date_depot).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                            <a href={route('documents.download', doc.id)} className="soft-button soft-button-secondary text-xs">
                                <Download size={14} /> Télécharger
                            </a>
                        </div>
                        <DiscussionFil document={doc} projetId={projet.id} commentaires={projet.commentaires} canComment={canComment} isSupervision={isSupervision} />
                    </div>
                ))}
                {(!chapitre.documents || chapitre.documents.length === 0) && (
                    <p className="text-sm text-slate-400">Aucun document déposé pour ce chapitre.</p>
                )}

                {canManage && (
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                        <span className="text-xs font-semibold text-slate-500">Actions :</span>
                        {statutButtons.map(({ statut, label }) => (
                            <button
                                key={statut}
                                onClick={() => setStatut(statut)}
                                disabled={form.processing || chapitre.statut === statut}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
                            >
                                {label}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={remove}
                            className="ml-auto rounded-lg p-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            title="Supprimer le chapitre"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
