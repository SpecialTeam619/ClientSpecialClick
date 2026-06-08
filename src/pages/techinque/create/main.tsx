import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { Input, EmptyBlock } from '@shared/ui';
import { Basement } from '@widgets';
import { createTechnique } from '@api/techniques';
import { getTechniqueTypes } from '@api/techniques-type';
import type { TechniqueTypeInfo } from '@api/techniques-type';
import { getStoredUserRole } from '@shared/lib/auth';

function CreateTechniquePage() {
    const navigate = useNavigate();
    const role = getStoredUserRole();

    const [name, setName] = useState('');
    const [techniqueTypeId, setTechniqueTypeId] = useState('');
    const [description, setDescription] = useState('');
    const [properties, setProperties] = useState(['']);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [techniqueTypes, setTechniqueTypes] = useState<TechniqueTypeInfo[]>([]);
    const [typesLoading, setTypesLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await getTechniqueTypes({ page: 1, limit: 100 });
                const types = response?.data ?? [];
                setTechniqueTypes(types);
                if (types.length === 1 && types[0]?.id) {
                    setTechniqueTypeId(types[0].id);
                }
            } catch {
                setError('Не удалось загрузить типы техники');
            } finally {
                setTypesLoading(false);
            }
        };

        fetchTypes();
    }, []);

    const trimmedProperties = useMemo(
        () => properties.map((item) => item.trim()).filter(Boolean),
        [properties],
    );

    const isValid =
        name.trim() !== '' &&
        techniqueTypeId !== '' &&
        description.trim() !== '' &&
        trimmedProperties.length > 0 &&
        !submitting &&
        !typesLoading;

    const handlePropertyChange = (index: number, value: string) => {
        setProperties((prev) =>
            prev.map((item, i) => (i === index ? value : item)),
        );
    };

    const handleAddProperty = () => {
        setProperties((prev) => [...prev, '']);
    };

    const handleRemoveProperty = (index: number) => {
        setProperties((prev) =>
            prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
        );
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        setImage(file);

        if (!file) {
            setImagePreview('');
            return;
        }

        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!isValid) {
            return false;
        }

        if (role !== 'LESSOR') {
            setError('Создавать технику могут только арендодатели');
            return false;
        }

        setError('');
        setSubmitting(true);

        try {
            await createTechnique({
                name: name.trim(),
                techniqueTypeId,
                description: description.trim(),
                property: trimmedProperties,
                image,
            });
            navigate('/', { replace: true });
            return true;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Не удалось создать технику';
            setError(message);
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    if (role !== 'LESSOR') {
        return (
            <div className={styles.main}>
                <h1>Создание техники</h1>
                <p className={styles.hint}>
                    Эта страница доступна только арендодателям.
                </p>
                <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => navigate('/')}
                >
                    На главную
                </button>
            </div>
        );
    }

    return (
        <>
            <div className={styles.main}>
                <h1>Создание техники</h1>

                <label className={styles.label} htmlFor="technique-name">
                    Название
                </label>
                <Input
                    id="technique-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например, Экскаватор JCB"
                    maxLength={255}
                />

                <label className={styles.label} htmlFor="technique-type">
                    Тип техники
                </label>
                <select
                    id="technique-type"
                    className={styles.select}
                    value={techniqueTypeId}
                    onChange={(e) => setTechniqueTypeId(e.target.value)}
                    disabled={typesLoading || techniqueTypes.length === 0}
                >
                    <option value="">
                        {typesLoading
                            ? 'Загрузка типов...'
                            : 'Выберите тип техники'}
                    </option>
                    {techniqueTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>

                <label className={styles.label} htmlFor="technique-description">
                    Описание
                </label>
                <textarea
                    id="technique-description"
                    className={styles.textarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Кратко опишите технику"
                    rows={4}
                />

                <label className={styles.label} htmlFor="technique-image">
                    Изображение техники
                </label>
                <input
                    id="technique-image"
                    className={styles.fileInput}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {imagePreview && (
                    <img
                        className={styles.previewImage}
                        src={imagePreview}
                        alt="Предпросмотр техники"
                    />
                )}

                <div className={styles.propertiesHeader}>
                    <span className={styles.label}>Свойства</span>
                    <button
                        type="button"
                        className={styles.addPropertyButton}
                        onClick={handleAddProperty}
                    >
                        + Добавить
                    </button>
                </div>

                {properties.map((property, index) => (
                    <div key={index} className={styles.propertyRow}>
                        <div className={styles.propertyInputWrap}>
                            <Input
                                type="text"
                                value={property}
                                onChange={(e) =>
                                    handlePropertyChange(index, e.target.value)
                                }
                                placeholder={`Свойство ${index + 1}`}
                                maxLength={255}
                            />
                        </div>
                        {properties.length > 1 && (
                            <button
                                type="button"
                                className={styles.removePropertyButton}
                                onClick={() => handleRemoveProperty(index)}
                                aria-label="Удалить свойство"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}

                {error && <p className={styles.error}>{error}</p>}
            </div>
            <EmptyBlock />
            <Basement
                onForward={handleSubmit}
                isActive={isValid}
                placeholder={submitting ? 'Сохранение...' : 'Создать'}
            />
        </>
    );
}

export default CreateTechniquePage;
