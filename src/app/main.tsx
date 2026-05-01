import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

const HomePage = lazy(() => import('@pages/homepage'));
const Login = lazy(() => import('@pages/login'));
const RegisterPhoneNumber = lazy(() => import('@pages/register/phone-number'));
const RegisterSmsCode = lazy(() => import('@pages/register/sms-code'));
const RegisterRole = lazy(() => import('@pages/register/role'));
const ChoiseCards = lazy(() => import('@pages/catalog/ChoiseCards'));
const FilterPage = lazy(() => import('@pages/filter/main'));
const AdressPage = lazy(() => import('@pages/address/main'));

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Suspense fallback={null}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPhoneNumber />} />
                    <Route
                        path="/register/sms-code"
                        element={<RegisterSmsCode />}
                    />
                    <Route path="/register/role" element={<RegisterRole />} />
                    <Route path="/cards" element={<ChoiseCards />} />
                    <Route path="/cards/filter" element={<FilterPage />} />
                    <Route path="/adress" element={<AdressPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </StrictMode>,
);
