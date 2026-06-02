import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { getStoredAccessToken } from '@shared/lib/auth';

const IntroductoryPage = lazy(() => import('@pages/IntroductoryPage'));
const Login = lazy(() => import('@pages/login/Login'));
const RegisterPhoneNumber = lazy(() => import('@pages/register/phone-number'));
const RegisterName = lazy(() => import('@pages/register/name'));
const RegisterRole = lazy(() => import('@pages/register/role'));
const RegisterPassword = lazy(() => import('@pages/register/password'));
const RegisterSmsCode = lazy(() => import('@pages/register/sms-code'));
const ChoiceCards = lazy(() => import('@pages/catalog/ChoiceCards'));
const HomePage = lazy(() => import('@pages/home'));
const AddressPage = lazy(() => import('@pages/address'));
const HistoryPage = lazy(() => import('@pages/history'));
const ProfilePage = lazy(() => import('@pages/profile'));
const CreateTechniquePage = lazy(() => import('@pages/techinque/create'));

function hasAccessToken() {
    return Boolean(getStoredAccessToken());
}

function ProtectedRoute() {
    return hasAccessToken() ? (
        <Outlet />
    ) : (
        <Navigate to="/register/phone" replace />
    );
}

function GuestRoute() {
    return hasAccessToken() ? <Navigate to="/" replace /> : <Outlet />;
}

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/introductory" element={<IntroductoryPage />} />
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/register/phone"
                    element={<RegisterPhoneNumber />}
                />
                <Route path="/register/name" element={<RegisterName />} />
                <Route path="/register/role" element={<RegisterRole />} />
                <Route
                    path="/register/password"
                    element={<RegisterPassword />}
                />
                <Route
                    path="/register/sms-code"
                    element={<RegisterSmsCode />}
                />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/cards" element={<ChoiceCards />} />
                <Route path="/address" element={<AddressPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                    path="/technique/create"
                    element={<CreateTechniquePage />}
                />
            </Route>
        </Routes>
    );
}
