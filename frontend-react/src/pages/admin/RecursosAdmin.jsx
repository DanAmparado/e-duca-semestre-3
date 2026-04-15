import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

function RecursosAdmin() {
    const [recursos, setRecursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentRecurso, setCurrentRecurso] = useState(null);
    const [formData, setFormData] = useState({ titulo: '', descricao: '', link_externo: '', etapa: 'Basico', ativo: true });
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroEtapa, setFiltroEtapa] = useState('');

    const fetchRecursos = async () => {
        try {
            let url = '/admin/recursos';
            if (filtroStatus) url += `?status=${filtroStatus}`;
            if (filtroEtapa) url += `${filtroStatus ? '&' : '?'}etapa=${filtroEtapa}`;
            const res = await api.get(url);
            setRecursos(res.data);
        } catch (err) {
            toast.error('Erro ao carregar recursos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecursos();
    }, [filtroStatus, filtroEtapa]);

    const handleDelete = async (id) => {
        if (!confirm('Excluir permanentemente este recurso?')) return;
        try {
            await api.delete(`/admin/recursos/${id}`);
            toast.success('Recurso excluído');
            fetchRecursos();
        } catch (err) {
            toast.error('Erro ao excluir');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const res = await api.post(`/admin/recursos/${id}/toggle`);
            toast.success(res.data.message);
            fetchRecursos();
        } catch (err) {
            toast.error('Erro ao alterar status');
        }
    };

    const openModal = (recurso = null) => {
        if (recurso) {
            setCurrentRecurso(recurso);
            setFormData({
                titulo: recurso.titulo,
                descricao: recurso.descricao || '',
                link_externo: recurso.link_externo || '',
                etapa: recurso.etapa,
                ativo: recurso.ativo
            });
        } else {
            setCurrentRecurso(null);
            setFormData({ titulo: '', descricao: '', link_externo: '', etapa: 'Basico', ativo: true });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentRecurso) {
                await api.put(`/admin/recursos/${currentRecurso.id}`, formData);
                toast.success('Recurso atualizado');
            } else {
                await api.post('/admin/recursos', formData);
                toast.success('Recurso criado');
            }
            setShowModal(false);
            fetchRecursos();
        } catch (err) {
            toast.error('Erro ao salvar recurso');
        }
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3">Gerenciar Recursos</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <i className="bi bi-plus-circle me-1"></i> Novo Recurso
                </button>
            </div>

            <div className="card shadow mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Status</label>
                            <select className="form-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                                <option value="">Todos</option>
                                <option value="ativos">Ativos</option>
                                <option value="inativos">Inativos</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Etapa</label>
                            <select className="form-select" value={filtroEtapa} onChange={e => setFiltroEtapa(e.target.value)}>
                                <option value="">Todas</option>
                                <option value="Basico">Básico</option>
                                <option value="Fundamental">Fundamental</option>
                                <option value="Medio">Médio</option>
                                <option value="Tecnico">Técnico</option>
                                <option value="Superior">Superior</option>
                            </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button className="btn btn-primary me-2" onClick={() => fetchRecursos()}>Filtrar</button>
                            <button className="btn btn-outline-secondary" onClick={() => { setFiltroStatus(''); setFiltroEtapa(''); }}>Limpar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr><th>ID</th><th>Título</th><th>Etapa</th><th>Status</th><th>Data Criação</th><th>Ações</th></tr>
                            </thead>
                            <tbody>
                                {recursos.map(recurso => (
                                    <tr key={recurso.id}>
                                        <td>{recurso.id}</td>
                                        <td><strong>{recurso.titulo}</strong><br /><small className="text-muted"><a href={recurso.link_externo} target="_blank">Link externo</a></small></td>
                                        <td><span className="badge bg-info">{recurso.etapa}</span></td>
                                        <td>{recurso.ativo ? <span className="badge bg-success">Ativo</span> : <span className="badge bg-danger">Inativo</span>}</td>
                                        <td><small>{new Date(recurso.data_criacao).toLocaleDateString('pt-BR')}</small></td>
                                        <td>
                                            <div className="btn-group btn-group-sm">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(recurso)}>Editar</button>
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleToggleStatus(recurso.id, recurso.ativo)}>
                                                    {recurso.ativo ? 'Desativar' : 'Ativar'}
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(recurso.id)}>Excluir</button>
                                                <Link to={`/recursos/${recurso.id}`} className="btn btn-outline-info btn-sm" target="_blank">Ver</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para criar/editar */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentRecurso ? 'Editar Recurso' : 'Novo Recurso'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Título *</label>
                                        <input type="text" className="form-control" required value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Descrição</label>
                                        <textarea className="form-control" rows="4" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Link Externo *</label>
                                        <input type="url" className="form-control" required value={formData.link_externo} onChange={e => setFormData({...formData, link_externo: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Etapa *</label>
                                        <select className="form-select" required value={formData.etapa} onChange={e => setFormData({...formData, etapa: e.target.value})}>
                                            <option value="Basico">Básico</option><option value="Fundamental">Fundamental</option>
                                            <option value="Medio">Médio</option><option value="Tecnico">Técnico</option><option value="Superior">Superior</option>
                                        </select>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" id="ativoSwitch" checked={formData.ativo} onChange={e => setFormData({...formData, ativo: e.target.checked})} />
                                        <label className="form-check-label" htmlFor="ativoSwitch">Ativo</label>
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
export default RecursosAdmin;