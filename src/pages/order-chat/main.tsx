import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HomeBasement } from '@widgets';
import {
    getOrder,
    getOrderMessages,
    type Order,
    PaymentMode,
    sendOrderMessage,
    type ChatMessage,
} from '@api/orders';
import { getStoredUserId } from '@shared/lib/auth';
import styles from './style.module.css';

const STATUS_LABELS: Record<Order['status'], string> = {
    AWAITING: 'Ожидает',
    REJECTED: 'Отклонён',
    ON_THE_WAY: 'В пути',
    IN_PROGRESS: 'В работе',
    COMPLETED: 'Завершён',
};

const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
    [PaymentMode.SHIFT_7_PLUS_1]: 'Смена 7+1',
    [PaymentMode.HOURLY]: 'Почасовая',
};

function formatDate(value?: string | null) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString('ru-RU');
}

export default function OrderChatPage() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const currentUserId = getStoredUserId();

    const [order, setOrder] = useState<Order | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) {
            setError('Заказ не найден');
            setLoading(false);
            return;
        }

        const loadChat = async () => {
            setLoading(true);
            setError('');

            try {
                const [orderData, messageData] = await Promise.all([
                    getOrder(orderId),
                    getOrderMessages(orderId),
                ]);
                setOrder(orderData);
                setMessages(messageData);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Не удалось загрузить чат';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadChat();
    }, [orderId]);

    const handleSend = async () => {
        const trimmedText = text.trim();

        if (!orderId || !trimmedText) {
            return;
        }

        setSending(true);
        setError('');

        try {
            const message = await sendOrderMessage(orderId, trimmedText);
            setMessages((prev) => [...prev, message]);
            setText('');
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось отправить сообщение';
            setError(message);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <main className={styles.main}>
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate('/history')}
                >
                    ← К заказам
                </button>

                <h1>Чат заказа</h1>

                {loading ? (
                    <p>Загрузка...</p>
                ) : error && !order ? (
                    <p className={styles.error}>{error}</p>
                ) : order ? (
                    <>
                        <section className={styles.summary}>
                            <h2>{order.technique?.name ?? 'Техника'}</h2>
                            <p>
                                <strong>Статус:</strong>{' '}
                                {STATUS_LABELS[order.status] ?? order.status}
                            </p>
                            <p>
                                <strong>Тип:</strong>{' '}
                                {order.technique?.techniqueType?.name ?? '—'}
                            </p>
                            <p>
                                <strong>Адрес:</strong>{' '}
                                {order.objectAddress ?? '—'}
                            </p>
                            <p>
                                <strong>Приезд:</strong>{' '}
                                {formatDate(order.arrivalAt)}
                            </p>
                            <p>
                                <strong>Оплата:</strong>{' '}
                                {order.paymentMode
                                    ? PAYMENT_MODE_LABELS[order.paymentMode]
                                    : '—'}
                            </p>
                            <p>
                                <strong>Заказчик:</strong>{' '}
                                {order.customer?.name ?? '—'}
                            </p>
                            <p>
                                <strong>Арендодатель:</strong>{' '}
                                {order.lessor?.name ?? '—'}
                            </p>
                        </section>

                        <section className={styles.messages}>
                            {messages.length === 0 ? (
                                <p className={styles.empty}>
                                    Сообщений пока нет
                                </p>
                            ) : (
                                messages.map((message) => {
                                    const isMine =
                                        message.senderId === currentUserId;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`${styles.message} ${
                                                isMine ? styles.mine : ''
                                            }`}
                                        >
                                            <p className={styles.sender}>
                                                {message.sender?.name ??
                                                    'Пользователь'}
                                            </p>
                                            <p>{message.text}</p>
                                            <span>
                                                {formatDate(message.createdAt)}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </section>

                        {error && <p className={styles.error}>{error}</p>}

                        <div className={styles.form}>
                            <textarea
                                value={text}
                                onChange={(event) =>
                                    setText(event.target.value)
                                }
                                placeholder="Введите сообщение"
                                rows={3}
                            />
                            <button
                                type="button"
                                disabled={sending || text.trim() === ''}
                                onClick={handleSend}
                            >
                                {sending ? 'Отправка...' : 'Отправить'}
                            </button>
                        </div>
                    </>
                ) : null}
            </main>
            <div className={styles.basementIndent} />
            <HomeBasement />
        </>
    );
}
