import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Perfil() {
    const [perfil, setPerfil] = useState({
        cidade: '',
        estado: '',
        etapa_preferida: ''
    });
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const response = await api.get('/auth/perfil');
                setPerfil(response.data);
            } catch (err) {
                console.error(err);
                setErro('Erro ao carregar perfil');
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setCarregando(false);
            }
        };
        fetchPerfil();
    }, [navigate]);

    const handleSubmitPerfil = async (e) => {
        e.preventDefault();
        setMensagem('');
        setErro('');
        try {
            const response = await api.put('/auth/perfil', {
                cidade: perfil.cidade,
                estado: perfil.estado,
                etapa_preferida: perfil.etapa_preferida
            });
            setPerfil(response.data);
            setMensagem('Perfil atualizado com sucesso!');
        } catch (err) {
            setErro('Erro ao atualizar perfil');
        }
    };

    const handleSubmitSenha = async (e) => {
        e.preventDefault();
        setMensagem('');
        setErro('');
        if (novaSenha !== confirmarSenha) {
            setErro('As novas senhas não coincidem');
            return;
        }
        if (novaSenha.length < 6) {
            setErro('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }
        try {
            await api.put('/auth/alterar-senha', { senhaAtual, novaSenha });
            setMensagem('Senha alterada com sucesso!');
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
        } catch (err) {
            setErro(err.response?.data?.error || 'Erro ao alterar senha');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (carregando) return <div className="text-center mt-5">Carregando...</div>;

    return (
        <div className="container mt-4" style={{ maxWidth: 600 }}>
            <h2>Meu Perfil</h2>
            {mensagem && <div className="alert alert-success">{mensagem}</div>}
            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={handleSubmitPerfil}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={perfil.email || ''} disabled />
                    <small className="text-muted">O email não pode ser alterado</small>
                </div>
                <div className="mb-3">
                    <label className="form-label">Cidade</label>
                    <input type="text" className="form-control" value={perfil.cidade || ''} onChange={e => setPerfil({ ...perfil, cidade: e.target.value })} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado (UF)</label>
                    <select className="form-select" value={perfil.estado || ''} onChange={e => setPerfil({ ...perfil, estado: e.target.value })}>
                        <option value="">Selecione...</option>
                        <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>
                        <option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>
                        <option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>
                        <option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
                        <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>
                        <option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>
                        <option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>
                        <option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
                        <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Etapa Preferida</label>
                    <select className="form-select" value={perfil.etapa_preferida || ''} onChange={e => setPerfil({ ...perfil, etapa_preferida: e.target.value })}>
                        <option value="">Selecione...</option>
                        <option value="Basico">Básico</option>
                        <option value="Fundamental">Fundamental</option>
                        <option value="Medio">Médio</option>
                        <option value="Tecnico">Técnico</option>
                        <option value="Superior">Superior</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Atualizar Perfil</button>
            </form>

            <hr className="my-4" />

            <h3>Alterar Senha</h3>
            <form onSubmit={handleSubmitSenha}>
                <div className="mb-3">
                    <label className="form-label">Senha Atual</label>
                    <input type="password" className="form-control" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nova Senha</label>
                    <input type="password" className="form-control" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirmar Nova Senha</label>
                    <input type="password" className="form-control" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-secondary">Alterar Senha</button>
            </form>

            <hr className="my-4" />
            <button className="btn btn-danger w-100" onClick={handleLogout}>Sair</button>
        </div>
    );
}

export default Perfil;