import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Text, SectionTitle } from '../atoms/Typography';
import { GlassCard } from '../atoms/GlassCard';
import { SEO } from '../SEO';
import styles from './Privacy.module.css';

export function Privacy() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <SEO title="RuTren - Политика конфиденциальности" />
            <Header
                title="Политика"
                showBack
                onBack={() => navigate(-1)}
                centered
            />
            <div className={styles.content}>
                <GlassCard className={styles.privacyCard}>
                    <SectionTitle>Политика конфиденциальности</SectionTitle>
                    <Text className={styles.privacyText}>
                        Последнее обновление: 20 марта 2026 г.<br/><br/>
                        Ваша конфиденциальность очень важна для нас. Мы используем ваши данные исключительно для обеспечения работы приложения и улучшения тренировочного процесса. <br/><br/>
                        Все данные хранятся в защищенном виде и не передаются третьим лицам без вашего явного согласия.
                    </Text>
                </GlassCard>
            </div>
        </div>
    );
}
