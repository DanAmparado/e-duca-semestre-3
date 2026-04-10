import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function RecursosLista() {
    const [recursos, setRecursos] = useState([]);
    const [favoritosIds, setFavoritosIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [termoBusca, setTermoBusca] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchRecursos = async () => {
        try {
            const res = await api.get('/recursos?limit=all');
            setRecursos(res.data.recursos);
        } catch (err) {
            console.error(err);
            alert('Erro ao carregar recursos');
        } finally {
            setLoading(false);
        }
    };

    const fetchFavoritos = async () => {
        if (!token) return;
        try {
            const res = await api.get('/favoritos');
            const ids = res.data.favoritos.map(f => f.id);
            setFavoritosIds(ids);
        } catch (err) {
            console.error('Erro ao carregar favoritos:', err);
        }
    };

    useEffect(() => {
        fetchRecursos();
        fetchFavoritos();
    }, []);

    const handleBusca = (e) => {
        e.preventDefault();
        if (termoBusca.trim()) {
            navigate(`/recursos/busca?q=${encodeURIComponent(termoBusca)}`);
        }
    };

    const toggleFavorito = async (recursoId, isFavorito) => {
        if (!token) {
            alert('Faça login para favoritar recursos');
            return;
        }
        try {
            if (isFavorito) {
                await api.delete(`/recursos/${recursoId}/favoritar`);
                setFavoritosIds(prev => prev.filter(id => id !== recursoId));
            } else {
                await api.post(`/recursos/${recursoId}/favoritar`);
                setFavoritosIds(prev => [...prev, recursoId]);
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao favoritar/desfavoritar');
        }
    };

    if (loading) return <div className="text-center mt-5">Carregando...</div>;

    return (
        <>
            <h1 className="mb-4">Recursos Educacionais</h1>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title"><i className="bi bi-search me-2"></i>Encontrar Recursos</h5>
                    <form onSubmit={handleBusca} className="row g-3 align-items-end">
                        <div className="col-md-8">
                            <label className="form-label">Buscar por palavra‑chave:</label>
                            <input type="text" className="form-control" value={termoBusca} onChange={e => setTermoBusca(e.target.value)} placeholder="Ex: matemática, física..." required />
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-primary w-100">Buscar Recursos</button>
                        </div>
                    </form>
                    <div className="mt-2"><small className="text-muted">Busque por título, descrição ou etapa educacional</small></div>
                </div>
            </div>

            {recursos.length === 0 ? (
                <div className="alert alert-info">Nenhum recurso encontrado.</div>
            ) : (
                <div className="row">
                    {recursos.map(recurso => {
                        const isFavorito = favoritosIds.includes(recurso.id);
                        return (
                            <div key={recurso.id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{recurso.titulo.length > 60 ? recurso.titulo.substring(0,60)+'...' : recurso.titulo}</h5>
                                        <p className="card-text text-muted small">{recurso.descricao?.substring(0,120)}...</p>
                                        <div className="mb-2"><span className="badge bg-primary">{recurso.etapa}</span></div>
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <a href={recurso.link_externo} target="_blank" className="btn btn-primary btn-sm">Acessar</a>
                                                <Link to={`/recursos/${recurso.id}`} className="btn btn-outline-secondary btn-sm ms-2">Detalhes</Link>
                                            </div>
                                            <button className={`btn btn-sm ${isFavorito ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => toggleFavorito(recurso.id, isFavorito)}>
                                                <i className={`bi ${isFavorito ? 'bi-heart-fill' : 'bi-heart'}`}></i> {isFavorito ? 'Favoritado' : 'Favoritar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}
export default RecursosLista;