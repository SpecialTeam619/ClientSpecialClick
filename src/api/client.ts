import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const ACCESS_TOKEN_KEY = 'accessToken';

function shouldUseSecureCookie(): boolean {
    return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

export function setStoredAccessToken(token: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    Cookies.set(ACCESS_TOKEN_KEY, token, {
        secure: shouldUseSecureCookie(),
        sameSite: 'strict',
    });
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function getStoredAccessToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        Cookies.get(ACCESS_TOKEN_KEY) ??
        window.localStorage.getItem(ACCESS_TOKEN_KEY)
    );
}

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
        const token = getStoredAccessToken();

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
