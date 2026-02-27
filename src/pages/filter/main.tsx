import { useState } from 'react';
import styles from './style.module.css';
import technick from './img/technic.png';
import { Basement } from '@widgets';

export default function FilterPage() {
    const [selectedRole, setSelectedRole] = useState(-1);
    const data = [
        {
            name: 'Автовышка 32м',
            description:
                'Подходит для высотных работ: монтажа, подсветки, фасадных задач',
        },
        {
            name: 'Автовышка 5м',
            description:
                'Подходит для высотных работ: монтажа, подсветки, фасадных задач',
        },
        {
            name: 'Автовышка 3м',
            description:
                'Подходит для высотных работ: монтажа, подсветки, фасадных задач',
        },
    ];

    return (
        <>
            <div className={styles.fieldsetCard}>
                {data.map((card, index) => (
                    <label
                        className={`${styles.box} ${selectedRole === index ? styles.active : ''}`}
                        key={index}
                    >
                        <input
                            type="radio"
                            name="role"
                            value={index}
                            checked={selectedRole === index}
                            onChange={() => setSelectedRole(index)}
                            style={{ display: 'none' }}
                        />
                        <img src={technick} />
                        <p className={styles.black}>
                            <span className={styles.green}>●</span> В наличии
                        </p>
                        <h3>{card.name}</h3>
                        <p className={styles.description}>{card.description}</p>
                    </label>
                ))}
            </div>
            <div className={styles.basementIndent}></div>
            <Basement to="/cards" />
        </>
    );
}
