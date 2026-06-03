import React from 'react';
import styles from './Input.module.css';

const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...args }, ref) {
    return (
        <input
            ref={ref}
            className={[styles.input, className].filter(Boolean).join(' ')}
            {...args}
        />
    );
});

Input.displayName = 'Input';
export default Input;
