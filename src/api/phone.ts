import { apiFetch, getApiUrl } from './client';

export type CheckPhoneResponse = {
    exists: boolean;
    retryAfterSec?: number;
};

export default async function checkPhoneExists(
    phone: string,
): Promise<CheckPhoneResponse> {
    const url = new URL(getApiUrl('/users/check/phone/'));
    url.searchParams.append('phone', phone);

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
            const data = (await res.json()) as { exists?: boolean };
            return { exists: Boolean(data.exists) };
        }

        throw new Error(`Unexpected response format: ${contentType}`);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('[API] Ошибка при проверке номера:', errorMessage);

        if (err instanceof Error && err.name === 'AbortError') {
            throw err;
        }
        throw err;
    }
}
