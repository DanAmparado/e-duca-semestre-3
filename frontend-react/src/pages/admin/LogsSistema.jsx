import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

function LogsSistema() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filtros, setFiltros] = useState({ tipo: '', usuarioId: '', dataInicio: '', dataFim: '' });

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 20, ...filtros });
            const res = await api.get(`/admin/logs?${params}`);
            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error('Erro ao carregar logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, filtros]);

    const handleFiltroChange = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
        setPage(1);
    };

    const limparFiltros = () => {
        setFiltros({ tipo: '', usuarioId: '', dataInicio: '', dataFim: '' });
        setPage(1);
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <>
            <h1 className="h3 mb-4">Logs do Sistema</h1>
            <div className="card shadow mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Tipo</label>
                            <select className="form-select" name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
                                <option value="">Todos</option>
                                <option value="admin">Admin</option>
                                <option value="seguranca">Segurança</option>
                                <option value="login">Login</option>
                                <option value="backup">Backup</option>
                                <option value="permissao">Permissão</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Usuário ID</label>
                            <input type="text" className="form-control" name="usuarioId" value={filtros.usuarioId} onChange={handleFiltroChange} placeholder="ID do usuário" />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Data Início</label>
                            <input type="date" className="form-control" name="dataInicio" value={filtros.dataInicio} onChange={handleFiltroChange} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Data Fim</label>
                            <input type="date" className="form-control" name="dataFim" value={filtros.dataFim} onChange={handleFiltroChange} />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-secondary w-100" onClick={limparFiltros}>Limpar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr><th>ID</th><th>Tipo</th><th>Usuário</th><th>Ação</th><th>Descrição</th><th>IP</th><th>Data</th></tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td>{log.id}</td>
                                        <td><span className="badge bg-info">{log.tipo_log}</span></td>
                                        <td>{log.usuario?.email || 'Sistema'}</td>
                                        <td>{log.acao}</td>
                                        <td>{log.descricao || '-'}</td>
                                        <td>{log.ip_address || '-'}</td>
                                        <td>{new Date(log.data_log).toLocaleString('pt-BR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <nav>
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
export default LogsSistema;