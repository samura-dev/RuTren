import { type ReactNode } from 'react';
import { ModalOverlay } from '../atoms/ModalOverlay';
import { SectionTitle } from '../atoms/Typography';
import { X } from 'lucide-react';
import styles from './Modal.module.css';
import { cn } from '@/utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClose={onClose}>
            <div className={cn(styles.modal, className)} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    {title && <SectionTitle className={styles.title}>{title}</SectionTitle>}
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </ModalOverlay>
    );
}
