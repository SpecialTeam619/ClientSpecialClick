import { Header, Basement } from '@widgets';
import styles from './Register.module.css';
import { useState } from 'react';
import { EmptyBlock } from '@shared/ui';

function Register_role() {
    const [selectedRole, setSelectedRole] = useState('customer');

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Кто вы?</h1>
                <div className={styles.fieldsetRole}>
                    <label
                        className={`${styles.box} ${selectedRole === 'customer' ? styles.active : ''}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="customer"
                            checked={selectedRole === 'customer'}
                            onChange={() => setSelectedRole('customer')}
                            style={{ display: 'none' }}
                        />
                        <h3>Я заказчик</h3>
                        <p>Мне нужна спецтехника</p>
                    </label>

                    <label
                        className={`${styles.box} ${selectedRole === 'vendor' ? styles.active : ''}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="vendor"
                            checked={selectedRole === 'vendor'}
                            onChange={() => setSelectedRole('vendor')}
                            style={{ display: 'none' }}
                        />
                        <h3>Я арендодатель</h3>
                        <p>У меня есть спецтехника</p>
                    </label>
                </div>
            </div>
            <EmptyBlock />
            <Basement to="/cards/filter" />
        </>
    );
}

export default Register_role;
