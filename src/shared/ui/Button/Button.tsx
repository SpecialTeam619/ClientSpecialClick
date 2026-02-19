import { Link } from 'react-router-dom';
import styles from './Button.module.css';
import { Squircle } from 'corner-smoothing';

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
        <Squircle
            cornerRadius={20}
            cornerSmoothing={1}
            preserveSmoothing={true}
            className={`${styles.button} ${active ? styles.active : ''}`}
        >
            <Link className={styles.link} to={to} onClick={handleClick}>
                <h3>{text ? text : 'Продолжить'}</h3>
            </Link>
        </Squircle>
    );
}
