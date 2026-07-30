import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    BarChart3, BookOpen, GraduationCap, CheckCircle, Clock, Send, CalendarRange,
    AlertCircle, FileText, Download, Printer, Search, Briefcase, Users, Building2,
    FileCheck, ScrollText, UserCheck, PieChart, FileDown, FileSpreadsheet, Eye,
} from 'lucide-react';

const statusColors = {
    'Validé': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'En Cours': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Sujet Soumis': 'bg-amber-50 text-amber-700 border border-amber-200',
    'À Corriger': 'bg-red-50 text-red-700 border border-red-200',
    'Prêt pour Soutenance': 'bg-purple-50 text-purple-700 border border-purple-200',
};

const categorie1 = [
    {
        id: 'lettres',
        titre: 'Lettre de Recommandation de Stage',
        desc: 'Générée automatiquement avec les infos étudiant, université et entreprise.',
        icon: ScrollText,
        pdfUrl: (annee) => `${route('admin.pdf.lettres-recommandation')}?annee=${annee}`,
        wordUrl: (annee) => `${route('admin.pdf.lettres-recommandation.word')}?annee=${annee}`,
        tone: 'from-amber-500 to-orange-600',
    },
    {
        id: 'attestation',
        titre: 'Attestation de Validation / Quitus',
        desc: 'Attestation de validation de sujet et autorisation de soutenance.',
        icon: FileCheck,
        pdfUrl: null,
        wordUrl: null,
        tone: 'from-emerald-500 to-emerald-600',
        needsProjet: true,
    },
    {
        id: 'cotation',
        titre: 'Grille de Cotation & Évaluation',
        desc: 'Fiche d\'évaluation de soutenance avec critères, note et mention.',
        icon: FileText,
        pdfUrl: null,
        wordUrl: null,
        tone: 'from-purple-500 to-violet-600',
        needsProjet: true,
    },
    {
        id: 'pv',
        titre: 'Procès-Verbal de Soutenance',
        desc: 'PV officiel avec composition du jury, note, mention et remarques.',
        icon: ScrollText,
        pdfUrl: null,
        wordUrl: null,
        tone: 'from-indigo-500 to-blue-600',
        needsProjet: true,
    },
];

const categorie2 = [
    {
        id: 'statistique',
        titre: 'Rapport Statistique Annuel',
        desc: 'Bilan des stages, mémoires, taux de réussite et répartition.',
        icon: PieChart,
        pdfUrl: (annee) => `${route('admin.pdf.statistique')}?annee=${annee}`,
        wordUrl: (annee) => `${route('admin.pdf.statistique.word')}?annee=${annee}`,
        tone: 'from-emerald-500 to-emerald-600',
    },
    {
        id: 'etudiants',
        titre: 'Liste des Projets Validés',
        desc: 'Tableau récapitulatif des étudiants et sujets validés.',
        icon: UserCheck,
        pdfUrl: (annee) => `${route('admin.pdf.etudiants-valides')}?annee=${annee}`,
        wordUrl: (annee) => `${route('admin.pdf.etudiants-valides.word')}?annee=${annee}`,
        tone: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'repartition',
        titre: 'Répartition par Enseignant',
        desc: 'Charge de travail et liste des étudiants par encadreur.',
        icon: Users,
        pdfUrl: (annee) => `${route('admin.pdf.repartition-enseignants')}?annee=${annee}`,
        wordUrl: (annee) => `${route('admin.pdf.repartition-enseignants.word')}?annee=${annee}`,
        tone: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'entreprises',
        titre: 'Annuaire des Entreprises',
        desc: 'Liste des entreprises partenaires avec stagiaires reçus.',
        icon: Building2,
        pdfUrl: (annee) => `${route('admin.pdf.annuaire-entreprises')}?annee=${annee}`,
        wordUrl: (annee) => `${route('admin.pdf.annuaire-entreprises.word')}?annee=${annee}`,
        tone: 'from-rose-500 to-pink-600',
    },
];

