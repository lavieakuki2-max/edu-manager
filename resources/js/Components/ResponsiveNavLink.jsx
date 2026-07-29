import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none ${
                active
                    ? 'bg-white/15 text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
