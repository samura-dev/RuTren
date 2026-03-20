import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../organisms/Header';
import { GlassCard } from '../atoms/GlassCard';
import { Text, Caption } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { BarChart, type BarData } from '../molecules/BarChart';
import { LineChart, type LineData } from '../molecules/LineChart';
import { SEO } from '../SEO';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useMeasurementStore } from '@/stores/useMeasurementStore';
import styles from './Analytics.module.css';

const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function Analytics() {
    const navigate = useNavigate();
    const [volumePeriod, setVolumePeriod] = useState<'week' | 'month'>('week');

    // Data Sources
    const { history } = useWorkoutStore();
    const { measurements } = useMeasurementStore();

    // 1. Calculate General Stats
    const totalWorkouts = history.length;
    const totalTonnage = history.reduce((sum, w) => sum + (w.totalVolume || 0), 0);

    // 2. Prepare Tonnage Data for BarChart (Last N workouts or Last N days)
    // We will group by day (YYYY-MM-DD) for simplicity
    const volumeData = useMemo<BarData[]>(() => {
        const daysToLookBack = volumePeriod === 'week' ? 7 : 30;
        const now = new Date();
        const map = new Map<string, number>();

        // Initialize map with empty dates to keep layout stable
        for (let i = daysToLookBack - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            map.set(dateStr, 0);
        }

        history.forEach(w => {
            const dateStr = new Date(w.date).toISOString().split('T')[0];
            if (map.has(dateStr)) {
                map.set(dateStr, map.get(dateStr)! + (w.totalVolume || 0));
            }
        });

        // Convert Map to array of BarData
        const result: BarData[] = [];
        let index = 0;
        map.forEach((vol, dateStr) => {
            const d = new Date(dateStr);
            // Label could be "Пн", "Вт" or short date "12.03"
            const label = volumePeriod === 'week' 
                ? d.toLocaleDateString('ru-RU', { weekday: 'short' })
                : d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
            
            result.push({
                id: dateStr,
                label,
                value: vol,
                isAccent: index === daysToLookBack - 1 // Highlight today
            });
            index++;
        });

        return result;
    }, [history, volumePeriod]);

    // 3. Prepare Weight Data for LineChart
    const weightData = useMemo<LineData[]>(() => {
        const weightEntry = measurements.find(m => m.id === 'weight' || m.label.toLowerCase().includes('вес'));
        if (!weightEntry || !weightEntry.history || weightEntry.history.length === 0) {
            return [];
        }

        // Sort ascending by date
        const sorted = [...weightEntry.history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Take last 10 entries for a clean chart
        const recent = sorted.slice(-10);

        return recent.map(r => {
            const d = new Date(r.date);
            return {
                id: r.date,
                label: d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
                value: parseFloat(r.value) || 0
            };
        });
    }, [measurements]);

    const currentWeightStr = weightData.length > 0 ? `${weightData[weightData.length - 1].value} кг` : '—';

    return (
        <div className={styles.page}>
            <SEO title="RuTren - Аналитика" />
            <Header
                title="Аналитика"
                showBack
                onBack={() => navigate(-1)}
                centered
            />

            <motion.div 
                className={styles.content}
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
            >
                {/* Stats Grid */}
                <motion.div variants={fadeIn} className={styles.summaryGrid}>
                    <GlassCard className={styles.summaryCard}>
                        <Caption>Всего тренировок</Caption>
                        <Text className={styles.summaryValue}>{totalWorkouts}</Text>
                    </GlassCard>
                    <GlassCard className={styles.summaryCard}>
                        <Caption>Общий вес</Caption>
                        <Text className={styles.summaryValue}>{(totalTonnage / 1000).toFixed(1)} т</Text>
                    </GlassCard>
                    <GlassCard className={styles.summaryCard}>
                        <Caption>Текущий вес</Caption>
                        <Text className={styles.summaryValue}>{currentWeightStr}</Text>
                    </GlassCard>
                </motion.div>

                {/* Tonnage Bar Chart */}
                <motion.div variants={fadeIn}>
                    <GlassCard className={styles.chartCard}>
                        <div className={styles.cardHeader}>
                            <Text className={styles.cardTitle}>Нагрузка (Тоннаж)</Text>
                            <div className={styles.periodToggles}>
                                <Button variant={volumePeriod === 'week' ? 'primary' : 'ghost'} size="sm" className={styles.periodBtn} onClick={() => setVolumePeriod('week')}>Нед.</Button>
                                <Button variant={volumePeriod === 'month' ? 'primary' : 'ghost'} size="sm" className={styles.periodBtn} onClick={() => setVolumePeriod('month')}>Мес.</Button>
                            </div>
                        </div>
                        <div className={styles.chartArea}>
                            <BarChart data={volumeData} />
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Weight Line Chart */}
                <motion.div variants={fadeIn}>
                    <GlassCard className={styles.chartCard} style={{ marginBottom: 40 }}>
                        <div className={styles.cardHeader}>
                            <Text className={styles.cardTitle}>Прогресс веса</Text>
                        </div>
                        <div className={styles.chartArea} style={{ paddingTop: 30, paddingBottom: 20 }}>
                            <LineChart data={weightData} />
                        </div>
                    </GlassCard>
                </motion.div>

            </motion.div>
        </div>
    );
}
