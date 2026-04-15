import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/images/logo%20simples%20branca.png" alt="E-DUCA" height="40" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Início</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="educacaoDropdown" role="button" data-bs-toggle="dropdown">
                                Educação
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/recursos?etapa=basica">Educação Básica</Link></li>
                                <li><Link className="dropdown-item" to="/recursos?etapa=profissional">Educação Profissional</Link></li>
                                <li><Link className="dropdown-item" to="/recursos?etapa=superior">Ensino Superior</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/recursos">Todos os Recursos</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/noticias' ? 'active' : ''}`} to="/noticias">Notícias</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/sobre' ? 'active' : ''}`} to="/sobre">Sobre</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        {isLoggedIn ? (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                                    <i className="bi bi-person-circle"></i> {user.email || 'Usuário'}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/perfil">Meu Perfil</Link></li>
                                    <li><Link className="dropdown-item" to="/recomendacoes">Para Você</Link></li>
                                    <li><Link className="dropdown-item" to="/favoritos">Meus Favoritos</Link></li>
                                    {user.is_admin && (
                                        <>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><Link className="dropdown-item" to="/admin">Painel Admin</Link></li>
                                        </>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Sair</button></li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Entrar</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/cadastro">Cadastrar</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;