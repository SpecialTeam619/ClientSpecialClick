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
    photoUrl?: string | null;
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
    image?: File | null;
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
    const body = new FormData();

    body.append('name', payload.name);
    body.append('techniqueTypeId', payload.techniqueTypeId);
    body.append('description', payload.description);
    payload.property.forEach((item) => body.append('property', item));

    if (payload.image) {
        body.append('image', payload.image);
    }

    const res = await apiFetch(url.toString(), {
        method: 'POST',
        body,
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

    if (payload.image) {
        const body = new FormData();

        if (payload.name) {
            body.append('name', payload.name);
        }

        if (payload.techniqueTypeId) {
            body.append('techniqueTypeId', payload.techniqueTypeId);
        }

        if (payload.description) {
            body.append('description', payload.description);
        }

        payload.property?.forEach((item) => body.append('property', item));
        body.append('image', payload.image);

        const res = await apiFetch(url.toString(), {
            method: 'PATCH',
            body,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        return (await res.json()) as Technique;
    }

    const { image: _image, ...jsonPayload } = payload;
    const res = await apiFetch(url.toString(), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonPayload),
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
