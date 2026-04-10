import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Recomendacoes() {
    const [recursos, setRecursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //log, remover depois
                const token = localStorage.getItem('token');
                console.log('Token presente?', token ? 'Sim' : 'Não');
                
                const perfilRes = await api.get('/auth/perfil');
                setUser(perfilRes.data);
                const res = await api.get('/recursos/recomendados');
                setRecursos(res.data.recursos);
            } catch (err) {
                console.error(err);
                alert('Erro ao carregar recomendações');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-5">Carregando recomendações...</div>;

    return (
        <>
            <h1 className="mb-4"><i className="bi bi-stars text-primary me-2"></i>Para Você</h1>
            {user?.etapa_preferida ? (
                <div className="alert alert-info">
                    <h5>Recomendações Personalizadas</h5>
                    <p>Baseado na sua etapa de interesse: <strong>{user.etapa_preferida}</strong></p>
                    <small><Link to="/perfil">Alterar preferências</Link></small>
                </div>
            ) : (
                <div className="alert alert-warning">
                    <h5>Recursos Populares</h5>
                    <p>Complete seu <Link to="/perfil">perfil</Link> para receber recomendações personalizadas!</p>
                </div>
            )}

            {recursos.length === 0 ? (
                <div className="alert alert-info">Nenhum recurso encontrado para suas preferências.</div>
            ) : (
                <div className="row">
                    {recursos.map(recurso => (
                        <div key={recurso.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{recurso.titulo}</h5>
                                    <p className="card-text text-muted small">{recurso.descricao?.substring(0,120)}...</p>
                                    <div className="mb-2"><span className="badge bg-primary">{recurso.etapa}</span></div>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="d-flex justify-content-between">
                                        <a href={recurso.link_externo} target="_blank" className="btn btn-primary btn-sm">Acessar</a>
                                        <Link to={`/recursos/${recurso.id}`} className="btn btn-outline-secondary btn-sm">Detalhes</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-4 text-center">
                <Link to="/recursos" className="btn btn-outline-primary me-2">Ver Todos os Recursos</Link>
                <Link to="/perfil" className="btn btn-outline-secondary">Editar Preferências</Link>
            </div>
        </>
    );
}
export default Recomendacoes;