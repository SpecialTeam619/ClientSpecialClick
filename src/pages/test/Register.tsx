import { useState } from 'react';
import styles from './Register.module.css';
import img from './image.png';

function Test() {
    const [selectedRole, setSelectedRole] = useState('customer');

    return (
        <>
            <header className={styles.header}>
                <button className={styles.header_button}>×</button>
                <h3 className={styles.header_h3}>Заказать такси</h3>
                <p></p>
            </header>
            <div className={styles.main}>
                <img className={styles.logo} src={img} alt="Логотип СпецКлика" />;  
                
                <div className={styles.basement}>
                    <h1 className={styles.basement_h1}>Ты хочешь меня?</h1>
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
                                // style={{ display: 'none' }}
                            />
                            <p>Да</p>
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
                                // style={{ display: 'none' }}
                            />
                            <p>Сильно, сладкий</p>
                        </label>
                        <label
                            className={`${styles.box} ${selectedRole === '1' ? styles.active : ''}`}
                        >
                            <input
                                type="radio"
                                name="role"
                                value="1"
                                checked={selectedRole === '1'}
                                onChange={() => setSelectedRole('1')}
                                // style={{ display: 'none' }}
                            />
                            <p>Ало</p>
                        </label>
                        <label
                            className={`${styles.box} ${selectedRole === '2' ? styles.active : ''}`}
                        >
                            <input
                                type="radio"
                                name="role"
                                value="2"
                                checked={selectedRole === '2'}
                                onChange={() => setSelectedRole('2')}
                                // style={{ display: 'none' }}
                            />
                            <p>Другое</p>
                        </label>
                    </div>
                    <button className={styles.basement_button}>
                        Подтвердить
                    </button>
                </div>
            </div>
        </>
    );
}

export default Test;
