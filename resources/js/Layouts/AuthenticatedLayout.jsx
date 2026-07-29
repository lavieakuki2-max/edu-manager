import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import UserAvatar from '@/Components/UserAvatar';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, BookOpenText, Briefcase, Building2, CheckCheck, ClipboardList, FileText, GraduationCap, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, Shield, Users, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const flash = usePage().props.flash;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(usePage().props.unreadNotifications || 0);
    const [toast, setToast] = useState(null);
    const notifRef = useRef(null);

    useEffect(() => {
        if (flash?.success) { setToast({ type: 'success', message: flash.success }); setTimeout(() => setToast(null), 4000); }
        if (flash?.error) { setToast({ type: 'error', message: flash.error }); setTimeout(() => setToast(null), 4000); }
    }, [flash]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (notifOpen) {
            fetch(route('notifications.index'))
                .then((r) => r.json())
                .then((data) => {
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.unread_count || 0);
                })
                .catch(() => {});
        }
    }, [notifOpen]);

    const markAsRead = useCallback((notif) => {
        if (!notif.est_lu) {
            fetch(route('notifications.markAsRead', notif.id), { method: 'PATCH' })
                .then((r) => r.json())
                .then((data) => {
                    setUnreadCount(data.unread_count || 0);
                    setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, est_lu: true } : n));
                })
                .catch(() => {});
        }
        if (notif.lien_url) {
            setNotifOpen(false);
            router.visit(notif.lien_url);
        }
    }, []);

    const markAllAsRead = useCallback(() => {
        fetch(route('notifications.markAllAsRead'), { method: 'PATCH' })
            .then((r) => r.json())
            .then((data) => {
                setUnreadCount(data.unread_count || 0);
                setNotifications((prev) => prev.map((n) => ({ ...n, est_lu: true })));
            })
            .catch(() => {});
    }, []);

    const navItems = [];

    if (user.role === 'admin') {
        navItems.push(
            { label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard'), icon: LayoutDashboard },
            { label: 'Utilisateurs', href: route('admin.users.index'), active: route().current('admin.users.*'), icon: Users },
            { label: 'Projets', href: route('admin.projets.index'), active: route().current('admin.projets.*') || route().current('admin.projets.*'), icon: Briefcase },
            { label: 'Soutenances', href: route('admin.soutenances.index'), active: route().current('admin.soutenances.*'), icon: GraduationCap },
            { label: 'Entreprises', href: route('admin.entreprises.index'), active: route().current('admin.entreprises.*'), icon: Building2 },
            { label: 'Rapports', href: route('admin.rapports'), active: route().current('admin.rapports'), icon: FileText },
            { label: 'Parametres', href: route('profile.edit'), active: route().current('profile.*'), icon: Settings },
        );
    } else if (user.role === 'enseignant') {
        navItems.push(
            { label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard'), icon: LayoutDashboard },
            { label: 'Mes Etudiants', href: route('enseignant.etudiants'), active: route().current('enseignant.etudiants'), icon: Users },
            { label: 'Projets Suivis', href: route('projets.index'), active: route().current('projets.*'), icon: ClipboardList },
            { label: 'Commentaires', href: route('enseignant.commentaires'), active: route().current('enseignant.commentaires'), icon: MessageSquare },
            { label: 'Soutenances', href: route('enseignant.soutenances'), active: route().current('enseignant.soutenances'), icon: GraduationCap },
            { label: 'Documents', href: route('documents.index'), active: route().current('documents.*'), icon: FileText },
            { label: 'Parametres', href: route('profile.edit'), active: route().current('profile.*'), icon: Settings },
        );
    } else {
        navItems.push(
            { label: 'Dashboard', href: route('dashboard'), active: route().current('dashboard'), icon: LayoutDashboard },
            { label: 'Mon Projet', href: route('projets.index'), active: route().current('projets.*'), icon: Briefcase },
            { label: 'Documents', href: route('documents.index'), active: route().current('documents.*'), icon: FileText },
            { label: 'Discussions', href: route('etudiant.discussions'), active: route().current('etudiant.discussions'), icon: MessageSquare },
            { label: 'Ma Soutenance', href: route('etudiant.soutenance'), active: route().current('etudiant.soutenance'), icon: GraduationCap },
            { label: 'Parametres', href: route('profile.edit'), active: route().current('profile.*'), icon: Settings },
        );
    }

    const roleLabel = user.role === 'admin' ? 'Administration' : user.role === 'enseignant' ? 'Encadreur' : 'Etudiant';
    const roleAccent = user.role === 'admin' ? 'from-amber-400 to-orange-500' : user.role === 'enseignant' ? 'from-blue-400 to-indigo-500' : 'from-emerald-400 to-teal-500';

    const Navigation = ({ mobile = false }) => (
        <nav className={`flex-1 space-y-1 ${mobile ? 'px-3 py-5' : 'px-4 py-6'}`}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const Component = mobile ? ResponsiveNavLink : NavLink;
                return (
                    <Component key={item.label} href={item.href} active={item.active} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200">
                        <Icon size={18} className="shrink-0" />
                        {item.label}
                    </Component>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-700">
            {toast && (
                <div className={`fixed top-4 right-4 z-[100] rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.message}
                </div>
            )}

            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <button className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                <aside className="fixed inset-y-0 left-0 flex w-80 flex-col border-r border-white/10 bg-slate-950 text-white shadow-2xl">
                    <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                        <Link href="/" className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/30">ED</span>
                            <div>
                                <div className="text-lg font-semibold leading-5">EduManager</div>
                                <div className="text-xs text-slate-400">UNILUK — Plateforme academique</div>
                            </div>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/10"><X size={20} /></button>
                    </div>
                    <Navigation mobile />
                    <div className="mx-4 mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${roleAccent} text-white`}><Shield size={16} /></div>
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
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/30">ED</span>
                        <div>
                            <div className="text-lg font-semibold leading-5">EduManager</div>
                            <div className="text-xs text-slate-400">UNILUK — Plateforme academique</div>
                        </div>
                    </Link>
                </div>
                <Navigation />
                <div className="border-t border-white/10 p-5">
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-4">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${roleAccent} text-white shadow-lg`}><BookOpenText size={17} /></div>
                            <div>
                                <p className="text-sm font-semibold">{roleLabel}</p>
                                <p className="text-xs text-slate-400">Connecte en tant que</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="lg:pl-80">
                <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
                    <div className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white shadow-lg shadow-black/5">
                        <button onClick={() => setSidebarOpen(true)} className="rounded-xl border border-white/10 bg-white/10 p-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:scale-105 lg:hidden"><Menu size={20} /></button>
                        <div className="min-w-0 flex-1 px-3">{header}</div>
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={notifRef}>
                                <button onClick={() => setNotifOpen(!notifOpen)} className="relative rounded-xl border border-white/10 bg-white/10 p-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:scale-105">
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>
                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-96 rounded-2xl border border-slate-200 bg-white shadow-soft-lg z-50">
                                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                            <p className="text-sm font-semibold text-slate-800">Notifications {unreadCount > 0 && <span className="ml-1 text-xs font-normal text-slate-400">({unreadCount} non lue{unreadCount > 1 ? 's' : ''})</span>}</p>
                                            <div className="flex items-center gap-2">
                                                {unreadCount > 0 && (
                                                    <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors">
                                                        <CheckCheck size={14} /> Tout marquer lu
                                                    </button>
                                                )}
                                                <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <p className="px-4 py-8 text-center text-sm text-slate-400">Aucune notification</p>
                                            ) : notifications.map((n) => (
                                                <button
                                                    key={n.id}
                                                    onClick={() => markAsRead(n)}
                                                    className={`w-full border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50 ${!n.est_lu ? 'bg-blue-50/50' : ''}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {!n.est_lu && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                                                        <div className="min-w-0 flex-1">
                                                            <p className={`text-xs font-semibold ${!n.est_lu ? 'text-slate-900' : 'text-slate-600'}`}>{n.titre}</p>
                                                            <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                                            <p className="mt-1 text-[10px] text-slate-400">{new Date(n.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2 transition-all duration-200 hover:bg-white/20">
                                        <UserAvatar user={user} size="md" />
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
