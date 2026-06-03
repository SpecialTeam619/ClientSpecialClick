import { apiFetch, getApiUrl } from './client';

export type User = {
    id: string;
    name: string;
    phone: string;
    role: 'LESSOR' | 'CUSTOMER';
    createdAt?: string;
    updatedAt?: string;
};

export type UpdateUserPayload = {
    name?: string;
    phone?: string;
};

export async function me(): Promise<User> {
    const url = new URL(getApiUrl('/users/me'));
    const res = await apiFetch(url.toString(), {
        method: 'GET',
        auth: true,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as User;
}

export async function getUser(userId: string): Promise<User> {
    const url = new URL(getApiUrl(`/users/${userId}`));
    const res = await apiFetch(url.toString(), { method: 'GET', auth: true });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as User;
}

export async function updateUser(
    userId: string,
    payload: UpdateUserPayload,
): Promise<User> {
    const url = new URL(getApiUrl(`/users/${userId}`));
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

    return (await res.json()) as User;
}

export async function deleteUser(userId: string): Promise<User> {
    const url = new URL(getApiUrl(`/users/${userId}`));
    const res = await apiFetch(url.toString(), { method: 'DELETE' });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return (await res.json()) as User;
}