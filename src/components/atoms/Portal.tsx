import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
}

export function Portal({ children }: PortalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => {
            clearTimeout(timer);
            setMounted(false);
        };
    }, []);

    return mounted ? createPortal(children, document.body) : null;
}
