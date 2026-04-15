import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="bg-dark sidebar">
            <div className="sidebar-content">
                <div className="sidebar-header text-center py-4">
                    <h5 className="text-white mb-1">
                        <i className="bi bi-shield-lock"></i> Admin
                    </h5>
                    <small className="text-muted">E-DUCA</small>
                </div>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`} to="/admin/dashboard">
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                        </Link>
                    </li>
                    {user.tipo === 'superadmin' && (
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/admin/usuarios' ? 'active' : ''}`} to="/admin/usuarios">
                                <i className="bi bi-people me-2"></i> Usuários
                            </Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/admin/recursos' ? 'active' : ''}`} to="/admin/recursos">
                            <i className="bi bi-book me-2"></i> Recursos
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/admin/noticias' ? 'active' : ''}`} to="/admin/noticias">
                            <i className="bi bi-newspaper me-2"></i> Notícias
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/admin/relatorios' ? 'active' : ''}`} to="/admin/relatorios">
                            <i className="bi bi-graph-up me-2"></i> Relatórios
                        </Link>
                    </li>
                    {(user.tipo === 'superadmin' || user.tipo === 'moderador') && (
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/admin/logs' ? 'active' : ''}`} to="/admin/logs">
                                <i className="bi bi-list-check me-2"></i> Logs do Sistema
                            </Link>
                        </li>
                    )}
                </ul>
                <div className="sidebar-footer mt-auto p-3">
                    <div className="dropdown">
                        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                            <i className="bi bi-person-circle me-2"></i>
                            <strong>{user.email?.split('@')[0]}</strong>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark">
                            <li><span className="dropdown-item-text">Nível: <span className={`badge ${user.tipo === 'superadmin' ? 'bg-danger' : user.tipo === 'moderador' ? 'bg-warning' : 'bg-info'}`}>{user.tipo}</span></span></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link className="dropdown-item" to="/perfil"><i className="bi bi-person me-2"></i>Meu Perfil</Link></li>
                            <li><Link className="dropdown-item" to="/"><i className="bi bi-house me-2"></i>Site Público</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item text-danger" onClick={() => { localStorage.clear(); window.location.href = '/'; }}><i className="bi bi-box-arrow-right me-2"></i>Sair</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminSidebar;