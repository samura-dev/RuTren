import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Text, Caption } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { Scale, TrendingUp, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Modal } from '@/components/molecules/Modal';
import { FormInput } from '@/components/molecules/FormInput';
import styles from './Measurements.module.css';

// Store & Types
import { useMeasurementStore } from '@/stores/useMeasurementStore';
import type { Measurement } from '@/types';

export function Measurements() {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);

    // Store
    const { measurements, weight, addMeasurement, updateMeasurement } = useMeasurementStore();

    // Form states
    const [newName, setNewName] = useState('');
    const [newValue, setNewValue] = useState('');

    // Edit state
    const [editValue, setEditValue] = useState('');

    const handleAddMeasurement = () => {
        if (!newName || !newValue) return;
        addMeasurement(newName, newValue);
        setNewName('');
        setNewValue('');
        setIsAddModalOpen(false);
    };

    const handleUpdateMeasurement = () => {
        if (!selectedMeasurement || !editValue) return;
        updateMeasurement(selectedMeasurement.id, editValue);
        setEditValue('');
        setSelectedMeasurement(null);
    };

    const openEditModal = (m: Measurement) => {
        setSelectedMeasurement(m);
        setEditValue(m.value);
    };

    return (
        <div className={styles.page}>
            <Header
                title="Замеры"
                showBack
                onBack={() => navigate(-1)}
                centered
                action={
                    <Button
                        variant="ghost"
                        className={styles.headerActionBtn}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={24} />
                    </Button>
                }
            />

            <div className={styles.content}>
                {/* Weight Card */}
                <div className={styles.mainCard}>
                    <div className={styles.mainCardHeader}>
                        <div className={styles.iconWrapper}>
                            <Scale size={24} className={styles.mainIcon} />
                        </div>
                        <div className={styles.mainCardTitle}>
                            <Text>Вес тела</Text>
                            <Caption>Сегодня</Caption>
                        </div>
                    </div>
                    <div className={styles.mainValueContainer}>
                        <span className={styles.mainValue}>{weight.current}</span>
                        <span className={styles.unit}>кг</span>
                    </div>
                    <div className={styles.diffPositive}>
                        <TrendingUp size={16} />
                        <span>{weight.diff} кг {weight.period}</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <Caption className={styles.sectionTitle}>Обхваты (см)</Caption>
                    <div className={styles.grid}>
                        {measurements.map(m => (
                            <MeasurementCard
                                key={m.id}
                                label={m.label}
                                value={m.value}
                                diff={m.diff}
                                isGood={m.isGood}
                                onClick={() => openEditModal(m)}
                            />
                        ))}
                    </div>
                </div>

                <Button variant="primary" className={styles.saveBtn} onClick={() => navigate(-1)}>
                    Сохранить замеры
                </Button>
            </div>

            {/* Add Measurement Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Новый замер"
            >
                <div className={styles.modalForm}>
                    <FormInput
                        label="Название"
                        placeholder="Например: Шея"
                        value={newName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
                    />
                    <FormInput
                        label="Значение (см)"
                        placeholder="0.0"
                        type="number"
                        value={newValue}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleAddMeasurement} className={styles.modalButton}>
                        Добавить
                    </Button>
                </div>
            </Modal>

            {/* Edit Measurement Modal */}
            <Modal
                isOpen={!!selectedMeasurement}
                onClose={() => setSelectedMeasurement(null)}
                title={selectedMeasurement?.label}
            >
                <div className={styles.modalForm}>
                    <div className={styles.currentValueBox}>
                        <span className={styles.currentValueTitle}>Текущее значение</span>
                        <span className={styles.currentValue}>{selectedMeasurement?.value} {selectedMeasurement?.unit}</span>
                    </div>

                    <FormInput
                        label="Новое значение"
                        placeholder="0.0"
                        type="number"
                        value={editValue}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                        autoFocus
                    />

                    <Button variant="primary" onClick={handleUpdateMeasurement} className={styles.modalButton}>
                        Сохранить
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

function MeasurementCard({
    label,
    value,
    diff,
    isGood,
    onClick
}: {
    label: string,
    value: string,
    diff?: string,
    isGood?: boolean,
    onClick?: () => void
}) {
    return (
        <div className={styles.card} onClick={onClick}>
            <Caption className={styles.label}>{label}</Caption>
            <div className={styles.valueRow}>
                <span className={styles.value}>{value}</span>
                {diff && (
                    <span className={cn(styles.diff, isGood && styles.goodDiff)}>
                        {diff}
                    </span>
                )}
            </div>
        </div>
    );
}
