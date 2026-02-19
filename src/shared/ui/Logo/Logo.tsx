import styles from './Logo.module.css';
import logoImage from './img/Logo.png';

export default function Logo({ onClick }: { onClick?: () => void }) {
    return <img className={styles.logo} onClick={onClick} src={logoImage} alt="Логотип СпецКлика" />;  
}
