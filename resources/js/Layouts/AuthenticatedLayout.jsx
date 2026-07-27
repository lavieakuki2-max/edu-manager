import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { Bell, BookOpenText, Briefcase, FileText, LayoutDashboard, LogOut, Menu, Settings, Shield, User as UserIcon, X } from 'lucide-react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard'), icon: LayoutDashboard },
        { label: 'Projets', href: route('projets.index'), active: route().current('projets.*') || route().current('admin.projets.*'), icon: Briefcase },
        { label: 'Documents', href: route('documents.index'), active: route().current('documents.*'), icon: FileText },
    ];

    const roleLabel = user.role === 'admin' ? 'Administration' : user.role === 'enseignant' ? 'Encadreur' : 'Etudiant';
    const roleAccent = user.role === 'admin' ? 'from-amber-400 to-orange-500' : user.role === 'enseignant' ? 'from-cyan-400 to-blue-500' : 'from-teal-400 to-emerald-500';

    const Navigation = ({ mobile = false }) => (
        <nav className={`flex-1 space-y-1 ${mobile ? 'px-3 py-5' : 'px-4 py-4'}`}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const Component = mobile ? ResponsiveNavLink : NavLink;

                return (
                    <Component key={item.label} href={item.href} active={item.active} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium">
                        <Icon size={18} className="shrink-0" />
                        {item.label}
                    </Component>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-screen text-slate-900">
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <button className="fixed inset-0 bg-slate-950/50" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu" />
                <aside className="fixed inset-y-0 left-0 flex w-80 flex-col border-r border-white/10 bg-slate-950 text-white shadow-2xl">
                    <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                        <Link href="/" className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-black text-slate-950">ED</span>
                            <div>
                                <div className="text-lg font-semibold leading-5">EduManager</div>
                                <div className="text-xs text-slate-400">UNILUK - Suivi academique</div>
                            </div>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="rounded-md p-2 text-slate-400 hover:bg-white/10" aria-label="Fermer">
                            <X size={20} />
                        </button>
                    </div>
                    <Navigation mobile />
                    <div className="mx-4 mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${roleAccent} text-slate-950`}>
                                <Shield size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{roleLabel}</p>
                                <p className="text-xs text-slate-400">{user.prenom} {user.nom}</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <aside className="fixed inset-y-0 left-0 hidden w-80 flex-col border-r border-white/10 bg-slate-950 text-white lg:flex">
                <div className="flex h-20 items-center border-b border-white/10 px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-black text-slate-950">ED</span>
                        <div>
                            <div className="text-lg font-semibold leading-5">EduManager</div>
                            <div className="text-xs text-slate-400">UNILUK - Plateforme de suivi</div>
                        </div>
                    </Link>
                </div>
                <Navigation />
                <div className="border-t border-white/10 p-5">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${roleAccent} text-slate-950`}>
                                <BookOpenText size={17} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{roleLabel}</p>
                                <p className="text-xs text-slate-400">Espace connecte</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-80">
                <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
                    <div className="flex min-h-16 items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/8 px-4 py-3 text-white">
                        <button onClick={() => setSidebarOpen(true)} className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-white transition hover:bg-white/15 lg:hidden" aria-label="Ouvrir le menu">
                            <Menu size={20} />
                        </button>
                        <div className="min-w-0 flex-1 px-3">{header}</div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-2xl border border-white/10 bg-white/10 p-2.5 text-white transition hover:bg-white/15" aria-label="Notifications">
                                <Bell size={18} />
                            </button>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 transition hover:bg-white/15">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-sm font-black text-slate-950">
                                            {user.nom?.charAt(0) ?? <UserIcon size={16} />}
                                        </span>
                                        <span className="hidden text-left text-sm md:block">
                                            <span className="block font-medium">{user.prenom} {user.nom}</span>
                                            <span className="block text-xs text-slate-300">{roleLabel}</span>
                                        </span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2"><Settings size={16} /> Profil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-600"><LogOut size={16} /> Deconnexion</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="edumanager-shell py-6 sm:py-8">{children}</main>
            </div>
        </div>
    );
}
