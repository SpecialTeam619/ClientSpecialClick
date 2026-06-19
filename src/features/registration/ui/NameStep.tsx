import { useNavigate } from 'react-router-dom';
import styles from '../../../pages/register/name/Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import { Basement, Header } from '@widgets';
import { useState } from 'react';
import { useRegistration } from '../model/RegistrationContext';
import checkPhoneExists from '@app/router/phone';
import register from '@app/router/registration';
import { setStoredAccessToken } from '@api/client';

function NameStep() {
    const { data, updateData, clearData } = useRegistration();
    const [name, setName] = useState(data.name || '');
    const isValidName = name.trim() !== '';
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // function normalizePhone(value: string) {
    //     const digitsOnly = value.replace(/\D/g, '');

    //     if (digitsOnly.length <= 10) {
    //         return digitsOnly.slice(0, 10);
    //     }

    //     return digitsOnly.slice(-10);
    // }

    function handleName(e: React.FormEvent<HTMLInputElement>) {
        const currentValue = (e.target as HTMLInputElement).value;
        setName(currentValue);
        updateData({ name: currentValue });
    }

    async function handleSubmit() {
        setError('');
        // const phone = normalizePhone(data.phone);

        const phoneCheck = await checkPhoneExists(data.phone);

        if (!phoneCheck.exists) {
            try {
                const response = await register(
                    data.phone,
                    data.password,
                    data.role,
                    name,
                );

                if (!response.access_token) {
                    throw new Error('Не удалось получить токен');
                }

                setStoredAccessToken(response.access_token);
                clearData();
                navigate('/');
                return;
            } catch {
                setError('Ошибка регистрации. Пожалуйста, попробуйте снова.');
                return false;
            }
        } else {
            setError(
                'Пользователь с таким номером уже существует. Пожалуйста, войдите в систему.',
            );
        }
    }

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Как к вам обращаться</h1>
                <Input
                    type="text"
                    onInput={handleName}
                    value={name}
                    placeholder="Введите ваше имя"
                />
                {error && <FootNote>{error}</FootNote>}
            </div>
            <EmptyBlock />
            <Basement onForward={handleSubmit} isActive={isValidName} />
        </>
    );
}

export default NameStep;
