import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import { Button } from '@shared/ui';
import { createOrder } from '@api/orders';
import { getTechnique, type Technique } from '@api/techniques';
import { getUser, type User as UserType } from '@api/users';
import { getStoredUserId, getStoredUserRole } from '@shared/lib/auth';
import {
    getOrderArrivalIso,
    PAYMENT_MODE_LABELS,
    type OrderSettings,
} from '@shared/lib/orderSettings';

type TechniqueDetailModalProps = {
    techniqueId: string | null;
    onClose: () => void;
    onRented: () => void;
    orderSettings: OrderSettings;
    hasOrderSettings: boolean;
};

const ORDER_STATUS_LABELS: Record<string, string> = {
    AWAITING: 'Ожидает',
    ON_THE_WAY: 'В пути',
    IN_PROGRESS: 'В работе',
    COMPLETED: 'Завершён',
};

function formatDate(value?: string) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString('ru-RU');
}

export default function TechniqueDetailModal({
    techniqueId,
    onClose,
    onRented,
    orderSettings,
    hasOrderSettings,
}: TechniqueDetailModalProps) {
    const navigate = useNavigate();
    const currentUserId = getStoredUserId();
    const role = getStoredUserRole();

    const [technique, setTechnique] = useState<Technique | null>(null);
    const [loading, setLoading] = useState(false);
    const [renting, setRenting] = useState(false);
    const [lessor, setLessor] = useState<UserType | undefined>(undefined);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!techniqueId) {
            setTechnique(null);
            setLessor(undefined);
            setError('');
            setSuccess('');
            return;
        }

        let cancelled = false;

        const loadDetails = async () => {
            setLoading(true);
            setError('');
            setSuccess('');
            setLessor(undefined);

            try {
                const data = await getTechnique(techniqueId);
                if (cancelled) {
                    return;
                }

                setTechnique(data);

                if (data.owner) {
                    setLessor({
                        id: data.owner.id,
                        name: data.owner.name,
                        phone: data.owner.phone,
                        role: data.owner.role as UserType['role'],
                    });
                    return;
                }

                if (data.ownerId) {
                    const user = await getUser(data.ownerId);
                    if (!cancelled) {
                        setLessor(user);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : 'Не удалось загрузить данные';
                    setError(message);
                    setTechnique(null);
                    setLessor(undefined);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadDetails();

        return () => {
            cancelled = true;
        };
    }, [techniqueId]);

    if (!techniqueId) {
        return null;
    }

    const isOwnTechnique = technique?.ownerId === currentUserId;
    const canRent =
        role === 'CUSTOMER' &&
        technique?.status === 'IN_STOCK' &&
        !isOwnTechnique &&
        hasOrderSettings &&
        !renting;

    const handleRent = async () => {
        if (!technique || !canRent) {
            return false;
        }

        setRenting(true);
        setError('');
        setSuccess('');

        try {
            const order = await createOrder({
                techniqueId: technique.id,
                objectAddress: orderSettings.objectAddress.trim(),
                arrivalAt: getOrderArrivalIso(orderSettings),
                paymentMode: orderSettings.paymentMode,
            });
            setSuccess(
                `Заказ создан (статус: ${ORDER_STATUS_LABELS[order.status] ?? order.status})`,
            );
            onRented();
            return true;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Не удалось создать заказ';
            setError(message);
            return false;
        } finally {
            setRenting(false);
        }
    };

    const photoUrl =
        technique?.photoUrl ||
        technique?.techniqueType?.photoUrl ||
        '/placeholder.jpg';

    return (
        <div
            className={styles.modalOverlay}
            role="presentation"
            onClick={onClose}
        >
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="technique-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={styles.modalClose}
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>

                {loading ? (
                    <p className={styles.modalMessage}>Загрузка...</p>
                ) : !technique ? (
                    <p className={styles.modalError}>{error || 'Техника не найдена'}</p>
                ) : (
                    <>
                        <img
                            className={styles.modalImage}
                            src={photoUrl}
                            alt={technique.name}
                        />

                        <h2 id="technique-modal-title" className={styles.modalTitle}>
                            {technique.name}
                        </h2>

                        <p className={styles.modalStatus}>
                            <span className={styles.green}>●</span>{' '}
                            {technique.status === 'IN_STOCK'
                                ? 'В наличии'
                                : 'Арендована'}
                        </p>

                        <section className={styles.modalSection}>
                            <h3>О технике</h3>
                            <p>
                                <strong>Тип:</strong>{' '}
                                {technique.techniqueType?.name ?? '—'}
                            </p>
                            <p>
                                <strong>Описание:</strong> {technique.description}
                            </p>
                            {technique.property.length > 0 && (
                                <ul className={styles.propertyList}>
                                    {technique.property.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                            <p>
                                <strong>Добавлена:</strong>{' '}
                                {formatDate(technique.createdAt)}
                            </p>
                        </section>

                        <section className={styles.modalSection}>
                            <h3>Арендодатель</h3>
                            {lessor ? (
                                <>
                                    <p>
                                        <strong>Имя:</strong> {lessor.name}
                                    </p>
                                    <p>
                                        <strong>Телефон:</strong> {lessor.phone}
                                    </p>
                                </>
                            ) : (
                                <p>Данные арендодателя недоступны</p>
                            )}
                        </section>

                        <section className={styles.modalSection}>
                            <h3>Настройки заказа</h3>
                            {hasOrderSettings ? (
                                <>
                                    <p>
                                        <strong>Адрес:</strong>{' '}
                                        {orderSettings.objectAddress}
                                    </p>
                                    <p>
                                        <strong>Дата и время:</strong>{' '}
                                        {orderSettings.arrivalDate},{' '}
                                        {orderSettings.arrivalTime}
                                    </p>
                                    <p>
                                        <strong>Оплата:</strong>{' '}
                                        {
                                            PAYMENT_MODE_LABELS[
                                                orderSettings.paymentMode
                                            ]
                                        }
                                    </p>
                                </>
                            ) : (
                                <p>Заполните настройки заказа перед арендой.</p>
                            )}
                        </section>

                        {role !== 'CUSTOMER' && (
                            <p className={styles.modalHint}>
                                Арендовать технику могут только заказчики
                            </p>
                        )}

                        {isOwnTechnique && (
                            <p className={styles.modalHint}>
                                Это ваша техника — аренда недоступна
                            </p>
                        )}

                        {technique.status !== 'IN_STOCK' && !isOwnTechnique && (
                            <p className={styles.modalHint}>
                                Техника сейчас недоступна для аренды
                            </p>
                        )}

                        {!hasOrderSettings && (
                            <p className={styles.modalHint}>
                                Не заполнены адрес, дата и время заказа
                            </p>
                        )}

                        {error && <p className={styles.modalError}>{error}</p>}
                        {success && (
                            <p className={styles.modalSuccess}>{success}</p>
                        )}

                        <div className={styles.modalActions}>
                            {canRent && !success ? (<Button
                                text={renting ? 'Оформление...' : 'Арендовать'}
                                    active={canRent}
                                    onClick={handleRent}
                                />
                            ) : null}
                            {success && (
                                <Button
                                    text="К заказам"
                                    active
                                    onClick={() => navigate('/history')}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
