import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header, Basement } from '@widgets';
import styles from './Register.module.css';
import { EmptyBlock, FootNote } from '@shared/ui';

function Register_sms_code() {
    const [codes, setCodes] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [active, setActive] = useState(false)

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(0, 1);

        const newCodes = [...codes];
        newCodes[index] = digit;
        setCodes(newCodes);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
            inputRefs.current[index + 1]?.select();
        }
        
        if (newCodes.every(elem => elem !== '')) {
            setActive(true);
        } else {
            setActive(false)
        }
    };

    const handleFocus = () => {};

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace' && !codes[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);

        if (pastedData.length > 0) {
            const newCodes = [...codes];
            for (let i = 0; i < 6; i++) {
                newCodes[i] = pastedData[i] || '';
            }
            setCodes(newCodes);

            const nextIndex = Math.min(pastedData.length, 5);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    return (
        <>
            <Header />
            <div className={styles.main}>
                <h1>Введите код с SMS</h1>
                <h5 className={styles.title}>
                    {'на номер +7 (999) 999 99 99'}
                </h5>
                <div className={styles.fieldset} onPaste={handlePaste}>
                    <label className={styles.box}>
                        <input
                            ref={(el) => {
                                inputRefs.current[0] = el;
                            }}
                            className={styles.field}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={codes[0]}
                            onChange={(e) => handleChange(0, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(0, e)}
                            onFocus={handleFocus}
                            placeholder=""
                        />
                    </label>
                    <label className={styles.box}>
                        <input
                            ref={(el) => {
                                inputRefs.current[1] = el;
                            }}
                            className={styles.field}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={codes[1]}
                            onChange={(e) => handleChange(1, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(1, e)}
                            onFocus={handleFocus}
                            placeholder=""
                        />
                    </label>
                    <label className={styles.box}>
                        <input
                            ref={(el) => {
                                inputRefs.current[2] = el;
                            }}
                            className={styles.field}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={codes[2]}
                            onChange={(e) => handleChange(2, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(2, e)}
                            onFocus={handleFocus}
                            placeholder=""
                        />
                    </label>
                    <div className={styles.separator}></div>
                    <label className={styles.box}>
                        <input
                            ref={(el) => {
                                inputRefs.current[3] = el;
                            }}
                            className={styles.field}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={codes[3]}
                            onChange={(e) => handleChange(3, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(3, e)}
                            onFocus={handleFocus}
                            placeholder=""
                        />
                    </label>
                    <label className={styles.box}>
                        <input
                            ref={(el) => {
                                inputRefs.current[4] = el;
                            }}
                            className={styles.field}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={codes[4]}
                            onChange={(e) => handleChange(4, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(4, e)}
                            onFocus={handleFocus}
                            placeholder=""
                        />
                    </label>
                    <label className={styles.box}>
                        <input
                            ref={(el) => {
                                inputRefs.current[5] = el;
                            }}
                            className={styles.field}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={codes[5]}
                            onChange={(e) => handleChange(5, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(5, e)}
                            onFocus={handleFocus}
                            placeholder=""
                        />
                    </label>
                </div>
                <FootNote>
                    <Link to={'/register'}>{'Отправить заново'}</Link>
                    {' (15s)'}
                </FootNote>
            </div>
            <EmptyBlock />
            <Basement to="/register/role" isActive={active}/>
        </>
    );
}

export default Register_sms_code;
