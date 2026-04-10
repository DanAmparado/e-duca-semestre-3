import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function NoticiasLista() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/noticias')
            .then(res => setNoticias(res.data.noticias))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center mt-5">Carregando...</div>;

    return (
        <>
            <h1 className="mb-4">Notícias</h1>
            <div className="row">
                {noticias.map(noticia => (
                    <div key={noticia.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{noticia.titulo}</h5>
                                <p className="card-text text-muted small">{noticia.conteudo?.substring(0,150)}...</p>
                                <p className="text-muted"><small>Publicado em: {new Date(noticia.data_publicacao).toLocaleDateString()}</small></p>
                                <Link to={`/noticias/${noticia.id}`} className="btn btn-primary">Leia mais</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
export default NoticiasLista;