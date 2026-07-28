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

    const inputClass = "mt-1 block w-full rounded-xl border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-teal-400 focus:bg-white/15 focus:ring-4 focus:ring-teal-400/20";
    const labelClass = "block text-sm font-medium text-slate-300";

    return (
        <GuestLayout>
            <Head title="Inscription" />
            <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-teal-400">Nouveau compte</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Créez votre espace</h1>
                <p className="mt-2 text-sm text-slate-300">Rejoignez la plateforme UNILUK.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="prenom" value="Prénom" className={labelClass} />
                        <TextInput id="prenom" value={data.prenom} className={inputClass} autoComplete="given-name" isFocused onChange={(e) => setData('prenom', e.target.value)} required />
                        <InputError message={errors.prenom} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="nom" value="Nom" className={labelClass} />
                        <TextInput id="nom" value={data.nom} className={inputClass} autoComplete="family-name" onChange={(e) => setData('nom', e.target.value)} required />
                        <InputError message={errors.nom} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className={labelClass} />
                    <TextInput id="email" type="email" value={data.email} className={inputClass} autoComplete="username" onChange={(e) => setData('email', e.target.value)} required />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" className={labelClass} />
                    <TextInput id="password" type="password" value={data.password} className={inputClass} autoComplete="new-password" onChange={(e) => setData('password', e.target.value)} required />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" className={labelClass} />
                    <TextInput id="password_confirmation" type="password" value={data.password_confirmation} className={inputClass} autoComplete="new-password" onChange={(e) => setData('password_confirmation', e.target.value)} required />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="role" value="Je suis" className={labelClass} />
                    <select id="role" value={data.role} onChange={(e) => setData('role', e.target.value)} className="mt-1 block w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white shadow-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20">
                        <option value="etudiant" className="text-slate-900">Étudiant</option>
                        <option value="enseignant" className="text-slate-900">Enseignant</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                {data.role === 'etudiant' && (
                    <>
                        <div>
                            <InputLabel htmlFor="matricule" value="Matricule" className={labelClass} />
                            <TextInput id="matricule" value={data.matricule} className={inputClass} onChange={(e) => setData('matricule', e.target.value)} required />
                            <InputError message={errors.matricule} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="classe" value="Classe" className={labelClass} />
                                <TextInput id="classe" value={data.classe} className={inputClass} placeholder="ex: L2" onChange={(e) => setData('classe', e.target.value)} required />
                                <InputError message={errors.classe} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="filiere" value="Filière" className={labelClass} />
                                <TextInput id="filiere" value={data.filiere} className={inputClass} placeholder="ex: Informatique" onChange={(e) => setData('filiere', e.target.value)} required />
                                <InputError message={errors.filiere} className="mt-2" />
                            </div>
                        </div>
                    </>
                )}

                {data.role === 'enseignant' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="grade" value="Grade" className={labelClass} />
                            <TextInput id="grade" value={data.grade} className={inputClass} placeholder="ex: Professeur" onChange={(e) => setData('grade', e.target.value)} required />
                            <InputError message={errors.grade} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="specialite" value="Spécialité" className={labelClass} />
                            <TextInput id="specialite" value={data.specialite} className={inputClass} placeholder="ex: Génie logiciel" onChange={(e) => setData('specialite', e.target.value)} required />
                            <InputError message={errors.specialite} className="mt-2" />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2">
                    <Link href={route('login')} className="text-sm text-teal-400 hover:text-teal-300 transition">Déjà inscrit ?</Link>
                    <PrimaryButton className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-500 transition shadow-lg shadow-teal-600/25" disabled={processing}>
                        Créer le compte
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
