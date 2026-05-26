import { apiFetch, getApiUrl } from './client';

export type RegisterResponse = {
    accessToken: string;
};

export default async function register(
    phone: string,
    password: string,
    role: string,
    name: string,
): Promise<RegisterResponse> {
    const url = new URL(getApiUrl('/auth/register/'));
    url.searchParams.append('phone', phone);

    try {
        const res = await apiFetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, password, role, name }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const contentType = res.headers.get('content-type') ?? '';

        if (contentType.includes('application/json')) {
            const data = (await res.json()) as { accessToken?: string };
            return { accessToken: data.accessToken || '' };
        }

        throw new Error(`Unexpected response format: ${contentType}`);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(
            '[API] Ошибка при регистрации пользователя:',
            errorMessage,
        );

        if (err instanceof Error && err.name === 'AbortError') {
            throw err;
        }
        throw err;
    }
}
