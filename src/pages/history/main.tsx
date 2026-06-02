import { FilterBasement } from '@widgets';
import styles from './style.module.css';

export default function HistoryPage() {
    return (
        <>
            <main className={styles.main}>
                <h1>История заказов</h1>
                <p>Здесь будут отображаться ваши заказы.</p>
            </main>
            <div className={styles.basementIndent}></div>
            <FilterBasement />
        </>
    );
}
