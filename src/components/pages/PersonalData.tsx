import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Caption } from '../atoms/Typography';
import { FormInput } from '../molecules/FormInput';
import { Button } from '../atoms/Button';
import { User, Calendar, Ruler, Weight } from 'lucide-react';
import styles from './PersonalData.module.css';
import { useUserStore } from '@/stores/useUserStore';

export function PersonalData() {
    const navigate = useNavigate();
    const { user, updateProfile } = useUserStore();
    const { profile } = user;

    // Локальный стейт формы — инициализируем из стора
    const [name, setName] = useState(profile.name);
    const [age, setAge] = useState(profile.age.toString());
    const [height, setHeight] = useState(profile.height.toString());
    const [weight, setWeight] = useState(profile.weight.toString());
    const [gender, setGender] = useState<'male' | 'female'>(profile.gender);

    const handleSave = () => {
        updateProfile({
            name,
            age: parseInt(age) || profile.age,
            height: parseInt(height) || profile.height,
            weight: parseFloat(weight) || profile.weight,
            gender,
        });
        navigate(-1);
    };

    return (
        <div className={styles.page}>
            <Header
                title="Личные данные"
                showBack
                onBack={() => navigate(-1)}
                centered
            />

            <div className={styles.content}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                            alt="Profile"
                            className={styles.avatar}
                        />
                        <button className={styles.editAvatarBtn}>
                            <User size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.form}>
                    <FormInput
                        leftIcon={<User size={20} />}
                        label="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ваше имя"
                    />
                    <FormInput
                        leftIcon={<Calendar size={20} />}
                        label="Возраст"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="22"
                        type="number"
                    />
                    <div className={styles.row}>
                        <FormInput
                            leftIcon={<Ruler size={20} />}
                            label="Рост (см)"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="180"
                            type="number"
                        />
                        <FormInput
                            leftIcon={<Weight size={20} />}
                            label="Вес (кг)"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="75"
                            type="number"
                        />
                    </div>

                    <div className={styles.section}>
                        <Caption className={styles.sectionTitle}>Пол</Caption>
                        <div className={styles.genderSelect}>
                            <Button
                                variant={gender === 'male' ? 'primary' : 'ghost'}
                                className={styles.genderBtn}
                                onClick={() => setGender('male')}
                            >
                                Мужской
                            </Button>
                            <Button
                                variant={gender === 'female' ? 'primary' : 'ghost'}
                                className={styles.genderBtn}
                                onClick={() => setGender('female')}
                            >
                                Женский
                            </Button>
                        </div>
                    </div>

                    <Button variant="primary" className={styles.saveBtn} onClick={handleSave}>
                        Сохранить изменения
                    </Button>
                </div>
            </div>
        </div>
    );
}
