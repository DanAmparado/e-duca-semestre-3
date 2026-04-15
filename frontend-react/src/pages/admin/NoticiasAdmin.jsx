import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

function NoticiasAdmin() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentNoticia, setCurrentNoticia] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [formData, setFormData] = useState({
        titulo: '',
        conteudo: '',
        status: 'rascunho',
        data_agendamento: '',
        etapa_educacional: ''
    });

    const fetchNoticias = async () => {
        try {
            const url = filtroStatus ? `/admin/noticias?status=${filtroStatus}` : '/admin/noticias';
            const res = await api.get(url);
            setNoticias(res.data);
        } catch (err) {
            toast.error('Erro ao carregar notícias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNoticias();
    }, [filtroStatus]);

    const openModal = (noticia = null) => {
        if (noticia) {
            setCurrentNoticia(noticia);
            setFormData({
                titulo: noticia.titulo,
                conteudo: noticia.conteudo,
                status: noticia.status,
                data_agendamento: noticia.data_agendamento ? new Date(noticia.data_agendamento).toISOString().slice(0, 16) : '',
                etapa_educacional: noticia.etapa_educacional || ''
            });
        } else {
            setCurrentNoticia(null);
            setFormData({ titulo: '', conteudo: '', status: 'rascunho', data_agendamento: '', etapa_educacional: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentNoticia) {
                await api.put(`/admin/noticias/${currentNoticia.id}`, formData);
                toast.success('Notícia atualizada');
            } else {
                await api.post('/admin/noticias', formData);
                toast.success('Notícia criada');
            }
            setShowModal(false);
            fetchNoticias();
        } catch (err) {
            toast.error('Erro ao salvar notícia');
        }
    };

    const handlePublish = async (id) => {
        try {
            await api.post(`/admin/noticias/${id}/publicar`);
            toast.success('Notícia publicada');
            fetchNoticias();
        } catch (err) {
            toast.error('Erro ao publicar');
        }
    };

    const handleArchive = async (id) => {
        try {
            await api.post(`/admin/noticias/${id}/arquivar`);
            toast.success('Notícia arquivada');
            fetchNoticias();
        } catch (err) {
            toast.error('Erro ao arquivar');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Excluir permanentemente esta notícia?')) return;
        try {
            await api.delete(`/admin/noticias/${id}`);
            toast.success('Notícia excluída');
            fetchNoticias();
        } catch (err) {
            toast.error('Erro ao excluir');
        }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Gerenciar Notícias</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <i className="bi bi-plus-circle me-1"></i> Nova Notícia
                </button>
            </div>

            <div className="card shadow mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                                <option value="">Todas</option>
                                <option value="rascunho">Rascunho</option>
                                <option value="agendado">Agendado</option>
                                <option value="publicado">Publicado</option>
                                <option value="arquivado">Arquivado</option>
                            </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button className="btn btn-primary me-2" onClick={() => fetchNoticias()}>Filtrar</button>
                            <button className="btn btn-outline-secondary" onClick={() => setFiltroStatus('')}>Limpar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr><th>ID</th><th>Título</th><th>Status</th><th>Publicação</th><th>Ações</th></tr>
                            </thead>
                            <tbody>
                                {noticias.map(noticia => (
                                    <tr key={noticia.id}>
                                        <td>{noticia.id}</td>
                                        <td>{noticia.titulo}</td>
                                        <td><span className="badge bg-secondary">{noticia.status}</span></td>
                                        <td>{noticia.data_publicacao ? new Date(noticia.data_publicacao).toLocaleDateString() : '-'}</td>
                                        <td>
                                            <div className="btn-group btn-group-sm">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(noticia)}>Editar</button>
                                                {noticia.status !== 'publicado' && (
                                                    <button className="btn btn-sm btn-outline-success" onClick={() => handlePublish(noticia.id)}>Publicar</button>
                                                )}
                                                {noticia.status !== 'arquivado' && (
                                                    <button className="btn btn-sm btn-outline-warning" onClick={() => handleArchive(noticia.id)}>Arquivar</button>
                                                )}
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(noticia.id)}>Excluir</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para criar/editar notícia */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentNoticia ? 'Editar Notícia' : 'Nova Notícia'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Título *</label>
                                        <input type="text" className="form-control" required value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Conteúdo *</label>
                                        <textarea className="form-control" rows="10" required value={formData.conteudo} onChange={e => setFormData({...formData, conteudo: e.target.value})}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Status</label>
                                        <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                            <option value="rascunho">Rascunho</option>
                                            <option value="agendado">Agendado</option>
                                            <option value="publicado">Publicado</option>
                                        </select>
                                    </div>
                                    {formData.status === 'agendado' && (
                                        <div className="mb-3">
                                            <label className="form-label">Data de Agendamento</label>
                                            <input type="datetime-local" className="form-control" value={formData.data_agendamento} onChange={e => setFormData({...formData, data_agendamento: e.target.value})} />
                                        </div>
                                    )}
                                <div className="mb-3">
                                    <label className="form-label">Etapa Educacional</label>
                                    <select className="form-select" value={formData.etapa_educacional} onChange={e => setFormData({...formData, etapa_educacional: e.target.value})}>
                                        <option value="">Selecione...</option>
                                        <option value="Educação Básica">Educação Básica</option>
                                        <option value="Ensino Fundamental">Ensino Fundamental</option>
                                        <option value="Ensino Médio">Ensino Médio</option>
                                        <option value="Educação Técnica">Educação Técnica</option>
                                        <option value="Educação Superior">Educação Superior</option>
                                    </select>
                                </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Salvar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default NoticiasAdmin;