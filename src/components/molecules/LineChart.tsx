import styles from './LineChart.module.css';
import { cn } from '@/utils/cn';
import { useId, useMemo } from 'react';

export interface LineData {
    id: string;
    label: string;
    value: number;
}

interface LineChartProps {
    data: LineData[];
    className?: string;
}

export function LineChart({ data, className }: LineChartProps) {
    const gradientId = useId();

    const { pathData, points, minVal, maxVal } = useMemo(() => {
        if (data.length < 2) return { pathData: '', points: [], minVal: 0, maxVal: 0 };

        const values = data.map(d => d.value);
        let min = Math.min(...values);
        let max = Math.max(...values);
        
        // Add some padding to min/max so lines don't touch the absolute top/bottom
        const padding = (max - min) * 0.2 || 1; 
        min -= padding;
        max += padding;

        const range = max - min;
        
        const width = 1000; // viewBox width
        const height = 400; // viewBox height

        const pts = data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((d.value - min) / range) * height;
            return { x, y, label: d.label, value: d.value };
        });

        const commands = pts.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`));
        return { pathData: commands.join(' '), points: pts, minVal: min, maxVal: max };
    }, [data]);

    if (data.length === 0) {
        return <div className={cn(styles.empty, className)}>Нет данных</div>;
    }

    if (data.length < 2) {
        return <div className={cn(styles.empty, className)}>Недостаточно данных для графика</div>;
    }

    // Creating a filled area under the path
    const areaPathData = `${pathData} L 1000,400 L 0,400 Z`;

    return (
        <div className={cn(styles.container, className)}>
            <div className={styles.chartArea}>
                <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className={styles.svg}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    
                    <path
                        d={areaPathData}
                        fill={`url(#${gradientId})`}
                        stroke="none"
                        className={styles.areaPath}
                    />

                    <path
                        d={pathData}
                        fill="none"
                        className={styles.linePath}
                    />

                    {points.map((p, i) => (
                        <g key={i} className={styles.dataPoint}>
                            <circle cx={p.x} cy={p.y} r={6} className={styles.pointCircle} />
                            <text x={p.x} y={p.y - 15} className={styles.pointText} textAnchor="middle">
                                {p.value}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
            
            <div className={styles.labelsX}>
                {points.map((p, i) => {
                    // Only show first, last, and maybe some in between to avoid crowding
                    const show = i === 0 || i === points.length - 1 || data.length <= 6 || i % Math.ceil(data.length / 5) === 0;
                    return (
                        <div key={i} className={styles.labelX} style={{ left: `${(p.x / 1000) * 100}%` }}>
                            {show ? p.label : ''}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
