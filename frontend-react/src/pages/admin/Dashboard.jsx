import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard() {
    const [stats, setStats] = useState({
        total_usuarios: 0,
        total_admins: 0,
        recursos_ativos: 0,
        recursos_inativos: 0,
        noticias_publicadas: 0,
        noticias_agendadas: 0
    });
    const [usuariosRecentes, setUsuariosRecentes] = useState([]);
    const [recursosPendentes, setRecursosPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [crescimento, setCrescimento] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, recentUsersRes, pendingRes, growthRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/recent-users?limit=5'),
                api.get('/admin/pending-resources?limit=5'),
                api.get('/admin/user-growth?days=30')
            ]);
            setStats(statsRes.data);
            setUsuariosRecentes(recentUsersRes.data);
            setRecursosPendentes(pendingRes.data);
            if (growthRes.data) setCrescimento(growthRes.data);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao carregar dados do dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center mt-5">Carregando dashboard...</div>;

    return (
        <>
            <h1 className="h3 mb-4">Dashboard Administrativo</h1>
            <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card stat-card users h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col me-2">
                                    <div className="text-xs fw-bold text-primary text-uppercase mb-1">Total de Usuários</div>
                                    <div className="h5 mb-0 fw-bold">{stats.total_usuarios}</div>
                                    <div className="mt-2 mb-0 text-muted text-xs">
                                        <span className="text-success me-2"><i className="bi bi-arrow-up"></i> {stats.total_admins} admins</span>
                                    </div>
                                </div>
                                <div className="col-auto"><i className="bi bi-people text-gray-300 fs-2"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card stat-card resources h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col me-2">
                                    <div className="text-xs fw-bold text-success text-uppercase mb-1">Recursos Ativos</div>
                                    <div className="h5 mb-0 fw-bold">{stats.recursos_ativos}</div>
                                    <div className="mt-2 mb-0 text-muted text-xs">
                                        <span className="text-danger me-2"><i className="bi bi-arrow-down"></i> {stats.recursos_inativos} inativos</span>
                                    </div>
                                </div>
                                <div className="col-auto"><i className="bi bi-book text-gray-300 fs-2"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card stat-card pending h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col me-2">
                                    <div className="text-xs fw-bold text-warning text-uppercase mb-1">Recursos Pendentes</div>
                                    <div className="h5 mb-0 fw-bold">{stats.recursos_inativos}</div>
                                    <div className="mt-2 mb-0 text-muted text-xs"><span>Requerem moderação</span></div>
                                </div>
                                <div className="col-auto"><i className="bi bi-clock text-gray-300 fs-2"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card stat-card news h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col me-2">
                                    <div className="text-xs fw-bold text-info text-uppercase mb-1">Notícias</div>
                                    <div className="h5 mb-0 fw-bold">{stats.noticias_publicadas}</div>
                                    <div className="mt-2 mb-0 text-muted text-xs">
                                        <span className="text-warning me-2"><i className="bi bi-calendar"></i> {stats.noticias_agendadas} agendadas</span>
                                    </div>
                                </div>
                                <div className="col-auto"><i className="bi bi-newspaper text-gray-300 fs-2"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-primary">Recursos Pendentes</h6>
                            <Link to="/admin/recursos?status=inativos" className="btn btn-sm btn-primary">Ver Todos</Link>
                        </div>
                        <div className="card-body">
                            {recursosPendentes.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {recursosPendentes.map(recurso => (
                                        <div key={recurso.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{recurso.titulo}</h6>
                                                <small className="text-muted">Etapa: {recurso.etapa}</small>
                                            </div>
                                            <div>
                                                <small className="text-muted me-2">{new Date(recurso.data_criacao).toLocaleDateString()}</small>
                                                <Link to={`/admin/recursos/editar/${recurso.id}`} className="btn btn-sm btn-outline-primary">Revisar</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="bi bi-check-circle text-success fs-2 mb-2"></i>
                                    <p className="text-muted">Nenhum recurso pendente de moderação</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-success">Usuários Recentes</h6>
                            <Link to="/admin/usuarios" className="btn btn-sm btn-success">Ver Todos</Link>
                        </div>
                        <div className="card-body">
                            {usuariosRecentes.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {usuariosRecentes.map(usuario => (
                                        <div key={usuario.id} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{usuario.email}</h6>
                                                    <small className="text-muted">{usuario.cidade || 'N/A'} - {usuario.estado || 'N/A'}</small>
                                                </div>
                                                <small className="text-muted">{new Date(usuario.data_cadastro).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="bi bi-person-plus text-muted fs-2 mb-2"></i>
                                    <p className="text-muted">Nenhum usuário recente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {crescimento.length > 0 && (
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-header py-3">
                                <h6 className="m-0 fw-bold text-primary">Crescimento de Usuários (últimos 30 dias)</h6>
                            </div>
                            <div className="card-body">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={crescimento}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="data" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="novos_usuarios" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">Ações Rápidas</h6>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-md-3 mb-3">
                                    <Link to="/admin/recursos/criar" className="btn btn-primary btn-block py-3 w-100">
                                        <i className="bi bi-plus-circle fs-2 mb-2 d-block"></i> Novo Recurso
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Link to="/admin/usuarios" className="btn btn-success btn-block py-3 w-100">
                                        <i className="bi bi-people fs-2 mb-2 d-block"></i> Gerenciar Usuários
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Link to="/admin/recursos" className="btn btn-info btn-block py-3 w-100">
                                        <i className="bi bi-book fs-2 mb-2 d-block"></i> Todos os Recursos
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Link to="/admin/relatorios" className="btn btn-warning btn-block py-3 w-100">
                                        <i className="bi bi-graph-up fs-2 mb-2 d-block"></i> Relatórios
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Dashboard;