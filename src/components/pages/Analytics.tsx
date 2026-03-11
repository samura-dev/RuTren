import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { GlassCard } from '../atoms/GlassCard';
import { Text, Caption } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import styles from './Analytics.module.css';

export function Analytics() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <Header
                title="Аналитика"
                showBack
                onBack={() => navigate(-1)}
                centered
            />

            <div className={styles.content}>
                {/* Mock Chart Area 1 */}
                <GlassCard className={styles.chartCard} noPadding>
                    <div className={styles.cardHeader}>
                        <Text className={styles.cardTitle}>Прогресс веса</Text>
                        <Button variant="ghost" size="sm" className={styles.periodBtn}>Месяц</Button>
                    </div>
                    <div className={styles.chartPlaceholder}>
                        <div className={styles.graphLine}></div>
                        <Caption className={styles.placeholderText}>График веса</Caption>
                    </div>
                </GlassCard>

                {/* Mock Chart Area 2 */}
                <GlassCard className={styles.chartCard} noPadding>
                    <div className={styles.cardHeader}>
                        <Text className={styles.cardTitle}>Нагрузка (Тоннаж)</Text>
                        <Button variant="ghost" size="sm" className={styles.periodBtn}>Неделя</Button>
                    </div>
                    <div className={styles.chartPlaceholder}>
                        <div className={styles.graphBars}></div>
                        <Caption className={styles.placeholderText}>График тоннажа</Caption>
                    </div>
                </GlassCard>

                <GlassCard className={styles.summaryCard}>
                    <div className={styles.summaryItem}>
                        <Caption>Всего тренировок</Caption>
                        <Text className={styles.summaryValue}>124</Text>
                    </div>
                    <div className={styles.summaryItem}>
                        <Caption>Общий вес</Caption>
                        <Text className={styles.summaryValue}>452т</Text>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
