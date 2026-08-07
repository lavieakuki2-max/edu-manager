import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Briefcase, GraduationCap, Shield } from 'lucide-react';

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

    const quickLogin = (email, password) => {
        setData({ email, password, remember: false });
        setTimeout(() => {
            post(route('login'), {
                onFinish: () => reset('password'),
            });
        }, 50);
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-400">Bienvenue</p>
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
                        className="mt-1 block w-full border-white/10 bg-white/10 text-base text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 sm:text-sm"
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
                        className="mt-1 block w-full border-white/10 bg-white/10 text-base text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 sm:text-sm"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <label className="flex items-center gap-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="text-sm text-slate-300">Se souvenir de moi</span>
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-sm text-blue-400 hover:text-blue-300 transition">
                            Mot de passe oublié ?
                        </Link>
                    )}
                </div>

                <PrimaryButton className="w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/25" disabled={processing}>
                    Se connecter
                </PrimaryButton>

                <p className="text-center text-sm text-slate-400">
                    Pas encore de compte ?{' '}
                    <Link href={route('register')} className="font-medium text-blue-400 hover:text-blue-300 transition">
                        Créer un compte
                    </Link>
                </p>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-3 text-slate-400">Accès rapide (démo)</span></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => quickLogin('admin@uniluk.edu', 'password')}
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 hover:border-amber-400/40 sm:gap-2 sm:p-4"
                    >
                        <Shield size={20} className="text-amber-400" />
                        <span className="text-xs font-medium">Admin</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => quickLogin('ngoy@uniluk.edu', 'password')}
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 hover:border-blue-400/40 sm:gap-2 sm:p-4"
                    >
                        <GraduationCap size={20} className="text-blue-400" />
                        <span className="text-xs font-medium">Enseignant</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => quickLogin('kabongo@uniluk.edu', 'password')}
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 hover:border-emerald-400/40 sm:gap-2 sm:p-4"
                    >
                        <Briefcase size={20} className="text-emerald-400" />
                        <span className="text-xs font-medium">Étudiant</span>
                    </button>
                </div>
            </div>
        </GuestLayout>
    );
}
