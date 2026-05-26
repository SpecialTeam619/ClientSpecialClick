import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { RegistrationProvider } from '@features/registration';
import AppRouter from '@app/router';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RegistrationProvider>
            <BrowserRouter>
                <Suspense fallback={null}>
                    <AppRouter />
                </Suspense>
            </BrowserRouter>
        </RegistrationProvider>
    </StrictMode>,
);
