import { Link, useLocation } from 'react-router-dom';

function Login() {
    const location = useLocation();
    const state = location.state as { message?: string } | null;

    return (
        <main style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Вход</h1>
            <p>
                {state?.message ?? 'Введите свои данные для входа в аккаунт.'}
            </p>
            <Link to="/register/name">Вернуться к регистрации</Link>
        </main>
    );
}

export default Login;
