import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ResultadosBusca() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTerm = queryParams.get('q') || '';
    const [recursos, setRecursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [termo, setTermo] = useState(initialTerm);
    const navigate = useNavigate();

    const handleBuscaLocal = (e) => {
        e.preventDefault();
        if (termo.trim()) {
            navigate(`/recursos/busca?q=${encodeURIComponent(termo)}`);
        }
    };

    useEffect(() => {
        const termFromUrl = queryParams.get('q') || '';
        if (termFromUrl) {
            setLoading(true);
            api.get(`/recursos/buscar?q=${encodeURIComponent(termFromUrl)}`)
                .then(res => setRecursos(res.data.recursos))
                .catch(err => console.error('Erro na busca:', err))
                .finally(() => setLoading(false));
        } else {
            setRecursos([]);
            setLoading(false);
        }
    }, [location.search]);

    if (loading) return <div className="text-center mt-5">Buscando...</div>;

    return (
        <>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title"><i className="bi bi-search me-2"></i>Encontrar Recursos</h5>
                    <form onSubmit={handleBuscaLocal} className="row g-3 align-items-end">
                        <div className="col-md-8">
                            <label className="form-label">Buscar por palavra‑chave:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={termo} 
                                onChange={e => setTermo(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="col-md-4">
                            <button type="submit" className="btn btn-primary w-100">Buscar Recursos</button>
                        </div>
                    </form>
                </div>
            </div>
            <h1 className="mb-4">Resultados da busca por: "{queryParams.get('q') || ''}"</h1>
            {recursos.length === 0 ? (
                <div className="alert alert-info">Nenhum recurso encontrado.</div>
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
                                    <Link to={`/recursos/${recurso.id}`} className="btn btn-primary btn-sm">Ver detalhes</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
export default ResultadosBusca;