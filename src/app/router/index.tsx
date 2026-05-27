import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const IntroductoryPage = lazy(() => import('@pages/IntroductoryPage'));
const Login = lazy(() => import('@pages/login/Login'));
const RegisterPhoneNumber = lazy(() => import('@pages/register/phone-number'));
const RegisterName = lazy(() => import('@pages/register/name'));
const RegisterRole = lazy(() => import('@pages/register/role'));
const RegisterPassword = lazy(() => import('@pages/register/password'));
const RegisterSmsCode = lazy(() => import('@pages/register/sms-code'));
const ChoiceCards = lazy(() => import('@pages/catalog/ChoiceCards'));
const FilterPage = lazy(() => import('@pages/filter'));
const AddressPage = lazy(() => import('@pages/address'));

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<FilterPage />} />
            <Route path="/introductory" element={<IntroductoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/phone" element={<RegisterPhoneNumber />} />
            <Route path="/register/name" element={<RegisterName />} />
            <Route path="/register/role" element={<RegisterRole />} />
            <Route path="/register/password" element={<RegisterPassword />} />
            <Route path="/register/sms-code" element={<RegisterSmsCode />} />
            <Route path="/cards" element={<ChoiceCards />} />
            {/* <Route path="/cards/filter" element={<FilterPage />} /> */}
            <Route path="/address" element={<AddressPage />} />
        </Routes>
    );
}