export default function Rapports({ projets = [], documents = [], stats = {} }) {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatut, setFilterStatut] = useState('all');
    const [annee, setAnnee] = useState('2025-2026');
    const [selectedProjet, setSelectedProjet] = useState('');

    const filtered = projets.filter((p) => {
        if (filterType !== 'all' && p.type !== filterType) return false;
        if (filterStatut !== 'all' && p.statut_actuel !== filterStatut) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                (p.titre || '').toLowerCase().includes(q) ||
                (p.etudiant?.user?.prenom || '').toLowerCase().includes(q) ||
                (p.etudiant?.user?.nom || '').toLowerCase().includes(q) ||
                (p.etudiant?.matricule || '').toLowerCase().includes(q)
            );
        }
        return true;
    });

    const kpiCards = [
        { label: 'Total projets', sub: `${stats.stages || 0} stages / ${stats.memoires || 0} memoires`, value: stats.total_projets || projets.length, icon: BookOpen, tone: 'from-slate-500 to-slate-600' },
        { label: 'Taux de réussite', sub: `${stats.valides || 0} valides`, value: `${stats.taux_reussite || 0}%`, icon: CheckCircle, tone: 'from-emerald-500 to-green-500' },
        { label: 'Soutenances', sub: `${stats.soutenances_planifiees || 0} planifiées / ${stats.soutenances_effectuees || 0} effectuées`, value: (stats.soutenances_planifiees || 0), icon: CalendarRange, tone: 'from-amber-500 to-amber-600' },
        { label: 'Étudiants / Enseignant', sub: `Moyenne par encadreur`, value: stats.moyenne_etudiants_par_enseignant || 0, icon: Users, tone: 'from-violet-500 to-violet-600' },
    ];

    const openPdfPreview = (url) => {
        window.open(url + '&mode=preview', '_blank');
    };

    const renderDocButtons = (doc, annee) => {
        if (!doc.pdfUrl) return null;
        const pdfUrl = doc.pdfUrl(annee);
        const wordUrl = doc.wordUrl?.(annee);
        return (
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="soft-button soft-button-primary text-xs flex-1 justify-center">
                    <FileDown size={13} /> PDF
                </a>
                {wordUrl && (
                    <a href={wordUrl} className="soft-button bg-blue-600 text-white hover:bg-blue-700 shadow-xs text-xs flex-1 justify-center">
                        <FileSpreadsheet size={13} /> Word
                    </a>
                )}
                <button onClick={() => openPdfPreview(pdfUrl)} className="soft-button soft-button-secondary text-xs flex-1 justify-center">
                    <Eye size={13} /> Aperçu
                </button>
            </div>
        );
    };

    const renderProjetDocButtons = (docId, annee) => {
        const pid = selectedProjet || '__none__';
        const pdfUrl = route(docId, pid) + `?annee=${annee}`;
        return (
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="soft-button soft-button-primary text-xs flex-1 justify-center">
                    <FileDown size={13} /> PDF
                </a>
                <button onClick={() => openPdfPreview(pdfUrl)} className="soft-button soft-button-secondary text-xs flex-1 justify-center">
                    <Eye size={13} /> Aperçu
                </button>
            </div>
        );
    };

    return (
        <AuthenticatedLayout header={<h1 className="truncate text-xl font-semibold text-white">Rapports & Statistiques</h1>}>
            <Head title="Rapports" />
            <div className="space-y-6">
                <section className="glass-card overflow-hidden p-6 text-white">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="status-pill bg-white/10 text-white/90 mb-3 inline-flex">{projets.length} projet{projets.length !== 1 ? 's' : ''}</span>
                            <h2 className="text-2xl font-semibold tracking-tight">Rapports & Statistiques</h2>
                            <p className="mt-1 max-w-xl text-sm text-slate-200/80">Consultez, générez et exportez tous les documents officiels aux formats PDF et Word.</p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className="panel-card p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="panel-title">{card.label}</p>
                                        <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
                                        <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg ${card.tone}`}><Icon size={22} /></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="panel-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-700">Taux de réussite global</h3>
                        <span className="text-sm font-bold text-emerald-600">{stats.taux_reussite || 0}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500" style={{ width: `${stats.taux_reussite || 0}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{stats.valides || 0} validé(s) sur {projets.length} projet(s)</p>
                </div>

                <section className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-slate-950">Documents Administratifs et Officiels</h2>
                                <p className="mt-1 text-sm text-slate-500">Lettres, attestations, fiches d'évaluation et PV de soutenance.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-medium text-slate-600">Année :</label>
                                <select className="soft-input w-40" value={annee} onChange={(e) => setAnnee(e.target.value)}>
                                    <option value="2024-2025">2024-2025</option>
                                    <option value="2025-2026">2025-2026</option>
                                    <option value="2026-2027">2026-2027</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                        {categorie1.map((doc) => {
                            const Icon = doc.icon;
                            return (
                                <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className={`rounded-xl bg-gradient-to-br p-2.5 text-white shadow ${doc.tone}`}><Icon size={20} /></div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-semibold text-slate-900">{doc.titre}</h3>
                                            <p className="mt-1 text-xs text-slate-500">{doc.desc}</p>
                                        </div>
                                    </div>
                                    {doc.needsProjet ? (
                                        <>
                                            <div className="mt-3">
                                                <select className="soft-input text-xs" value={selectedProjet} onChange={(e) => setSelectedProjet(e.target.value)}>
                                                    <option value="">Sélectionner un projet</option>
                                                    {projets.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.titre} — {p.etudiant?.user?.prenom} {p.etudiant?.user?.nom}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {selectedProjet && (
                                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                                    {doc.id === 'cotation' && (
                                                        <>
                                                            <a href={`/admin/rapports/grille-cotation/${selectedProjet}?annee=${annee}`} target="_blank" className="soft-button soft-button-primary text-xs flex-1 justify-center">
                                                                <FileDown size={13} /> PDF
                                                            </a>
                                                            <button onClick={() => window.open(`/admin/rapports/grille-cotation/${selectedProjet}?annee=${annee}&mode=preview`, '_blank')} className="soft-button soft-button-secondary text-xs flex-1 justify-center">
                                                                <Eye size={13} /> Aperçu
                                                            </button>
                                                        </>
                                                    )}
                                                    {doc.id === 'attestation' && (
                                                        <>
                                                            <a href={`/admin/rapports/attestation/${selectedProjet}?annee=${annee}`} target="_blank" className="soft-button soft-button-primary text-xs flex-1 justify-center">
                                                                <FileDown size={13} /> PDF
                                                            </a>
                                                            <button onClick={() => window.open(`/admin/rapports/attestation/${selectedProjet}?annee=${annee}&mode=preview`, '_blank')} className="soft-button soft-button-secondary text-xs flex-1 justify-center">
                                                                <Eye size={13} /> Aperçu
                                                            </button>
                                                        </>
                                                    )}
                                                    {doc.id === 'pv' && (
                                                        <>
                                                            <a href={`/admin/rapports/pv-soutenance/${selectedProjet}?annee=${annee}`} target="_blank" className="soft-button soft-button-primary text-xs flex-1 justify-center">
                                                                <FileDown size={13} /> PDF
                                                            </a>
                                                            <button onClick={() => window.open(`/admin/rapports/pv-soutenance/${selectedProjet}?annee=${annee}&mode=preview`, '_blank')} className="soft-button soft-button-secondary text-xs flex-1 justify-center">
                                                                <Eye size={13} /> Aperçu
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        renderDocButtons(doc, annee)
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <h2 className="text-base font-semibold text-slate-950">Rapports Académiques & Statistiques</h2>
                        <p className="mt-1 text-sm text-slate-500">Bilans annuels, listes officielles, répartition et annuaire.</p>
                    </div>
                    <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                        {categorie2.map((doc) => {
                            const Icon = doc.icon;
                            return (
                                <div key={doc.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className={`rounded-xl bg-gradient-to-br p-2.5 text-white shadow ${doc.tone}`}><Icon size={20} /></div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-semibold text-slate-900">{doc.titre}</h3>
                                            <p className="mt-1 text-xs text-slate-500">{doc.desc}</p>
                                        </div>
                                    </div>
                                    {renderDocButtons(doc, annee)}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <h2 className="text-base font-semibold text-slate-950">Livrables et Fichiers Déposés</h2>
                        <p className="mt-1 text-sm text-slate-500">Mémoires, rapports de stage et documents déposés par les étudiants.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                    <th className="px-5 py-3 font-semibold text-slate-600">Document</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Auteur</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Projet</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Date</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Téléchargement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="transition hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-red-50 p-2 text-red-600"><FileText size={16} /></div>
                                                <div>
                                                    <p className="font-medium text-slate-950">{doc.titre_fichier}</p>
                                                    <p className="text-xs text-slate-400">v{doc.version}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{doc.auteur?.prenom} {doc.auteur?.nom}</td>
                                        <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{doc.projet?.titre || '-'}</td>
                                        <td className="px-5 py-3 text-slate-600">{doc.date_depot ? new Date(doc.date_depot).toLocaleDateString('fr-FR') : '-'}</td>
                                        <td className="px-5 py-3">
                                            <a href={route('documents.download', doc.id)} className="soft-button soft-button-secondary text-xs">
                                                <Download size={13} /> Télécharger
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                {documents.length === 0 && (
                                    <tr><td colSpan={5} className="px-5 py-16 text-center"><FileText className="mx-auto text-slate-300" size={40} /><p className="mt-4 text-sm font-medium text-slate-500">Aucun document déposé.</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="panel-card overflow-hidden">
                    <div className="border-b border-slate-200/80 p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-base font-semibold text-slate-950">Liste des projets</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input className="soft-input pl-9 text-xs" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                                <select className="soft-input text-xs" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    <option value="all">Tous types</option>
                                    <option value="Stage">Stage</option>
                                    <option value="Memoire">Mémoire</option>
                                    <option value="Projet_Tutore">Projet Tutoré</option>
                                </select>
                                <select className="soft-input text-xs" value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
                                    <option value="all">Tous statuts</option>
                                    <option value="Sujet Soumis">Soumis</option>
                                    <option value="En Cours">En Cours</option>
                                    <option value="À Corriger">À Corriger</option>
                                    <option value="Prêt pour Soutenance">Prêt</option>
                                    <option value="Validé">Validé</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200/80 bg-slate-50/50">
                                    <th className="px-5 py-3 font-semibold text-slate-600">Étudiant</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Titre</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Type</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Encadreur</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Statut</th>
                                    <th className="px-5 py-3 font-semibold text-slate-600">Documents</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="transition hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <div>
                                                <p className="font-medium text-slate-950">{p.etudiant?.user?.prenom} {p.etudiant?.user?.nom}</p>
                                                <p className="text-xs text-slate-400">{p.etudiant?.matricule}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{p.titre || '-'}</td>
                                        <td className="px-5 py-3"><span className="status-pill bg-slate-100 text-slate-600 text-xs">{p.type === 'Projet_Tutore' ? 'Projet Tutoré' : p.type}</span></td>
                                        <td className="px-5 py-3 text-slate-600 text-xs">{p.enseignant?.user?.prenom} {p.enseignant?.user?.nom}</td>
                                        <td className="px-5 py-3">
                                            <span className={`status-pill text-xs ${statusColors[p.statut_actuel] || 'bg-slate-100 text-slate-600'}`}>{p.statut_actuel}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                {p.type === 'Stage' && (
                                                    <a href={route('admin.pdf.lettre-stage', p.id)} target="_blank" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50">
                                                        <FileText size={12} /> Lettre
                                                    </a>
                                                )}
                                                {(p.statut_actuel === 'Validé' || p.soutenance) && (
                                                    <a href={`/admin/rapports/grille-cotation/${p.id}`} target="_blank" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-violet-600 hover:bg-violet-50">
                                                        <FileCheck size={12} /> Fiche
                                                    </a>
                                                )}
                                                {p.soutenance && (
                                                    <a href={`/admin/rapports/pv-soutenance/${p.id}`} target="_blank" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50">
                                                        <FileText size={12} /> PV
                                                    </a>
                                                )}
                                                <a href={`/admin/rapports/attestation/${p.id}`} target="_blank" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50">
                                                    <FileCheck size={12} /> Attest.
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={6} className="px-5 py-16 text-center"><BarChart3 className="mx-auto text-slate-300" size={40} /><p className="mt-4 text-sm font-medium text-slate-500">Aucun projet trouvé.</p></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
