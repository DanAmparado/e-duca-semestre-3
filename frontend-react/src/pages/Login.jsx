import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Tentando login com:', { email, senha }); // depuração
        try {
            const response = await api.post('/auth/login', { email, senha });
            console.log('Resposta:', response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/recursos');
        } catch (err) {
            console.error('Erro completo:', err);
            if (err.response) {
                alert(`Erro ${err.response.status}: ${err.response.data.error || err.response.data.message}`);
            } else if (err.request) {
                alert('Servidor não respondeu. Verifique se o backend está rodando na porta 3000.');
            } else {
                alert('Erro ao configurar requisição: ' + err.message);
            }
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '50px auto' }}>
            <h2>Login</h2>
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
            </form>
        </div>
    );
}

export default Login;