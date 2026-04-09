import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function RecursosLista() {
    const [recursos, setRecursos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecursos = async () => {
            try {
                const res = await api.get('/recursos');
                setRecursos(res.data.recursos);
            } catch (err) {
                console.error(err);
                alert('Erro ao carregar recursos');
            } finally {
                setLoading(false);
            }
        };
        fetchRecursos();
    }, []);

    if (loading) return <div>Carregando...</div>;

    return (
        <div className="container mt-4">
            <h1>Recursos Educacionais</h1>
            <div className="row">
                {recursos.map(recurso => (
                    <div key={recurso.id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{recurso.titulo}</h5>
                                <p className="card-text">{recurso.descricao?.substring(0, 100)}...</p>
                                <Link to={`/recursos/${recurso.id}`} className="btn btn-primary">Ver detalhes</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecursosLista;