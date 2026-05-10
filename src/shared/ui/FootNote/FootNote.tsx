import type { ReactNode } from 'react';
import styles from './FootNote.module.css';

export default function FootNote({ children }: { children?: ReactNode }) {
    return <div className={styles.footNote}>{children}</div>;
}
