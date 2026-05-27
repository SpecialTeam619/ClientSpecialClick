import styles from './Logo.module.css';
import logoImage from '@shared/assets/logo.svg';

export default function Logo({
    onClick,
    direction = 'horizontally',
    style,
}: {
    onClick?: () => void;
    direction?: 'horizontally' | 'vertically';
    style?: React.CSSProperties;
}) {
    return (
        <div style={{ flexDirection: direction === 'horizontally' ? 'row' : 'column' }} className={styles.logoContainer}>
            <img
                className={styles.logo}
                style={style}
                onClick={onClick}
                src={logoImage}
                alt="Логотип СпецКлика"
            />
            <h2 className={styles.logoText}>
                спецклик
            </h2>
        </div>
    );
}
