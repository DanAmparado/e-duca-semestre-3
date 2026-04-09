import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

        // Verificar se já é favorito
        const checkFavorito = async () => {
            try {
                const res = await api.get('/favoritos');
                const favoritos = res.data.favoritos;
                setIsFavorito(favoritos.some(f => f.id === id));
            } catch (err) {
                console.error(err);
            }
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
        } catch (err) {
            alert('Erro ao favoritar');
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (!recurso) return <div>Recurso não encontrado</div>;

    return (
        <div className="container mt-4">
            <h1>{recurso.titulo}</h1>
            <button className={`btn ${isFavorito ? 'btn-danger' : 'btn-outline-danger'} mb-3`} onClick={toggleFavorito}>
                {isFavorito ? 'Desfavoritar' : 'Favoritar'}
            </button>
            <p>{recurso.descricao}</p>
            <a href={recurso.link_externo} target="_blank" className="btn btn-primary">Acessar recurso</a>
        </div>
    );
}

export default DetalhesRecurso;