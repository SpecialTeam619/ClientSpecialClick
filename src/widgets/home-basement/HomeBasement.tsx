import { useNavigate } from 'react-router-dom';
import styles from './HomeBasement.module.css';
import homeIcon from '@shared/assets/Home.svg';
import ordersIcon from '@shared/assets/Orders.svg';
import profileIcon from '@shared/assets/Profile.svg';

type NavItem = {
    label: string;
    img: string;
    to: string;
};

const navItems: NavItem[] = [
    { label: 'Главная', img: homeIcon, to: '/' },
    { label: 'Заказы', img: ordersIcon, to: '/history' },
    { label: 'Профиль', img: profileIcon, to: '/profile' },
];

export default function HomeBasement() {
    const navigate = useNavigate();

    return (
        <nav className={styles.basement} aria-label="Нижняя навигация">
            {navItems.map((item) => (
                <button
                    key={item.to}
                    type="button"
                    className={styles.button}
                    onClick={() => navigate(item.to)}
                >
                    <img src={item.img} alt={item.label} />
                    <p>{item.label}</p>
                </button>
            ))}
        </nav>
    );
}
