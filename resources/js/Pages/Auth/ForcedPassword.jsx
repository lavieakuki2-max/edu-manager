import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, ShieldCheck } from 'lucide-react';

export default function ForcedPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.force.update'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClass = "mt-1 block w-full rounded-xl border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder-slate-400 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white/15 focus:ring-4 focus:ring-blue-400/20 sm:text-sm";
    const labelClass = "block text-sm font-medium text-slate-300";

    return (
        <GuestLayout>
            <Head title="Changer votre mot de passe" />

            <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-600/25">
                    <KeyRound size={22} />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-amber-400">Sécurité</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Changer votre mot de passe</h1>
                <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-300">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                    Pour des raisons de sécurité, vous devez remplacer le mot de passe par défaut avant de continuer.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="current_password" value="Mot de passe actuel" className={labelClass} />
                    <TextInput
                        id="current_password"
                        type="password"
                        value={data.current_password}
                        className={inputClass}
                        autoComplete="current-password"
                        isFocused
                        onChange={(e) => setData('current_password', e.target.value)}
                        required
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Nouveau mot de passe" className={labelClass} />
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        className={inputClass}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le nouveau mot de passe" className={labelClass} />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        className={inputClass}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <PrimaryButton
                    className="w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/25"
                    disabled={processing}
                >
                    Mettre à jour et continuer
                </PrimaryButton>
            </form>
        </GuestLayout>
    );
}
