import { Header, Basement } from '@widgets';
import styles from '../../../pages/register/password/Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import { useState } from 'react';
import { useRegistration } from '../model/RegistrationContext';
import { FaCheck, FaTimes } from 'react-icons/fa';
import login from '@api/login';
import checkPhoneExists from '@api';
import { setStoredAccessToken } from '@api/client';
import { useNavigate } from 'react-router-dom';

function PasswordStep() {
    const { data, updateData, clearData } = useRegistration();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit() {
        setError('');

        const phoneCheck = await checkPhoneExists(data.phone);

        if (phoneCheck.exists) {
            try {
                const response = await login(data.phone, data.password);

                if (!response.access_token) {
                    throw new Error('Не удалось получить токен');
                }

                setStoredAccessToken(response.access_token);
                clearData();
                navigate('/');
                return;
            } catch {
                setError('Неверный номер телефона или пароль');
                return false;
            }
        } else {
            navigate('/register/role');
            return;
        }
    }

    function handlePassword(value: React.ChangeEvent<HTMLInputElement>) {
        const currentValue = value.target.value;
        setPassword(currentValue);
        updateData({ password: currentValue });
    }

    const check = password.length >= 6 && /\d/.test(password) && /[a-zA-Z]/.test(password);

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Введите пароль</h1>
                <Input
                    type="password"
                    onInput={handlePassword}
                    value={password}
                />
                <FootNote>
                    <div style={{ textAlign: 'left' }}>
                        {password.length >= 6 ? (
                            <FaCheck color="green" />
                        ) : <FaTimes color="red" />}
                        {' '}Пароль должен содержать не менее 6 символов
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        {/\d/.test(password) && /[a-zA-Z]/.test(password) ? (
                            <FaCheck color="green" />
                        ) : <FaTimes color="red" />}
                        {' '}Пароль должен содержать и буквы, и цифры
                    </div>
                </FootNote>
                {error && <FootNote>{error}</FootNote>}
            </div>
            <EmptyBlock />
            <Basement isActive={check} onForward={handleSubmit} />
        </>
    );
}

export default PasswordStep;