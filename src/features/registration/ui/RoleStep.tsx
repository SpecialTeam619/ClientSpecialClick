
import { Header, Basement } from '@widgets';
import styles from '../../../pages/register/role/Register.module.css';
import { EmptyBlock } from '@shared/ui';
import { useRegistration } from '../model/RegistrationContext';
import customerIcon from '@shared/assets/customer-icon.svg';
import lessorIcon from '@shared/assets/lessor-icon.svg';

function RoleStep() {
    const { data, updateData } = useRegistration();

    function handleRoleChange(role: string) {
        updateData({ role });
    }

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Выбор роли</h1>
                <div className={styles.fieldsetRole}>
                    <label
                        className={`${styles.box} ${data.role === 'CUSTOMER' ? styles.active : ''}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="CUSTOMER"
                            checked={data.role === 'CUSTOMER'}
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
                            checked={data.role === 'CUSTOMER'}
                        />
                    </label>

                    <label
                        className={`${styles.box} ${data.role === 'LESSOR' ? styles.active : ''}`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value="LESSOR"
                            checked={data.role === 'LESSOR'}
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
                            checked={data.role === 'LESSOR'}
                        />
                    </label>
                </div>
            </div>
            <EmptyBlock />
            <Basement
                // to="/address"
                to="/register/name"
            />
        </>
    );
}

export default RoleStep;
