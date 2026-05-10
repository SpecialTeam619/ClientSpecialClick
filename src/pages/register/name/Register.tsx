import styles from './Register.module.css';
import { Input, FootNote, EmptyBlock } from '@shared/ui';
import { Basement, Header } from '@widgets';
import { useState } from 'react';
import { useRegistration } from '@shared/Context/Registration';
import { Link } from 'react-router-dom';

function Register_name() {
    const { data, updateData } = useRegistration();
    const [name, setName] = useState(data.name || '');
    const isValidName = name.trim() !== '';

    function handleName(e: React.FormEvent<HTMLInputElement>) {
        const currentValue = (e.target as HTMLInputElement).value;
        setName(currentValue);
        updateData({ name: currentValue });
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
                <FootNote>
                    {'Уже есть аккаунт? '}
                    <Link to="/login" className={styles.login}>
                        {'Войти'}
                    </Link>
                </FootNote>
            </div>
            <EmptyBlock />
            <Basement to="/register/phone" isActive={isValidName} />
        </>
    );
}

export default Register_name;
