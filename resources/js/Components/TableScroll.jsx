import { useEffect, useRef, useState } from 'react';

export default function TableScroll({ children, className = '' }) {
    const ref = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const update = () => {
        const el = ref.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 2);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };

    useEffect(() => {
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <div className="relative">
            <div ref={ref} onScroll={update} className={`overflow-x-auto ${className}`}>
                {children}
            </div>
            {canScrollLeft && (
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white/80 to-transparent" />
            )}
            {canScrollRight && (
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white/80 to-transparent" />
            )}
        </div>
    );
}
