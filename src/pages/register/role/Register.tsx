import { Header, Basement } from '@widgets';
import styles from './Register.module.css';
import { useState } from 'react';
import { EmptyBlock } from '@shared/ui';
import { useRegistration } from '@shared/Context';

function Register_role() {
    const { data, updateData, submitRegistration } = useRegistration();
    const [selectedRole, setSelectedRole] = useState(data.role || 'CUSTOMER');

    function handleRoleChange(role: string) {
        setSelectedRole(role);
        updateData({ role });
    }

    async function handleSubmit() {
        try {
            await submitRegistration();
        } catch (error) {
            console.error('Не удалось завершить регистрацию:', error);
            return false;
        }
    }

    const isReady = Boolean(data.phone && data.password && selectedRole);

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Кто вы?</h1>
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
                        <h3>Я заказчик</h3>
                        <p>Мне нужна спецтехника</p>
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
                        <h3>Я арендoдатель</h3>
                        <p>У меня есть спецтехника</p>
                    </label>
                </div>
            </div>
            <EmptyBlock />
            <Basement
                to="/adress"
                isActive={isReady}
                onForward={handleSubmit}
            />
        </>
    );
}

export default Register_role;
