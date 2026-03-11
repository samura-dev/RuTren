import { Button } from '../atoms/Button';
import { SectionTitle, Text } from '../atoms/Typography';
import { ModalOverlay } from '../atoms/ModalOverlay';
import styles from './FinishWorkoutModal.module.css';

type FinishWorkoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    duration: string;
    exercisesCompleted: number;
    totalExercises: number;
};

export function FinishWorkoutModal({
    isOpen,
    onClose,
    onConfirm,
    duration,
    exercisesCompleted,
    totalExercises
}: FinishWorkoutModalProps) {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClose={onClose}>
            <div className={styles.modal}>
                <SectionTitle className={styles.title}>Завершить тренировку?</SectionTitle>

                <div className={styles.stats}>
                    <div className={styles.statRow}>
                        <Text className={styles.label}>Время</Text>
                        <Text className={styles.value}>{duration}</Text>
                    </div>
                    <div className={styles.statRow}>
                        <Text className={styles.label}>Упражнения</Text>
                        <Text className={styles.value}>{exercisesCompleted} / {totalExercises}</Text>
                    </div>
                </div>

                <Text className={styles.description}>
                    Убедитесь, что вы отметили все выполненные подходы. Несохраненные данные будут потеряны.
                </Text>

                <div className={styles.actions}>
                    <Button variant="primary" onClick={onConfirm} className={styles.confirmBtn}>
                        Завершить
                    </Button>
                    <Button variant="ghost" onClick={onClose} className={styles.cancelBtn}>
                        Отмена
                    </Button>
                </div>
            </div>
        </ModalOverlay>
    );
}
