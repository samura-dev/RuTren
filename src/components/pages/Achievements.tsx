import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Caption, Text, SectionTitle } from '../atoms/Typography';
import { Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Achievements.module.css';

// Store & Data
import { useAchievementStore } from '@/stores/useAchievementStore';
import { ACHIEVEMENT_ICON_MAP } from '@/data/achievements';
import type { Achievement } from '@/types';

export function Achievements() {
    const navigate = useNavigate();
    const { achievements, getUnlockedCount, getTotalCount } = useAchievementStore();

    const unlockedCount = getUnlockedCount();
    const totalCount = getTotalCount();
    const progressPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    // Use the Medal icon from the map for the main trophy, or import it directly if purely decorative in header
    const MainTrophy = ACHIEVEMENT_ICON_MAP['medal'];

    return (
        <div className={styles.page}>
            <Header
                title="Достижения"
                showBack
                onBack={() => navigate(-1)}
                centered
            />

            <div className={styles.content}>
                {/* Header Stats */}
                <div className={styles.statsCard}>
                    <div className={styles.trophyIconWrapper}>
                        <MainTrophy size={40} className={styles.mainTrophyIcon} />
                    </div>
                    <div className={styles.statsInfo}>
                        <SectionTitle>Твой зал славы</SectionTitle>
                        <Caption className={styles.statsSubtitle}>
                            Получено {unlockedCount} из {totalCount} наград
                        </Caption>
                        <div className={styles.progressBarBg}>
                            <div
                                className={styles.progressBarFill}
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Achievements List */}
                <div className={styles.list}>
                    {achievements.map(achievement => (
                        <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {

    const progressPercent = Math.min(100, Math.round((achievement.progress / achievement.maxProgress) * 100));

    // Resolve icon component from string ID
    const IconComponent = ACHIEVEMENT_ICON_MAP[achievement.iconId] || Lock;

    return (
        <div className={cn(styles.card, !achievement.isUnlocked && styles.locked)}>
            <div className={cn(styles.iconBox, styles[achievement.rarity])}>
                {achievement.isUnlocked ? (
                    <IconComponent size={24} />
                ) : (
                    <Lock size={24} />
                )}
            </div>

            <div className={styles.cardInfo}>
                <div className={styles.cardHeader}>
                    <Text className={styles.title}>{achievement.title}</Text>
                    {achievement.isUnlocked && (
                        <span className={styles.date}>{achievement.dateUnlocked}</span>
                    )}
                </div>
                <Caption className={styles.description}>{achievement.description}</Caption>

                {!achievement.isUnlocked && (
                    <div className={styles.progressRow}>
                        <div className={styles.miniProgressBg}>
                            <div
                                className={styles.miniProgressFill}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className={styles.progressText}>
                            {achievement.progress} / {achievement.maxProgress}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
