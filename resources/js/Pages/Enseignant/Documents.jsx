import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    FileText, Search, Download, GraduationCap, BookOpen, Calendar,
} from 'lucide-react';

export default function Documents({ documents = [] }) {
    const [search, setSearch] = useState('');

    const filtered = documents.filter((d) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (d.titre_fichier || '').toLowerCase().includes(q) ||
            (d.projet?.etudiant?.user?.prenom || '').toLowerCase().includes(q) ||
            (d.projet?.etudiant?.user?.nom || '').toLowerCase().includes(q) ||
            (d.projet?.titre || '').toLowerCase().includes(q)
        );
    });

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Documents des Étudiants</h1>}>
            <Head title="Documents" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {documents.length} document{documents.length !== 1 ? 's' : ''} au total
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Documents des Étudiants</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Accédez à tous les documents déposés par vos étudiants encadrés.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="soft-input pl-11"
                                placeholder="Rechercher par nom, étudiant ou projet..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                    <th className="px-5 py-3 font-semibold text-slate-600">Étudiant</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Document</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Version</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Date dépôt</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Projet</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Télécharger</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((doc) => (
                                    <tr key={doc.id} className="transition hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600">
                                                    <GraduationCap size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-950">
                                                        {doc.projet?.etudiant?.user?.prenom} {doc.projet?.etudiant?.user?.nom}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {doc.projet?.etudiant?.matricule}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-slate-400" />
                                                <span className="font-medium text-slate-950">{doc.titre_fichier || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="status-pill bg-slate-100 text-slate-600 text-xs">
                                                v{doc.version || '1'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                <span className="text-slate-600">
                                                    {doc.created_at || doc.date_depot
                                                        ? new Date(doc.created_at || doc.date_depot).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                                                        : '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={14} className="text-slate-400" />
                                                <span className="text-slate-600">{doc.projet?.titre || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <Link
                                                href={route('documents.download', doc.id)}
                                                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                                                preserveState
                                            >
                                                <Download size={13} /> Télécharger
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filtered.length === 0 && (
                        <div className="p-16 text-center">
                            <FileText className="mx-auto text-slate-300" size={40} />
                            <p className="mt-4 text-sm font-medium text-slate-500">Aucun document trouvé.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
