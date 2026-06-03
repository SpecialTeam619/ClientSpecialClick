import { HomeBasement } from '@widgets';
import styles from './style.module.css';
import { useEffect, useState } from 'react';
import { getOrders, Order, OrderStatus, updateOrderStatus } from '@api/orders';
import { getStoredUserRole } from '@shared/lib/auth';

const STATUS_LABELS: Record<Order['status'], string> = {
    AWAITING: 'Ожидает',
    REJECTED: 'Отклонён',
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

export default function HistoryPage() {
    const role = getStoredUserRole();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await getOrders({ page: 1, limit: 50 });
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getLessorActions = (order: Order) => {
        if (role !== 'LESSOR') {
            return [];
        }

        if (order.status === OrderStatus.AWAITING) {
            return [
                { label: 'Принять заказ', status: OrderStatus.ON_THE_WAY },
                { label: 'Отказаться', status: OrderStatus.REJECTED },
            ];
        }

        if (order.status === OrderStatus.ON_THE_WAY) {
            return [
                { label: 'Начать работу', status: OrderStatus.IN_PROGRESS },
            ];
        }

        if (order.status === OrderStatus.IN_PROGRESS) {
            return [{ label: 'Завершить заказ', status: OrderStatus.COMPLETED }];
        }

        return [];
    };

    const handleStatusChange = async (status: OrderStatus) => {
        if (!selectedOrder) {
            return;
        }

        setActionLoading(true);
        setError('');

        try {
            const updatedOrder = await updateOrderStatus(selectedOrder.id, status);
            setSelectedOrder(updatedOrder);
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === updatedOrder.id ? updatedOrder : order,
                ),
            );
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Не удалось обновить заказ';
            setError(message);
        } finally {
            setActionLoading(false);
        }
    };

    const actions = selectedOrder ? getLessorActions(selectedOrder) : [];

    return (
        <>
            <main className={styles.main}>
                <h1>История заказов</h1>
                {loading ? (
                    <p>Загрузка...</p>
                ) : orders.length === 0 ? (
                    <p>У вас пока нет заказов.</p>
                ) : (
                    <ul className={styles.list}>
                        {orders.map((order) => (
                            <li key={order.id}>
                                <button
                                    type="button"
                                    className={styles.orderItem}
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setError('');
                                    }}
                                >
                                <p>Заказ №{order.id.slice(0, 8)}</p>
                                {order.technique && (
                                    <h3>{order.technique.name}</h3>
                                )}
                                <p>
                                    Статус:{' '}
                                    {STATUS_LABELS[order.status] ?? order.status}
                                </p>
                                {role === 'LESSOR' && order.customer && (
                                    <p>Заказчик: {order.customer.name}</p>
                                )}
                                {role === 'CUSTOMER' && order.lessor && (
                                    <p>Арендодатель: {order.lessor.name}</p>
                                )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            {selectedOrder && (
                <div
                    className={styles.modalOverlay}
                    role="presentation"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className={styles.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="order-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={styles.modalClose}
                            onClick={() => setSelectedOrder(null)}
                            aria-label="Закрыть"
                        >
                            ×
                        </button>

                        <h2 id="order-modal-title">
                            Заказ №{selectedOrder.id.slice(0, 8)}
                        </h2>
                        <p>
                            <strong>Статус:</strong>{' '}
                            {STATUS_LABELS[selectedOrder.status] ??
                                selectedOrder.status}
                        </p>
                        <p>
                            <strong>Создан:</strong>{' '}
                            {formatDate(selectedOrder.createdAt)}
                        </p>

                        <section className={styles.modalSection}>
                            <h3>Техника</h3>
                            {selectedOrder.technique ? (
                                <>
                                    <p>
                                        <strong>Название:</strong>{' '}
                                        {selectedOrder.technique.name}
                                    </p>
                                    <p>
                                        <strong>Тип:</strong>{' '}
                                        {selectedOrder.technique.techniqueType
                                            ?.name ?? '—'}
                                    </p>
                                    <p>
                                        <strong>Описание:</strong>{' '}
                                        {selectedOrder.technique.description}
                                    </p>
                                </>
                            ) : (
                                <p>Данные о технике недоступны</p>
                            )}
                        </section>

                        <section className={styles.modalSection}>
                            <h3>Участники</h3>
                            {selectedOrder.customer && (
                                <p>
                                    <strong>Заказчик:</strong>{' '}
                                    {selectedOrder.customer.name},{' '}
                                    {selectedOrder.customer.phone}
                                </p>
                            )}
                            {selectedOrder.lessor && (
                                <p>
                                    <strong>Арендодатель:</strong>{' '}
                                    {selectedOrder.lessor.name},{' '}
                                    {selectedOrder.lessor.phone}
                                </p>
                            )}
                        </section>

                        {error && <p className={styles.error}>{error}</p>}

                        {actions.length > 0 && (
                            <div className={styles.modalActions}>
                                {actions.map((action) => (
                                    <button
                                        key={action.status}
                                        type="button"
                                        className={
                                            action.status === OrderStatus.REJECTED
                                                ? styles.rejectButton
                                                : styles.actionButton
                                        }
                                        disabled={actionLoading}
                                        onClick={() =>
                                            handleStatusChange(action.status)
                                        }
                                    >
                                        {actionLoading
                                            ? 'Обновление...'
                                            : action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.basementIndent} />
            <HomeBasement />
        </>
    );
}
