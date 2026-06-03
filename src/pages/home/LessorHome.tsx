import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { HomeBasement } from '@widgets';
import { Input } from '@shared/ui';
import {
    deleteTechnique,
    getTechniques,
    updateTechnique,
} from '@api/techniques';
import type { Technique } from '@api/techniques';
import { getTechniqueTypes } from '@api/techniques-type';
import type { TechniqueTypeInfo } from '@api/techniques-type';
import { getStoredUserId } from '@shared/lib/auth';

export default function LessorHome() {
    const navigate = useNavigate();
    const ownerId = getStoredUserId();
    const [techniques, setTechniques] = useState<Technique[]>([]);
    const [techniqueTypes, setTechniqueTypes] = useState<TechniqueTypeInfo[]>([]);
    const [editingTechnique, setEditingTechnique] = useState<Technique | null>(
        null,
    );
    const [name, setName] = useState('');
    const [techniqueTypeId, setTechniqueTypeId] = useState('');
    const [description, setDescription] = useState('');
    const [properties, setProperties] = useState<string[]>(['']);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');

    const fetchMyTechniques = useCallback(async () => {
        if (!ownerId) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const response = await getTechniques({ page: 1, limit: 100 });
            const mine = (response?.data ?? []).filter(
                (item) => item.ownerId === ownerId,
            );
            setTechniques(mine);
        } catch (error) {
            console.error('Failed to fetch techniques:', error);
            setTechniques([]);
        } finally {
            setLoading(false);
        }
    }, [ownerId]);

    useEffect(() => {
        fetchMyTechniques();
    }, [fetchMyTechniques]);

    useEffect(() => {
        const fetchTechniqueTypes = async () => {
            try {
                const response = await getTechniqueTypes({ page: 1, limit: 100 });
                setTechniqueTypes(response.data ?? []);
            } catch (error) {
                console.error('Failed to fetch technique types:', error);
            }
        };

        fetchTechniqueTypes();
    }, []);

    const trimmedProperties = useMemo(
        () => properties.map((item) => item.trim()).filter(Boolean),
        [properties],
    );

    const isFormValid =
        name.trim() !== '' &&
        techniqueTypeId !== '' &&
        description.trim() !== '' &&
        trimmedProperties.length > 0 &&
        !saving;

    const openEditModal = (technique: Technique) => {
        setEditingTechnique(technique);
        setName(technique.name);
        setTechniqueTypeId(technique.techniqueTypeId);
        setDescription(technique.description);
        setProperties(technique.property.length > 0 ? technique.property : ['']);
        setError('');
        setShowDeleteConfirm(false);
    };

    const closeEditModal = () => {
        if (saving || deleting) {
            return;
        }

        setEditingTechnique(null);
        setError('');
        setShowDeleteConfirm(false);
    };

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

    const handleSaveTechnique = async () => {
        if (!editingTechnique || !isFormValid) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            const updatedTechnique = await updateTechnique(editingTechnique.id, {
                name: name.trim(),
                techniqueTypeId,
                description: description.trim(),
                property: trimmedProperties,
            });

            setTechniques((prev) =>
                prev.map((item) =>
                    item.id === updatedTechnique.id ? updatedTechnique : item,
                ),
            );
            setEditingTechnique(null);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось обновить технику';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTechnique = async () => {
        if (!editingTechnique) {
            return;
        }

        setDeleting(true);
        setError('');

        try {
            await deleteTechnique(editingTechnique.id);
            setTechniques((prev) =>
                prev.filter((item) => item.id !== editingTechnique.id),
            );
            setEditingTechnique(null);
            setShowDeleteConfirm(false);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось удалить технику';
            setError(message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className={styles.lessorHeader}>
                <h1 className={styles.pageTitle}>Моя техника</h1>
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => navigate('/technique/create')}
                >
                    + Добавить
                </button>
            </div>

            <div className={styles.fieldsetCard}>
                {loading ? (
                    <p>Загрузка...</p>
                ) : techniques.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>У вас пока нет техники</p>
                        <button
                            type="button"
                            className={styles.addButton}
                            onClick={() => navigate('/technique/create')}
                        >
                            Добавить технику
                        </button>
                    </div>
                ) : (
                    techniques.map((technique) => (
                        <div key={technique.id} className={styles.box}>
                            {/* <img
                                src={
                                    technique.techniqueType?.photoUrl ||
                                    '/placeholder.jpg'
                                }
                                alt={technique.name}
                            /> */}
                            <p className={styles.black}>
                                <span className={styles.green}>●</span>{' '}
                                {technique.status === 'IN_STOCK'
                                    ? 'В наличии'
                                    : 'Арендована'}
                            </p>
                            <h3>{technique.name}</h3>
                            <p className={styles.typeLabel}>
                                {technique.techniqueType?.name ?? 'Тип не указан'}
                            </p>
                            <p className={styles.description}>
                                {technique.description}
                            </p>
                            <button
                                type="button"
                                className={styles.editButton}
                                onClick={() => openEditModal(technique)}
                            >
                                Редактировать
                            </button>
                        </div>
                    ))
                )}
            </div>

            {editingTechnique && (
                <div
                    className={styles.modalOverlay}
                    role="presentation"
                    onClick={closeEditModal}
                >
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-technique-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={styles.modalClose}
                            onClick={closeEditModal}
                            aria-label="Закрыть"
                        >
                            ×
                        </button>

                        <h2 id="edit-technique-title">
                            Редактирование техники
                        </h2>

                        <label className={styles.formLabel} htmlFor="edit-name">
                            Название
                        </label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Название техники"
                            maxLength={255}
                        />

                        <label className={styles.formLabel} htmlFor="edit-type">
                            Тип техники
                        </label>
                        <select
                            id="edit-type"
                            className={styles.select}
                            value={techniqueTypeId}
                            onChange={(event) =>
                                setTechniqueTypeId(event.target.value)
                            }
                        >
                            <option value="">Выберите тип техники</option>
                            {techniqueTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        <label
                            className={styles.formLabel}
                            htmlFor="edit-description"
                        >
                            Описание
                        </label>
                        <textarea
                            id="edit-description"
                            className={styles.textarea}
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows={4}
                            placeholder="Описание техники"
                        />

                        <div className={styles.propertiesHeader}>
                            <span className={styles.formLabel}>Свойства</span>
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
                                        value={property}
                                        onChange={(event) =>
                                            handlePropertyChange(
                                                index,
                                                event.target.value,
                                            )
                                        }
                                        placeholder={`Свойство ${index + 1}`}
                                        maxLength={255}
                                    />
                                </div>
                                {properties.length > 1 && (
                                    <button
                                        type="button"
                                        className={styles.removePropertyButton}
                                        onClick={() =>
                                            handleRemoveProperty(index)
                                        }
                                        aria-label="Удалить свойство"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}

                        {error && <p className={styles.error}>{error}</p>}

                        {showDeleteConfirm && (
                            <div className={styles.deleteConfirm}>
                                <p>
                                    Удалить технику «{editingTechnique.name}»?
                                    Это действие нельзя отменить.
                                </p>
                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className={styles.deleteButton + ' ' + styles.confirmDelete}
                                        disabled={deleting}
                                        onClick={handleDeleteTechnique}
                                    >
                                        {deleting
                                            ? 'Удаление...'
                                            : 'Да, удалить'}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.cancelButton + ' ' + styles.confirmDelete}
                                        disabled={deleting}
                                        onClick={() =>
                                            setShowDeleteConfirm(false)
                                        }
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.saveButton}
                                disabled={!isFormValid || deleting}
                                onClick={handleSaveTechnique}
                            >
                                {saving ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                disabled={saving || deleting}
                                onClick={closeEditModal}
                            >
                                Отмена
                            </button>
                            {!showDeleteConfirm && (
                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    disabled={saving || deleting}
                                    onClick={() => {
                                        setError('');
                                        setShowDeleteConfirm(true);
                                    }}
                                >
                                    Удалить технику
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.basementIndent} />
            <HomeBasement />
        </>
    );
}
