import styles from '../homepage/HomePage.module.css';
import { FootNote, Logo, Button } from '@shared/ui';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <>
            <div className={styles.pageSeparator}>
                <h4 className={styles.logoText}>
                    Аренда спецтехники — <span style={{ fontWeight: 'bold' }}>это просто</span>
                </h4>
                <Logo direction="vertically" />
            </div>
            <div className={styles.pageSeparator}>
                <FootNote>
                    При входе и регистрации вы соглашаетесь с
                    <Link to="/privacy">политика обработки персональных данных</Link> 
                    и
                    <Link to="/terms">пользовательским соглашением</Link>
                </FootNote>
                <Button text="Начать" to="/register/name" />
            </div>
        </>
    );
}

export default HomePage;
