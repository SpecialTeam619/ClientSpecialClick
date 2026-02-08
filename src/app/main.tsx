import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import { HomePage, Login, RegisterPhoneNumber, RegisterSmsCode, RegisterRole, ChoiseCards } from '@pages';
import Test from '@pages/test';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPhoneNumber />} />
                <Route
                    path="/register/sms-code"
                    element={<RegisterSmsCode />}
                />
                <Route path="/register/role" element={<RegisterRole />} />
                <Route path="/cards" element={<ChoiseCards/>} />
                <Route path="/test" element={<Test/>} />
                
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
