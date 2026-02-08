import { useState } from 'react';
import styles from './ChoiseCards.module.css';
import technick from './img/technic.png';
import { Basement } from '@widgets';

export default function ChoiseCards() {
    const [selectedRole, setSelectedRole] = useState('v1');
    const cards = ['Автовышка 32м', 'Манипулятор 5т', 'Эвакуатор 4,5м', '1', '2', '3', '4', '5', '6'];

    return (
        <>
            <div className={styles.fieldsetCard}>
                {cards.map((card, index) => (
                    <label
                        className={`${styles.box} ${selectedRole === card ? styles.active : ''}`}
                        key={index}
                    >
                        <input
                            type="radio"
                            name="role"
                            value={card}
                            checked={selectedRole === card}
                            onChange={() => setSelectedRole(card)}
                            style={{ display: 'none' }}
                        />
                        <img src={technick} />
                        <p className={styles.black}>
                            <span className={styles.green}>●</span> В наличии
                        </p>
                        <h3>{card}</h3>
                        <p>
                            Подходит для высотных работ: монтажа, подсветки,
                            фасадных задач
                        </p>
                        <p className={styles.additional}>Корзина 2 чел • Вынос 5 м</p>
                        <h3>15000₽/смена</h3>
                    </label>
                ))}
            </div>
            <Basement to="/"/>
        </>
    );
}
