import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Building2, Search, Eye, Edit, Trash2, Plus, X, Check, Phone, Mail, MapPin, Users, FileText, Briefcase,
} from 'lucide-react';

export default function Entreprises({ entreprises = [], stats = {} }) {
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(null);
    const [showView, setShowView] = useState(null);
    const [showDelete, setShowDelete] = useState(null);

    const createForm = useForm({
        raison_sociale: '',
        adresse: '',
        telephone: '',
        email_contact: '',
        maitre_stage: '',
    });

    const editForm = useForm({
        raison_sociale: '',
        adresse: '',
        telephone: '',
        email_contact: '',
        maitre_stage: '',
    });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.entreprises.store'), {
            onSuccess: () => {
                setShowCreate(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!showEdit) return;
        editForm.patch(route('admin.entreprises.update', showEdit.id), {
            onSuccess: () => {
                setShowEdit(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (entreprise) => {
        router.delete(route('admin.entreprises.destroy', entreprise.id), {
            onSuccess: () => setShowDelete(null),
        });
    };

    const openEdit = (entreprise) => {
        editForm.setData({
            raison_sociale: entreprise.raison_sociale,
            adresse: entreprise.adresse || '',
            telephone: entreprise.telephone || '',
            email_contact: entreprise.email_contact || '',
            maitre_stage: entreprise.maitre_stage || '',
        });
        setShowEdit(entreprise);
    };

    const filtered = entreprises.filter((e) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (e.raison_sociale || '').toLowerCase().includes(q) ||
            (e.ville || '').toLowerCase().includes(q) ||
            (e.secteur || '').toLowerCase().includes(q) ||
            (e.email_contact || '').toLowerCase().includes(q)
        );
    });

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Entreprises partenaires</h1>}>
            <Head title="Entreprises" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {entreprises.length} entreprise{entreprises.length !== 1 ? 's' : ''} partenaire{entreprises.length !== 1 ? 's' : ''}
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Entreprises partenaires</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Gérez les entreprises partenaires, les conventions de stage et les maîtres de stage.
                            </p>
                        </div>
                        <button onClick={() => setShowCreate(true)} className="soft-button bg-white text-slate-950 hover:bg-slate-100">
                            <Plus size={16} /> Nouvelle entreprise
                        </button>
                    </div>
                </section>

                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="soft-input pl-11"
                                    placeholder="Rechercher une entreprise..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                    <th className="px-5 py-3 font-semibold text-slate-600">Nom</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Secteur</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Ville</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Contact</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Stagiaires actifs</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Convention</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((entreprise) => (
                                    <tr key={entreprise.id} className="transition hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                                                    <Building2 size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-950">{entreprise.raison_sociale}</p>
                                                    <p className="text-xs text-slate-400">{entreprise.email_contact || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{entreprise.secteur || '-'}</td>
                                        <td className="px-5 py-3 text-slate-600">{entreprise.ville || '-'}</td>
                                        <td className="px-5 py-3 text-slate-600">{entreprise.telephone || '-'}</td>
                                        <td className="px-5 py-3">
                                            <span className="status-pill bg-blue-50 text-blue-700 text-xs">
                                                <Users size={12} />
                                                {entreprise.stagiaires_actifs ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`status-pill text-xs ${
                                                entreprise.convention_signee
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {entreprise.convention_signee ? 'Signée' : 'En attente'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setShowView(entreprise)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                    <Eye size={15} />
                                                </button>
                                                <button onClick={() => openEdit(entreprise)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                    <Edit size={15} />
                                                </button>
                                                <button onClick={() => setShowDelete(entreprise)} className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center">
                                            <Building2 className="mx-auto text-slate-300" size={40} />
                                            <p className="mt-4 text-sm font-medium text-slate-500">Aucune entreprise trouvée.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Nouvelle entreprise</h2>
                            <button onClick={() => setShowCreate(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitCreate} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Raison sociale</label>
                                <input className="soft-input" value={createForm.data.raison_sociale} onChange={(e) => createForm.setData('raison_sociale', e.target.value)} placeholder="Nom de l'entreprise" />
                                {createForm.errors.raison_sociale && <p className="mt-1 text-xs text-red-600">{createForm.errors.raison_sociale}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Adresse</label>
                                <input className="soft-input" value={createForm.data.adresse} onChange={(e) => createForm.setData('adresse', e.target.value)} placeholder="Adresse complète" />
                                {createForm.errors.adresse && <p className="mt-1 text-xs text-red-600">{createForm.errors.adresse}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Téléphone</label>
                                    <input className="soft-input" value={createForm.data.telephone} onChange={(e) => createForm.setData('telephone', e.target.value)} placeholder="+243..." />
                                    {createForm.errors.telephone && <p className="mt-1 text-xs text-red-600">{createForm.errors.telephone}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email contact</label>
                                    <input type="email" className="soft-input" value={createForm.data.email_contact} onChange={(e) => createForm.setData('email_contact', e.target.value)} placeholder="contact@entreprise.com" />
                                    {createForm.errors.email_contact && <p className="mt-1 text-xs text-red-600">{createForm.errors.email_contact}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Maître de stage</label>
                                <input className="soft-input" value={createForm.data.maitre_stage} onChange={(e) => createForm.setData('maitre_stage', e.target.value)} placeholder="Nom du maître de stage" />
                                {createForm.errors.maitre_stage && <p className="mt-1 text-xs text-red-600">{createForm.errors.maitre_stage}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreate(false)} className="soft-button soft-button-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={createForm.processing} className="soft-button soft-button-primary disabled:opacity-50">
                                    <Check size={16} /> Créer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowEdit(null)} />
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Modifier l'entreprise</h2>
                            <button onClick={() => setShowEdit(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Raison sociale</label>
                                <input className="soft-input" value={editForm.data.raison_sociale} onChange={(e) => editForm.setData('raison_sociale', e.target.value)} />
                                {editForm.errors.raison_sociale && <p className="mt-1 text-xs text-red-600">{editForm.errors.raison_sociale}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Adresse</label>
                                <input className="soft-input" value={editForm.data.adresse} onChange={(e) => editForm.setData('adresse', e.target.value)} />
                                {editForm.errors.adresse && <p className="mt-1 text-xs text-red-600">{editForm.errors.adresse}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Téléphone</label>
                                    <input className="soft-input" value={editForm.data.telephone} onChange={(e) => editForm.setData('telephone', e.target.value)} />
                                    {editForm.errors.telephone && <p className="mt-1 text-xs text-red-600">{editForm.errors.telephone}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email contact</label>
                                    <input type="email" className="soft-input" value={editForm.data.email_contact} onChange={(e) => editForm.setData('email_contact', e.target.value)} />
                                    {editForm.errors.email_contact && <p className="mt-1 text-xs text-red-600">{editForm.errors.email_contact}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Maître de stage</label>
                                <input className="soft-input" value={editForm.data.maitre_stage} onChange={(e) => editForm.setData('maitre_stage', e.target.value)} />
                                {editForm.errors.maitre_stage && <p className="mt-1 text-xs text-red-600">{editForm.errors.maitre_stage}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowEdit(null)} className="soft-button soft-button-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={editForm.processing} className="soft-button soft-button-primary disabled:opacity-50">
                                    <Check size={16} /> Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowView(null)} />
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Fiche entreprise</h2>
                            <button onClick={() => setShowView(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-lg font-bold text-slate-950">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-950">{showView.raison_sociale}</p>
                                    {showView.secteur && <p className="text-sm text-slate-500">{showView.secteur}</p>}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="text-slate-600">{showView.adresse || 'Non renseignée'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone size={16} className="text-slate-400" />
                                    <span className="text-slate-600">{showView.telephone || 'Non renseigné'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={16} className="text-slate-400" />
                                    <span className="text-slate-600">{showView.email_contact || 'Non renseigné'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Users size={16} className="text-slate-400" />
                                    <span className="text-slate-600">Maître de stage : {showView.maitre_stage || 'Non assigné'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <FileText size={16} className="text-slate-400" />
                                    <span className="text-slate-600">Convention : </span>
                                    <span className={`status-pill text-xs ${
                                        showView.convention_signee
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                        {showView.convention_signee ? 'Signée' : 'En attente'}
                                    </span>
                                </div>
                            </div>

                            {showView.stagiaires && showView.stagiaires.length > 0 && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-3 text-sm font-semibold text-slate-700">Historique des stagiaires</h3>
                                    <div className="space-y-2">
                                        {showView.stagiaires.map((stagiaire, idx) => (
                                            <div key={idx} className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                                                        {stagiaire.user?.prenom?.charAt(0)}{stagiaire.user?.nom?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-950">
                                                            {stagiaire.user?.prenom} {stagiaire.user?.nom}
                                                        </p>
                                                        <p className="text-xs text-slate-400">{stagiaire.annee_academique || ''}</p>
                                                    </div>
                                                </div>
                                                {stagiaire.statut && (
                                                    <span className="status-pill bg-slate-100 text-slate-600 text-xs">{stagiaire.statut}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowView(null)} className="soft-button soft-button-secondary">
                                    Fermer
                                </button>
                                <button onClick={() => { setShowView(null); openEdit(showView); }} className="soft-button soft-button-primary">
                                    <Edit size={16} /> Modifier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowDelete(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Supprimer l'entreprise</h2>
                            <button onClick={() => setShowDelete(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600">
                            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-slate-950">{showDelete.raison_sociale}</span> ?
                            Cette action est irréversible.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowDelete(null)} className="soft-button soft-button-secondary">
                                Annuler
                            </button>
                            <button onClick={() => handleDelete(showDelete)} className="soft-button bg-red-600 text-white hover:bg-red-700 shadow-sm">
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
