import { useNavigate } from 'react-router-dom';
import { Header, Basement } from '@widgets';
import styles from '../../../pages/register/role/Register.module.css';
import { useState } from 'react';
import { EmptyBlock } from '@shared/ui';
import { useRegistration } from '../model/RegistrationContext';
import customerIcon from '@shared/assets/customer-icon.svg';
import lessorIcon from '@shared/assets/lessor-icon.svg';
import checkPhoneExists from '@api/phone';
import login from '@api/login';
import { ACCESS_TOKEN_KEY } from '@api';

function RoleStep() {
    const { data, updateData, clearData } =
        useRegistration();
    const [selectedRole, setSelectedRole] = useState(data.role || 'CUSTOMER');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleRoleChange(role: string) {
        setSelectedRole(role);
        updateData({ role });
    }

    async function handleSubmit() {
        setError('');

        const phoneCheck = await checkPhoneExists(data.phone);

        if (phoneCheck.exists) {
            try {
                const response = await login(data.phone, data.password);

                if (!response.access_token) {
                    throw new Error('Не удалось получить токен');
                }

                localStorage.setItem(
                    ACCESS_TOKEN_KEY,
                    response.access_token,
                );
                clearData();
                navigate('/home');
                return;
            } catch {
                setError('Неверный номер телефона или пароль');
                return false;
            }
        }  else {
            navigate('/register/name');
        }
    }

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Выбор роли</h1>
                <div className={styles.fieldsetRole}>
                    <label
                        className={`${styles.box} ${selectedRole === 'CUSTOMER' ? styles.active : ''}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="CUSTOMER"
                            checked={selectedRole === 'CUSTOMER'}
                            onChange={() => handleRoleChange('CUSTOMER')}
                            style={{ display: 'none' }}
                        />
                        <img src={customerIcon} alt="Заказчик" />
                        <div className={styles.text_box}>
                            <h3>Я заказчик</h3>
                            <p>Мне нужна спецтехника</p>
                        </div>
                        <input
                            type="radio"
                            name="choice"
                            value="2"
                            checked={selectedRole === 'CUSTOMER'}
                        />
                    </label>

                    <label
                        className={`${styles.box} ${selectedRole === 'LESSOR' ? styles.active : ''}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="LESSOR"
                            checked={selectedRole === 'LESSOR'}
                            onChange={() => handleRoleChange('LESSOR')}
                            style={{ display: 'none' }}
                        />
                        <img src={lessorIcon} alt="Арендodатель" />
                        <div className={styles.text_box}>
                            <h3>Я арендoдатель</h3>
                            <p>У меня есть спецтехника</p>
                        </div>
                        <input
                            type="radio"
                            name="choice"
                            value="2"
                            checked={selectedRole === 'LESSOR'}
                        />
                    </label>
                </div>
                {error ? (
                    <div style={{ color: '#b00020', marginTop: '1rem' }}>
                        {error}
                    </div>
                ) : null}
            </div>
            <EmptyBlock />
            <Basement
                // to="/address"
                // isActive={isReady}
                onForward={handleSubmit}
            />
        </>
    );
}

export default RoleStep;
