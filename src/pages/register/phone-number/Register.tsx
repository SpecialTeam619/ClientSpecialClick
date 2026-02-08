import { Link } from 'react-router-dom';
import { Header } from '@widgets';
import styles from './Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import { Basement } from '@widgets';
import { useState } from 'react';

function Register_phone_number() {
    const [phone, setPhone] = useState('');
    const [check, setCheck] = useState(false);

    function handlePhone(value) {
        setPhone(value);
        if (String(value) === '') {
            setCheck(false);
        } else {
            setCheck(true)
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
                    setInput={handlePhone}
                />
                <Link to="/register/sms-code"></Link>
                <FootNote>
                    {'Продолжая, вы соглашаетесь с условиями наших '}
                    <Link to={'/register'}>{'юридических документов'}</Link>
                </FootNote>
            </div>
            <EmptyBlock />
            <Basement to="/register/sms-code" isActive={check} />
        </>
    );
}

export default Register_phone_number;
