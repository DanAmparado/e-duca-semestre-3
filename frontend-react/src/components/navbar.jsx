import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/images/logo%20simples%20branca.png" alt="E-DUCA" height="40" />
                </Link>
                <Link className="navbar-brand" to="/">
                    Início
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="educacaoDropdown" role="button" data-bs-toggle="dropdown">
                                Educação
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/recursos/etapa/basica">Educação Básica</Link></li>
                                <li><Link className="dropdown-item" to="/recursos/etapa/profissional">Educação Profissional</Link></li>
                                <li><Link className="dropdown-item" to="/recursos/etapa/superior">Ensino Superior</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/recursos">Todos os Recursos</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/noticias' ? 'active' : ''}`} to="/noticias">
                                Notícias
                            </Link>
                        </li>
                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/favoritos' ? 'active' : ''}`} to="/favoritos">
                                        Favoritos
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/perfil' ? 'active' : ''}`} to="/perfil">
                                        Perfil
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={`nav-link ${location.pathname === '/recomendacoes' ? 'active' : ''}`} to="/recomendacoes">
                                        Para Você
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <button className="btn btn-outline-light" onClick={handleLogout}>
                                    Sair
                                </button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        Entrar
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cadastro">
                                        Cadastrar
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;