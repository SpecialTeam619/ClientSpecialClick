import styles from './Input.module.css';

export default function Input({type, placeholder, setInput}: {
    type: string,
    placeholder?: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
}) {
    return (
        <input className={styles.input} type={type} placeholder={placeholder} onChange={(e) => setInput(e.target.value)}/>
    );
}
