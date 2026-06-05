import { apiFetch, getApiUrl } from './client';
import type { Technique } from './techniques';
import type { User } from './users';

export const OrderStatus = {
    AWAITING: 'AWAITING',
    REJECTED: 'REJECTED',
    ON_THE_WAY: 'ON_THE_WAY',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentMode = {
    SHIFT_7_PLUS_1: 'SHIFT_7_PLUS_1',
    HOURLY: 'HOURLY',
} as const;
export type PaymentMode = (typeof PaymentMode)[keyof typeof PaymentMode];

export type Order = {
    id: string;
    customerId: string;
    lessorId: string;
    techniqueId?: string | null;
    status: OrderStatus;
    objectAddress?: string | null;
    arrivalAt?: string | null;
    paymentMode?: PaymentMode | null;
    createdAt?: string;
    updatedAt?: string;
    customer?: User;
    lessor?: User;
    technique?: Technique | null;
};

export type CreateOrderPayload = {
    techniqueId: string;
    objectAddress: string;
    arrivalAt: string;
    paymentMode: PaymentMode;
};

export type PaginatedOrderResponse = {
    data: Order[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

export async function getOrders(params?: {
    page?: number;
    limit?: number;
}): Promise<PaginatedOrderResponse> {
    const url = new URL(getApiUrl('/orders/'));

    if (typeof params?.page !== 'undefined') {
        url.searchParams.set('page', String(params.page));
    }

    if (typeof params?.limit !== 'undefined') {
        url.searchParams.set('limit', String(params.limit));
    }

    const res = await apiFetch(url.toString(), { method: 'GET' });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as PaginatedOrderResponse;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
    const url = new URL(getApiUrl('/orders/'));
    const res = await apiFetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as Order;
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus,
): Promise<Order> {
    const url = new URL(getApiUrl(`/orders/${orderId}`));
    const res = await apiFetch(url.toString(), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as Order;
}
