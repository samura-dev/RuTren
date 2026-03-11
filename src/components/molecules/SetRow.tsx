import { motion, type PanInfo, useAnimation } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Checkbox } from '../atoms/Checkbox';
import { Caption } from '../atoms/Typography';
import styles from './SetRow.module.css';
import { cn } from '@/utils/cn';

type SetRowProps = {
    setNumber: number;
    weight: string;
    reps: string;
    isCompleted: boolean;
    onDelete?: () => void;
    onUpdate?: (field: 'weight' | 'reps' | 'isCompleted', value: string | boolean) => void;
    showCheckbox?: boolean;
}

export function SetRow({ setNumber, weight, reps, isCompleted, onDelete, onUpdate, showCheckbox = true }: SetRowProps) {
    const controls = useAnimation();

    const handleDragEnd = async (_: any, info: PanInfo) => {
        if (info.offset.x < -80 && onDelete) {
            await controls.start({ x: -100, opacity: 0 });
            onDelete();
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <div className={styles.container}>
            {/* Background Action (Delete) */}
            <div className={styles.deleteAction}>
                <Trash2 size={24} className={styles.trashIcon} />
            </div>

            {/* Foreground Content */}
            <motion.div
                className={styles.row}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0.1, right: 0 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x: 0 }}
            >
                {/* Drag Handle / Checkbox Area */}
                <div className={styles.dragArea}>
                    <div className={cn(styles.setNumber, isCompleted && styles.setNumberCompleted)}>
                        <span className={styles.setNumberText}>{setNumber}</span>
                    </div>
                </div>

                {/* Inputs Area - Stop propagation to allow focus */}
                <div
                    className={styles.inputs}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div className={styles.inputGroup}>
                        <input
                            type="tel"
                            value={weight}
                            onChange={(e) => onUpdate?.('weight', e.target.value)}
                            readOnly={!onUpdate}
                            className={styles.input}
                            placeholder="0"
                        />
                        <Caption className={styles.inputLabel}>кг</Caption>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.inputGroup}>
                        <input
                            type="tel"
                            value={reps}
                            onChange={(e) => onUpdate?.('reps', e.target.value)}
                            readOnly={!onUpdate}
                            className={styles.input}
                            placeholder="0"
                        />
                        <Caption className={styles.inputLabel}>повт</Caption>
                    </div>
                </div>

                {/* Checkbox - Stop propagation */}
                {showCheckbox && (
                    <div
                        className={styles.checkboxContainer}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <Checkbox
                            checked={isCompleted}
                            onCheckedChange={(checked) => onUpdate?.('isCompleted', checked)}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}
