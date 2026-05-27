import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Header, Basement } from '@widgets';
import styles from '../../../pages/register/phone-number/Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import { useRegistration } from '../model/RegistrationContext';

function PhoneStep() {
    const { data, updateData } = useRegistration();
    const [phone, setPhone] = useState(data.phone || '+7');
    const [error, setError] = useState('');
    const [check, setCheck] = useState(false);

    useEffect(() => {
        if (data.phone.length === 12) {
            setCheck(true);
        } else {
            setCheck(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handlePhone(value: ChangeEvent<HTMLInputElement>) {
        setPhone(value.target.value);
        updateData({ phone: value.target.value });
        setCheck(false);

        if (value.target.value.length === 12) {
            setCheck(true);
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
