import styles from './Input.module.css';

export default function Input({...args}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input className={styles.input} {...args}/>
    );
}
