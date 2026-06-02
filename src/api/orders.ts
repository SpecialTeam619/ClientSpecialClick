import { apiFetch, getApiUrl } from './client';

export type Order = {
    id: string;
    customerId: string;
    lessorId: string;
    status: 'AWAITING' | 'ON_THE_WAY' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
};

export type CreateOrderPayload = {
    [key: string]: unknown;
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
    [key: string]: unknown;
}): Promise<PaginatedOrderResponse> {
    const url = new URL(getApiUrl('/orders/'));

    if (params) {
        if (typeof params.page !== 'undefined')
            url.searchParams.set('page', String(params.page));
        if (typeof params.limit !== 'undefined')
            url.searchParams.set('limit', String(params.limit));
        Object.keys(params).forEach((k) => {
            if (
                k !== 'page' &&
                k !== 'limit' &&
                typeof params[k] !== 'undefined'
            ) {
                url.searchParams.set(k, String(params[k]));
            }
        });
    }

    try {
        const res = await apiFetch(url.toString(), {
            method: 'GET',
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const contentType = res.headers.get('content-type') ?? '';

        if (contentType.includes('application/json')) {
            return (await res.json()) as PaginatedOrderResponse;
        }

        throw new Error(`Unexpected response format: ${contentType}`);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('[API] Ошибка при получении заказов:', errorMessage);

        if (err instanceof Error && err.name === 'AbortError') {
            throw err;
        }
        throw err;
    }
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
    const url = new URL(getApiUrl('/orders/'));

    try {
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

        const contentType = res.headers.get('content-type') ?? '';

        if (contentType.includes('application/json')) {
            return (await res.json()) as Order;
        }

        throw new Error(`Unexpected response format: ${contentType}`);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('[API] Ошибка при создании заказа:', errorMessage);

        if (err instanceof Error && err.name === 'AbortError') {
            throw err;
        }
        throw err;
    }
}

export default { getOrders, createOrder };
