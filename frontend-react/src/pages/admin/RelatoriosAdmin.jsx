import { useEffect, useState } from 'react';
import api from '../../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

function RelatoriosAdmin() {
    const [stats, setStats] = useState({});
    const [userGrowth, setUserGrowth] = useState([]);
    const [recursosPorEtapa, setRecursosPorEtapa] = useState([]);
    const [usuariosPorEtapa, setUsuariosPorEtapa] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, growthRes, recursosEtapaRes, usuariosEtapaRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/user-growth?days=30'),
                    api.get('/admin/reports/recursos-por-etapa'),
                    api.get('/admin/reports/usuarios-por-etapa')
                ]);
                setStats(statsRes.data);
                setUserGrowth(growthRes.data);
                setRecursosPorEtapa(recursosEtapaRes.data);
                setUsuariosPorEtapa(usuariosEtapaRes.data);
            } catch (err) {
                toast.error('Erro ao carregar dados dos relatórios');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Carregando relatórios...</div>;

    return (
        <>
            <h1 className="h3 mb-4">Relatórios do Sistema</h1>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">Crescimento de Usuários (últimos 30 dias)</h6>
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={userGrowth}>
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

                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">Recursos por Etapa</h6>
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={recursosPorEtapa}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="etapa" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">Usuários por Etapa Preferida</h6>
                        </div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={usuariosPorEtapa} dataKey="total" nameKey="etapa" cx="50%" cy="50%" outerRadius={100} label>
                                        {usuariosPorEtapa.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header py-3">
                            <h6 className="m-0 fw-bold text-primary">Resumo Geral</h6>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total de Usuários
                                    <span className="badge bg-primary rounded-pill">{stats.total_usuarios || 0}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Administradores
                                    <span className="badge bg-success rounded-pill">{stats.total_admins || 0}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Recursos Ativos
                                    <span className="badge bg-success rounded-pill">{stats.recursos_ativos || 0}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Recursos Inativos
                                    <span className="badge bg-danger rounded-pill">{stats.recursos_inativos || 0}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Notícias Publicadas
                                    <span className="badge bg-info rounded-pill">{stats.noticias_publicadas || 0}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Notícias Agendadas
                                    <span className="badge bg-warning rounded-pill">{stats.noticias_agendadas || 0}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default RelatoriosAdmin;