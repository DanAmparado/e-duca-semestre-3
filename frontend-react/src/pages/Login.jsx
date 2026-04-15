import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, senha });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = '/';
        } catch (err) {
            alert(err.response?.data?.error || 'Erro ao fazer login');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h2>Entrar na Conta</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Senha</label>
                    <input type="password" className="form-control" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Entrar</button>
                <div className="mt-3 text-center">
                    <Link to="/cadastro">Não tem conta? Cadastre-se</Link>
                </div>
            </form>
        </div>
    );
}
export default Login;