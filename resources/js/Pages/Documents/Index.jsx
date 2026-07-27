import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Download, FileText, UploadCloud } from 'lucide-react';

export default function Index({ documents, projets, canUpload }) {
    const form = useForm({ projet_id: projets[0]?.id ?? '', fichier: null });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('documents.store', form.data.projet_id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.setData('fichier', null),
        });
    };

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Documents</h1>}>
            <Head title="Documents" />

            <div className="space-y-6">
                {canUpload && (
                    <section className="panel-card border-dashed border-teal-200 p-6">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-slate-950">Dépôt de livrable PDF</h2>
                            <p className="mt-1 text-sm text-slate-500">Chaque téléversement incrémente automatiquement la version du document.</p>
                        </div>
                        <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">Projet</label>
                                <select className="soft-input" value={form.data.projet_id} onChange={(e) => form.setData('projet_id', e.target.value)}>
                                    {projets.map((projet) => <option key={projet.id} value={projet.id}>{projet.titre}</option>)}
                                </select>
                            </div>
                            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 hover:bg-slate-100">
                                <UploadCloud size={20} />
                                <span>{form.data.fichier ? form.data.fichier.name : 'Glisser ou sélectionner un PDF'}</span>
                                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => form.setData('fichier', e.target.files[0])} />
                            </label>
                            <button disabled={form.processing || !form.data.fichier} className="soft-button soft-button-primary disabled:opacity-50">
                                Déposer
                            </button>
                        </form>
                        {form.errors.fichier && <p className="mt-2 text-sm text-red-600">{form.errors.fichier}</p>}
                    </section>
                )}

                <section className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <h2 className="text-base font-semibold text-slate-950">Livrables déposés</h2>
                        <p className="mt-1 text-sm text-slate-500">Historique des versions PDF par projet.</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {documents.map((document) => (
                            <div key={document.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-950">{document.titre_fichier}</p>
                                        <p className="text-sm text-slate-500">{document.projet?.titre} • version {document.version} • {document.auteur?.prenom} {document.auteur?.nom}</p>
                                    </div>
                                </div>
                                <Link href={route('documents.download', document.id)} className="soft-button soft-button-secondary w-fit">
                                    <Download size={16} /> Télécharger
                                </Link>
                            </div>
                        ))}
                        {documents.length === 0 && <div className="p-10 text-center text-slate-500">Aucun document PDF déposé.</div>}
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
