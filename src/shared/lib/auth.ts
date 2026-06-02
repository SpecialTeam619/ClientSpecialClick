import { ACCESS_TOKEN_KEY } from '@api';

type JwtPayload = {
    sub?: string;
    email?: string;
    role?: string;
};

function decodeBase64Url(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

    return atob(padded);
}

export function getStoredAccessToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getDecodedJwtPayload(): JwtPayload | null {
    const token = getStoredAccessToken();

    if (!token) {
        return null;
    }

    const [, payloadPart] = token.split('.');

    if (!payloadPart) {
        return null;
    }

    try {
        return JSON.parse(decodeBase64Url(payloadPart)) as JwtPayload;
    } catch {
        return null;
    }
}

export function getStoredUserRole(): string | null {
    return getDecodedJwtPayload()?.role ?? null;
}

export function getStoredUserId(): string | null {
    return getDecodedJwtPayload()?.sub ?? null;
}

export function getStoredUserPhone(): string | null {
    return getDecodedJwtPayload()?.email ?? null;
}

export function clearStoredAuth(): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}
