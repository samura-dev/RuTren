import { create } from 'zustand';
import type { Measurement } from '@/types';
import { INITIAL_MEASUREMENTS, INITIAL_WEIGHT } from '@/data/measurements';

type MeasurementState = {
    measurements: Measurement[];
    weight: { current: number; diff: number; period: string };

    // Действия
    addMeasurement: (label: string, value: string) => void;
    updateMeasurement: (id: string, newValue: string) => void;
    updateWeight: (newWeight: number) => void;
};

export const useMeasurementStore = create<MeasurementState>((set) => ({
    measurements: INITIAL_MEASUREMENTS,
    weight: INITIAL_WEIGHT,

    addMeasurement: (label, value) =>
        set((state) => ({
            measurements: [
                ...state.measurements,
                {
                    id: Date.now().toString(),
                    label,
                    value,
                    unit: 'см',
                    diff: '0',
                },
            ],
        })),

    updateMeasurement: (id, newValue) =>
        set((state) => ({
            measurements: state.measurements.map((m) => {
                if (m.id !== id) return m;

                const oldVal = parseFloat(m.value);
                const newVal = parseFloat(newValue);
                const diffVal = newVal - oldVal;
                const diffStr = diffVal > 0 ? `+${diffVal.toFixed(1)}` : diffVal.toFixed(1);

                return {
                    ...m,
                    value: newValue,
                    diff: diffVal !== 0 ? diffStr : m.diff,
                    isGood: m.id === 'waist' ? diffVal < 0 : diffVal > 0,
                    history: [
                        ...(m.history || []),
                        { date: new Date().toLocaleDateString(), value: m.value },
                    ],
                };
            }),
        })),

    updateWeight: (newWeight) =>
        set((state) => ({
            weight: {
                ...state.weight,
                diff: +(newWeight - state.weight.current).toFixed(1),
                current: newWeight,
            },
        })),
}));
