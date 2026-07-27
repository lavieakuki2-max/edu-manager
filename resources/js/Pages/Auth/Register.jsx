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
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="prenom" value="Prénom" />
                    <TextInput id="prenom" value={data.prenom} className="mt-1 block w-full" autoComplete="given-name" isFocused onChange={(e) => setData('prenom', e.target.value)} required />
                    <InputError message={errors.prenom} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="nom" value="Nom" />
                    <TextInput id="nom" value={data.nom} className="mt-1 block w-full" autoComplete="family-name" onChange={(e) => setData('nom', e.target.value)} required />
                    <InputError message={errors.nom} className="mt-2" />
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

                <div className="mt-4 flex items-center justify-end">
                    <Link href={route('login')} className="rounded-md text-sm text-slate-600 underline hover:text-slate-900">Déjà inscrit ?</Link>
                    <PrimaryButton className="ms-4" disabled={processing}>Créer le compte</PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
