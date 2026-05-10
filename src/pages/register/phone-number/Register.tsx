import { Link } from 'react-router-dom';
import { Header } from '@widgets';
import styles from './Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import { Basement } from '@widgets';
import checkPhoneExists from '@api';
import { useEffect, useState } from 'react';
import { useRegistration } from '@shared/Context/Registration';

function Register_phone_number() {
    const { data, updateData } = useRegistration();
    const [phone, setPhone] = useState(data.phone);
    const [formatedPhone, setFormatedPhone] = useState(formatPhone(data.phone));
    const [error, setError] = useState('');
    const [check, setCheck] = useState(false);

    function formatPhone(digits: string) {
        let formatted = '+7 (';
        formatted += digits.slice(0, 3).padEnd(3, '_');
        formatted += ') ';
        formatted += digits.slice(3, 6).padEnd(3, '_');
        formatted += '-';
        formatted += digits.slice(6, 8).padEnd(2, '_');
        formatted += '-';
        formatted += digits.slice(8, 10).padEnd(2, '_');
        return formatted;
    }

    useEffect(() => {
        if (data.phone.length === 10) {
            void validatePhone(data.phone);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handlePhone(value: React.ChangeEvent<HTMLInputElement>) {
        const currentValue = value.target.value;
        const lastChar = currentValue[currentValue.length - 1];

        if (/\d/.test(lastChar)) {
            const newPhone = (phone + lastChar).slice(0, 10);
            setPhone(newPhone);
            setFormatedPhone(formatPhone(newPhone));
            updateData({ phone: newPhone });
            setCheck(false);

            if (newPhone.length === 10 && newPhone !== phone) {
                await validatePhone(newPhone);
            }
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newPhone = phone.slice(0, -1);
            setPhone(newPhone);
            setFormatedPhone(formatPhone(newPhone));
            updateData({ phone: newPhone });
            setCheck(false);
        }
    }

    async function validatePhone(phoneValue: string) {
        try {
            const response = await checkPhoneExists(phoneValue);
            if (response.exists) {
                setError('Этот номер уже зарегистрирован');
            } else {
                setError('');
            }
            setCheck(!response.exists);
            console.log('Проверка номера:', response);
        } catch (error) {
            console.error('Ошибка проверки номера:', error);
            setCheck(false);
            setError('Ошибка проверки номера');
        }
    }

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Введите номер телефона</h1>
                <Input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    onInput={handlePhone}
                    onKeyDown={handleKeyDown}
                    value={formatedPhone}
                />
                <Link to="/register/sms-code"></Link>
                <FootNote>
                    {'Продолжая, вы соглашаетесь с условиями наших '}
                    <Link to={'/register'}>{'юридических документов'}</Link>
                </FootNote>
            </div>
            <div className="error">
                {error}
            </div>
            <EmptyBlock />
            <Basement to="/register/password" isActive={check} />
        </>
    );
}

export default Register_phone_number;
