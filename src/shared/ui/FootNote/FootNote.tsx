import type { ReactNode } from 'react';
import styles from "./FootNote.module.css";

export default function FootNote({ children }: {
    children: ReactNode
}) {
    return (
        <p className={styles.footNote}>
            {children}
        </p>
    );
}
