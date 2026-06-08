import styles from './IntroductoryPage.module.css';
import { FootNote, Logo, Button } from '@shared/ui';
import { Link } from 'react-router-dom';
import EmblaCarousel from '@widgets/EmblaCarousel';
import type { EmblaOptionsType } from 'embla-carousel';
import './embla.css';

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDES = [
    <div className={`${styles.customSlide} ${styles.slide1}`} key="slide1">
        <div className={styles.blackout}>
            <h3>Техника за 15 минут</h3>
            <p>
                Выбери тип, укажи адрес — система сама найдёт свободную машину
                рядом.
            </p>
        </div>
    </div>,
    <div className={`${styles.customSlide} ${styles.slide2}`} key="slide2">
        <div className={styles.blackout}>
            <h3>Только проверенная техника</h3>
            <p>
                Каждый исполнитель проходит проверку. Видишь реальные оценки от
                реальных заказчиков.
            </p>
        </div>
    </div>,
    <div className={`${styles.customSlide} ${styles.slide3}`} key="slide3">
        <div className={styles.blackout}>
            <h3>Знай где техника в любой момент</h3>
            <p>
                Следи за маршрутом на карте, получай уведомления и продли смену не
                выходя из приложения.
            </p>
        </div>
    </div>,
];

function IntroductoryPage() {
    return (
        <main className={styles.main}>
            <Logo direction="horizontally" style={{ height: '2rem' }} />
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
            <Button text="Начать" to="/register/phone" />
            <FootNote>
                При входе и регистрации вы соглашаетесь с{' '}
                <Link to="/privacy">
                    политикой обработки персональных данных
                </Link>{' '}
                и <Link to="/terms">пользовательским соглашением</Link>
            </FootNote>
        </main>
    );
}

export default IntroductoryPage;
