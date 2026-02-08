import styles from './HomePage.module.css';
import { FootNote, Logo, Button } from '@shared/ui';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <>
            <div className={styles.pageSeparator}>
                <h4 className={styles.logoText}>Аренда спецтехники рядом с вами</h4>
                <Logo />
            </div>
            <div className={styles.pageSeparator}>
                <FootNote>
                    {'Уже есть аккаунт? '}
                    <Link to="/login">{'Войти'}</Link>
                </FootNote>
                <Button text="Начать" to="/register"/>
            </div>
        </>
    );
}

export default HomePage;
