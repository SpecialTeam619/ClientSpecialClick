import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HomeBasement } from '@widgets';
import { Input } from '@shared/ui';
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
                <Input
                    id="object-address"
                    value={settings.objectAddress}
                    onChange={(event) =>
                        updateSettings({ objectAddress: event.target.value })
                    }
                    placeholder="Например, г. Москва, ул. Строителей, 10"
                />

                <label className={styles.label} htmlFor="arrival-date">
                    Дата приезда
                </label>
                <Input
                    id="arrival-date"
                    type="date"
                    value={settings.arrivalDate}
                    onChange={(event) =>
                        updateSettings({ arrivalDate: event.target.value })
                    }
                />

                <label className={styles.label} htmlFor="arrival-time">
                    Время приезда
                </label>
                <Input
                    id="arrival-time"
                    type="time"
                    value={settings.arrivalTime}
                    onChange={(event) =>
                        updateSettings({ arrivalTime: event.target.value })
                    }
                />

                <fieldset className={styles.paymentMode}>
                    <legend>Режим оплаты</legend>
                    <label className={styles.radioCard}>
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
                    <label className={styles.radioCard}>
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
                </fieldset>

                {error && <p className={styles.error}>{error}</p>}

                <button
                    type="button"
                    className={styles.continueButton}
                    onClick={handleContinue}
                >
                    Продолжить к выбору техники
                </button>
            </main>
            <div className={styles.basementIndent} />
            <HomeBasement />
        </>
    );
}
