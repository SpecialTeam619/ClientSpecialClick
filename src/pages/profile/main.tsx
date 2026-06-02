import { FilterBasement } from '@widgets';
import styles from './style.module.css';

export default function ProfilePage() {
    return (
        <>
            <main className={styles.main}>
                <h1>Профиль</h1>
                <p>Здесь будут отображаться данные вашего профиля.</p>
            </main>
            <div className={styles.basementIndent}></div>
            <FilterBasement />
        </>
    );
}
