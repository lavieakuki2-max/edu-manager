import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UserAvatar from '@/Components/UserAvatar';
import { Camera, Check, Trash2, Upload, X } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(user.photo_url || null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            alert('Format accepté : JPG, PNG, WEBP.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Fichier trop volumineux. Maximum 2 Mo.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const uploadPhoto = useCallback(async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch(route('profile.photo.update'), {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setPhotoUrl(data.photo_url);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        } catch (err) {
            alert('Erreur lors du téléversement.');
        } finally {
            setUploading(false);
        }
    }, []);

    const deletePhoto = useCallback(async () => {
        if (!confirm('Supprimer votre photo de profil ?')) return;

        try {
            const res = await fetch(route('profile.photo.destroy'), {
                method: 'DELETE',
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (data.success) {
                setPhotoUrl(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        } catch (err) {
            alert('Erreur lors de la suppression.');
        }
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Camera size={22} className="text-teal-400" />
                    <h2 className="text-xl font-semibold leading-tight text-white">Paramètres du profil</h2>
                </div>
            }
        >
            <Head title="Paramètres" />

            <div className="space-y-6 px-4 sm:px-6 lg:px-8">
                <div className="panel-card p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="panel-card p-6">
                    <div className="max-w-xl">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">Photo de profil</h2>
                            <p className="mt-1 text-sm text-gray-600">Ajoutez ou modifiez votre photo de profil. Formats acceptés : JPG, PNG, WEBP. Maximum 2 Mo.</p>
                        </header>

                        <div className="mt-6 flex items-center gap-6">
                            <div className="relative">
                                <UserAvatar user={{ ...user, photo_url: preview || photoUrl }} size="xl" />
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-slate-950 p-1.5 text-white shadow-md">
                                    <Camera size={12} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="soft-button soft-button-primary text-xs inline-flex items-center gap-2 cursor-pointer"
                                >
                                    <Upload size={14} /> Téléverser / Changer
                                </label>

                                {preview && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <button onClick={uploadPhoto} disabled={uploading} className="soft-button bg-emerald-600 text-white hover:bg-emerald-700 text-xs inline-flex items-center gap-1 disabled:opacity-50">
                                            {uploading ? 'Envoi...' : <><Check size={14} /> Enregistrer</>}
                                        </button>
                                        <button onClick={() => { setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="soft-button soft-button-secondary text-xs inline-flex items-center gap-1">
                                            <X size={14} /> Annuler
                                        </button>
                                    </div>
                                )}

                                {photoUrl && !preview && (
                                    <button onClick={deletePhoto} className="soft-button text-xs inline-flex items-center gap-1 text-red-600 border border-red-200 hover:bg-red-50">
                                        <Trash2 size={14} /> Supprimer la photo
                                    </button>
                                )}
                            </div>
                        </div>

                        {preview && (
                            <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3">
                                <p className="text-xs text-teal-700">Aperçu avant enregistrement. Cliquez sur <strong>Enregistrer</strong> pour confirmer.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="panel-card p-6">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="panel-card p-6 border-red-100">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
