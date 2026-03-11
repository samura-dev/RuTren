// Типы замеров

export type MeasurementEntry = {
    date: string;
    value: string;
};

export type Measurement = {
    id: string;
    label: string;
    value: string;
    unit: string;
    diff?: string;
    isGood?: boolean;
    history?: MeasurementEntry[];
};
