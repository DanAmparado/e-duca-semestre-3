import { Link } from 'react-router-dom';

function Home() {
    const token = localStorage.getItem('token');
    return (
        <>
            <div className="hero-with-logo">
                <img src="/images/logofinal.png" alt="E-DUCA" className="hero-logo" />
                <h1 className="display-4 fw-bold text-primary">Bem-vindo ao E-DUCA</h1>
                <p className="lead">Plataforma de democratização do acesso à educação</p>
                <div className="mt-4">
                    <Link to="/recursos" className="btn btn-primary btn-lg me-3">Explorar Recursos</Link>
                    <Link to="/sobre" className="btn btn-outline-primary btn-lg">Conheça o Projeto</Link>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-4 mb-4">
                    <div className="card card-custom h-100 text-center">
                        <div className="card-body">
                            <i className="bi bi-book display-4 text-primary"></i>
                            <h5 className="card-title mt-3">Recursos Educacionais</h5>
                            <p className="card-text">Acesso a materiais de todas as etapas da educação brasileira.</p>
                            <Link to="/recursos" className="btn btn-primary">Explorar</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card card-custom h-100 text-center">
                        <div className="card-body">
                            <i className="bi bi-person-check display-4 text-success"></i>
                            <h5 className="card-title mt-3">Para Você</h5>
                            <p className="card-text">Recomendações personalizadas baseadas no seu perfil.</p>
                            <Link to={token ? "/recomendacoes" : "/login"} className="btn btn-primary">Descobrir</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card card-custom h-100 text-center">
                        <div className="card-body">
                            <i className="bi bi-graph-up display-4 text-warning"></i>
                            <h5 className="card-title mt-3">Acompanhe seu Progresso</h5>
                            <p className="card-text">Monitore seu aprendizado e descubra novos recursos.</p>
                            <Link to={token ? "/perfil" : "/login"} className="btn btn-primary">Meu Perfil</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Home;