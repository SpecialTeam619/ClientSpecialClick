import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Header, Basement } from '@widgets';
import styles from '../../../pages/register/phone-number/Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import checkPhoneExists from '@api';
import { useRegistration } from '../model/RegistrationContext';

// function formatPhone(digits: string) {
//     let formatted = '(';
//     formatted += digits.slice(0, 3).padEnd(3, '_');
//     formatted += ') ';
//     formatted += digits.slice(3, 6).padEnd(3, '_');
//     formatted += '-';
//     formatted += digits.slice(6, 8).padEnd(2, '_');
//     formatted += '-';
//     formatted += digits.slice(8, 10).padEnd(2, '_');
//     return formatted;
// }

function PhoneStep() {
    const { data, updateData } = useRegistration();
    const [phone, setPhone] = useState(data.phone || '+7');
    const [error, setError] = useState('');
    const [check, setCheck] = useState(false);

    useEffect(() => {
        if (data.phone.length === 12) {
            void validatePhone(data.phone);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function validatePhone(phoneValue: string) {
        try {
            const response = await checkPhoneExists(phoneValue);
            setError(response.exists ? 'Этот номер уже зарегистрирован' : '');
            setCheck(!response.exists);
        } catch (validationError) {
            console.error('Ошибка проверки номера:', validationError);
            setCheck(false);
            setError('Ошибка проверки номера');
        }
    }

    async function handlePhone(value: ChangeEvent<HTMLInputElement>) {
        const digits = value.target.value.slice(0, 12);
        setPhone(digits);
        updateData({ phone: digits });
        setCheck(false);

        if (digits.length === 12) {
            await validatePhone(digits);
        } else {
            setError('');
        }
    }

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Введите номер телефона</h1>
                <div className={styles.phoneField}>
                    <Input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        inputMode="numeric"
                        autoComplete="tel"
                        onChange={handlePhone}
                        // value={phone ? formatPhone(phone) : ''}
                        value={phone}
                    />
                </div>
                <FootNote>
                    {'Продолжая, вы соглашаетесь с условиями наших '}
                    <Link to={'/register'}>{'юридических документов'}</Link>
                </FootNote>
            </div>
            <div className="error">{error}</div>
            <EmptyBlock />
            <Basement to="/register/password" isActive={check} />
        </>
    );
}

export default PhoneStep;
