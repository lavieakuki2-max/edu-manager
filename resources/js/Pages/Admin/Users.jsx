import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserAvatar from '@/Components/UserAvatar';
import TableScroll from '@/Components/TableScroll';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    UserPlus, Search, Eye, Edit, Trash2, Shield, GraduationCap,
    BookOpen, Users as UsersIcon, X, Check, Mail, Phone, MapPin, Briefcase, Calendar, EyeOff, Clock, Ban,
} from 'lucide-react';

const roleColors = {
    admin: 'bg-amber-50 text-amber-700 border border-amber-200',
    enseignant: 'bg-blue-50 text-blue-700 border border-blue-200',
    etudiant: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const roleIcons = {
    admin: Shield,
    enseignant: BookOpen,
    etudiant: GraduationCap,
};

const roleLabels = {
    admin: 'Admin',
    enseignant: 'Enseignant',
    etudiant: 'Etudiant',
};

const statutColors = {
    actif: 'bg-emerald-50 text-emerald-700',
    en_attente: 'bg-amber-50 text-amber-700',
    rejete: 'bg-red-50 text-red-700',
};

const statutLabels = {
    actif: 'Actif',
    en_attente: 'En attente',
    rejete: 'Rejeté',
};

export default function Users({ users = [], stats = {} }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(null);
    const [showView, setShowView] = useState(null);
    const [showDelete, setShowDelete] = useState(null);
    const [showReject, setShowReject] = useState(null);

    const createForm = useForm({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        role: 'etudiant',
        matricule: '',
        classe: '',
        filiere: '',
        grade: '',
        specialite: '',
    });

    const editForm = useForm({
        prenom: '',
        nom: '',
        email: '',
        statut: 'actif',
    });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => {
                setShowCreate(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!showEdit) return;
        editForm.patch(route('admin.users.update', showEdit.id), {
            onSuccess: () => {
                setShowEdit(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (user) => {
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => setShowDelete(null),
        });
    };

    const handleConfirm = (user) => {
        router.post(route('admin.users.confirm', user.id), {}, {
            onSuccess: () => {},
        });
    };

    const rejectForm = useForm({ motif_rejet: '' });

    const openReject = (user) => {
        rejectForm.reset();
        setShowReject(user);
    };

    const submitReject = (e) => {
        e.preventDefault();
        if (!showReject) return;
        rejectForm.post(route('admin.users.reject', showReject.id), {
            onSuccess: () => {
                setShowReject(null);
                rejectForm.reset();
            },
        });
    };

    const openEdit = (user) => {
        editForm.setData({
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            statut: user.statut || 'actif',
        });
        setShowEdit(user);
    };

    const openView = (user) => {
        setShowView(user);
    };

    const filtered = users.filter((u) => {
        if (activeTab !== 'all' && u.role !== activeTab) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                (u.prenom || '').toLowerCase().includes(q) ||
                (u.nom || '').toLowerCase().includes(q) ||
                (u.email || '').toLowerCase().includes(q)
            );
        }
        return true;
    });

    const tabs = [
        { key: 'all', label: 'Tous', count: stats.total || users.length },
        { key: 'admin', label: 'Admins', count: stats.admins || 0 },
        { key: 'enseignant', label: 'Enseignants', count: stats.enseignants || 0 },
        { key: 'etudiant', label: 'Etudiants', count: stats.etudiants || 0 },
    ];

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Gestion des Utilisateurs</h1>}>
            <Head title="Utilisateurs" />

            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">
                                {stats.total || users.length} utilisateur{(stats.total || users.length) !== 1 ? 's' : ''} au total
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight">Gestion des Utilisateurs</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">
                                Administrez les comptes utilisateurs, assignez les rôles et gérez les accès.
                            </p>
                        </div>
                        <button onClick={() => setShowCreate(true)} className="soft-button bg-white text-slate-950 hover:bg-slate-100">
                            <UserPlus size={16} /> Nouvel utilisateur
                        </button>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-4">
                    {[
                        { label: 'Total', value: stats.total || users.length, icon: UsersIcon, tone: 'from-slate-500 to-slate-600' },
                        { label: 'Etudiants', value: stats.etudiants || 0, icon: GraduationCap, tone: 'from-emerald-500 to-green-500' },
                        { label: 'Enseignants', value: stats.enseignants || 0, icon: BookOpen, tone: 'from-blue-500 to-indigo-500' },
                        { label: 'Admins', value: stats.admins || 0, icon: Shield, tone: 'from-amber-500 to-orange-500' },
                    ].map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="panel-card p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="panel-title">{card.label}</p>
                                        <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${card.tone}`}>
                                        <Icon size={22} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {users.some((u) => u.statut === 'en_attente') && (
                    <section className="panel-card overflow-hidden border-2 border-amber-200">
                        <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/60 p-5">
                            <div>
                                <h2 className="text-base font-semibold text-slate-950">
                                    Demandes de comptes en attente
                                    <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                                        {users.filter((u) => u.statut === 'en_attente').length}
                                    </span>
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Confirmez ou rejetez les comptes créés via l'inscription en ligne.
                                </p>
                            </div>
                            <Clock size={18} className="text-amber-500" />
                        </div>
                        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                            {users.filter((u) => u.statut === 'en_attente').map((user) => (
                                <div key={user.id} className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4">
                                    <div className="flex items-center gap-3">
                                        <UserAvatar user={user} size="lg" />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-950 truncate">{user.prenom} {user.nom}</p>
                                            <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        <span className={`status-pill text-xs ${roleColors[user.role] || 'bg-slate-100 text-slate-600'}`}>
                                            {roleLabels[user.role] || user.role}
                                        </span>
                                        <span className="status-pill text-xs bg-amber-50 text-amber-700">En attente</span>
                                    </div>
                                    {user.role === 'etudiant' && user.etudiant && (
                                        <div className="mt-3 space-y-1 text-xs text-slate-500">
                                            <p>Matricule : {user.etudiant.matricule}</p>
                                            <p>Classe : {user.etudiant.classe} · Filière : {user.etudiant.filiere}</p>
                                        </div>
                                    )}
                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            onClick={() => handleConfirm(user)}
                                            className="soft-button flex-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs"
                                        >
                                            <Check size={14} /> Confirmer
                                        </button>
                                        <button
                                            onClick={() => openReject(user)}
                                            className="soft-button flex-1 bg-red-600 text-white hover:bg-red-700 text-xs"
                                        >
                                            <Ban size={14} /> Rejeter
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                activeTab === tab.key
                                    ? 'bg-slate-950 text-white shadow-lg'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                <div className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    className="soft-input pl-11"
                                    placeholder="Rechercher un utilisateur..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((user) => {
                            const RoleIcon = roleIcons[user.role] || UsersIcon;
                            return (
                                <div key={user.id} className="panel-card overflow-hidden transition hover:shadow-lg">
                                    <div className="p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar user={user} size="lg" />
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-950 truncate">{user.prenom} {user.nom}</p>
                                                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2">
                                            <span className={`status-pill text-xs ${roleColors[user.role] || 'bg-slate-100 text-slate-600'}`}>
                                                <RoleIcon size={12} />
                                                {roleLabels[user.role] || user.role}
                                            </span>
                                            <span className={`status-pill text-xs ${statutColors[user.statut] || 'bg-emerald-50 text-emerald-700'}`}>
                                                {statutLabels[user.statut] || 'Actif'}
                                            </span>
                                        </div>

                                        {user.role === 'etudiant' && user.etudiant && (
                                            <div className="mt-3 space-y-1 text-xs text-slate-500">
                                                <p>Matricule : {user.etudiant.matricule}</p>
                                                <p>Classe : {user.etudiant.classe}</p>
                                                <p>Filière : {user.etudiant.filiere}</p>
                                            </div>
                                        )}

                                        {user.role === 'enseignant' && user.enseignant && (
                                            <div className="mt-3 space-y-1 text-xs text-slate-500">
                                                <p>Grade : {user.enseignant.grade}</p>
                                                <p>Spécialité : {user.enseignant.specialite}</p>
                                                <p>Bureau : {user.enseignant.bureau}</p>
                                            </div>
                                        )}

                                        <div className="mt-4 flex items-center gap-2">
                                            <button
                                                onClick={() => openView(user)}
                                                className="soft-button soft-button-secondary flex-1 text-xs"
                                            >
                                                <Eye size={14} /> Voir
                                            </button>
                                            <button
                                                onClick={() => openEdit(user)}
                                                className="soft-button soft-button-secondary flex-1 text-xs"
                                            >
                                                <Edit size={14} /> Modifier
                                            </button>
                                            <button
                                                onClick={() => setShowDelete(user)}
                                                className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="p-16 text-center">
                            <UsersIcon className="mx-auto text-slate-300" size={40} />
                            <p className="mt-4 text-sm font-medium text-slate-500">Aucun utilisateur trouvé.</p>
                        </div>
                    )}
                </div>

                {users.some((u) => u.role === 'enseignant') && (
                    <section className="panel-card overflow-hidden">
                        <div className="border-b border-slate-200/80 p-5">
                            <h2 className="text-base font-semibold text-slate-950">Enseignants</h2>
                            <p className="mt-1 text-sm text-slate-500">Liste des enseignants et leurs informations.</p>
                        </div>
                        <TableScroll>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                        <th className="px-5 py-3 font-semibold text-slate-600">Nom</th>
                                        <th className="px-5 py-3 font-semibold text-slate-600">Grade</th>
                                        <th className="px-5 py-3 font-semibold text-slate-600">Spécialité</th>
                                        <th className="px-5 py-3 font-semibold text-slate-600">Bureau</th>
                                        <th className="px-5 py-3 font-semibold text-slate-600">Étudiants suivis</th>
                                        <th className="px-5 py-3 font-semibold text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.filter((u) => u.role === 'enseignant').map((user) => (
                                        <tr key={user.id} className="transition hover:bg-slate-50">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar user={user} size="sm" />
                                                    <div>
                                                        <p className="font-medium text-slate-950">{user.prenom} {user.nom}</p>
                                                        <p className="text-xs text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-slate-600">{user.enseignant?.grade || '-'}</td>
                                            <td className="px-5 py-3 text-slate-600">{user.enseignant?.specialite || '-'}</td>
                                            <td className="px-5 py-3 text-slate-600">{user.enseignant?.bureau || '-'}</td>
                                            <td className="px-5 py-3 text-slate-600">{user.enseignant?.etudiants_count ?? '-'}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openView(user)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                        <Eye size={15} />
                                                    </button>
                                                    <button onClick={() => openEdit(user)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                                        <Edit size={15} />
                                                    </button>
                                                    <button onClick={() => setShowDelete(user)} className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.filter((u) => u.role === 'enseignant').length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
                                                Aucun enseignant trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </TableScroll>
                    </section>
                )}
            </div>

            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Nouvel utilisateur</h2>
                            <button onClick={() => setShowCreate(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitCreate} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Prénom</label>
                                    <input className="soft-input" value={createForm.data.prenom} onChange={(e) => createForm.setData('prenom', e.target.value)} placeholder="Prénom" />
                                    {createForm.errors.prenom && <p className="mt-1 text-xs text-red-600">{createForm.errors.prenom}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nom</label>
                                    <input className="soft-input" value={createForm.data.nom} onChange={(e) => createForm.setData('nom', e.target.value)} placeholder="Nom" />
                                    {createForm.errors.nom && <p className="mt-1 text-xs text-red-600">{createForm.errors.nom}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                                <input type="email" className="soft-input" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} placeholder="email@uniluk.cd" />
                                {createForm.errors.email && <p className="mt-1 text-xs text-red-600">{createForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mot de passe</label>
                                <input type="password" className="soft-input" value={createForm.data.password} onChange={(e) => createForm.setData('password', e.target.value)} placeholder="Mot de passe" />
                                {createForm.errors.password && <p className="mt-1 text-xs text-red-600">{createForm.errors.password}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Rôle</label>
                                <select className="soft-input" value={createForm.data.role} onChange={(e) => createForm.setData('role', e.target.value)}>
                                    <option value="etudiant">Etudiant</option>
                                    <option value="enseignant">Enseignant</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {createForm.data.role === 'etudiant' && (
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Matricule</label>
                                        <input className="soft-input" value={createForm.data.matricule} onChange={(e) => createForm.setData('matricule', e.target.value)} placeholder="MAT001" />
                                        {createForm.errors.matricule && <p className="mt-1 text-xs text-red-600">{createForm.errors.matricule}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Classe</label>
                                        <input className="soft-input" value={createForm.data.classe} onChange={(e) => createForm.setData('classe', e.target.value)} placeholder="L3" />
                                        {createForm.errors.classe && <p className="mt-1 text-xs text-red-600">{createForm.errors.classe}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Filière</label>
                                        <input className="soft-input" value={createForm.data.filiere} onChange={(e) => createForm.setData('filiere', e.target.value)} placeholder="Informatique" />
                                        {createForm.errors.filiere && <p className="mt-1 text-xs text-red-600">{createForm.errors.filiere}</p>}
                                    </div>
                                </div>
                            )}

                            {createForm.data.role === 'enseignant' && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Grade</label>
                                        <input className="soft-input" value={createForm.data.grade} onChange={(e) => createForm.setData('grade', e.target.value)} placeholder="Professeur" />
                                        {createForm.errors.grade && <p className="mt-1 text-xs text-red-600">{createForm.errors.grade}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Spécialité</label>
                                        <input className="soft-input" value={createForm.data.specialite} onChange={(e) => createForm.setData('specialite', e.target.value)} placeholder="Intelligence Artificielle" />
                                        {createForm.errors.specialite && <p className="mt-1 text-xs text-red-600">{createForm.errors.specialite}</p>}
                                    </div>
                                </div>
                            )}

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
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Modifier l'utilisateur</h2>
                            <button onClick={() => setShowEdit(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Prénom</label>
                                    <input className="soft-input" value={editForm.data.prenom} onChange={(e) => editForm.setData('prenom', e.target.value)} />
                                    {editForm.errors.prenom && <p className="mt-1 text-xs text-red-600">{editForm.errors.prenom}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nom</label>
                                    <input className="soft-input" value={editForm.data.nom} onChange={(e) => editForm.setData('nom', e.target.value)} />
                                    {editForm.errors.nom && <p className="mt-1 text-xs text-red-600">{editForm.errors.nom}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                                <input type="email" className="soft-input" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} />
                                {editForm.errors.email && <p className="mt-1 text-xs text-red-600">{editForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Statut</label>
                                <select className="soft-input" value={editForm.data.statut} onChange={(e) => editForm.setData('statut', e.target.value)}>
                                    <option value="actif">Actif</option>
                                    <option value="en_attente">En attente</option>
                                    <option value="rejete">Rejeté</option>
                                </select>
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
                            <h2 className="text-lg font-semibold text-slate-950">Profil utilisateur</h2>
                            <button onClick={() => setShowView(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <UserAvatar user={showView} size="xl" />
                                <div>
                                    <p className="text-lg font-semibold text-slate-950">{showView.prenom} {showView.nom}</p>
                                    <p className="text-sm text-slate-500">{showView.email}</p>
                                    <span className={`status-pill mt-1 text-xs ${roleColors[showView.role] || 'bg-slate-100 text-slate-600'}`}>
                                        {roleLabels[showView.role] || showView.role}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={16} className="text-slate-400" />
                                    <span className="text-slate-600">{showView.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield size={16} className="text-slate-400" />
                                    <span className="text-slate-600">{roleLabels[showView.role] || showView.role}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className={`status-pill text-xs ${statutColors[showView.statut] || 'bg-emerald-50 text-emerald-700'}`}>
                                        {statutLabels[showView.statut] || 'Actif'}
                                    </span>
                                </div>
                            </div>

                            {showView.role === 'etudiant' && showView.etudiant && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                    <h3 className="text-sm font-semibold text-slate-700">Informations étudiant</h3>
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex items-center gap-3">
                                            <Briefcase size={16} className="text-slate-400" />
                                            <span className="text-slate-600">Matricule : {showView.etudiant.matricule}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <GraduationCap size={16} className="text-slate-400" />
                                            <span className="text-slate-600">Classe : {showView.etudiant.classe}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <BookOpen size={16} className="text-slate-400" />
                                            <span className="text-slate-600">Filière : {showView.etudiant.filiere}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showView.role === 'enseignant' && showView.enseignant && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                    <h3 className="text-sm font-semibold text-slate-700">Informations enseignant</h3>
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex items-center gap-3">
                                            <BookOpen size={16} className="text-slate-400" />
                                            <span className="text-slate-600">Grade : {showView.enseignant.grade}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <GraduationCap size={16} className="text-slate-400" />
                                            <span className="text-slate-600">Spécialité : {showView.enseignant.specialite}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin size={16} className="text-slate-400" />
                                            <span className="text-slate-600">Bureau : {showView.enseignant.bureau}</span>
                                        </div>
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

            {showReject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowReject(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Rejeter la demande</h2>
                            <button onClick={() => setShowReject(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600">
                            Vous allez rejeter la demande de <span className="font-semibold text-slate-950">{showReject.prenom} {showReject.nom}</span>.
                            Le motif sera notifié à l'utilisateur.
                        </p>

                        <form onSubmit={submitReject} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Motif du rejet</label>
                                <textarea
                                    className="soft-input min-h-[100px] w-full"
                                    placeholder="Ex : matricule introuvable dans les registres de l'université"
                                    value={rejectForm.data.motif_rejet}
                                    onChange={(e) => rejectForm.setData('motif_rejet', e.target.value)}
                                    required
                                />
                                {rejectForm.errors.motif_rejet && <p className="mt-1 text-xs text-red-600">{rejectForm.errors.motif_rejet}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowReject(null)} className="soft-button soft-button-secondary">
                                    Annuler
                                </button>
                                <button type="submit" disabled={rejectForm.processing} className="soft-button soft-button-danger disabled:opacity-50">
                                    <Ban size={16} /> Rejeter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setShowDelete(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-950">Supprimer l'utilisateur</h2>
                            <button onClick={() => setShowDelete(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600">
                            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-slate-950">{showDelete.prenom} {showDelete.nom}</span> ?
                            Cette action est irréversible.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowDelete(null)} className="soft-button soft-button-secondary">
                                Annuler
                            </button>
                            <button onClick={() => handleDelete(showDelete)} className="soft-button soft-button-danger">
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {flash?.success && (
                <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 shadow-lg">
                    {flash.success}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
