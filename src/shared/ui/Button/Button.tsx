import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({
    text = '',
    to,
    active = true,
}: {
    text?: string;
    to: string;
    active?: boolean;
}) {
    const handleClick = (event) => {
        if (!active) {
            event.preventDefault();
        }
    };

    return (
        <Link
            className={`${styles.button} ${active ? styles.active : ''}`}
            to={to}
            onClick={handleClick}
        >
            <h3>{text ? text : 'Продолжить'}</h3>
        </Link>
    );
}
