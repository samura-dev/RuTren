import styles from './BarChart.module.css';
import { cn } from '@/utils/cn';

export interface BarData {
    id: string;
    label: string;
    value: number;
    isAccent?: boolean;
}

interface BarChartProps {
    data: BarData[];
    className?: string;
}

export function BarChart({ data, className }: BarChartProps) {
    if (data.length === 0) {
        return <div className={cn(styles.empty, className)}>Нет данных</div>;
    }

    const maxValue = Math.max(...data.map(d => d.value), 1); // fallback to 1 to avoid div by 0

    return (
        <div className={cn(styles.container, className)}>
            <div className={styles.chart}>
                {data.map((item) => {
                    const heightPercent = (item.value / maxValue) * 100;
                    return (
                        <div key={item.id} className={styles.barWrapper}>
                            <div className={styles.barTrack}>
                                <div
                                    className={cn(styles.barFill, item.isAccent && styles.accent)}
                                    style={{ height: `${heightPercent}%` }}
                                >
                                    {heightPercent > 10 && (
                                        <div className={styles.tooltip}>{item.value.toLocaleString()}</div>
                                    )}
                                </div>
                            </div>
                            <span className={styles.label}>{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
