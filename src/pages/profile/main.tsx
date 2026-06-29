import { HomeBasement } from '@widgets';
import styles from './style.module.css';
import { useEffect, useState } from 'react';
import { deleteUser, me, updateUser, type User } from '@api/users';
import { Button, Input } from '@shared/ui';
import { clearStoredAuth, isInvalidSessionError } from '@shared/lib/auth';
import { useNavigate } from 'react-router-dom';

function normalizePhone(value: string) {
    const digits = value.replace(/\D/g, '');
    let normalizedDigits = digits;

    if (normalizedDigits.startsWith('8')) {
        normalizedDigits = `7${normalizedDigits.slice(1)}`;
    }

    if (normalizedDigits.startsWith('7')) {
        normalizedDigits = normalizedDigits.slice(1);
    }

    return `+7${normalizedDigits.slice(0, 10)}`;
}

function isValidPhone(value: string) {
    return /^\+7\d{10}$/.test(value);
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('+7');
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await me();
                setUser(user);
                setName(user.name);
                setPhone(normalizePhone(user.phone));
            } catch (error) {
                console.error('Failed to fetch user:', error);

                if (isInvalidSessionError(error)) {
                    clearStoredAuth();
                    navigate('/register/phone', { replace: true });
                }
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        clearStoredAuth();
        navigate('/register/phone');
    };

    const handleEditClick = () => {
        if (!user) {
            return;
        }

        setError('');
        setShowDeleteConfirm(false);
        setName(user.name);
        setPhone(normalizePhone(user.phone));
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        if (user) {
            setName(user.name);
            setPhone(normalizePhone(user.phone));
        }

        setError('');
        setIsEditing(false);
    };

    const handleSaveProfile = async () => {
        if (!user) {
            return false;
        }

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError('Введите имя');
            return false;
        }

        if (!isValidPhone(phone)) {
            setError('Введите телефон в формате +7XXXXXXXXXX');
            return false;
        }

        setLoadingAction(true);
        setError('');

        try {
            const updatedUser = await updateUser(user.id, {
                name: trimmedName,
                phone,
            });
            setUser(updatedUser);
            setName(updatedUser.name);
            setPhone(normalizePhone(updatedUser.phone));
            setIsEditing(false);
            return true;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось обновить профиль';
            setError(message);
            return false;
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) {
            return false;
        }

        setLoadingAction(true);
        setError('');

        try {
            await deleteUser(user.id);
            clearStoredAuth();
            navigate('/register/phone', { replace: true });
            return true;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось удалить аккаунт';
            setError(message);
            return false;
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <>
            <main className={styles.main}>
                <h1>Профиль</h1>
                {user === null ? (
                    <p>Пользователь не найден.</p>
                ) : (
                    <div className={styles.profileContainer}>
                        <h2 className={styles.profileName}>{user.name}</h2>
                        <p className={styles.profilePhone}>Телефон: {user.phone}</p>
                        <p className={styles.profileRole}>Роль: {user.role === 'LESSOR' ? 'Арендодатель' : 'Заказчик'}</p>

                        {isEditing && (
                            <div className={styles.editForm}>
                                <label className={styles.label} htmlFor="profile-name">
                                    Имя
                                </label>
                                <Input
                                    id="profile-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="Введите имя"
                                />

                                <label className={styles.label} htmlFor="profile-phone">
                                    Телефон
                                </label>
                                <Input
                                    id="profile-phone"
                                    type="tel"
                                    value={phone}
                                    inputMode="numeric"
                                    maxLength={12}
                                    onChange={(event) =>
                                        setPhone(normalizePhone(event.target.value))
                                    }
                                    placeholder="+7XXXXXXXXXX"
                                />

                                <div className={styles.actions}>
                                    <Button
                                        text={
                                            loadingAction
                                                ? 'Сохранение...'
                                                : 'Сохранить'
                                        }
                                        active={loadingAction === false}
                                        onClick={handleSaveProfile}
                                    />
                                    <Button
                                        text="Отмена"
                                        active={loadingAction === false}
                                        onClick={handleCancelEdit}
                                    />
                                </div>
                            </div>
                        )}

                        {showDeleteConfirm && (
                            <div className={styles.deleteConfirm}>
                                <p>
                                    Вы уверены, что хотите удалить аккаунт? Это
                                    действие нельзя отменить.
                                </p>
                                <div className={styles.actions}>
                                    <Button
                                        text={
                                            loadingAction
                                                ? 'Удаление...'
                                                : 'Да, удалить'
                                        }
                                        active={loadingAction === false}
                                        onClick={handleDeleteAccount}
                                    />
                                    <Button
                                        text="Отмена"
                                        active={loadingAction === false}
                                        onClick={() => {
                                            setError('');
                                            setShowDeleteConfirm(false);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {error && <p className={styles.error}>{error}</p>}

                        <Button
                            text="Выйти из аккаунта"
                            onClick={handleLogout}
                        />
                        <Button
                            text="Редактировать профиль"
                            onClick={handleEditClick}
                        />
                        <Button
                            text="Удалить аккаунт"
                            onClick={() => {
                                setError('');
                                setIsEditing(false);
                                setShowDeleteConfirm(true);
                            }}
                        />
                    </div>
                )}
            </main>
            <div className={styles.basementIndent}></div>
            <HomeBasement />
        </>
    );
}
