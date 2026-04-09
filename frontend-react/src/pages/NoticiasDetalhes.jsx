import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function NoticiasDetalhes() {
    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const res = await api.get(`/noticias/${id}`);
                setNoticia(res.data);
            } catch (err) {
                console.error(err);
                alert('Notícia não encontrada');
            } finally {
                setLoading(false);
            }
        };
        fetchNoticia();
    }, [id]);

    if (loading) return <div>Carregando...</div>;
    if (!noticia) return <div>Notícia não encontrada</div>;

    return (
        <div className="container mt-4">
            <h1>{noticia.titulo}</h1>
            <p className="text-muted">Publicado em: {new Date(noticia.data_publicacao).toLocaleDateString()}</p>
            <hr />
            <div style={{ whiteSpace: 'pre-wrap' }}>{noticia.conteudo}</div>
            <Link to="/noticias" className="btn btn-secondary mt-3">← Voltar</Link>
        </div>
    );
}

export default NoticiasDetalhes;