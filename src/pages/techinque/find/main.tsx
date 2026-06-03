import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './style.module.css';
import { HomeBasement } from '@widgets';
import { getTechniques, Technique } from '@api/techniques';
import { getTechniqueTypes, TechniqueTypeInfo } from '@api/techniques-type';
import TechniqueDetailModal from './TechniqueDetailModal';

export default function FindTechniques() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [techniqueType, setTechniqueType] = useState<TechniqueTypeInfo | null>(null);
    const [techniques, setTechniques] = useState<Technique[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | null>(
        null,
    );

    const techniqueTypeId = searchParams.get('techniqueTypeId');

    const fetchTechniques = useCallback(async () => {
        setLoading(true);

        try {
            if (techniqueTypeId) {
                const typesResponse = await getTechniqueTypes({
                    page: 1,
                    limit: 100,
                });
                const foundType = typesResponse.data.find(
                    (t) => t.id === techniqueTypeId,
                );
                setTechniqueType(foundType || null);
            } else {
                setTechniqueType(null);
            }

            const techniquesResponse = await getTechniques({
                page: 1,
                limit: 50,
                ...(techniqueTypeId && { techniqueTypeId }),
            });

            setTechniques(techniquesResponse?.data ?? []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setTechniques([]);
        } finally {
            setLoading(false);
        }
    }, [techniqueTypeId]);

    useEffect(() => {
        fetchTechniques();
    }, [fetchTechniques]);

    const handleBack = () => {
        navigate('/');
    };

    const handleRented = () => {
        fetchTechniques();
    };

    return (
        <>
            <div className={styles.container}>
                <button onClick={handleBack} className={styles.backButton}>
                    ← Назад
                </button>

                {techniqueType && (
                    <div className={styles.header}>
                        <h1>{techniqueType.name}</h1>
                        <p>{techniqueType.description}</p>
                    </div>
                )}

                <div className={styles.fieldsetCard}>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : techniques.length === 0 ? (
                        <p>Техника не найдена</p>
                    ) : (
                        techniques.map((technique) => (
                            <button
                                key={technique.id}
                                type="button"
                                className={styles.box}
                                onClick={() =>
                                    setSelectedTechniqueId(technique.id)
                                }
                            >
                                <p className={styles.black}>
                                    <span className={styles.green}>●</span>{' '}
                                    {technique.status === 'IN_STOCK'
                                        ? 'В наличии'
                                        : 'Арендована'}
                                </p>
                                <h3>{technique.name}</h3>
                                {technique.owner && (
                                    <p className={styles.lessorName}>
                                        Арендодатель: {technique.owner.name}
                                    </p>
                                )}
                                <p className={styles.description}>
                                    {technique.description}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <TechniqueDetailModal
                techniqueId={selectedTechniqueId}
                onClose={() => setSelectedTechniqueId(null)}
                onRented={handleRented}
            />

            <div className={styles.basementIndent} />
            <HomeBasement />
        </>
    );
}
