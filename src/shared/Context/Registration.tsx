import { createContext, useContext, useState } from 'react';
import register from '@api/registration';
import { ACCESS_TOKEN_KEY } from '@api/client';

interface RegistrationData {
    phone: string;
    name: string;
    role: string;
    password: string;
}

const defaultRegistrationData: RegistrationData = {
    phone: '',
    name: '',
    role: '',
    password: '',
};

const RegistrationContext = createContext<{
    data: RegistrationData;
    updateData: (partial: Partial<RegistrationData>) => void;
    clearData: () => void;
    submitRegistration: () => Promise<void>;
} | null>(null);

export function RegistrationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [data, setData] = useState<RegistrationData>(() => {
        const saved = localStorage.getItem('registrationData');

        if (!saved) {
            return defaultRegistrationData;
        }

        try {
            return {
                ...defaultRegistrationData,
                ...JSON.parse(saved),
            } as RegistrationData;
        } catch {
            return defaultRegistrationData;
        }
    });

    const updateData = (partial: Partial<RegistrationData>) => {
        setData((prev) => {
            const updated = { ...prev, ...partial };
            localStorage.setItem('registrationData', JSON.stringify(updated));
            return updated;
        });
    };

    const clearData = () => {
        setData(defaultRegistrationData);
        localStorage.removeItem('registrationData');
    };

    const submitRegistration = async () => {
        if (!data.phone || !data.password || !data.role || !data.name) {
            throw new Error('Заполните все данные регистрации');
        }

        const response = await register(
            `+7${data.phone}`,
            data.password,
            data.role,
            data.name,
        );

        if (response.accessToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
        }

        clearData();
    };

    return (
        <RegistrationContext.Provider
            value={{ data, updateData, clearData, submitRegistration }}
        >
            {children}
        </RegistrationContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRegistration = () => {
    const context = useContext(RegistrationContext);
    if (!context)
        throw new Error(
            'useRegistration must be used within RegistrationProvider',
        );
    return context;
};
