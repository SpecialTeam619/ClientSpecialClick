import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Basement } from '@widgets';

import {
    getStoredOrderSettings,
    isOrderSettingsComplete,
    PaymentMode,
    saveOrderSettings,
    type OrderSettings,
} from '@shared/lib/orderSettings';
import styles from './style.module.css';

export default function OrderSetupPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const techniqueTypeId = searchParams.get('techniqueTypeId');

    const [settings, setSettings] = useState<OrderSettings>(() =>
        getStoredOrderSettings(),
    );
    const [error, setError] = useState('');

    useEffect(() => {
        saveOrderSettings(settings);
    }, [settings]);

    const updateSettings = (partial: Partial<OrderSettings>) => {
        setSettings((prev) => ({ ...prev, ...partial }));
        setError('');
    };

    const handleContinue = () => {
        if (!isOrderSettingsComplete(settings)) {
            setError('Заполните адрес, дату и время приезда техники');
            return;
        }

        saveOrderSettings(settings);
        navigate(
            `/technique/find${techniqueTypeId ? `?techniqueTypeId=${techniqueTypeId}` : ''}`,
        );
    };

    return (
        <>
            <main className={styles.main}>
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate('/')}
                >
                    ← Назад
                </button>

                <h1>Настройка заказа</h1>
                <p className={styles.description}>
                    Укажите, куда и когда должна приехать техника.
                </p>

                <label className={styles.label} htmlFor="object-address">
                    Адрес объекта
                </label>
                <input
                    type="text"
                    id="object-address"
                    className={styles.input}
                    value={settings.objectAddress}
                    onChange={(event) =>
                        updateSettings({ objectAddress: event.target.value })
                    }
                    placeholder="Например, г. Москва, ул. Строителей, 10"
                />

                <label className={styles.label} htmlFor="arrival-date">
                    Дата приезда
                </label>
                <input
                    type="date"
                    id="arrival-date"
                    className={styles.input}
                    value={settings.arrivalDate}
                    onChange={(event) =>
                        updateSettings({ arrivalDate: event.target.value })
                    }
                />

                <label className={styles.label} htmlFor="arrival-time">
                    Время приезда
                </label>
                <input
                    type="time"
                    id="arrival-time"
                    className={styles.input}
                    value={settings.arrivalTime}
                    onChange={(event) =>
                        updateSettings({ arrivalTime: event.target.value })
                    }
                />

                <fieldset className={styles.paymentMode}>
                    <legend>Режим оплаты</legend>
                    <div className={styles.radioCardBox}>
                    <label className={`${styles.radioCard} ${settings.paymentMode === PaymentMode.SHIFT_7_PLUS_1 ? styles.active : ''}`}>
                        <input
                            type="radio"
                            name="paymentMode"
                            value={PaymentMode.SHIFT_7_PLUS_1}
                            checked={
                                settings.paymentMode ===
                                PaymentMode.SHIFT_7_PLUS_1
                            }
                            onChange={() =>
                                updateSettings({
                                    paymentMode: PaymentMode.SHIFT_7_PLUS_1,
                                })
                            }
                        />
                        <span>Смена 7+1</span>
                    </label>
                    <label className={`${styles.radioCard} ${settings.paymentMode === PaymentMode.HOURLY ? styles.active : ''}`}>
                        <input
                            type="radio"
                            name="paymentMode"
                            value={PaymentMode.HOURLY}
                            checked={settings.paymentMode === PaymentMode.HOURLY}
                            onChange={() =>
                                updateSettings({
                                    paymentMode: PaymentMode.HOURLY,
                                })
                            }
                        />
                            <span>Почасовая</span>
                        </label>
                    </div>
                </fieldset>

                {error && <p className={styles.error}>{error}</p>}
            </main>
            <Basement isActive={isOrderSettingsComplete(settings)} onForward={handleContinue} />
        </>
    );
}
