import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'etudiant',
        matricule: '',
        classe: '',
        filiere: '',
        grade: '',
        specialite: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />
            <form onSubmit={submit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="prenom" value="Prénom" />
                        <TextInput id="prenom" value={data.prenom} className="mt-1 block w-full" autoComplete="given-name" isFocused onChange={(e) => setData('prenom', e.target.value)} required />
                        <InputError message={errors.prenom} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="nom" value="Nom" />
                        <TextInput id="nom" value={data.nom} className="mt-1 block w-full" autoComplete="family-name" onChange={(e) => setData('nom', e.target.value)} required />
                        <InputError message={errors.nom} className="mt-2" />
                    </div>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" value={data.email} className="mt-1 block w-full" autoComplete="username" onChange={(e) => setData('email', e.target.value)} required />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />
                    <TextInput id="password" type="password" value={data.password} className="mt-1 block w-full" autoComplete="new-password" onChange={(e) => setData('password', e.target.value)} required />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />
                    <TextInput id="password_confirmation" type="password" value={data.password_confirmation} className="mt-1 block w-full" autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} required />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="role" value="Je suis" />
                    <select id="role" value={data.role} onChange={(e) => setData('role', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <option value="etudiant">Étudiant</option>
                        <option value="enseignant">Enseignant</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                {data.role === 'etudiant' && (
                    <>
                        <div className="mt-4">
                            <InputLabel htmlFor="matricule" value="Matricule" />
                            <TextInput id="matricule" value={data.matricule} className="mt-1 block w-full" onChange={(e) => setData('matricule', e.target.value)} required />
                            <InputError message={errors.matricule} className="mt-2" />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="classe" value="Classe" />
                                <TextInput id="classe" value={data.classe} className="mt-1 block w-full" placeholder="ex: L2" onChange={(e) => setData('classe', e.target.value)} required />
                                <InputError message={errors.classe} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="filiere" value="Filière" />
                                <TextInput id="filiere" value={data.filiere} className="mt-1 block w-full" placeholder="ex: Informatique" onChange={(e) => setData('filiere', e.target.value)} required />
                                <InputError message={errors.filiere} className="mt-2" />
                            </div>
                        </div>
                    </>
                )}

                {data.role === 'enseignant' && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="grade" value="Grade" />
                            <TextInput id="grade" value={data.grade} className="mt-1 block w-full" placeholder="ex: Professeur" onChange={(e) => setData('grade', e.target.value)} required />
                            <InputError message={errors.grade} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="specialite" value="Spécialité" />
                            <TextInput id="specialite" value={data.specialite} className="mt-1 block w-full" placeholder="ex: Génie logiciel" onChange={(e) => setData('specialite', e.target.value)} required />
                            <InputError message={errors.specialite} className="mt-2" />
                        </div>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-end">
                    <Link href={route('login')} className="rounded-md text-sm text-slate-600 underline hover:text-slate-900">Déjà inscrit ?</Link>
                    <PrimaryButton className="ms-4" disabled={processing}>Créer le compte</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
