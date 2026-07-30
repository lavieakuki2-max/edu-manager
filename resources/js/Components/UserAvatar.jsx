import { User as UserIcon } from 'lucide-react';

export default function UserAvatar({ user, size = 'md', className = '' }) {
    const sizeMap = {
        xs: 'h-7 w-7 text-[10px]',
        sm: 'h-9 w-9 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-sm',
        xl: 'h-16 w-16 text-xl',
    };

    const imgSizeMap = {
        xs: 28,
        sm: 36,
        md: 40,
        lg: 48,
        xl: 64,
    };

    const iconSizeMap = {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
    };

    const sizeClass = sizeMap[size] || sizeMap.md;
    const imgSize = imgSizeMap[size] || imgSizeMap.md;
    const iconSize = iconSizeMap[size] || iconSizeMap.md;

    if (user?.photo_url) {
        return (
            <img
                src={user.photo_url}
                alt={`${user.prenom} ${user.nom}`}
                className={`${sizeClass} shrink-0 rounded-2xl object-cover ${className}`}
                style={{ width: imgSize, height: imgSize }}
            />
        );
    }

    return (
        <span className={`${sizeClass} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 font-bold text-white ${className}`}>
            {user?.prenom?.charAt(0) ?? <UserIcon size={iconSize} />}
        </span>
    );
}
