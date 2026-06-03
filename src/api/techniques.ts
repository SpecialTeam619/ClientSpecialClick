import { apiFetch, getApiUrl } from './client';

export type TechniqueStatus = 'IN_STOCK' | 'RENTED';

export type TechniqueTypeInfo = {
    id?: string;
    code?: string;
    name?: string;
    description?: string | null;
    photoUrl?: string | null;
};

export type TechniqueOwner = {
    id: string;
    name: string;
    phone: string;
    role: string;
};

export type Technique = {
    id: string;
    ownerId: string;
    name: string;
    techniqueTypeId: string;
    description: string;
    property: string[];
    createdAt?: string;
    updatedAt?: string;
    status: TechniqueStatus;
    techniqueType?: TechniqueTypeInfo;
    owner?: TechniqueOwner;
};

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

export type CreateTechniquePayload = {
    name: string;
    techniqueTypeId: string;
    description: string;
    property: string[];
};

export type UpdateTechniquePayload = Partial<CreateTechniquePayload>;

export async function getTechnique(id: string): Promise<Technique> {
    const url = new URL(getApiUrl(`/techniques/${id}`));
    const res = await apiFetch(url.toString(), { method: 'GET' });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as Technique;
}

export async function getTechniques(params?: {
    page?: number;
    limit?: number;
    techniqueTypeId?: string;
}): Promise<PaginatedResponse<Technique>> {
    const url = new URL(getApiUrl('/techniques/'));

    if (typeof params?.page !== 'undefined') {
        url.searchParams.set('page', String(params.page));
    }

    if (typeof params?.limit !== 'undefined') {
        url.searchParams.set('limit', String(params.limit));
    }

    if (typeof params?.techniqueTypeId !== 'undefined') {
        url.searchParams.set('techniqueTypeId', params.techniqueTypeId);
    }

    const res = await apiFetch(url.toString(), { method: 'GET' });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as PaginatedResponse<Technique>;
}

export async function createTechnique(
    payload: CreateTechniquePayload,
): Promise<Technique> {
    const url = new URL(getApiUrl('/techniques/'));
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

    return (await res.json()) as Technique;
}

export async function updateTechnique(
    id: string,
    payload: UpdateTechniquePayload,
): Promise<Technique> {
    const url = new URL(getApiUrl(`/techniques/${id}`));
    const res = await apiFetch(url.toString(), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as Technique;
}

export async function deleteTechnique(id: string): Promise<Technique> {
    const url = new URL(getApiUrl(`/techniques/${id}`));
    const res = await apiFetch(url.toString(), { method: 'DELETE' });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as Technique;
}
