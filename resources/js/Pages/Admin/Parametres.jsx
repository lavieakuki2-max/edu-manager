import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, router, usePage } from '@inertiajs/react';
import { Building2, CalendarDays, Image as ImageIcon, Save } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Parametres({ settings = {} }) {
    const { flash, errors: pageErrors } = usePage().props;
    const [logoPreview, setLogoPreview] = useState(settings.universite_logo || null);
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        universite_nom: settings.universite_nom || '',
        universite_sigle: settings.universite_sigle || '',
        faculte: settings.faculte || '',
        ministere_tutelle: settings.ministere_tutelle || '',
        pays: settings.pays || '',
        ville: settings.ville || '',
        devise: settings.devise || '',
        annee_academique_active: settings.annee_academique_active || '',
        annee_execution: settings.annee_execution || '',
    });

    const [processing, setProcessing] = useState(false);

    const updateField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const onLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const data = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== '') data.append(key, value);
        });
        if (fileRef.current?.files?.[0]) {
            data.append('universite_logo', fileRef.current.files[0]);
        }
        data.append('_method', 'PATCH');

        router.post(route('admin.parametres.update'), data, {
            preserveScroll: true,
            onSuccess: () => setProcessing(false),
            onFinish: () => setProcessing(false),
        });
    };

    const inputClass = 'mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-white sm:text-2xl">Configuration institutionnelle</h2>
                    <p className="text-sm text-slate-300">Identité de l'université et paramètres de l'année académique</p>
                </div>
            }
        >
            <Head title="Paramètres institutionnels" />
            <div className="mx-auto max-w-4xl space-y-6">
                {flash?.success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{flash.success}</div>}
                {pageErrors?.error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{pageErrors.error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white"><Building2 size={18} /></span>
                            <div>
                                <h3 className="text-base font-semibold text-slate-800">Identité institutionnelle</h3>
                                <p className="text-xs text-slate-400">Affiché dans les en-têtes de l'interface et tous les documents générés</p>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="universite_nom" value="Nom de l'université" />
                                <TextInput id="universite_nom" className={inputClass} value={form.universite_nom} onChange={updateField('universite_nom')} />
                            </div>
                            <div>
                                <InputLabel htmlFor="universite_sigle" value="Sigle" />
                                <TextInput id="universite_sigle" className={inputClass} value={form.universite_sigle} onChange={updateField('universite_sigle')} placeholder="Ex : UNILUK" />
                            </div>
                            <div>
                                <InputLabel htmlFor="faculte" value="Faculté" />
                                <TextInput id="faculte" className={inputClass} value={form.faculte} onChange={updateField('faculte')} />
                            </div>
                            <div>
                                <InputLabel htmlFor="ministere_tutelle" value="Ministère de tutelle" />
                                <TextInput id="ministere_tutelle" className={inputClass} value={form.ministere_tutelle} onChange={updateField('ministere_tutelle')} />
                            </div>
                            <div>
                                <InputLabel htmlFor="pays" value="Pays" />
                                <TextInput id="pays" className={inputClass} value={form.pays} onChange={updateField('pays')} />
                            </div>
                            <div>
                                <InputLabel htmlFor="ville" value="Ville" />
                                <TextInput id="ville" className={inputClass} value={form.ville} onChange={updateField('ville')} />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="devise" value="Devise" />
                                <TextInput id="devise" className={inputClass} value={form.devise} onChange={updateField('devise')} placeholder="Ex : La science au service de l'homme" />
                            </div>
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="universite_logo" value="Logo (PNG, JPG, SVG — 2 Mo max)" />
                                <div className="mt-1 flex items-center gap-4">
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                        {logoPreview ? (
                                            <img src={logoPreview.startsWith('blob') || logoPreview.startsWith('data') ? logoPreview : `/storage/${logoPreview}`} alt="Logo" className="h-full w-full object-contain" />
                                        ) : (
                                            <ImageIcon size={28} className="text-slate-300" />
                                        )}
                                    </div>
                                    <label className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                                        Choisir un fichier
                                        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml" className="hidden" onChange={onLogoChange} />
                                    </label>
                                </div>
                                <InputError message={pageErrors?.universite_logo} className="mt-2" />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white"><CalendarDays size={18} /></span>
                            <div>
                                <h3 className="text-base font-semibold text-slate-800">Année académique / d'exécution</h3>
                                <p className="text-xs text-slate-400">Calculée automatiquement ; laissez vide pour conserver le calcul automatique</p>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="annee_academique_active" value="Année académique (surcharge)" />
                                <TextInput id="annee_academique_active" className={inputClass} value={form.annee_academique_active} onChange={updateField('annee_academique_active')} placeholder="Ex : 2025-2026" />
                                <InputError message={pageErrors?.annee_academique_active} className="mt-2" />
                                <p className="mt-1 text-xs text-slate-400">Auto : {settings.annee_academique}</p>
                            </div>
                            <div>
                                <InputLabel htmlFor="annee_execution" value="Année d'exécution (surcharge)" />
                                <TextInput id="annee_execution" className={inputClass} value={form.annee_execution} onChange={updateField('annee_execution')} placeholder="Ex : 2026" />
                                <InputError message={pageErrors?.annee_execution} className="mt-2" />
                                <p className="mt-1 text-xs text-slate-400">Auto : {settings.annee_execution}</p>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end">
                        <PrimaryButton type="submit" disabled={processing} className="inline-flex items-center gap-2">
                            <Save size={16} />
                            {processing ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
