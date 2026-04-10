import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function RecursosPorEtapa() {
    const { etapa } = useParams();
    const [recursos, setRecursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const titulos = {
        basica: 'Educação Básica',
        profissional: 'Educação Profissional',
        superior: 'Ensino Superior'
    };

    useEffect(() => {
        api.get(`/recursos/etapa/${etapa}`)
            .then(res => setRecursos(res.data.recursos))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [etapa]);

    if (loading) return <div>Carregando...</div>;
    return (
        <>
            <h1>{titulos[etapa] || 'Recursos'}</h1>
            <div className="row">
                {recursos.map(recurso => (
                    <div key={recurso.id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{recurso.titulo}</h5>
                                <p className="card-text">{recurso.descricao?.substring(0,100)}...</p>
                                <Link to={`/recursos/${recurso.id}`} className="btn btn-primary">Ver detalhes</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
export default RecursosPorEtapa;