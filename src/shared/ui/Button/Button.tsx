import { useNavigate, Link } from 'react-router-dom';
import type { MouseEvent } from 'react';
import styles from './Button.module.css';

export default function Button({
    text = '',
    to,
    active = true,
    onClick,
}: {
    text?: string;
    to: string;
    active?: boolean;
    onClick?: (
        event: MouseEvent<HTMLAnchorElement>,
    ) => void | Promise<void | boolean> | boolean;
}) {
    const navigate = useNavigate();

    const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
        if (!active) {
            event.preventDefault();
            return;
        }

        if (!onClick) {
            return;
        }

        event.preventDefault();
        const result = await onClick(event);

        if (result !== false) {
            navigate(to);
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
