import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavoritos = async () => {
        try {
            const res = await api.get('/favoritos');
            setFavoritos(res.data.favoritos);
        } catch (err) {
            console.error(err);
            alert('Erro ao carregar favoritos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavoritos();
    }, []);

    const removerFavorito = async (id) => {
        try {
            await api.delete(`/favoritos/${id}`);
            await fetchFavoritos();
        } catch (err) {
            console.error(err);
            alert('Erro ao remover favorito');
        }
    };

    if (loading) return <div className="text-center mt-5">Carregando...</div>;

    return (
        <div className="container mt-4">
            <h1>Meus Favoritos</h1>
            <div className="row">
                {favoritos.map(recurso => (
                    <div key={recurso.id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{recurso.titulo}</h5>
                                <p className="card-text">{recurso.descricao?.substring(0, 100)}...</p>
                                <Link to={`/recursos/${recurso.id}`} className="btn btn-primary btn-sm">Ver</Link>
                                <button className="btn btn-danger btn-sm ms-2" onClick={() => removerFavorito(recurso.id)}>Remover</button>
                            </div>
                        </div>
                    </div>
                ))}
                {favoritos.length === 0 && <p>Nenhum recurso favoritado ainda.</p>}
            </div>
        </div>
    );
}

export default Favoritos;