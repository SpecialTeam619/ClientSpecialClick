import { Link } from 'react-router-dom';
import styles from './Basement.module.css';
import icon from './img/icon.png';
import { Button } from '@shared/ui';

export default function Basement({ to, isActive=true }: { to: string, isActive?: boolean }) {
    return (
        <div className={styles.basement}>
            <Link to={-1} className={styles.link}>
                <img src={icon} />
            </Link>
            <Button to={to} active={isActive}/>
        </div>
    );
}
