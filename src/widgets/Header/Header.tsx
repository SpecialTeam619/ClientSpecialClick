import { Logo } from '@shared/ui';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div>
                <Logo/>
            </div>
        </header>
    );
}
