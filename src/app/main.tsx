import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { RegistrationProvider } from '@shared/Context';

const HomePage = lazy(() => import('@pages/homepage'));
const Login = lazy(() => import('@pages/login'));
const RegisterPhoneNumber = lazy(() => import('@pages/register/phone-number'));
// const RegisterSmsCode = lazy(() => import('@pages/register/sms-code'));
const RegisterPassword = lazy(() => import('@pages/register/password'));
const RegisterName = lazy(() => import('@pages/register/name/Register'));
const RegisterRole = lazy(() => import('@pages/register/role'));
const ChoiseCards = lazy(() => import('@pages/catalog/ChoiseCards'));
const FilterPage = lazy(() => import('@pages/filter/main'));
const AdressPage = lazy(() => import('@pages/address/main'));

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RegistrationProvider>
            <BrowserRouter>
                <Suspense fallback={null}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/register/phone"
                            element={<RegisterPhoneNumber />}
                        />
                        <Route
                            path="/register/name"
                            element={<RegisterName />}
                        />
                        {/* <Route
                            path="/register/sms-code"
                            element={<RegisterSmsCode />}
                        /> */}
                        <Route
                            path="/register/role"
                            element={<RegisterRole />}
                        />
                        <Route
                            path="/register/password"
                            element={<RegisterPassword />}
                        />
                        <Route path="/cards" element={<ChoiseCards />} />
                        <Route path="/cards/filter" element={<FilterPage />} />
                        <Route path="/adress" element={<AdressPage />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </RegistrationProvider>
    </StrictMode>,
);
