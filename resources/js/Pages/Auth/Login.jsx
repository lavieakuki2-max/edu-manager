import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-teal-400">Bienvenue</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Connectez-vous</h1>
                <p className="mt-2 text-sm text-slate-300">Retrouvez le suivi de vos projets académiques.</p>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-3 text-sm font-medium text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Adresse e-mail" className="text-slate-300" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-white/10 bg-white/10 text-white placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400/20"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Mot de passe" className="text-slate-300" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-white/10 bg-white/10 text-white placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400/20"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="text-sm text-slate-300">Se souvenir de moi</span>
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-sm text-teal-400 hover:text-teal-300 transition">
                            Mot de passe oublié ?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full justify-center rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-500 transition shadow-lg shadow-teal-600/25" disabled={processing}>
                    Se connecter
                </PrimaryButton>

                <p className="text-center text-sm text-slate-400">
                    Pas encore de compte ?{' '}
                    <Link href={route('register')} className="font-medium text-teal-400 hover:text-teal-300 transition">
                        Créer un compte
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
