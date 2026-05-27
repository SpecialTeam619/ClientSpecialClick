import { useNavigate } from 'react-router-dom';
import styles from './Basement.module.css';
import icon from './img/icon.png';
import { Button } from '@shared/ui';

export default function Basement({
    to,
    isActive = true,
    placeholder,
    onForward,
}: {
    to?: string;
    isActive?: boolean;
    placeholder?: string;
    onForward?: () => void | Promise<void | boolean> | boolean;
}) {
    const navigate = useNavigate();

    return (
        <div className={styles.basement}>
            <button
                type="button"
                className={styles.link}
                onClick={() => navigate(-1)}
            >
                <img src={icon} />
            </button>
            <Button
                to={to}
                active={isActive}
                text={placeholder}
                onClick={onForward}
            />
        </div>
    );
}
