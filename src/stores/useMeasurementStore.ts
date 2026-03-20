import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Measurement } from '@/types';
import { INITIAL_MEASUREMENTS, INITIAL_WEIGHT } from '@/data/measurements';
import pb from '@/lib/pocketbase';

type MeasurementState = {
    measurements: Measurement[];
    weight: { current: number; diff: number; period: string };
    loading: boolean;
    error: string | null;

    syncMeasurements: () => Promise<void>;
    addMeasurement: (label: string, value: string) => Promise<void>;
    updateMeasurement: (id: string, newValue: string) => Promise<void>;
    updateWeight: (newWeight: number) => Promise<void>;
};

const getUserId = () => {
    const w = window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number } } } } };
    if (typeof window !== 'undefined' && w.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        return w.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    return 'default';
};

export const useMeasurementStore = create<MeasurementState>()(
    persist(
        (set, get) => ({
            measurements: INITIAL_MEASUREMENTS,
            weight: INITIAL_WEIGHT,
            loading: false,
            error: null,

            syncMeasurements: async () => {
                const authRecord = pb.authStore.record;
                if (!authRecord) return;

                try {
                    set({ loading: true, error: null });
                    const records = await pb.collection('measurements').getFullList({
                        filter: `user="${authRecord.id}"`
                    });

                    if (records.length === 0) {
                        set({ loading: false });
                        return; // Let user start with seeded local or add new
                    }

                    // For this app, we might have stored them individually.
                    // Mapping back to local Measurement[]
                    const mapped: Measurement[] = records.map(r => ({
                        id: r.id,
                        label: r.type, // 'type' holds the label like waist, chest
                        value: (r.entries && r.entries.length > 0) ? r.entries[r.entries.length - 1].value : '0',
                        unit: 'см',
                        history: r.entries || []
                    }));

                    // We also need to map diff / isGood manually
                    const mappedWithDiff = mapped.map(m => {
                        const hist = m.history || [];
                        if (hist.length > 1) {
                            const last = parseFloat(hist[hist.length - 1].value);
                            const prev = parseFloat(hist[hist.length - 2].value);
                            const diffVal = last - prev;
                            return {
                                ...m,
                                diff: diffVal > 0 ? `+${diffVal.toFixed(1)}` : diffVal.toFixed(1),
                                isGood: m.id.includes('waist') ? diffVal < 0 : diffVal > 0 // heuristic
                            };
                        }
                        return { ...m, diff: '0' };
                    });

                    // Search for weight
                    const weightRecord = records.find(r => r.type === 'Вес');
                    if (weightRecord && weightRecord.entries?.length > 0) {
                        const wHist = weightRecord.entries;
                        const lastW = parseFloat(wHist[wHist.length - 1].value);
                        let diffW = 0;
                        if (wHist.length > 1) {
                            const prevW = parseFloat(wHist[wHist.length - 2].value);
                            diffW = lastW - prevW;
                        }
                        set({ weight: { current: lastW, diff: diffW, period: 'за всё время' } });
                    }

                    if (mappedWithDiff.length > 0) {
                        set({ measurements: mappedWithDiff.filter(m => m.label !== 'Вес') });
                    }
                    set({ loading: false });

                } catch (err: any) {
                    console.error('Failed to sync measurements', err);
                    set({ error: err.message, loading: false });
                }
            },

            addMeasurement: async (label, value) => {
                const tempId = Date.now().toString();
                const newMeasurement: Measurement = {
                    id: tempId,
                    label,
                    value,
                    unit: 'см',
                    diff: '0',
                    history: [{ date: new Date().toLocaleDateString(), value }]
                };

                set((state) => ({ measurements: [...state.measurements, newMeasurement] }));

                const authRecord = pb.authStore.record;
                if (authRecord) {
                    try {
                        const created = await pb.collection('measurements').create({
                            user: authRecord.id,
                            type: label,
                            entries: [{ date: new Date().toLocaleDateString(), value }]
                        });
                        set(state => ({
                            measurements: state.measurements.map(m => 
                                m.id === tempId ? { ...m, id: created.id } : m
                            )
                        }));
                    } catch (e) {
                         console.error('Failed to add measurement PB', e);
                    }
                }
            },

            updateMeasurement: async (id, newValue) => {
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
                                { date: new Date().toLocaleDateString(), value: newValue },
                            ],
                        };
                    }),
                }));

                const authRecord = pb.authStore.record;
                if (authRecord) {
                    try {
                         const m = get().measurements.find(x => x.id === id);
                         if (m) {
                             if (id.length === 15) { 
                                 await pb.collection('measurements').update(id, { entries: m.history });
                             } else {
                                 // mock id ? handle appropriately in a real app
                             }
                         }
                    } catch (e) {
                        console.error('Failed to update measurement PB', e);
                    }
                }
            },

            updateWeight: async (newWeight) => {
                set((state) => ({
                    weight: {
                        ...state.weight,
                        diff: +(newWeight - state.weight.current).toFixed(1),
                        current: newWeight,
                    },
                }));

                const authRecord = pb.authStore.record;
                if (authRecord) {
                    try {
                        const records = await pb.collection('measurements').getFullList({
                            filter: `user="${authRecord.id}" && type="Вес"`
                        });
                        if (records.length > 0) {
                            const wRecord = records[0];
                            const newEntries = [...(wRecord.entries || []), { date: new Date().toLocaleDateString(), value: String(newWeight) }];
                            await pb.collection('measurements').update(wRecord.id, { entries: newEntries });
                        } else {
                            await pb.collection('measurements').create({
                                user: authRecord.id,
                                type: 'Вес',
                                entries: [{ date: new Date().toLocaleDateString(), value: String(newWeight) }]
                            });
                        }
                    } catch (e) {
                        console.error('Failed to update weight PB', e);
                    }
                }
            },
        }),
        {
            name: `measurement-storage-${getUserId()}`
        }
    )
);
