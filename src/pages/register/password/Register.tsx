import { Link } from 'react-router-dom';
import { Header } from '@widgets';
import styles from './Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import { Basement } from '@widgets';
import { useState } from 'react';
import { useRegistration } from '@shared/Context/Registration';
import { FaCheck, FaTimes } from 'react-icons/fa';

function Register_password() {
    const { data, updateData } = useRegistration();
    const [password, setPassword] = useState(data.password || '');

    function checkPassword(passwordValue: string) {
        const isValidLength = passwordValue.length >= 6;
        const hasLettersAndNumbers =
            /\d/.test(passwordValue) &&
            (/[a-zA-Z]/.test(passwordValue) ||
                /[a-zа-яё]/i.test(passwordValue));
        return { isValidLength, hasLettersAndNumbers };
    }

    const passwordCheck = checkPassword(password);
    const [check, setCheck] = useState(
        passwordCheck.isValidLength && passwordCheck.hasLettersAndNumbers,
    );

    function handlePassword(value: React.ChangeEvent<HTMLInputElement>) {
        const currentValue = value.target.value;
        setPassword(currentValue);
        updateData({ password: currentValue });

        const { isValidLength, hasLettersAndNumbers } =
            checkPassword(currentValue);
        setCheck(isValidLength && hasLettersAndNumbers);
    }

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Введите пароль</h1>
                <Input
                    type="password"
                    onInput={handlePassword}
                    // onKeyDown={handleKeyDown}
                    value={password}
                />
                <Link to="/register/sms-code"></Link>
                <FootNote>
                    <div style={{ textAlign: 'left' }}>
                        {passwordCheck.isValidLength ? (
                            <FaCheck color="green" />
                        ) : (
                            <FaTimes color="red" />
                        )}{' '}
                        Пароль должен содержать не менее 6 символов
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        {passwordCheck.hasLettersAndNumbers ? (
                            <FaCheck color="green" />
                        ) : (
                            <FaTimes color="red" />
                        )}{' '}
                        Пароль должен содержать и буквы, и цифры
                    </div>
                </FootNote>
            </div>
            <EmptyBlock />
            <Basement to="/register/role" isActive={check} />
        </>
    );
}

export default Register_password;
