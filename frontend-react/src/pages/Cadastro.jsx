import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Cadastro() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [etapaPreferida, setEtapaPreferida] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem');
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                email,
                senha,
                cidade: cidade || undefined,
                estado: estado || undefined,
                etapa_preferida: etapaPreferida || undefined
            });
            setSucesso('Usuário criado com sucesso! Redirecionando para login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setErro(err.response.data.error);
            } else {
                setErro('Erro ao criar conta. Tente novamente.');
            }
            console.error(err);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <h2>Cadastro</h2>
            {erro && <div className="alert alert-danger">{erro}</div>}
            {sucesso && <div className="alert alert-success">{sucesso}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Senha *</label>
                    <input type="password" className="form-control" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirmar Senha *</label>
                    <input type="password" className="form-control" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Cidade</label>
                    <input type="text" className="form-control" value={cidade} onChange={e => setCidade(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado (UF)</label>
                    <input type="text" className="form-control" value={estado} onChange={e => setEstado(e.target.value)} maxLength={2} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Etapa Preferida</label>
                    <select className="form-select" value={etapaPreferida} onChange={e => setEtapaPreferida(e.target.value)}>
                        <option value="">Selecione...</option>
                        <option value="Basico">Básico</option>
                        <option value="Fundamental">Fundamental</option>
                        <option value="Medio">Médio</option>
                        <option value="Tecnico">Técnico</option>
                        <option value="Superior">Superior</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
                <div className="mt-3 text-center">
                    <Link to="/login">Já tem conta? Faça login</Link>
                </div>
            </form>
        </div>
    );
}

export default Cadastro;