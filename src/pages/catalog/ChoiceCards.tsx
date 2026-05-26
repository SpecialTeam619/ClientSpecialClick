import { useState } from 'react';
import styles from './ChoiseCards.module.css';
import technick from './img/technic.png';
import { Basement } from '@widgets';

export default function ChoiceCards() {
    const [selectedRole, setSelectedRole] = useState(-1);
    const data = [
        {
            name: 'Автовышка 32м',
            price: '15000₽/смена',
            description:
                'Подходит для высотных работ: монтажа, подсветки, фасадных задач',
            additional: 'Корзина 2 чел • Вынос 5 м',
        },
        {
            name: 'Автовышка 5м',
            price: '15000₽/смена',
            description:
                'Подходит для высотных работ: монтажа, подсветки, фасадных задач',
            additional: 'Корзина 2 чел • Вынос 5 м',
        },
        {
            name: 'Автовышка 3м',
            price: '15000₽/смена',
            description:
                'Подходит для высотных работ: монтажа, подсветки, фасадных задач',
            additional: 'Корзина 2 чел • Вынос 5 м',
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
                        {/* <p>{card.description}</p> */}
                        <p className={styles.additional}>{card.additional}</p>
                        <h3>{card.price}</h3>
                    </label>
                ))}
            </div>
            <div className={styles.basementIndent}></div>
            <Basement to="/cards" />
        </>
    );
}
