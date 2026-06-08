import { apiFetch, getApiUrl } from './client';

export type TechniqueStatus = 'IN_STOCK' | 'RENTED';

export type TechniqueTypeInfo = {
    id?: string;
    code?: string;
    name?: string;
    description?: string | null;
    photoUrl?: string | null;
};

// export type Technique = {
//     id: string;
//     ownerId: string;
//     name: string;
//     techniqueTypeId: string;
//     description: string;
//     property: string[];
//     createdAt?: string;
//     updatedAt?: string;
//     status: TechniqueStatus;
//     techniqueType?: TechniqueTypeInfo;
// };

export type PaginatedResponse<T> = {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

export type CreateTechniqueTypePayload = {
    name: string;
    code: string;
    description: string;
    photoUrl?: string;
};

export async function getTechniqueTypes(params?: {
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<TechniqueTypeInfo>> {
    const url = new URL(getApiUrl('/technique-types/'));

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

    return (await res.json()) as PaginatedResponse<TechniqueTypeInfo>;
}

export async function createTechniqueType(
    payload: CreateTechniqueTypePayload,
): Promise<TechniqueTypeInfo> {
    const url = new URL(getApiUrl('/technique-types/'));
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

    return (await res.json()) as TechniqueTypeInfo;
}
