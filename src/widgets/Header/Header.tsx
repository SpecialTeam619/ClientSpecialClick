import { Logo } from '@shared/ui';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div>
                <Logo style={{height: '2rem', width: 'auto'}}/>
            </div>
        </header>
    );
}
