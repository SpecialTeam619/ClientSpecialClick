import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { HomeBasement } from '@widgets';
import { getTechniqueTypes } from '@api/techniques-type';
import type { TechniqueTypeInfo } from '@api/techniques-type';
import { me, type User } from '@api/users';
import { CiSearch } from "react-icons/ci";

export default function CustomerHome() {
    const navigate = useNavigate();
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(-1);
    const [techniqueTypes, setTechniqueTypes] = useState<TechniqueTypeInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [search] = useState('');
    const [filteredTechniqueTypes, setFilteredTechniqueTypes] = useState<TechniqueTypeInfo[]>([]);

    useEffect(() => {
        setFilteredTechniqueTypes(techniqueTypes);
    }, [techniqueTypes]);

    useEffect(() => {
        const fetchTechniqueTypes = async () => {
            try {
                const response = await getTechniqueTypes({ page: 1, limit: 100 });
                if (response?.data) {
                    setTechniqueTypes(response.data);
                }

                const user = await me();
                if (user) {
                    setUser(user);
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

    const handleSearch = async (search: string) => {
        const filteredTechniqueTypes = techniqueTypes.filter((type) => type?.name?.toLowerCase().includes(search.toLowerCase()));
        if (filteredTechniqueTypes) {
            setFilteredTechniqueTypes(filteredTechniqueTypes);
        }
    };

    return (    
        <>
            <h1 className={styles.pageTitle}>Добрый день, {user?.name}</h1>
            <h2 className={styles.pageSubtitle}>Что ищем сегодня?</h2>
            <div className={styles.searchContainer}>
                <button type="button" className={styles.searchButton} onClick={() => handleSearch(search)}>
                    <CiSearch size={24} />
                </button>
                <input type="text" placeholder="Поиск" className={styles.searchInput} onChange={(e) => handleSearch(e.target.value)} />
            </div>
            <div className={styles.fieldsetCard}>
                {loading ? (
                    <p>Загрузка...</p>
                ) : filteredTechniqueTypes.length === 0 ? (
                    <p>Типы техники не найдены</p>
                ) : (
                    filteredTechniqueTypes.map((card, index) => (
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
