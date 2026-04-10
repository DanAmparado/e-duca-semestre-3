import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function DetalhesRecurso() {
    const { id } = useParams();
    const [recurso, setRecurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorito, setIsFavorito] = useState(false);

    useEffect(() => {
        const fetchRecurso = async () => {
            try {
                const res = await api.get(`/recursos/${id}`);
                setRecurso(res.data);
            } catch (err) {
                console.error(err);
                alert('Erro ao carregar recurso');
            } finally {
                setLoading(false);
            }
        };
        fetchRecurso();

        const checkFavorito = async () => {
            try {
                const res = await api.get('/favoritos');
                const favoritos = res.data.favoritos;
                setIsFavorito(favoritos.some(f => f.id === id));
            } catch (err) { console.error(err); }
        };
        if (localStorage.getItem('token')) checkFavorito();
    }, [id]);

    const toggleFavorito = async () => {
        try {
            if (isFavorito) {
                await api.delete(`/favoritos/${id}`);
                setIsFavorito(false);
            } else {
                await api.post(`/favoritos/${id}`);
                setIsFavorito(true);
            }
        } catch (err) { alert('Erro ao favoritar'); }
    };

    if (loading) return <div className="text-center mt-5">Carregando...</div>;
    if (!recurso) return <div>Recurso não encontrado</div>;

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                    <li className="breadcrumb-item"><Link to="/recursos">Recursos</Link></li>
                    <li className="breadcrumb-item active">{recurso.titulo.length > 30 ? recurso.titulo.substring(0,30)+'...' : recurso.titulo}</li>
                </ol>
            </nav>
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h1 className="h4 mb-0">{recurso.titulo}</h1>
                    {localStorage.getItem('token') && (
                        <button className={`btn btn-sm ${isFavorito ? 'btn-danger' : 'btn-light'}`} onClick={toggleFavorito}>
                            <i className={`bi ${isFavorito ? 'bi-heart-fill' : 'bi-heart'}`}></i> {isFavorito ? 'Favoritado' : 'Favoritar'}
                        </button>
                    )}
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h5 className="text-muted">Descrição</h5>
                            <p>{recurso.descricao || 'Descrição não disponível.'}</p>
                            <div className="mt-4">
                                <h5 className="text-muted">Informações do Recurso</h5>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <strong>Etapa(s) Educacional(is):</strong><br />
                                        <span className="badge bg-primary fs-6 mt-1">{recurso.etapa}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body text-center">
                                    <h6 className="card-title">Acesse o Recurso</h6>
                                    <p className="small text-muted">Você será redirecionado para o site externo</p>
                                    <a href={recurso.link_externo} target="_blank" className="btn btn-success btn-lg w-100 mb-2">Acessar Recurso</a>
                                    <small className="text-muted">Link externo verificado</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-transparent">
                    <Link to="/recursos" className="btn btn-outline-secondary">← Voltar para Recursos</Link>
                </div>
            </div>
        </>
    );
}
export default DetalhesRecurso;