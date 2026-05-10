const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const ACCESS_TOKEN_KEY = 'accessToken';

type ApiFetchOptions = RequestInit & {
    auth?: boolean;
};

export function getApiUrl(path: string): string {
    return `${API_URL}${path}`;
}

export async function apiFetch(
    input: string | URL,
    options: ApiFetchOptions = {},
): Promise<Response> {
    const { auth = true, headers, ...restOptions } = options;
    const mergedHeaders = new Headers(headers);

    if (auth && !mergedHeaders.has('Authorization')) {
        const token =
            typeof window !== 'undefined'
                ? window.localStorage.getItem(ACCESS_TOKEN_KEY)
                : null;

        if (token) {
            mergedHeaders.set('Authorization', `Bearer ${token}`);
        }
    }

    return fetch(input, {
        ...restOptions,
        credentials: 'include',
        headers: mergedHeaders,
    });
}
