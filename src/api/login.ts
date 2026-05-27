import { apiFetch, getApiUrl } from './client';

export type LoginResponse = {
    access_token: string;
};

export default async function login(
    phone: string,
    password: string,
): Promise<LoginResponse> {
    const url = new URL(getApiUrl('/auth/login/'));

    try {
        const res = await apiFetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, password}),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const contentType = res.headers.get('content-type') ?? '';

        if (contentType.includes('application/json')) {
            const data = (await res.json()) as { access_token?: string };
            return { access_token: data.access_token || '' };
        }

        throw new Error(`Unexpected response format: ${contentType}`);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(
            '[API] Ошибка при входе в систему:',
            errorMessage,
        );

        if (err instanceof Error && err.name === 'AbortError') {
            throw err;
        }
        throw err;
    }
}
