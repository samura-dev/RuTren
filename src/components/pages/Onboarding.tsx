import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { Text, PageTitle } from '../atoms/Typography';
import { GlassCard } from '../atoms/GlassCard';
import { ChevronRight, Ruler, Weight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SEO } from '../SEO';
import styles from './Onboarding.module.css';
import { useUserStore } from '@/stores/useUserStore';
import type { UserProfile } from '@/types';

export function Onboarding() {
    const navigate = useNavigate();
    const { completeOnboarding } = useUserStore();
    const [step, setStep] = useState(0); // 0: Gender, 1: Params, 2: Goal
    const [formData, setFormData] = useState({
        gender: '',
        weight: '',
        height: '',
        goal: ''
    });

    const updateData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            // Finish onboarding
            completeOnboarding({
                name: 'Пользователь', // Default name or ask for it
                age: 25, // Default age or ask for it
                weight: Number(formData.weight) || 75,
                height: Number(formData.height) || 175,
                gender: formData.gender as UserProfile['gender'],
                goal: formData.goal as UserProfile['goal'],
                experience: 'beginner' // Default
            });
            navigate('/dashboard');
        }
    };

    return (
        <div className={styles.page}>
            <SEO title="RuTren - Добро пожаловать" />
            {/* Progress Bar */}
            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${((step + 1) / 3) * 100}%` }}
                />
            </div>

            <div className={styles.content}>
                {step === 0 && (
                    <div className={styles.stepContainer}>
                        <PageTitle className={styles.title}>Ваш пол</PageTitle>
                        <Text className={styles.subtitle}>Для расчета калорий и программ</Text>

                        <div className={styles.genderGrid}>
                            <GenderCard
                                label="Мужской"
                                icon="🧑"
                                selected={formData.gender === 'male'}
                                onClick={() => updateData('gender', 'male')}
                            />
                            <GenderCard
                                label="Женский"
                                icon="👩"
                                selected={formData.gender === 'female'}
                                onClick={() => updateData('gender', 'female')}
                            />
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className={styles.stepContainer}>
                        <PageTitle className={styles.title}>Параметры</PageTitle>
                        <Text className={styles.subtitle}>Укажите текущие данные</Text>

                        <div className={styles.inputsContainer}>
                            <GlassCard className={styles.inputCard}>
                                <div className={styles.inputIcon}><Weight size={24} /></div>
                                <div className={styles.inputWrapper}>
                                    <label>Вес (кг)</label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) => updateData('weight', e.target.value)}
                                        placeholder="75"
                                    />
                                </div>
                            </GlassCard>

                            <GlassCard className={styles.inputCard}>
                                <div className={styles.inputIcon}><Ruler size={24} /></div>
                                <div className={styles.inputWrapper}>
                                    <label>Рост (см)</label>
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => updateData('height', e.target.value)}
                                        placeholder="180"
                                    />
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContainer}>
                        <PageTitle className={styles.title}>Ваша цель</PageTitle>
                        <Text className={styles.subtitle}>Подберем программу под вас</Text>

                        <div className={styles.goalsList}>
                            {['lose_weight', 'gain_muscle', 'endurance', 'strength'].map((key) => {
                                const labels: Record<string, string> = {
                                    'lose_weight': 'Похудение',
                                    'gain_muscle': 'Набор массы',
                                    'endurance': 'Выносливость',
                                    'strength': 'Сила'
                                };
                                return (
                                    <GlassCard
                                        key={key}
                                        className={cn(styles.goalCard, formData.goal === key && styles.selectedGoal)}
                                        onClick={() => updateData('goal', key)}
                                        noPadding
                                    >
                                        <div className={styles.goalContent}>
                                            <Text className={styles.goalText}>{labels[key]}</Text>
                                            {formData.goal === key && <div className={styles.checkCircle} />}
                                        </div>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <Button
                variant="primary"
                size="lg"
                className={styles.nextBtn}
                onClick={nextStep}
                disabled={
                    (step === 0 && !formData.gender) ||
                    (step === 1 && (!formData.weight || !formData.height)) ||
                    (step === 2 && !formData.goal)
                }
            >
                {step === 2 ? 'Начать' : 'Продолжить'}
                <ChevronRight size={20} />
            </Button>
        </div>
    );
}

function GenderCard({ label, icon, selected, onClick }: { label: string, icon: string, selected: boolean, onClick: () => void }) {
    return (
        <GlassCard
            className={cn(styles.genderCard, selected && styles.selectedGender)}
            onClick={onClick}
        >
            <div className={styles.genderIcon}>{icon}</div>
            <Text className={styles.genderLabel}>{label}</Text>
        </GlassCard>
    );
}
