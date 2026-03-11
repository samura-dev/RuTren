import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Text, Caption, SectionTitle } from '../atoms/Typography';
import { GlassCard } from '../atoms/GlassCard';
import { ExerciseCard } from '../organisms/ExerciseCard';
import { Clock, Flame, Dumbbell, Weight } from 'lucide-react';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import styles from './HistoryDetail.module.css';

export function HistoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getHistoryById } = useWorkoutStore();

    const record = getHistoryById(id || '');

    if (!record) {
        return (
            <div className={styles.page}>
                <Header title="Не найдено" showBack onBack={() => navigate(-1)} centered />
                <div className={styles.emptyState}>
                    <Text>Запись не найдена</Text>
                </div>
            </div>
        );
    }

    // Форматирование
    const durationMin = Math.round(record.duration / 60);
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;
    const timeDisplay = hours > 0 ? `${hours}ч ${minutes}м` : `${minutes} мин`;

    const tonnageDisplay = record.totalVolume >= 1000
        ? `${(record.totalVolume / 1000).toFixed(1)} т`
        : `${record.totalVolume} кг`;

    const completedSets = record.exercises.reduce((acc, ex) =>
        acc + ex.sets.filter(s => s.isCompleted).length, 0
    );

    const dateFormatted = new Date(record.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className={styles.page}>
            <Header
                title={record.title}
                showBack
                onBack={() => navigate(-1)}
                centered
            />

            <div className={styles.content}>
                {/* Мета-информация */}
                <Caption className={styles.dateBadge}>{dateFormatted}</Caption>

                {/* Стат-карточки */}
                <div className={styles.statsGrid}>
                    <GlassCard className={styles.statCard} noPadding>
                        <div className={styles.statContent}>
                            <Clock size={18} className={styles.statIcon} />
                            <Text className={styles.statValue}>{timeDisplay}</Text>
                            <Caption>Время</Caption>
                        </div>
                    </GlassCard>
                    <GlassCard className={styles.statCard} noPadding>
                        <div className={styles.statContent}>
                            <Flame size={18} className={styles.statIcon} />
                            <Text className={styles.statValue}>{record.calories}</Text>
                            <Caption>Ккал</Caption>
                        </div>
                    </GlassCard>
                    <GlassCard className={styles.statCard} noPadding>
                        <div className={styles.statContent}>
                            <Weight size={18} className={styles.statIcon} />
                            <Text className={styles.statValue}>{tonnageDisplay}</Text>
                            <Caption>Тоннаж</Caption>
                        </div>
                    </GlassCard>
                    <GlassCard className={styles.statCard} noPadding>
                        <div className={styles.statContent}>
                            <Dumbbell size={18} className={styles.statIcon} />
                            <Text className={styles.statValue}>{completedSets}</Text>
                            <Caption>Подходов</Caption>
                        </div>
                    </GlassCard>
                </div>

                {/* Упражнения */}
                <section className={styles.section}>
                    <SectionTitle>Упражнения ({record.exercises.length})</SectionTitle>
                    <div className={styles.exerciseList}>
                        {record.exercises.map((ex, i) => (
                            <ExerciseCard
                                key={ex.exerciseId + i}
                                index={i + 1}
                                title={ex.title}
                                subtitle={ex.subtitle}
                                initialSets={ex.sets}
                                isReadonly
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
