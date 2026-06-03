import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Header, Basement } from '@widgets';
import styles from '../../../pages/register/phone-number/Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import { useRegistration } from '../model/RegistrationContext';

const PHONE_PREFIX = '+7';
const PHONE_DIGITS_COUNT = 11;
const PHONE_LENGTH = PHONE_PREFIX.length + 10;

function normalizePhone(value: string) {
    const digits = value.replace(/\D/g, '');
    let normalizedDigits = digits;

    if (normalizedDigits.startsWith('8')) {
        normalizedDigits = `7${normalizedDigits.slice(1)}`;
    }

    if (normalizedDigits.startsWith('7')) {
        normalizedDigits = normalizedDigits.slice(1);
    }

    return `${PHONE_PREFIX}${normalizedDigits.slice(0, 10)}`;
}

function isValidPhone(value: string) {
    return new RegExp(`^\\+7\\d{10}$`).test(value);
}

function PhoneStep() {
    const { data, updateData } = useRegistration();
    const [phone, setPhone] = useState(
        data.phone ? normalizePhone(data.phone) : PHONE_PREFIX,
    );
    const [error, setError] = useState('');
    const [check, setCheck] = useState(false);

    useEffect(() => {
        setCheck(isValidPhone(phone));
    }, [phone]);

    async function handlePhone(value: ChangeEvent<HTMLInputElement>) {
        const normalizedPhone = normalizePhone(value.target.value);

        setPhone(normalizedPhone);
        updateData({ phone: normalizedPhone });

        if (normalizedPhone === PHONE_PREFIX || isValidPhone(normalizedPhone)) {
            setError('');
        } else {
            setError(
                `Введите номер в формате +7XXXXXXXXXX (${PHONE_DIGITS_COUNT} цифр)`,
            );
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
                        maxLength={PHONE_LENGTH}
                        onChange={handlePhone}
                        value={phone}
                    />
                </div>
                <FootNote>
                    {'Продолжая, вы соглашаетесь с условиями наших '}
                    <Link to={'/register'}>{'юридических документов'}</Link>
                </FootNote>
                {error && <FootNote>{error}</FootNote>}
            </div>
            <EmptyBlock />
            <Basement to="/register/password" isActive={check} />
        </>
    );
}

export default PhoneStep;
