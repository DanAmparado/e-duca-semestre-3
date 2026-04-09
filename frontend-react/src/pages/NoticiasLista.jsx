import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function NoticiasLista() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                const res = await api.get('/noticias');
                setNoticias(res.data.noticias);
            } catch (err) {
                console.error(err);
                alert('Erro ao carregar notícias');
            } finally {
                setLoading(false);
            }
        };
        fetchNoticias();
    }, []);

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="container mt-4">
            <h1>Notícias</h1>
            <div className="row">
                {noticias.map(noticia => (
                    <div key={noticia.id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{noticia.titulo}</h5>
                                <p className="card-text">{noticia.conteudo?.substring(0, 150)}...</p>
                                <Link to={`/noticias/${noticia.id}`} className="btn btn-primary">Leia mais</Link>
                            </div>
                            <div className="card-footer text-muted">
                                Publicado em: {new Date(noticia.data_publicacao).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NoticiasLista;