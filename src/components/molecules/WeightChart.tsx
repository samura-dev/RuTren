import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../atoms/GlassCard';
import { SectionTitle, Caption } from '../atoms/Typography';
import styles from './WeightChart.module.css';

type DataPoint = {
    label: string;
    value: number;
};

type WeightChartProps = {
    data: DataPoint[];
    title?: string;
    className?: string;
};

export function WeightChart({ data, title = "История весов", className }: WeightChartProps) {
    // 1. Calculate Scales
    const { points, width, height, minVal, maxVal } = useMemo(() => {
        const width = 300; // viewBox width
        const height = 150; // viewBox height
        const padding = 20;

        const values = data.map(d => d.value);
        const minVal = Math.min(...values) - 5;
        const maxVal = Math.max(...values) + 5;

        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
            const normalizedY = (d.value - minVal) / (maxVal - minVal);
            const y = height - (normalizedY * (height - padding * 2) + padding);
            return { x, y, ...d };
        });

        return { points, width, height, minVal, maxVal };
    }, [data]);

    // 2. Generate Path (Smooth Bezier)
    const pathData = useMemo(() => {
        if (points.length === 0) return '';

        let d = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            // Simple smoothing: Control points at midpoints
            const cp1x = current.x + (next.x - current.x) * 0.5;
            const cp1y = current.y;
            const cp2x = current.x + (next.x - current.x) * 0.5;
            const cp2y = next.y;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }

        return d;
    }, [points]);

    const fillPathData = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
        <GlassCard className={className} contentClassName={styles.container}>
            <SectionTitle className={styles.title}>{title}</SectionTitle>

            <div className={styles.chartContainer}>
                {/* Y-Axis Labels (Absolute) */}
                <div className={styles.yAxis}>
                    <Caption>{Math.round(maxVal)}</Caption>
                    <Caption>{Math.round(minVal + (maxVal - minVal) / 2)}</Caption>
                    <Caption>{Math.round(minVal)}</Caption>
                </div>

                <div className={styles.graphArea}>
                    <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        <line x1="20" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
                        <line x1="20" y1="75" x2="280" y2="75" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
                        <line x1="20" y1="130" x2="280" y2="130" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />

                        {/* Fill */}
                        <motion.path
                            d={fillPathData}
                            fill="url(#chartGradient)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        />

                        {/* Stroke */}
                        <motion.path
                            d={pathData}
                            fill="none"
                            stroke="var(--color-accent)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* Dots */}
                        {points.map((p, i) => (
                            <motion.circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="#1c1c1e"
                                stroke="var(--color-accent)"
                                strokeWidth="2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1 + i * 0.1 }}
                            />
                        ))}
                    </svg>

                    {/* X-Axis Labels */}
                    <div className={styles.xAxis}>
                        {data.map((d, i) => (
                            <Caption key={i} className={styles.xLabel}>{d.label}</Caption>
                        ))}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
