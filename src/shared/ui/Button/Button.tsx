import { useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';
import styles from './Button.module.css';

export default function Button({
    text = '',
    to,
    active = true,
    onClick,
    style = ''
}: {
    text?: string;
    to?: string;
    active?: boolean;
    style?: string;
    onClick?: (
        event: MouseEvent<HTMLButtonElement>,
    ) => void | Promise<void | boolean> | boolean;
}) {
    const navigate = useNavigate();

    const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
        if (!active) {
            event.preventDefault();
            return;
        }

        event.preventDefault();
        const result = onClick ? await onClick(event) : undefined;

        if (result !== false) {
            if (to) {
                navigate(to);
            }
        }
    };

    return (
        <button
            className={`${styles.button} ${active ? styles.active : ''} ${styles[style]}`}
            onClick={handleClick}
        >
            <h3>{text ? text : 'Продолжить'}</h3>
        </button>
    );
}
