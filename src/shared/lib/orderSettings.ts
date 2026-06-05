export const ORDER_SETTINGS_STORAGE_KEY = 'orderSettings';

export const PaymentMode = {
    SHIFT_7_PLUS_1: 'SHIFT_7_PLUS_1',
    HOURLY: 'HOURLY',
} as const;

export type PaymentMode = (typeof PaymentMode)[keyof typeof PaymentMode];

export type OrderSettings = {
    objectAddress: string;
    arrivalDate: string;
    arrivalTime: string;
    paymentMode: PaymentMode;
};

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
    [PaymentMode.SHIFT_7_PLUS_1]: 'Смена 7+1',
    [PaymentMode.HOURLY]: 'Почасовая',
};

export const DEFAULT_ORDER_SETTINGS: OrderSettings = {
    objectAddress: '',
    arrivalDate: '',
    arrivalTime: '',
    paymentMode: PaymentMode.SHIFT_7_PLUS_1,
};

export function getStoredOrderSettings(): OrderSettings {
    const raw = window.localStorage.getItem(ORDER_SETTINGS_STORAGE_KEY);

    if (!raw) {
        return DEFAULT_ORDER_SETTINGS;
    }

    try {
        return {
            ...DEFAULT_ORDER_SETTINGS,
            ...(JSON.parse(raw) as Partial<OrderSettings>),
        };
    } catch {
        return DEFAULT_ORDER_SETTINGS;
    }
}

export function saveOrderSettings(settings: OrderSettings) {
    window.localStorage.setItem(
        ORDER_SETTINGS_STORAGE_KEY,
        JSON.stringify(settings),
    );
}

export function isOrderSettingsComplete(settings: OrderSettings) {
    return (
        settings.objectAddress.trim() !== '' &&
        settings.arrivalDate !== '' &&
        settings.arrivalTime !== ''
    );
}

export function getOrderArrivalIso(settings: OrderSettings) {
    return new Date(
        `${settings.arrivalDate}T${settings.arrivalTime}:00`,
    ).toISOString();
}
