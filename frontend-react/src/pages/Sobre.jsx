// src/pages/Sobre.jsx
function Sobre() {
    return (
        <>
            <div className="container mt-4">
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold mb-4">Sobre Nossa Iniciativa</h1>
                    <p className="lead text-muted">Democratizando o acesso à educação de qualidade para todos os brasileiros</p>
                </div>

                <div className="row g-4">
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h2 className="h3 mb-4 text-primary">
                                    <i className="bi bi-bullseye me-2"></i>Nossa Missão
                                </h2>
                                <div className="row">
                                    <div className="col-lg-8">
                                        <p className="mb-3">
                                            Na <strong>E-DUCA</strong>, nossa missão é democratizar o acesso à educação de qualidade para todos os brasileiros, independentemente de sua origem, idade ou condição social. Acreditamos que a educação é a ferramenta mais poderosa para transformar vidas e construir um futuro mais justo e inclusivo.
                                        </p>
                                        <p className="mb-3">
                                            Buscamos oferecer conteúdos, recursos e informações confiáveis que auxiliem estudantes, educadores e comunidades a superarem barreiras e conquistarem seus objetivos educacionais. Com foco na inclusão, inovação e apoio contínuo, trabalhamos para fortalecer a formação técnica, básica e superior, contribuindo para o desenvolvimento pessoal e profissional de cada indivíduo.
                                        </p>
                                        <p className="mb-0">
                                            Nos empenhamos em ser uma ponte entre as oportunidades educacionais e quem delas mais precisa, promovendo um ambiente de aprendizado acessível, colaborativo e inspirador.
                                        </p>
                                    </div>
                                    <div className="col-lg-4 text-center">
                                        <div className="bg-light rounded p-4">
                                            <i className="bi bi-bullseye display-4 text-primary mb-3"></i>
                                            <h4 className="h5">Propósito</h4>
                                            <p className="small text-muted">Educação gratuita e acessível para todos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h2 className="h3 mb-4 text-primary">
                                    <i className="bi bi-people me-2"></i>Nossa Equipe
                                </h2>
                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="card h-100 team-member border-0">
                                            <div className="card-body text-center">
                                                <i className="bi bi-palette-fill display-4 text-primary mb-3"></i>
                                                <h3 className="h5 mb-2">Time de Design</h3>
                                                <p className="text-muted mb-1">César Henrique Ramos da Silva</p>
                                                <small className="text-muted">UX/UI Design & Banco de Dados</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card h-100 team-member border-0">
                                            <div className="card-body text-center">
                                                <i className="bi bi-code-slash display-4 text-success mb-3"></i>
                                                <h3 className="h5 mb-2">Time de Desenvolvimento</h3>
                                                <p className="text-muted mb-1">Daniel Lemos Amparado Jr</p>
                                                <small className="text-muted">Backend & Arquitetura do Sistema</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card h-100 team-member border-0">
                                            <div className="card-body text-center">
                                                <i className="bi bi-search display-4 text-info mb-3"></i>
                                                <h3 className="h5 mb-2">Time de Pesquisa</h3>
                                                <p className="text-muted mb-1">Victor Medeiros Fidalgo</p>
                                                <small className="text-muted">Frontend & Conteúdo Educacional</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card shadow-sm border-0 bg-primary text-white">
                            <div className="card-body p-4">
                                <div className="row text-center">
                                    <div className="col-md-3">
                                        <h3 className="h2 fw-bold">100+</h3>
                                        <p className="mb-0">Recursos Educacionais</p>
                                    </div>
                                    <div className="col-md-3">
                                        <h3 className="h2 fw-bold">5</h3>
                                        <p className="mb-0">Etapas de Ensino</p>
                                    </div>
                                    <div className="col-md-3">
                                        <h3 className="h2 fw-bold">100%</h3>
                                        <p className="mb-0">Gratuito</p>
                                    </div>
                                    <div className="col-md-3">
                                        <h3 className="h2 fw-bold">24/7</h3>
                                        <p className="mb-0">Disponível</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .team-member {
                    transition: transform 0.3s ease;
                }
                .team-member:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </>
    );
}
export default Sobre;