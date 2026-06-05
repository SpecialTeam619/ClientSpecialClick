import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { HomeBasement } from '@widgets';
import { getTechniqueTypes, TechniqueTypeInfo } from '@api/techniques-type';

export default function CustomerHome() {
    const navigate = useNavigate();
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(-1);
    const [techniqueTypes, setTechniqueTypes] = useState<TechniqueTypeInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTechniqueTypes = async () => {
            try {
                const response = await getTechniqueTypes({ page: 1, limit: 100 });
                if (response?.data) {
                    setTechniqueTypes(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch technique types:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTechniqueTypes();
    }, []);

    const handleTechniqueTypeClick = (techniqueTypeId: string) => {
        navigate(`/order/setup?techniqueTypeId=${techniqueTypeId}`);
    };

    return (
        <>
            <h1 className={styles.pageTitle}>Выберите тип техники</h1>
            <div className={styles.fieldsetCard}>
                {loading ? (
                    <p>Загрузка...</p>
                ) : techniqueTypes.length === 0 ? (
                    <p>Типы техники не найдены</p>
                ) : (
                    techniqueTypes.map((card, index) => (
                        <label
                            className={`${styles.box} ${selectedTypeIndex === index ? styles.active : ''}`}
                            key={card.id}
                            onClick={() => card.id && handleTechniqueTypeClick(card.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <input
                                type="radio"
                                name="techniqueType"
                                value={index}
                                checked={selectedTypeIndex === index}
                                onChange={() => setSelectedTypeIndex(index)}
                                style={{ display: 'none' }}
                            />
                            <img
                                src={card.photoUrl || '/placeholder.jpg'}
                                alt={card.name}
                            />
                            <p className={styles.black}>
                                <span className={styles.green}>●</span> В наличии
                            </p>
                            <h3>{card.name}</h3>
                            <p className={styles.description}>{card.description}</p>
                        </label>
                    ))
                )}
            </div>
            <div className={styles.basementIndent} />
            <HomeBasement />
        </>
    );
}
